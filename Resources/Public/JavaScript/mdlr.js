/*
This file is part of the MDLR web frontend library v0.5.0.

The atomic interface library is designed to work with semantic HTML for
accessible, responsive web apps. It is MIT licenced.
*/

/*
// Show a functioning install button if the app is not installed yet
window.addEventListener( 'beforeinstallprompt', (e) => {
    const deferredPrompt = e;

    // Display the install button
    const installButton = document.getElementById( 'install' );
    installButton.hidden = false;
    installButton.classList.add( 'mdlr-variant-visible' );
  
    // When the button is clicked, show the install prompt
    document.getElementById( 'install-button' ).addEventListener( 'click', ( e ) => {
        deferredPrompt.prompt();
    } );
    document.getElementById( 'install-button' ).addEventListener( 'keydown', function( e ) {
        if( e.code == 'Enter' || e.code == 'Space' ) {
            e.preventDefault();
            deferredPrompt.prompt();
        }
    });

    // Wait for the user response and show a notification
    deferredPrompt.userChoice.then( ( choice ) => {

        // Case 1: user installs app
        if ( choice.outcome === 'accepted' ) {
            mdlr_toast_open( 'notify', 'Erfolgreich installiert' );

        // Case 2: user does not install app
        } else {
            mdlr_toast_open( 'notify', 'App leider nicht installiert' );
        }

        // Hide the button
        installButton.classList.remove( 'mdlr-variant-visible' );
        setTimeout( function () {
            installButton.hidden = true;
        }, 350 );

        // Reset the variable
        deferredPrompt = null;
    } );
} );*/


/*
# Timeline ####################################################################
*/

// Variable
const timelineRegions = mdlrElements('.mdlr-function-timeline');

// Activate all copy buttons
if(timelineRegions.length > 0) {
    timelineRegions.forEach((timelineRegion) => {
        timelineRegion.addEventListener('mouseover', (e) => {
            //e.preventDefault();
            mdlrTimelineHighlight(e.currentTarget);
        });
    });
}

// Highlight desired content
function mdlrTimelineHighlight(hoveredElement) {
    if(hoveredElement) {

        // Highlight target element
        const target = document.getElementById(hoveredElement.dataset.target);
        target.classList.add('mdlr-variant-active');

        // Add one-time listener to remove highlight
        hoveredElement.addEventListener('mouseout', (e) => {
            target.classList.remove('mdlr-variant-active');
        }, {once: true});
    }
}


/*
# Info buttons ################################################################
*/

// Variables
const infoButtons = mdlrElements('.mdlr-function-info');
const infoPopovers = mdlrElements('.mdlr-info > ol > li');

// Activate all info buttons
if(infoButtons.length > 0) {
    infoButtons.forEach((infoButton) => {
        infoButton.addEventListener('click', (e) => {
            //e.preventDefault();
            mdlrInfoOpen(e.currentTarget);
        });
        infoButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrInfoOpen(e.currentTarget);
            }
        });
    });
}

// Show info popover on demand
function mdlrInfoOpen(clickedElement) {

    // Identify the popover to open
    let targetId = clickedElement.href;
    targetId = targetId.substring(targetId.indexOf('#') );
    let targets = mdlrElements(targetId);

    // Close popover if it is already open
    targets.forEach((target) => {
        if(target.classList.contains('mdlr-variant-active')) {
            mdlrInfoClose();
        }
        else {

            // Get desired popover position
            const viewport = window.innerWidth;
            const offsetMin = clickedElement.offsetWidth;
            const offsetAdditional = Math.round(0.25 * offsetMin);
            const offsetWidth = target.offsetWidth;
            const position = clickedElement.getBoundingClientRect();
            const positionTop = position.top + window.scrollY + offsetMin;

            // Calculate whether popover should be right-aligned
            if((position.left + window.scrollX) > (viewport * 0.5)) {
                var positionLeft = position.left + window.scrollX - offsetWidth + offsetMin + offsetAdditional;
            }
            else {
                var positionLeft = position.left + window.scrollX - offsetAdditional;
            }

            // Position and show popover
            target.style['top'] = positionTop + 'px';
            target.style['left'] = positionLeft + 'px';
            target.classList.add('mdlr-variant-active');

            // Set a listener to close the popover on the next click anywhere in the document
            setTimeout(() => {
                document.addEventListener('click', mdlrInfoCloseConditions);
                window.addEventListener('resize', mdlrInfoCloseConditions);
                document.addEventListener('touchstart', mdlrInfoCloseConditions);
                document.addEventListener('keydown', mdlrInfoCloseConditions);
            }, 50);
        }
    });
}

// Close info popover on demand
function mdlrInfoClose() {

    // Close popovers
    if(infoPopovers.length > 0) {
        infoPopovers.forEach((infoPopover) => {
            infoPopover.classList.remove('mdlr-variant-active');
        });
    }

    // Remove unnecessary listeners
    document.removeEventListener('click', mdlrInfoCloseConditions);
    window.removeEventListener('resize', mdlrInfoCloseConditions);
    document.removeEventListener('touchstart', mdlrInfoCloseConditions);
    document.removeEventListener('keydown', mdlrInfoCloseConditions);
}

