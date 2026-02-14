<?php

declare(strict_types=1);

namespace App\Controller;

use Cake\Controller\Controller;
use Cake\Event\EventInterface;

abstract class AppController extends Controller
{
    public function beforeFilter(EventInterface $event): ?\Cake\Http\Response
    {
        $response = parent::beforeFilter($event);
        if ($response !== null) {
            return $response;
        }

        if ($this->request->is('options')) {
            $this->response = $this->response->cors($this->request)
                ->allowOrigin(['*'])
                ->allowMethods(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
                ->allowHeaders(['Content-Type', 'Authorization'])
                ->maxAge(3600)
                ->build();
            return $this->response;
        }

        return null;
    }
}
