<?php

declare(strict_types=1);

namespace App\Test\TestCase\Service;

use App\Service\InvoiceValidatorService;
use PHPUnit\Framework\TestCase;
use Cake\ORM\Table;
use Cake\ORM\Entity;

class InvoiceValidatorServiceTest extends TestCase
{
    private InvoiceValidatorService $service;
    private $tableMock;

    protected function setUp(): void
    {
        parent::setUp();
        // Mock the Table class
        $this->tableMock = $this->getMockBuilder(Table::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Mock newEntity to return a dummy entity
        $this->tableMock->method('newEntity')
            ->willReturn(new Entity());

        $this->service = new InvoiceValidatorService($this->tableMock);
    }

    /** Valid VAT (11 digits) + correct total → valid */
    public function testValidVatAndCorrectTotalReturnsValid(): void
    {
        $data = [
            'partita_iva' => '12345678903',
            'imponibile' => 1000,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 1220,
        ];

        // Expect save to be called once
        $this->tableMock->expects($this->once())
            ->method('save');

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

        // Should still persist
        $this->tableMock->expects($this->once())
            ->method('save');

        $result = $this->service->validate($data);

        $this->assertFalse($result['valid']);
        $this->assertNotEmpty($result['errors']);
        $this->assertStringContainsString('11 cifre', $result['errors'][0]);
    }

    /** Total mismatch (calculated vs declared) → error */
    public function testTotalMismatchReturnsError(): void
    {
        $data = [
            'partita_iva' => '12345678903',
            'imponibile' => 1000,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 1300,
        ];

        // Should still persist
        $this->tableMock->expects($this->once())
            ->method('save');

        $result = $this->service->validate($data);

        $this->assertFalse($result['valid']);
        $this->assertSame(1220.0, $result['total_calculated']);
        $this->assertNotEmpty($result['errors']);
        $this->assertStringContainsString('non corrisponde', $result['errors'][0]);
    }

    /** Small difference (rounding) → valid with warning */
    public function testRoundingDifferenceReturnsValidWithWarning(): void
    {
        $data = [
            'partita_iva' => '12345678903',
            'imponibile' => 100.33,
            'aliquota_iva' => 22,
            'totale_dichiarato' => 122.41,
        ];

        // Should still persist
        $this->tableMock->expects($this->once())
            ->method('save');

        $result = $this->service->validate($data);

        $this->assertTrue($result['valid']);
        $this->assertNotEmpty($result['warnings']);
        $this->assertStringContainsString('arrotondamento', $result['warnings'][0]);
    }
}