<?php
declare(strict_types=1);

# This file is part of the MDLR extension for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


defined('TYPO3') or die();

// Make namespace known to all template files
$GLOBALS['TYPO3_CONF_VARS']['SYS']['fluid']['namespaces']['mdlr'] = [
    \Digicademy\MDLR\Components\MdlrComponents::class,
];
