<?php

declare(strict_types=1);

namespace App\Middleware;

use Cake\Http\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Adds CORS headers to API responses and handles OPTIONS preflight.
 * Headers are set explicitly so they are always present (Cake CorsBuilder
 * only applies when request has an Origin header).
 */
class CorsMiddleware implements MiddlewareInterface
{
    private const CORS_HEADERS = [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        'Access-Control-Max-Age' => '3600',
    ];

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $origin = $request->getHeaderLine('Origin');
        
        // Default headers
        $headers = [
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age' => '3600',
        ];

        // If origin is present, echo it back (or validate it against a whitelist in production)
        if ($origin) {
            $headers['Access-Control-Allow-Origin'] = $origin;
            $headers['Access-Control-Allow-Credentials'] = 'true';
        } else {
             $headers['Access-Control-Allow-Origin'] = '*';
        }

        if ($request->getMethod() === 'OPTIONS') {
            $response = new Response();
            foreach ($headers as $name => $value) {
                $response = $response->withHeader($name, $value);
            }
            return $response->withStatus(204);
        }

        $response = $handler->handle($request);

        foreach ($headers as $name => $value) {
            $response = $response->withHeader($name, $value);
        }

        return $response;
    }
}