// Close all info popovers under certain conditions
function mdlrInfoCloseConditions(e) {

    // Check for 'escape' keypress if the event is a keypress
    if(e.code) {
        if(e.code == 'Escape' || e.code == 'Enter' || e.code == 'Space') {
            e.preventDefault();
            mdlrInfoClose();
        }
    }

    // Check if click was outside the popover
    else {
        if(! e.target.closest('.mdlr-info > ol > li')) {
            mdlrInfoClose();
        }
    }
}


/*
# Reference links #############################################################
*/

// Variables
const referenceLinks = mdlrElements('.mdlr-function-reference');

// Activate all reference links
if(referenceLinks.length > 0) {
    referenceLinks.forEach((referenceLink) => {
        referenceLink.addEventListener('click', (e) => {
            //e.preventDefault();
            mdlrReferenceOpen(e.currentTarget);
        });
        referenceLink.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrReferenceOpen(e.currentTarget);
            }
        });
    });
}

// Show reference popover on demand
function mdlrReferenceOpen(clickedElement) {

    // Identify the reference to show
    let targetId = clickedElement.href;
    targetId = targetId.substring(targetId.indexOf('#') );
    let targets = mdlrElements(targetId);

    // Close popover if it is already open
    targets.forEach((target) => {
        if(document.getElementById('temporary-reference')) {
            mdlrReferenceClose();
        }
        else {

            // Move content to temporary info popover
            let content = document.createElement('li');
            content.id = 'temporary-reference';
            content.innerHTML = target.innerHTML;
            const contentElement = document.getElementById('info-items').appendChild(content);

            // Get desired popover position
            const viewport = window.innerWidth;
            const offsetMin = clickedElement.offsetWidth;
            const offsetHeight = clickedElement.offsetHeight;
            const offsetAdditional = 10;
            const offsetWidth = contentElement.offsetWidth;
            const position = clickedElement.getBoundingClientRect();
            const positionTop = position.top + window.scrollY + offsetHeight;

            // Calculate whether popover should be right-aligned
            if((position.left + window.scrollX) > (viewport * 0.5)) {
                var positionLeft = position.left + window.scrollX - offsetWidth + offsetMin + offsetAdditional;
            }
            else {
                var positionLeft = position.left + window.scrollX - offsetAdditional;
            }

            // Position and show popover
            contentElement.style['top'] = positionTop + 'px';
            contentElement.style['left'] = positionLeft + 'px';
            contentElement.classList.add('mdlr-variant-active');

            // Set a listener to close the popover on the next click anywhere in the document
            setTimeout(() => {
                document.addEventListener('click', mdlrReferenceCloseConditions);
                window.addEventListener('resize', mdlrReferenceCloseConditions);
                document.addEventListener('touchstart', mdlrReferenceCloseConditions);
                document.addEventListener('keydown', mdlrReferenceCloseConditions);
            }, 50);
        }
    });
}

// Close reference popover on demand
function mdlrReferenceClose() {

    // Close popovers
    let referencePopover = document.getElementById('temporary-reference');
    referencePopover.classList.remove('mdlr-variant-active');
    setTimeout(() => { // TODO Possibly remove this
        referencePopover.remove();
    }, 225);

    // Remove unnecessary listeners
    document.removeEventListener('click', mdlrReferenceCloseConditions);
    window.removeEventListener('resize', mdlrReferenceCloseConditions);
    document.removeEventListener('touchstart', mdlrReferenceCloseConditions);
    document.removeEventListener('keydown', mdlrReferenceCloseConditions);
}

// Close reference popover under certain conditions
function mdlrReferenceCloseConditions(e) {

    // Check for 'escape' keypress if the event is a keypress
    if(e.code) {
        if(e.code == 'Escape' || e.code == 'Enter' || e.code == 'Space') {
            e.preventDefault();
            mdlrReferenceClose();
        }
    }

    // Check if click was outside the popover
    else {
        if(! e.target.closest('.mdlr-info > ol > li#temporary-reference')) {
            mdlrReferenceClose();
        }
    }
}















/*
# Basics ######################################################################
*/

// General variables
const root = document.documentElement;

// Identify elements
function mdlrElements(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

/*
# Web app #####################################################################
*/

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('mdlr-sw.js')
}

/*
# Storage #####################################################################
*/

// Variables
const storageButtons = mdlrElements('.mdlr-function-storage');

// Activate theme buttons
if(storageButtons.length > 0) {
    storageButtons.forEach((storageButton) => {
        storageButton.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrStorageClear();
        });
        storageButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrStorageClear();
            }
        });
    });
}

