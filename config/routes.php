<?php

declare(strict_types=1);

use Cake\Routing\RouteBuilder;

return function (RouteBuilder $routes): void {
    $routes->setRouteClass(\Cake\Routing\Route\DashedRoute::class);

    // API v1: versioned, future-proof for v2
    $routes->prefix('Api', function (RouteBuilder $routes): void {
        $routes->prefix('V1', function (RouteBuilder $routes): void {
            $routes->connect(
                '/invoices/validate',
                ['controller' => 'Invoices', 'action' => 'validate']
            )->setMethods(['POST']);
        });
    });
};
