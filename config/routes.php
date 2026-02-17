<?php

declare(strict_types=1);

use Cake\Routing\RouteBuilder;
use Cake\Routing\Route\DashedRoute;

return function (RouteBuilder $routes): void {
    $routes->setRouteClass(DashedRoute::class);

    // API v1: versioned, future-proof for v2
    $routes->prefix('Api', function (RouteBuilder $routes): void {
        $routes->prefix('V1', function (RouteBuilder $routes): void {
            $routes->connect('/invoices', ['controller' => 'Invoices', 'action' => 'index'])
                ->setMethods(['GET']);

            $routes->connect('/invoices/validate', ['controller' => 'Invoices', 'action' => 'validate'])
                ->setMethods(['POST']);

            $routes->connect('/invoices/validations', ['controller' => 'Invoices', 'action' => 'validations'])
                ->setMethods(['GET']);

            $routes->connect('/statistics/summary', ['controller' => 'Statistics', 'action' => 'summary'])
                ->setMethods(['GET']);

            $routes->connect('/statistics/timeline', ['controller' => 'Statistics', 'action' => 'timeline'])
                ->setMethods(['GET']);

            $routes->connect('/statistics/errors', ['controller' => 'Statistics', 'action' => 'errors'])
                ->setMethods(['GET']);

            $routes->fallbacks(DashedRoute::class);
        });
    });
};