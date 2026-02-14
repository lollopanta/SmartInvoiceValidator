<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * InvoiceValidation Entity
 *
 * @property string $id
 * @property string $partita_iva
 * @property string $imponibile
 * @property string $aliquota_iva
 * @property string $totale_dichiarato
 * @property string $total_calculated
 * @property bool $valid
 * @property array $errors
 * @property array $warnings
 * @property \Cake\I18n\DateTime $created
 */
class InvoiceValidation extends Entity
{
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * @var array<string, bool>
     */
    protected array $_accessible = [
        'partita_iva' => true,
        'imponibile' => true,
        'aliquota_iva' => true,
        'totale_dichiarato' => true,
        'total_calculated' => true,
        'valid' => true,
        'errors' => true,
        'warnings' => true,
        'created' => true,
    ];
}