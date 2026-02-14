<?php
declare(strict_types=1);

use Migrations\BaseMigration;

class CreateInvoiceValidations extends BaseMigration
{
    /**
     * Change Method.
     *
     * @return void
     */
    public function change(): void
    {
        $table = $this->table('invoice_validations', ['id' => false, 'primary_key' => ['id']]);
        $table->addColumn('id', 'uuid', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('partita_iva', 'string', [
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);
        $table->addColumn('imponibile', 'decimal', [
            'default' => null,
            'precision' => 10,
            'scale' => 2,
            'null' => false,
        ]);
        $table->addColumn('aliquota_iva', 'decimal', [
            'default' => null,
            'precision' => 5,
            'scale' => 2,
            'null' => false,
        ]);
        $table->addColumn('totale_dichiarato', 'decimal', [
            'default' => null,
            'precision' => 10,
            'scale' => 2,
            'null' => false,
        ]);
        $table->addColumn('total_calculated', 'decimal', [
            'default' => null,
            'precision' => 10,
            'scale' => 2,
            'null' => false,
        ]);
        $table->addColumn('valid', 'boolean', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('errors', 'json', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('warnings', 'json', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('created', 'datetime', [
            'default' => null,
            'null' => false,
        ]);
        $table->addIndex(['partita_iva']);
        $table->create();
    }
}