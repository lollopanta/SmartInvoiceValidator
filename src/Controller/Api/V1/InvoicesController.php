<?php

declare(strict_types=1);

namespace App\Controller\Api\V1;

use App\Controller\AppController;
use App\Service\InvoiceValidatorService;
use Cake\Http\Response;

/**
 * API V1 Invoices controller.
 * Thin layer: delegates validation to InvoiceValidatorService.
 */
class InvoicesController extends AppController
{
    /**
     * GET /api/v1/invoices
     * Returns the last 10 validation attempts.
     */
    public function index(): Response
    {
        $this->request->allowMethod(['get']);

        try {
            $table = \Cake\ORM\TableRegistry::getTableLocator()->get('InvoiceValidations');
            $history = $table->find()
                ->select(['id', 'partita_iva', 'imponibile', 'valid', 'created'])
                ->orderBy(['created' => 'DESC'])
                ->limit(10)
                ->all();

            return $this->respondJson(200, $history->toArray());
        } catch (\Throwable $e) {
            // If DB/migrations aren't ready yet, don't break the frontend.
            return $this->respondJson(200, []);
        }
    }

    /**
     * POST /api/v1/invoices/validate
     * Expects JSON: partita_iva, imponibile, aliquota_iva, totale_dichiarato
     */
    public function validate(): Response
    {
        $this->request->allowMethod(['post']);

        $data = $this->request->getData();
        if (!is_array($data)) {
            $data = $this->request->input('json_decode', true);
        }

        if (!is_array($data)) {
            return $this->respondUnprocessable([
                'valid' => false,
                'total_calculated' => 0,
                'errors' => ['Invalid or missing JSON body'],
                'warnings' => [],
            ]);
        }

        $required = ['partita_iva', 'imponibile', 'aliquota_iva', 'totale_dichiarato'];
        $missing = [];
        foreach ($required as $key) {
            if (!array_key_exists($key, $data)) {
                $missing[] = $key;
            }
        }

        if ($missing !== []) {
            return $this->respondUnprocessable([
                'valid' => false,
                'total_calculated' => 0,
                'errors' => ['Missing required fields: ' . implode(', ', $missing)],
                'warnings' => [],
            ]);
        }

        $validator = new InvoiceValidatorService();
        $result = $validator->validate($data);

        return $this->respondJson(200, $result);
    }

    /**
     * GET /api/v1/invoices/validations
     * Paginated history with sorting.
     */
    public function validations(): Response
    {
        $this->request->allowMethod(['get']);
        
        $table = \Cake\ORM\TableRegistry::getTableLocator()->get('InvoiceValidations');
        
        $sort = $this->request->getQuery('sort', 'created');
        $direction = $this->request->getQuery('direction', 'DESC');
        $limit = (int)$this->request->getQuery('limit', 10);
        $page = (int)$this->request->getQuery('page', 1);

        $query = $table->find()
            ->orderBy([$sort => $direction]);

        $this->paginate = [
            'limit' => $limit,
            'page' => $page,
        ];

        try {
            $validations = $this->paginate($query);
            $pagingParams = $this->request->getAttribute('paging')['InvoiceValidations'];
            
            return $this->respondJson(200, [
                'data' => $validations->toArray(),
                'pagination' => [
                    'count' => $pagingParams['count'],
                    'current' => $pagingParams['page'],
                    'pages' => $pagingParams['pageCount'],
                    'limit' => $pagingParams['limit'],
                ]
            ]);
        } catch (\Throwable $e) {
            return $this->respondJson(200, ['data' => [], 'pagination' => []]);
        }
    }

    private function respondJson(int $status, array $body): Response
    {
        $this->response = $this->response->withType('application/json');
        $this->response = $this->response->withStatus($status);
        $this->response = $this->response->withStringBody((string)json_encode($body));

        return $this->response;
    }

    private function respondUnprocessable(array $body): Response
    {
        return $this->respondJson(422, $body);
    }
}