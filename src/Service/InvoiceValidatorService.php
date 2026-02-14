<?php

declare(strict_types=1);

namespace App\Service;

/**
 * Domain service for validating invoice data before submission.
 * Handles VAT structure validation, amount calculations, and total comparison.
 */
class InvoiceValidatorService
{
    private const VAT_DIGITS = 11;

    private const TOLERANCE_ERROR = 0.01;

    /**
     * Validate invoice payload and return validation result.
     *
     * @param array<string, mixed> $data Decoded JSON with partita_iva, imponibile, aliquota_iva, totale_dichiarato
     * @return array{valid: bool, total_calculated: float, errors: list<string>, warnings: list<string>}
     */
    public function validate(array $data): array
    {
        $errors = [];
        $warnings = [];

        $partitaIva = $data['partita_iva'] ?? null;
        $imponibile = isset($data['imponibile']) ? $this->toFloat($data['imponibile']) : null;
        $aliquotaIva = isset($data['aliquota_iva']) ? $this->toFloat($data['aliquota_iva']) : null;
        $totaleDichiarato = isset($data['totale_dichiarato']) ? $this->toFloat($data['totale_dichiarato']) : null;

        // Partita IVA Specific Validation
        if ($partitaIva === null || $partitaIva === '' || strlen((string)$partitaIva) !== self::VAT_DIGITS || !ctype_digit((string)$partitaIva)) {
            $errors[] = 'La Partita IVA deve contenere esattamente 11 cifre numeriche.';
        }
        elseif (!$this->isValidVatChecksum((string)$partitaIva)) {
            $errors[] = 'La Partita IVA inserita non è valida (errore nel codice di controllo).';
        }

        if ($imponibile === null || $imponibile < 0) {
            $errors[] = "L'imponibile è obbligatorio e deve essere un numero non negativo.";
        }

        if ($aliquotaIva === null || $aliquotaIva < 0) {
            $errors[] = "L'aliquota IVA è obbligatoria e deve essere un numero non negativo.";
        }

        if ($totaleDichiarato === null || $totaleDichiarato < 0) {
            $errors[] = 'Il totale dichiarato è obbligatorio e deve essere un numero non negativo.';
        }

        if ($errors !== []) {
            return [
                'valid' => false,
                'total_calculated' => 0.0,
                'errors' => $errors,
                'warnings' => [],
            ];
        }

        $ivaAmount = $this->round2($imponibile * $aliquotaIva / 100);
        $totalCalculated = $this->round2($imponibile + $ivaAmount);
        $difference = abs($totalCalculated - $totaleDichiarato);

        if ($difference > self::TOLERANCE_ERROR) {
            $errors[] = sprintf(
                'Il totale dichiarato (%.2f €) non corrisponde al totale calcolato (%.2f €).',
                $totaleDichiarato,
                $totalCalculated
            );
            return [
                'valid' => false,
                'total_calculated' => $totalCalculated,
                'errors' => $errors,
                'warnings' => $warnings,
            ];
        }

        if ($difference > 0 && $difference <= self::TOLERANCE_ERROR) {
            $warnings[] = 'Lieve differenza di arrotondamento tra il totale calcolato e quello dichiarato.';
        }

        return [
            'valid' => true,
            'total_calculated' => $totalCalculated,
            'errors' => [],
            'warnings' => $warnings,
        ];
    }

    /**
     * Alias for backward compatibility or internal use if needed,
     * but now we use separate checks in validate() for granular errors.
     */
    public function isValidVatStructure(mixed $partitaIva): bool
    {
        $str = (string)$partitaIva;
        if (strlen($str) !== self::VAT_DIGITS || !ctype_digit($str)) {
            return false;
        }
        return $this->isValidVatChecksum($str);
    }

    /**
     * Checksum validation for Italian VAT (Partita IVA).
     */
    private function isValidVatChecksum(string $str): bool
    {
        $sOdd = 0;
        $sEven = 0;

        for ($i = 0; $i < 10; $i++) {
            $digit = (int)$str[$i];
            if (($i + 1) % 2 !== 0) {
                // Odd position (1st, 3rd, 5th, 7th, 9th) -> Index 0, 2, 4, 6, 8
                $sOdd += $digit;
            }
            else {
                // Even position (2nd, 4th, 6th, 8th, 10th) -> Index 1, 3, 5, 7, 9
                $val = $digit * 2;
                if ($val > 9) {
                    $val -= 9;
                }
                $sEven += $val;
            }
        }

        $s = $sOdd + $sEven;
        $checkDigit = (10 - ($s % 10)) % 10;

        return (int)$str[10] === $checkDigit;
    }

    private function toFloat(mixed $value): ?float
    {
        if (is_numeric($value)) {
            return (float)$value;
        }

        if (is_string($value) && $value !== '') {
            $trimmed = trim($value);
            if (is_numeric($trimmed)) {
                return (float)$trimmed;
            }
        }

        return null;
    }

    private function round2(float $value): float
    {
        return round($value, 2);
    }
}