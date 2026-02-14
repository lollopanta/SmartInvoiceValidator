<?php

declare(strict_types=1);

namespace App;

use Cake\Core\Configure;
use Cake\Http\BaseApplication;
use Cake\Http\Middleware\BodyParserMiddleware;
use Cake\Http\MiddlewareQueue;
use Cake\Routing\RouteBuilder;

/**
 * Application class for Smart Invoice Validator.
 */
class Application extends BaseApplication
{
    public function bootstrap(): void
    {
        parent::bootstrap();
    }

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            ->add(new \Cake\Error\Middleware\ErrorHandlerMiddleware(Configure::read('Error'), $this))
            ->add(new \App\Middleware\CorsMiddleware())
            ->add(new \Cake\Routing\Middleware\AssetMiddleware([
            'cacheTime' => Configure::read('Asset.cacheTime'),
        ]))
            ->add(new \Cake\Routing\Middleware\RoutingMiddleware($this))
            ->add(new BodyParserMiddleware());

        return $middlewareQueue;
    }

    public function routes(RouteBuilder $routes): void
    {
        $loader = require $this->configDir . 'routes.php';
        $loader($routes);
    }
}