<?php
declare(strict_types=1);

# This file is part of the MDLR extension for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


namespace Digicademy\MDLR\Components;

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3Fluid\Fluid\Core\Component\AbstractComponentCollection;
use TYPO3Fluid\Fluid\View\TemplatePaths;

defined('TYPO3') or die();

/**
 * Collection of MDLR frontend components
 */
final class MdlrComponents extends AbstractComponentCollection
{
    public function getTemplatePaths(): TemplatePaths
    {
        $templatePaths = new TemplatePaths();
        $templatePaths->setTemplateRootPaths([
            ExtensionManagementUtility::extPath('mdlr', 'Resources/Private/Components'),
        ]);
        return $templatePaths;
    }
}
