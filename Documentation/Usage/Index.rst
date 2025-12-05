..  include:: /Includes.rst.txt

..  _using-the-components:

====================
Using the components
====================

MDLR provides Fluid components you can use like ViewHelpers in your TYPO3
templates. Fluid transforms them into HTML when the frontend is rendered.

..  code-block:: html

    <mdlr:atom.button.function function="copy" variants="{0: 'tinyicon', 1: 'unobserved', 2: 'sidelined'}" text="Copy" hint="Copy this sample text" data="{target: 'I am sample text', success: 'Copied to clipboard', failure: 'Something went wrong'}" icon="copy" />

More complex constructs such as dropdowns work with combinations of wrappers,
fragments, and list items:

..  code-block:: html

    <mdlr:molecule.dropdown.wrap id="select-page" variants="{0: 'right', 1: 'up'}">

        <f:fragment name="handle">
            <mdlr:atom.button.function function="dropdown" variants="{0: 'texticon'}" text="Select page" hint="Show available items" iconAfter="down" popoverTarget="select-page" />
        </f:fragment>

        <f:fragment name="list">
            <mdlr:molecule.dropdown.item>
                <mdlr:atom.button.page pageUid="0" variants="{0: 'mini', 1: 'unobtrusive'}" text="Homepage" />
            </mdlr:molecule.dropdown.item>
            <mdlr:molecule.dropdown.item>
                <mdlr:atom.button.page pageUid="1" variants="{0: 'mini', 1: 'unobtrusive'}" text="Another page" />
            </mdlr:molecule.dropdown.item>
        </f:fragment>

    </mdlr:molecule.dropdown.wrap>

Refer to the :ref:`API reference <api-reference>` for all available components.

..  _sample-implementation:

Sample implementation
=====================

To see the Fluid components in use, check out their
`sample implementation <https://github.com/digicademy-chf/chf_base/tree/main/Resources/Private/PageView>`__
in the ``PageView`` of CHF Base, a publishing system for cultural-heritage
data.
