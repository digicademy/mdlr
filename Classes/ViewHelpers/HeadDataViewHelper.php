<?php
declare(strict_types=1);

# This file is part of the MDLR extension for TYPO3.
#
# For the full copyright and license information, please read the
# LICENSE.txt file that was distributed with this source code.


namespace Digicademy\MDLR\ViewHelpers;

use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class HeadDataViewHelper extends AbstractViewHelper
{
    public function __construct(private readonly PageRenderer $pageRenderer) {}

    public function render(): void
    {
        $this->pageRenderer->addHeaderData($this->renderChildren());
    }
}