// Remove all content of local storage
function mdlrStorageClear() {
    localStorage.clear();
    mdlrStorageEvaluate();
    mdlrWatchlistView();
}

// Evaluate whether there is local storage to delete
function mdlrStorageEvaluate() {
    if(localStorage.length > 0) {
        if(storageButtons.length > 0) {
            storageButtons.forEach((storageButton) => {
                storageButton.disabled = false;
            });
        }
    } else {
        if(storageButtons.length > 0) {
            storageButtons.forEach((storageButton) => {
                storageButton.disabled = true;
            });
        }
    }
}

// Automatically evaluate local storage
mdlrStorageEvaluate();

/*
# Theme #######################################################################
*/

// Variables
const themeButtons = mdlrElements('.mdlr-function-theme');
const themePictures = mdlrElements('picture.mdlr-variant-theme');

// Activate theme buttons
if(themeButtons.length > 0) {
    themeButtons.forEach((themeButton) => {
        themeButton.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrThemeSet(e.currentTarget.dataset.target);
        });
        themeButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrThemeSet(e.currentTarget.dataset.target);
            }
        });
    });
}

// Highlight the active switch button
function mdlrThemeSwitch(theme) {
    const themeActiveClass = 'mdlr-variant-active';

    // Activate only the requested switch buttons
    themeButtons.forEach((themeButton) => {
        if(themeButton.dataset.target == theme) {
            themeButton.classList.add(themeActiveClass);
        } else {
            themeButton.classList.remove(themeActiveClass);
        }
    });
}

// Set requested theme class
function mdlrThemeSet(theme) {

    // Remove any previous theme classes
    const themeClasses = [
        'mdlr-theme-light',
        'mdlr-theme-dark'
    ];
    themeClasses.forEach((themeClass) => {
        root.classList.remove(themeClass);
    });

    // Add requested class and save user preference
    if(theme != null) {
        switch(theme) {

            // Light mode
            case 'light':
                root.classList.add('mdlr-theme-light');
                localStorage.setItem('theme', 'light');
                break;

            // Dark mode
            case 'dark':
                root.classList.add('mdlr-theme-dark');
                localStorage.setItem('theme', 'dark');
                break;

            // Auto mode
            default:
                localStorage.removeItem('theme');
                break;
        }

        // Highlight the active switch button
        mdlrThemeSwitch(theme);
    }

    // Re-evaluate local-storage indicators
    mdlrStorageEvaluate();
}

// Automatically activate theme
mdlrThemeSet(localStorage.getItem('theme'));

/*
# Back, up, and PDF ###########################################################
*/

// Variable
const backButtons = mdlrElements('.mdlr-function-back');
const upButtons = mdlrElements('.mdlr-function-up');
const pdfButtons = mdlrElements('.mdlr-function-pdf');

// Activate back buttons
if(backButtons.length > 0) {
    backButtons.forEach((backButton) => {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            history.back();
        });
        backButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                history.back();
            }
        });
    });
}

// Activate up buttons
if(upButtons.length > 0) {
    upButtons.forEach((upButton) => {
        upButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo(0, 0);
        });
        upButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                window.scrollTo(0, 0);
            }
        });
    });
}

// Activate PDF buttons
if(pdfButtons.length > 0) {
    pdfButtons.forEach((pdfButton) => {
        pdfButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
        pdfButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                window.print();
            }
        });
    });
}

/*
# Fullscreen ##################################################################
*/

// Variable
const fullscreenButtons = mdlrElements('.mdlr-function-fullscreen');

// Activate fullscreen buttons
if(fullscreenButtons.length > 0) {
    fullscreenButtons.forEach((fullscreenButton) => {
        fullscreenButton.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrFullscreenToggle(e.currentTarget);
        });
        fullscreenButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrFullscreenToggle(e.currentTarget);
            }
        });
    });
}

// Open a specific element in fullscreen
function mdlrFullscreenToggle(clickedElement) {

    // Find element to open
    const elementId = clickedElement.dataset.target;
    const element = document.getElementById(elementId);
    const failureMessage = clickedElement.dataset.failure;

    // Check if element is available
    if(! element) {
        mdlrToastOpen(failureMessage);
    } else {

        // Open element
        if(! document.fullscreenElement) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.webkitRequestFullscreen) { // Fallback for Safari versions pre-16.4
                element.webkitRequestFullscreen();
            } else {
                mdlrToastOpen(failureMessage);
            }

        // Close element
        } else {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.webkitExitFullscreen) { // Fallback for Safari versions pre-16.4
                document.webkitExitFullscreen();
            } else {
                mdlrToastOpen(failureMessage);
            }
        }
    }
}

/*
# Headerbars ##################################################################
*/

// Variable
const headerbars = mdlrElements('.mdlr-variant-headerbar');

// Set up observer
const headerbarOptions = {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1
}

