<?php

declare(strict_types=1);

use Cake\Http\Server;

$app = require dirname(__DIR__) . '/config/bootstrap.php';

assert($app instanceof \Cake\Http\BaseApplication);
$server = new Server($app);
$server->emit($server->run());