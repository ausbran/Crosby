<?php

$vendorDir = dirname(__DIR__);
$rootDir = dirname(dirname(__DIR__));

return array (
  'craftcms/ckeditor' => 
  array (
    'class' => 'craft\\ckeditor\\Plugin',
    'basePath' => $vendorDir . '/craftcms/ckeditor/src',
    'handle' => 'ckeditor',
    'aliases' => 
    array (
      '@craft/ckeditor' => $vendorDir . '/craftcms/ckeditor/src',
    ),
    'name' => 'CKEditor',
    'version' => '4.4.0',
    'description' => 'Edit rich text content in Craft CMS using CKEditor.',
    'developer' => 'Pixel & Tonic',
    'developerUrl' => 'https://pixelandtonic.com/',
    'developerEmail' => 'support@craftcms.com',
    'documentationUrl' => 'https://github.com/craftcms/ckeditor/blob/master/README.md',
  ),
  'craftsnippets/craft-image-toolbox' => 
  array (
    'class' => 'craftsnippets\\imagetoolbox\\ImageToolbox',
    'basePath' => $vendorDir . '/craftsnippets/craft-image-toolbox/src',
    'handle' => 'image-toolbox',
    'aliases' => 
    array (
      '@craftsnippets/imagetoolbox' => $vendorDir . '/craftsnippets/craft-image-toolbox/src',
    ),
    'name' => 'Image toolbox',
    'version' => '3.0.1',
    'description' => 'Image toolbox',
    'developer' => 'Piotr Pogorzelski',
    'developerUrl' => 'http://craftsnippets.com/',
    'documentationUrl' => 'http://craftsnippets.com/docs/image-toolbox/',
    'changelogUrl' => 'https://github.com/craft-snippets/Craft-image-toolbox/blob/master/CHANGELOG.md',
    'components' => 
    array (
      'imageToolboxService' => 'craftsnippets\\imagetoolbox\\services\\ImageToolboxService',
    ),
  ),
  'vaersaagod/dospaces' => 
  array (
    'class' => 'vaersaagod\\dospaces\\Plugin',
    'basePath' => $vendorDir . '/vaersaagod/dospaces/src',
    'handle' => 'dospaces',
    'aliases' => 
    array (
      '@vaersaagod/dospaces' => $vendorDir . '/vaersaagod/dospaces/src',
    ),
    'name' => 'DigitalOcean Spaces Filesystem',
    'version' => '3.0.0',
    'schemaVersion' => '2.0.0',
    'description' => 'DigitalOcean Spaces integration for Craft CMS',
    'developer' => 'Værsågod',
    'developerUrl' => 'https://www.vaersaagod.no/',
    'documentationUrl' => 'https://github.com/vaersaagod/dospaces',
    'changelogUrl' => 'https://raw.githubusercontent.com/vaersaagod/dospaces/master/CHANGELOG.md',
    'downloadUrl' => 'https://github.com/vaersaagod/dospaces/archive/master.zip',
  ),
  'nystudio107/craft-seomatic' => 
  array (
    'class' => 'nystudio107\\seomatic\\Seomatic',
    'basePath' => $vendorDir . '/nystudio107/craft-seomatic/src',
    'handle' => 'seomatic',
    'aliases' => 
    array (
      '@nystudio107/seomatic' => $vendorDir . '/nystudio107/craft-seomatic/src',
    ),
    'name' => 'SEOmatic',
    'version' => '5.1.7',
    'description' => 'SEOmatic facilitates modern SEO best practices & implementation for Craft CMS 5. It is a turnkey SEO system that is comprehensive, powerful, and flexible.',
    'developer' => 'nystudio107',
    'developerUrl' => 'https://nystudio107.com',
    'documentationUrl' => 'https://nystudio107.com/docs/seomatic/',
  ),
  'verbb/formie' => 
  array (
    'class' => 'verbb\\formie\\Formie',
    'basePath' => $vendorDir . '/verbb/formie/src',
    'handle' => 'formie',
    'aliases' => 
    array (
      '@verbb/formie' => $vendorDir . '/verbb/formie/src',
    ),
    'name' => 'Formie',
    'version' => '3.0.14',
    'description' => 'The most user-friendly forms plugin for Craft.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/formie',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/formie/craft-5/CHANGELOG.md',
  ),
);
