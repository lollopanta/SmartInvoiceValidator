<?php

declare(strict_types=1);

use Cake\Cache\Cache;
use Cake\Core\Configure;
use Cake\Core\Plugin;
use Cake\Datasource\ConnectionManager;
use Cake\Error\ErrorTrap;
use Cake\Error\ExceptionTrap;
use Cake\Http\ServerRequest;
use Cake\Log\Log;
use Cake\Mailer\Mailer;
use Cake\Mailer\TransportFactory;
use Cake\Routing\Router;
use Cake\Utility\Security;

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

define('ROOT', dirname(__DIR__) . DS);
define('APP_DIR', 'src');
define('WEBROOT_DIR', 'webroot');
define('CONFIG', ROOT . 'config' . DS);
define('WWW_ROOT', ROOT . WEBROOT_DIR . DS);
define('TESTS', ROOT . 'tests' . DS);
define('LOGS', ROOT . 'logs' . DS);
define('CACHE', ROOT . 'tmp' . DS . 'cache' . DS);
define('RESOURCES', ROOT . 'resources' . DS);
define('APP', ROOT . APP_DIR . DS);
define('CORE_PATH', ROOT . 'vendor' . DS . 'cakephp' . DS . 'cakephp' . DS);
define('CAKE', CORE_PATH . 'src' . DS);

require ROOT . 'vendor' . DS . 'autoload.php';

require ROOT . 'vendor' . DS . 'cakephp' . DS . 'cakephp' . DS . 'src' . DS . 'Core' . DS . 'functions.php';
require ROOT . 'vendor' . DS . 'cakephp' . DS . 'cakephp' . DS . 'src' . DS . 'Core' . DS . 'functions_global.php';

\Cake\Database\TypeFactory::map('json', 'Cake\Database\Type\JsonType');

$envFile = ROOT . '.env';
if (file_exists($envFile) && class_exists(\josegonzalez\Dotenv\Loader::class)) {
    (new \josegonzalez\Dotenv\Loader($envFile))->parse()->putenv(true);
}

Configure::config('default', new \Cake\Core\Configure\Engine\PhpConfig());
Configure::load('app', 'default', false);

if (file_exists(CONFIG . 'app_local.php')) {
    Configure::load('app_local', 'default');
}

if (Configure::read('debug')) {
    Configure::write('Cache._cake_model_.duration', '+1 minute');
    Configure::write('Cache._cake_translations_.duration', '+1 minute');
}

date_default_timezone_set(Configure::read('App.defaultTimezone'));
mb_internal_encoding(Configure::read('App.encoding'));
ini_set('intl.default_locale', Configure::read('App.defaultLocale'));

// (new ErrorTrap(Configure::read('Error')))->register();
// (new ExceptionTrap(Configure::read('Error')))->register();

if (PHP_SAPI === 'cli') {
    if (Configure::check('Log.debug')) {
        Configure::write('Log.debug.file', 'cli-debug');
    }
    if (Configure::check('Log.error')) {
        Configure::write('Log.error.file', 'cli-error');
    }
}

$fullBaseUrl = Configure::read('App.fullBaseUrl');
if (!$fullBaseUrl) {
    $httpHost = env('HTTP_HOST');
    if ($httpHost) {
        $s = (env('HTTPS') || env('HTTP_X_FORWARDED_PROTO') === 'https') ? 's' : '';
        $fullBaseUrl = 'http' . $s . '://' . $httpHost;
    }
}
if ($fullBaseUrl) {
    Router::fullBaseUrl($fullBaseUrl);
}

Cache::setConfig(Configure::consume('Cache'));
ConnectionManager::setConfig(Configure::consume('Datasources'));
// TransportFactory::setConfig(Configure::consume('EmailTransport'));
// Mailer::setConfig(Configure::consume('Email'));
Log::setConfig(Configure::consume('Log'));
Security::setSalt(Configure::consume('Security.salt'));
Router::reload();

return new \App\Application(CONFIG);