// Add or remove class when target element hits or exits viewport
const headerbarCallback = (entries, observer) => {
    entries.forEach((entry) => {

        // Entering viewport
        if(entry.isIntersecting) {
            headerbars.forEach((headerbar) => {
                headerbar.classList.remove('mdlr-variant-scrolled');
            });
        }

        // Exiting viewport
        else {
            headerbars.forEach((headerbar) => {
                headerbar.classList.add('mdlr-variant-scrolled');
            });
        }
    });
}

// Initialise observer
const headerbarObserver = new IntersectionObserver(headerbarCallback, headerbarOptions);
const headerbarTargets = mdlrElements('.mdlr-function-scroll');
if(headerbarTargets.length > 0) {
    headerbarTargets.forEach((headerbarTarget) => {
        headerbarObserver.observe(headerbarTarget);
    });
}

/*
# Dropdown ####################################################################
*/

// Variable
const dropdowns = mdlrElements('.mdlr-dropdown');
const dropdownClass = 'mdlr-variant-active';

// Insert positions and transitions
if(dropdowns.length > 0) {
    dropdowns.forEach((dropdown) => {

        // Add position/transition after popover is opened
        dropdown.addEventListener('toggle', (e) => {
            if(e.newState == 'open') {
                mdlrDropdownToggle(dropdown);
            }
        });

        // Add transition before popover is closed
        dropdown.addEventListener('beforetoggle', (e) => {
            if(e.newState == 'closed') {
                mdlrDropdownToggle(dropdown, true);
            }
        });
    });
}

// Manipulate handle and dropdown when opened/closed
function mdlrDropdownToggle(dropdown, close = false) {

    // Get handle
    const handle = document.querySelector('[popovertarget="' + dropdown.id + '"]');

    // Position dropdown
    if(!close) {
        const handleRect = handle.getBoundingClientRect();
        if(dropdown.classList.contains('mdlr-variant-right')) {
            dropdown.style.insetInlineStart = `${handleRect.right - dropdown.offsetWidth}px`;
        } else {
            dropdown.style.insetInlineStart = `${handleRect.left}px`;
        }
        if(dropdown.classList.contains('mdlr-variant-up')) {
            dropdown.style.insetBlockStart = `${handleRect.top - dropdown.offsetHeight}px`;
        } else {
            dropdown.style.insetBlockStart = `${handleRect.bottom}px`;
        }

        // Activate handle and dropdown
        dropdown.classList.add(dropdownClass);
        handle.classList.add(dropdownClass);

    // Reset handle and dropdown
    } else {
        dropdown.classList.remove(dropdownClass);
        handle.classList.remove(dropdownClass);
    }
}

/*
# Select ######################################################################
*/

const selectForms = mdlrElements('.mdlr-function-select-form');

// Activate select form buttons
if(selectForms.length > 0) {
    selectForms.forEach((selectForm) => {
        selectForm.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrSelectForm(e.currentTarget);
        });
        selectForm.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrSelectForm(e.currentTarget);
            }
        });
    });
}

// Form-wide select
function mdlrSelectForm(clickedElement) {

    // Retrieve selection
    const newAction = clickedElement.href;
    const newLabel = clickedElement.textContent;

    // Retrieve relevant elements
    const popover = clickedElement.closest('menu');
    const popoverItems = popover.querySelectorAll('li');
    const popoverItemIcons = popover.querySelectorAll('svg > use');
    const selectedItem = clickedElement.closest('li');
    const selectedItemIcon = clickedElement.querySelector('svg > use');
    const handleSpan = document.querySelector('[popovertarget="' + popover.id + '"] > span');
    const form = clickedElement.closest('form');

    // Unselect all options
    if(popoverItems.length > 0) {
        popoverItems.forEach((popoverItem) => {
            popoverItem.ariaSelected = 'false';
        });
    }
    if(popoverItemIcons.length > 0) {
        popoverItemIcons.forEach((popoverItemIcon) => {
            popoverItemIcon.setAttributeNS(null, 'href', '#icon-blank');
        });
    }

    // Activate selected option
    selectedItem.ariaSelected = 'true';
    selectedItemIcon.setAttributeNS(null, 'href', '#icon-checkmark');

    // Change form and handle accordingly
    form.action = newAction;
    handleSpan.textContent = newLabel;

    // Hide popover
    popover.hidePopover();
}

/*
# Hierarchy ###################################################################
*/

// Variable
const hierarchies = mdlrElements('.mdlr-function-hierarchy');

// Activate all toggles
if(hierarchies.length > 0) {
    hierarchies.forEach((hierarchy) => {
        hierarchy.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrHierarchy(e.currentTarget);
        });
        hierarchy.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrHierarchy(e.currentTarget);
            }
        });
    });
}

