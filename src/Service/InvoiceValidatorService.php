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

    protected ?\Cake\ORM\Table $table;

    /**
     * Constructor
     *
     * @param \Cake\ORM\Table|null $table Optional table for injection (tests)
     */
    public function __construct(?\Cake\ORM\Table $table = null)
    {
        // Lazy-load by default so API doesn't 500 when migrations aren't run yet.
        $this->table = $table;
    }

    /**
     * Validate invoice payload and return validation result.
     * Persists the attempt in history regardless of validity.
     *
     * @param array<string, mixed> $data Decoded JSON with partita_iva, imponibile, aliquota_iva, totale_dichiarato
     * @return array{valid: bool, total_calculated: float, errors: list<string>, warnings: list<string>}
     */
    public function validate(array $data): array
    {
        $errors = [];
        $warnings = [];

        $partitaIva = (string)($data['partita_iva'] ?? '');
        $imponibile = $this->parseNumber($data['imponibile'] ?? null, 'imponibile', $errors);
        $aliquotaIva = $this->parseNumber($data['aliquota_iva'] ?? null, 'aliquota_iva', $errors);
        $totaleDichiarato = $this->parseNumber($data['totale_dichiarato'] ?? null, 'totale_dichiarato', $errors);

        // Partita IVA Specific Validation
        if ($partitaIva === '' || strlen($partitaIva) !== self::VAT_DIGITS || !ctype_digit($partitaIva)) {
            $errors[] = 'La Partita IVA deve contenere esattamente 11 cifre numeriche.';
        }
        elseif (!$this->isValidVatChecksum($partitaIva)) {
            $errors[] = 'La Partita IVA inserita non è valida (errore nel codice di controllo).';
        }

        if ($imponibile < 0) {
            $errors[] = "L'imponibile deve essere un numero non negativo.";
        }

        if ($aliquotaIva < 0) {
            $errors[] = "L'aliquota IVA deve essere un numero non negativo.";
        }

        if ($totaleDichiarato < 0) {
            $errors[] = 'Il totale dichiarato deve essere un numero non negativo.';
        }

        $totalCalculated = 0.0;
        if ($errors === []) {
            $ivaAmount = $this->round2($imponibile * $aliquotaIva / 100);
            $totalCalculated = $this->round2($imponibile + $ivaAmount);
            $difference = abs($totalCalculated - $totaleDichiarato);

            if ($difference > self::TOLERANCE_ERROR) {
                $errors[] = sprintf(
                    'Il totale dichiarato (%.2f €) non corrisponde al totale calcolato (%.2f €).',
                    $totaleDichiarato,
                    $totalCalculated
                );
            }
            elseif ($difference > 0) {
                $warnings[] = 'Lieve differenza di arrotondamento tra il totale calcolato e quello dichiarato.';
            }
        }

        $isValid = $errors === [];

        // Validation History Persistence (best-effort; don't 500 if DB/migration missing)
        try {
            $table = $this->table ?? \Cake\ORM\TableRegistry::getTableLocator()->get('InvoiceValidations');
            $entity = $table->newEntity([
                'partita_iva' => substr($partitaIva, 0, 11),
                'imponibile' => $imponibile,
                'aliquota_iva' => $aliquotaIva,
                'totale_dichiarato' => $totaleDichiarato,
                'total_calculated' => $totalCalculated,
                'valid' => $isValid,
                'errors' => $errors,
                'warnings' => $warnings,
            ]);
            $table->save($entity);
        } catch (\Throwable $e) {
            $warnings[] = 'Impossibile salvare la cronologia di validazione (DB non inizializzato).';
        }

        return [
            'valid' => $isValid,
            'total_calculated' => $totalCalculated,
            'errors' => $errors,
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

    /**
     * @param list<string> $errors
     */
    private function parseNumber(mixed $value, string $field, array &$errors): float
    {
        if (is_numeric($value)) {
            return (float)$value;
        }

        if (is_string($value)) {
            $trimmed = trim($value);
            if ($trimmed !== '' && is_numeric($trimmed)) {
                return (float)$trimmed;
            }
        }

        $errors[] = sprintf('Il campo `%s` deve essere un numero.', $field);
        return 0.0;
    }

    private function round2(float $value): float
    {
        return round($value, 2);
    }
}