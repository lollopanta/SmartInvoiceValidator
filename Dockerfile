FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    $PHPIZE_DEPS

RUN docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
    intl \
    pdo_mysql \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader 2>/dev/null || composer install --no-scripts --no-autoloader
COPY . .
RUN composer dump-autoload --optimize

RUN mkdir -p tmp/cache tmp/sessions logs && chown -R www-data:www-data /var/www/html

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