// Toggle display of an element
function mdlrHierarchy(clickedElement) {
    if(clickedElement) {

        // Get toggle data
        const hierarchyClass = 'mdlr-variant-active';
        const element = clickedElement.parentElement.parentElement.querySelector('ul.mdlr-variant-ondemand');

        // Toggle CSS class
        if(element) {

            // Remove
            if(element.classList.contains(hierarchyClass)) {
                element.classList.remove(hierarchyClass);
                clickedElement.classList.remove(hierarchyClass);
            }

            // Add
            else {
                element.classList.add(hierarchyClass);
                clickedElement.classList.add(hierarchyClass);
            }
        }
    }
}

/*
# Modals ######################################################################
*/

// Variables
const modals = mdlrElements('.mdlr-modal');
const modalOpeners = mdlrElements('.mdlr-function-modal');
const modalClosers = mdlrElements('.mdlr-function-modal-close');
var modalTransition = 200;

// Calculate CSS transition duration
if(modals.length > 0) {
    modalTransition = (parseFloat(window.getComputedStyle(modals[0]).transitionDuration)) * 1000;
}

// Activate opener buttons in modals
if(modalOpeners.length > 0) {
    modalOpeners.forEach((modalOpener) => {
        modalOpener.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrModalOpen(e.currentTarget);
        });
        modalOpener.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrModalOpen(e.currentTarget);
            }
        });
    });
}

// Activate close buttons in modals
if(modalClosers.length > 0) {
    modalClosers.forEach((modalCloser) => {
        modalCloser.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrModalClose();
        });
        modalCloser.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrModalClose();
            }
        });
    });
}

// Open a specific modal
function mdlrModalOpen(clickedElement) {

    // Retrieve modal to open and identify the opener
    const modalId = clickedElement.getAttribute('aria-controls');
    const modal = document.getElementById(modalId);
    const focusId = clickedElement.dataset.focus;
    const focusElement = document.getElementById(focusId);
    modal.dataset.opener = clickedElement.id;

    // Show dialog
    modal.showModal();
    modal.classList.add('mdlr-variant-active');

    // Focus close button for keyboard users
    modal.querySelectorAll('button')[0].focus();

    // Enable scroll prevention
    document.body.classList.add('mdlr-variant-modal');

    // Focus specific element
    setTimeout(() => {
        if(focusElement) {
            focusElement.focus();
        }

        // Set one-time listeners for removing the modal (click, swipe, keypress)
        document.addEventListener('click', mdlrModalCloseConditions);
        window.addEventListener('touchstart', mdlrModalCloseConditions);
        window.addEventListener('keydown', mdlrModalCloseConditions);
    }, modalTransition);
}

// Close all modals
function mdlrModalClose() {

    // Remove scroll prevention
    document.body.classList.remove('mdlr-variant-modal');

    // Hide modal
    modals.forEach((modal) => {
        modal.classList.remove('mdlr-variant-active');

        // Close modal after transition
        setTimeout(() => {
            modal.close();
        }, modalTransition + 25);
    
        // Return keyboard focus to the opener
        const modalOpenerId = modal.dataset.opener
        if(modalOpenerId && modalOpenerId != '') {
            document.getElementById(modalOpenerId).focus();
            modal.dataset.opener = '';
        }
    });

    // Remove unnecessary listeners for removing the modal (click, swipe, keypress)
    document.removeEventListener('click', mdlrModalCloseConditions);
    window.removeEventListener('touchstart', mdlrModalCloseConditions);
    window.removeEventListener('keydown', mdlrModalCloseConditions);
}

// Close conditions for listeners
function mdlrModalCloseConditions(e) {

    // Check for 'escape' keypress
    if(e.code) {
        if(e.code == 'Escape') {
            e.preventDefault();
            mdlrModalClose();
        }
    }

    // Check if click/swipe is outside dialog
    else {
        const openModal = document.querySelector('.mdlr-modal[open]');
        const openModalRect = openModal.getBoundingClientRect();
        let clientY = 0;
        let clientX = 0;

        // Click
        if(e.clientY && e.clientX) {
            clientY = e.clientY;
            clientX = e.clientX;

        // Swipe
        } else if(e.touches[0].clientY && e.touches[0].clientX) {
            clientY = e.touches[0].clientY;
            clientX = e.touches[0].clientX;
        }

        // Check dialog rect
        const inOpenModal = (openModalRect.top <= clientY && clientY <= openModalRect.top + openModalRect.height && openModalRect.left <= clientX && clientX <= openModalRect.left + openModalRect.width);
        if (! inOpenModal) {
            //e.preventDefault();
            mdlrModalClose();
        }
    }
}

/*
# Toasts ######################################################################
*/

// Variables
const toasts = mdlrElements('.mdlr-toast');
const toastClosers = mdlrElements('.mdlr-function-toast-close');
var toastTransition = 200;

// Calculate CSS transition duration
if(toasts.length > 0) {
    toastTransition = (parseFloat(window.getComputedStyle(toasts[0]).transitionDuration)) * 1000;
}

// Activate all close buttons for toasts
if(toastClosers.length > 0) {
    toastClosers.forEach((toastCloser) => {
        toastCloser.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrToastClose();
        });
        toastCloser.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrToastClose();
            }
        });
    });
}

