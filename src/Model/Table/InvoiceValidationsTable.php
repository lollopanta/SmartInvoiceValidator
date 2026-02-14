<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Database\Schema\TableSchemaInterface;

/**
 * InvoiceValidations Model
 */
class InvoiceValidationsTable extends Table
{
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('invoice_validations');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');

        $this->getSchema()->setColumnType('errors', 'json');
        $this->getSchema()->setColumnType('warnings', 'json');
    }
}