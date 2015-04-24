<?php
use Sami\Sami;
use Symfony\Component\Finder\Finder;
use Sami\Parser\Filter\TrueFilter;

$iterator = Finder::create()
    ->files()
    ->name('*.php')
    ->exclude('libs')
    ->in('./');

$sami = new Sami($iterator, array(
    'theme'                => 'enhanced',
    'title'                => 'Around Earth',
    'build_dir'            => __DIR__.'/public/docs/api',
    'cache_dir'            => '/tmp/cache',
    'default_opened_level' => 1,
));

// Sami only documents the public API (public properties and methods);
// override the default configured filter to change this behavior:
$sami['filter'] = function () {
    return new TrueFilter();
};

return $sami;