// Open toast notification
function mdlrToastOpen(toastText) {

    // Close open notification and add delay to accomodate the transition
    // Delay also makes actions appear like they took time to compute
    mdlrToastClose()
    setTimeout(() => {

        // Add notification text
        toasts.forEach((toast) => {
            const notifications = toast.getElementsByTagName('p');
            for(const notification of notifications) {
                notification.textContent = toastText;
            }

            // Show dialog
            toast.show();
            toast.setAttribute('aria-hidden', 'false');
            toast.classList.add('mdlr-variant-active');

        });

        // Remove notification after three seconds and transition bonus
        setTimeout(() => {
            mdlrToastClose();
        }, toastTransition + 3050);

    }, toastTransition + 50);
}

// Close toast notification
function mdlrToastClose() {

    // Remove active notifications
    toasts.forEach((toast) => {
        toast.classList.remove('mdlr-variant-active');
        toast.setAttribute('aria-hidden', 'true');

        // Clear dialog element and notification text
        setTimeout(() => {
            toast.close();
            const notifications = toast.getElementsByTagName('p');
            for(const notification of notifications) {
                notification.textContent = '';
            }
        }, toastTransition + 25);
    });
}

/*
# Copy ########################################################################
*/

// Variable
const copyButtons = mdlrElements('.mdlr-function-copy');

// Activate all copy buttons
if(copyButtons.length > 0) {
    copyButtons.forEach((copyButton) => {
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrCopy(e.currentTarget);
        });
        copyButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrCopy(e.currentTarget);
            }
        });
    });
}

// Copy desired content
function mdlrCopy(clickedElement) {
    if(clickedElement) {

        // Get content
        const content = clickedElement.dataset.target;
        const successMessage = clickedElement.dataset.success;
        const failureMessage = clickedElement.dataset.failure;

        // Copy content to the clipboard
        if(content && successMessage && failureMessage) {
            try {
                navigator.clipboard.writeText(content)

                // Success notification
                .then(() => {
                    mdlrToastOpen(successMessage);

                // Failure notification
                }, () => {
                    mdlrToastOpen(failureMessage);
                });

            // Error notification, especially useful in non-HTTPS contexts
            // navigator.clipboard.writeText is only available with HTTPS
            } catch (error) {
                mdlrToastOpen(failureMessage);
            }
        }
    }
}

/*
# Share #######################################################################
*/

// Variable
const shareButtons = mdlrElements('.mdlr-function-share');

// Activate all share buttons
if(shareButtons.length > 0) {
    shareButtons.forEach((shareButton) => {
        shareButton.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrShare(e.currentTarget);
        });
        shareButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrShare(e.currentTarget);
            }
        });
    });
}

// Enable share buttons only when the browser feature is available
if(navigator.canShare && navigator.canShare({
    title: 'Sample headline',
    text: 'Sample text',
    url: 'https://www.adwmainz.de/'
    })) {
    shareButtons.forEach((shareButton) => {
        if(shareButton.parentElement.hidden == true) {
            shareButton.parentElement.hidden = false;
        }
        else {
            shareButton.hidden = false;
        }
    });
}

// Open the browser's share dialog
async function mdlrShare(clickedElement) {

    // Retrieve data to share
    const shareData = {
        title: clickedElement.dataset.title,
        text: clickedElement.dataset.text,
        url: clickedElement.dataset.target
    }
    const successMessage = clickedElement.dataset.success;
    const failureMessage = clickedElement.dataset.failure;
    const errorMessage = clickedElement.dataset.error;

    // Request share action
    if(navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData)
            mdlrToastOpen(successMessage);
        } catch(error) {
            mdlrToastOpen(failureMessage);
        }
    }
    else {
        mdlrToastOpen(errorMessage);
    }
}

/*
# Mastodon ####################################################################
*/

// Variables
const mastodonButtons = mdlrElements('.mdlr-function-mastodon');

// Activate Mastodon share buttons
if(mastodonButtons.length > 0) {
    mastodonButtons.forEach((mastodonButton) => {
        mastodonButton.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrMastodon(e.currentTarget);
        });
        mastodonButton.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrMastodon(e.currentTarget);
            }
        });
    });
}

// Share to user-defined Mastodon instance (no central share URL due to federation)
function mdlrMastodon(clickedElement) {

    // Get content
    var target = clickedElement.dataset.target;
    const promptMessage = clickedElement.dataset.prompt;
    const failureMessage = clickedElement.dataset.failure;

    // Ask user about their Mastodon instance
    var instance = prompt(promptMessage, 'mastodon.social');

    // Clean and assemble target URL
    if(instance != null && instance != '') {
        instance = instance.replace(/^(https\:\/\/)/, '');
        instance = instance.replace(/^(http\:\/\/)/, '');
        target = 'https://' + instance + '/share?text=' + target;

        // Open user-defined target URL
        window.open(target, '_blank');
    }

    // Notify user of cancellation
    else {
        mdlrToastOpen(failureMessage)
    }
}

