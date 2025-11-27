<?php

$EM_CONF[$_EXTKEY] = [
    'title'          => 'MDLR',
    'description'    => 'Atomic web frontend library for use in accessible, responsive web apps',
    'category'       => 'templates',
    'author'         => 'Jonatan Jalle Steller',
    'author_email'   => 'jonatan.steller@adwmainz.de',
    'author_company' => 'Academy of Sciences and Literature Mainz',
    'state'          => 'stable',
    'version'        => '2.0.0',
    'constraints'    => [
        'depends'   => [
            'typo3' => '14.0.0-14.99.99'
        ],
        'conflicts' => [
        ],
        'suggests'  => [
        ],
    ],
    'autoload'       => [
        'psr-4' => [
           'Digicademy\\MDLR\\' => 'Classes/'
        ]
     ]
];
