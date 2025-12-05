..  include:: /Includes.rst.txt

..  _install-and-config:

==================
Install and config
==================

..  rst-class:: bignums

1.  Install the extension

    Add the package to your ``composer.json`` via a PHP Composer command:

    ..  code-block::

        composer require digicademy/mdlr:^2

2.  Apply the site set

    For MDLR components to have the right CSS and JS code, edit your site
    configuration in the TYPO3 backend at :guilabel:`Sites > Setup` and add
    ``MDLR Frontend Library`` to the site sets you use.

    Alternatively, if your site is implemented via its own site set, add
    the following code to your ``config.yaml``:

    ..  code-block:: yaml

        dependencies:
          - digicademy/mdlr