/*
# Watchlist ###################################################################
*/

const watchlistAdders = mdlrElements('.mdlr-function-watchlist-add');
const watchlistCsvs = mdlrElements('.mdlr-function-watchlist-csv');
const watchlistJsons = mdlrElements('.mdlr-function-watchlist-json');
const watchlistClearers = mdlrElements('.mdlr-function-watchlist-clear');
const watchlistEmpties = mdlrElements('.mdlr-function-watchlist-empty');
const watchlistSerialisations = mdlrElements('.mdlr-function-watchlist-serialisations');

// Activate all buttons for watchlists
if(watchlistAdders.length > 0) {
    watchlistAdders.forEach((watchlistAdder) => {
        watchlistAdder.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrWatchlistAdd(e.currentTarget);
        });
        watchlistAdder.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrWatchlistAdd(e.currentTarget);
            }
        });
    });
}
if(watchlistCsvs.length > 0) {
    watchlistCsvs.forEach((watchlistCsv) => {
        watchlistCsv.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrWatchlistCsv();
        });
        watchlistCsv.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrWatchlistCsv();
            }
        });
    });
}
if(watchlistJsons.length > 0) {
    watchlistJsons.forEach((watchlistJson) => {
        watchlistJson.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrWatchlistJson();
        });
        watchlistJson.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrWatchlistJson();
            }
        });
    });
}
if(watchlistClearers.length > 0) {
    watchlistClearers.forEach((watchlistClearer) => {
        watchlistClearer.addEventListener('click', (e) => {
            e.preventDefault();
            mdlrWatchlistSet();
        });
        watchlistClearer.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                mdlrWatchlistSet();
            }
        });
    });
}

// Retrieve watchlist
function mdlrWatchlistGet() {

    // Get current watchlist if available
    let watchlist = localStorage.getItem('watchlist');
    if(watchlist) {
        watchlist = JSON.parse(watchlist);
    } else {
        watchlist = {};
    }

    // Return list
    return watchlist;
}

// Save watchlist
function mdlrWatchlistSet(watchlist = null) {

    // Either clear watchlist
    if(!watchlist || Object.keys(watchlist).length == 0) {
        localStorage.removeItem('watchlist');

    // Or save it to local storage
    } else {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }

    // Update DOM
    mdlrWatchlistView();
}

// Add entry to watchlist array
function mdlrWatchlistAdd(clickedElement) {

    // Retrieve watchlist
    let watchlist = mdlrWatchlistGet();

    // Retrieve new list item
    var addUrl = clickedElement.dataset.target;
    var addLabel = clickedElement.dataset.label;
    var addType = clickedElement.dataset.type;
    var messageFailure = clickedElement.dataset.failure;

    // Show failure message if URL is in watchlist already
    if(watchlist[addUrl]) {
        mdlrToastOpen(messageFailure);
    } else {

        // Add item to watchlist
        watchlist[addUrl] = [
            addLabel,
            addType,
        ];

        // Update watchlist
        mdlrWatchlistSet(watchlist);
    }
}

// Remove entry from watchlist
function mdlrWatchlistRemove(clickedElement) {

    // Retrieve watchlist
    let watchlist = mdlrWatchlistGet();

    // Retrieve list item to remove
    var removeUrl = clickedElement.dataset.target;
    var messageFailure = clickedElement.dataset.failure;

    // Show failure message if URL is not in watchlist
    if(!watchlist[removeUrl]) {
        mdlrToastOpen(messageFailure);
    } else {

        // Remove item from watchlist
        delete watchlist[removeUrl];

        // Update watchlist and show success message
        mdlrWatchlistSet(watchlist);
    }
}

