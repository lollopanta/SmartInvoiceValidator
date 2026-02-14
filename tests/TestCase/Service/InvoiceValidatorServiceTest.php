<?php

declare(strict_types=1);

namespace App\Test\TestCase\Service;

use App\Service\InvoiceValidatorService;
use PHPUnit\Framework\TestCase;

class InvoiceValidatorServiceTest extends TestCase
{
    private InvoiceValidatorService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InvoiceValidatorService();
    }

    /** Valid VAT (11 digits) + correct total → valid */
    public function testValidVatAndCorrectTotalReturnsValid(): void
    {
        $data = [
            'partita_iva' => '12345678901',
            'imponibile' => 1000,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 1220,
        ];

        $result = $this->service->validate($data);

        $this->assertTrue($result['valid']);
        $this->assertSame(1220.0, $result['total_calculated']);
        $this->assertEmpty($result['errors']);
        $this->assertEmpty($result['warnings']);
    }

    /** Invalid VAT structure → error */
    public function testInvalidVatStructureReturnsError(): void
    {
        $data = [
            'partita_iva' => '1234567890',
            'imponibile' => 1000,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 1220,
        ];

        $result = $this->service->validate($data);

        $this->assertFalse($result['valid']);
        $this->assertNotEmpty($result['errors']);
        $this->assertStringContainsString('partita_iva', $result['errors'][0]);
    }

    /** Total mismatch (calculated vs declared) → error */
    public function testTotalMismatchReturnsError(): void
    {
        $data = [
            'partita_iva' => '12345678901',
            'imponibile' => 1000,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 1300,
        ];

        $result = $this->service->validate($data);

        $this->assertFalse($result['valid']);
        $this->assertSame(1220.0, $result['total_calculated']);
        $this->assertNotEmpty($result['errors']);
        $this->assertStringContainsString('total mismatch', $result['errors'][0]);
    }

    /** Small difference (rounding) → valid with warning */
    public function testRoundingDifferenceReturnsValidWithWarning(): void
    {
        $data = [
            'partita_iva' => '12345678901',
            'imponibile' => 100.33,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 122.41,
        ];

        $result = $this->service->validate($data);

        $this->assertTrue($result['valid']);
        $this->assertNotEmpty($result['warnings']);
        $this->assertStringContainsString('rounding', $result['warnings'][0]);
    }
}