// Update watchlist view
function mdlrWatchlistView() {

    // Reset all add buttons
    if(watchlistAdders.length > 0) {
        watchlistAdders.forEach((watchlistAdder) => {
            watchlistAdder.disabled = false;
            const watchlistAdderIcon = watchlistAdder.querySelector('svg > use');
            watchlistAdderIcon.setAttributeNS(null, 'href', '#icon-add');
        });
    }

    // Remove existing list from DOM
    const watchlistLists = mdlrElements('.mdlr-function-watchlist-list');
    if(watchlistLists.length > 0) {
        watchlistLists.forEach((watchlistList) => {
            watchlistList.remove();
        });
    }

    // Retrieve watchlist
    const watchlist = mdlrWatchlistGet();
    if(watchlistEmpties.length > 0) {
        watchlistEmpties.forEach((watchlistEmpty) => {
            const buttonRemove = watchlistEmpty.dataset.remove;
            const messageFailure = watchlistEmpty.dataset.failure;

            // Either hide empty note if the list has items
            if(Object.keys(watchlist).length > 0) {
                watchlistEmpty.classList.add('mdlr-variant-hidden');

                // Show serialisations
                if(watchlistSerialisations.length > 0) {
                    watchlistSerialisations.forEach((watchlistSerialisation) => {
                        watchlistSerialisation.classList.remove('mdlr-variant-hidden');
                    });
                }

                // Build list
                let newList = document.createElement('ul');
                newList.classList.add('mdlr-boxedlist', 'mdlr-function-watchlist-list');
                watchlistEmpty.after(newList);

                // Build list items
                for(let [key, value] of Object.entries(watchlist)) {
                    let newEntry = document.createElement('li');
                    newList.appendChild(newEntry);

                    // Button
                    let newButton = document.createElement('button');
                    newButton.classList.add('mdlr-variant-icon', 'mdlr-variant-transparent', 'mdlr-variant-sidelined');
                    newButton.title = buttonRemove;
                    newEntry.appendChild(newButton);

                    // Button > icon
                    let newButtonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    newButtonIcon.setAttributeNS(null, 'width', '24');
                    newButtonIcon.setAttributeNS(null, 'height', '24');
                    newButtonIcon.setAttributeNS(null, 'viewBox', '0 0 24 24');
                    newButtonIcon.setAttributeNS(null, 'version', '1.1');
                    newButtonIcon.ariaHidden = 'true';
                    newButton.appendChild(newButtonIcon);

                    // Button > icon > use
                    let newButtonIconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    newButtonIconUse.setAttributeNS(null, 'href', '#icon-remove');
                    newButtonIcon.appendChild(newButtonIconUse);

                    // Button > span
                    let newButtonSpan = document.createElement('span');
                    newButtonSpan.textContent = buttonRemove;
                    newButton.appendChild(newButtonSpan);

                    // Attach function to button
                    newButton.dataset.target = encodeURI(key); // Content escaped via function
                    newButton.dataset.failure = messageFailure;
                    newButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        mdlrWatchlistRemove(e.currentTarget);
                    });
                    newButton.addEventListener('keydown', (e) => {
                        if(e.code == 'Enter' || e.code == 'Space') {
                            e.preventDefault();
                            mdlrWatchlistRemove(e.currentTarget);
                        }
                    });

                    // Link
                    let newLink = document.createElement('a');
                    newLink.href = encodeURI(key); // Content escaped via function
                    newLink.classList.add('mdlr-boxedlist-emphasis');
                    newLink.textContent = value[0]; // Content auto-escaped via property
                    newEntry.appendChild(newLink);

                    // Paragraph
                    let newParagraph = document.createElement('p');
                    newParagraph.textContent = value[1]; // Content auto-escaped via property
                    newEntry.appendChild(newParagraph);

                    // Deactivate respective add buttons
                    if(watchlistAdders.length > 0) {
                        watchlistAdders.forEach((watchlistAdder) => {
                            if(watchlistAdder.dataset.target == encodeURI(key)) {
                                watchlistAdder.disabled = true;
                                const watchlistAdderIcon = watchlistAdder.querySelector('svg > use');
                                watchlistAdderIcon.setAttributeNS(null, 'href', '#icon-checkmark');
                            }
                        });
                    }
                }

            // Or only show note if the list is empty
            } else {
                watchlistEmpty.classList.remove('mdlr-variant-hidden');
                if(watchlistSerialisations.length > 0) {
                    watchlistSerialisations.forEach((watchlistSerialisation) => {
                        watchlistSerialisation.classList.add('mdlr-variant-hidden');
                    });
                }
            }
        });
    }
}

// Automatically update watchlist view
mdlrWatchlistView();

// Save watchlist as CSV file
function mdlrWatchlistCsv() {

    // Retrieve watchlist
    const watchlist = mdlrWatchlistGet();

    // Generate CSV
    let csv = '"URL","Label","Type"';
    for(let [key, value] of Object.entries(watchlist)) {
        csv += '\n"' + encodeURI(key) + '","' + value[0].replace('"', '') + '","' + value[1].replace('"', '') + '"';
    }

    // Turn into downloadable blob
    const data = new Blob([csv], {type: 'text/csv'});
    const downloadUrl = window.URL.createObjectURL(data);

    // Download blob
    let download = document.createElement('a');
    download.href = downloadUrl;
    download.download = 'watchlist.csv';
    download.click();
    window.URL.revokeObjectURL(downloadUrl);
}

// Save watchlist as JSON file
function mdlrWatchlistJson() {

    // Retrieve watchlist
    const watchlist = mdlrWatchlistGet();

    // Generate JSON
    json = JSON.stringify(watchlist);

    // Turn into downloadable blob
    const data = new Blob([json], {type: 'application/json'});
    const downloadUrl = window.URL.createObjectURL(data);

    // Download blob
    let download = document.createElement('a');
    download.href = downloadUrl;
    download.download = 'watchlist.json';
    download.click();
    window.URL.revokeObjectURL(downloadUrl);
}
