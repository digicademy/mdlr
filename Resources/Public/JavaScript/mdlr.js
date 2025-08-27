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
    setTimeout( function () {
        installButton.classList.add( 'mdlr-variant-visible' );
    }, 50 );
  
    // When the button is clicked, show the install prompt
    document.getElementById( 'install-button' ).addEventListener( 'click', ( e ) => {
        deferredPrompt.prompt();
    } );
    document.getElementById( 'install-button' ).addEventListener( 'keydown', function( e ) {
        if( e.code == 'Enter' || e.code == 'Space' ) {
            deferredPrompt.prompt();
            e.preventDefault();
        }
    });

    // Wait for the user response and show a notification
    deferredPrompt.userChoice.then( ( choice ) => {

        // Case 1: user installs app
        if ( choice.outcome === 'accepted' ) {
            mdlr_toast_open( 'notification', 'Erfolgreich installiert' );

        // Case 2: user does not install app
        } else {
            mdlr_toast_open( 'notification', 'App leider nicht installiert' );
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
    timelineRegions.forEach(function(timelineRegion) {
        timelineRegion.addEventListener('mouseover', function(e) {
            mdlrTimelineHighlight(e.currentTarget);
            //e.preventDefault();
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
        hoveredElement.addEventListener('mouseout', function(e) {
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
    infoButtons.forEach(function(infoButton) {
        infoButton.addEventListener('click', function(e) {
            mdlrInfoOpen(e.currentTarget);
            //e.preventDefault();
        });
        infoButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrInfoOpen(e.currentTarget);
                e.preventDefault();
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
    targets.forEach(function(target) {
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
            setTimeout(function() {
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
        infoPopovers.forEach(function(infoPopover) {
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
            mdlrInfoClose();
            e.preventDefault();
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
    referenceLinks.forEach(function(referenceLink) {
        referenceLink.addEventListener('click', function(e) {
            mdlrReferenceOpen(e.currentTarget);
            //e.preventDefault();
        });
        referenceLink.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrReferenceOpen(e.currentTarget);
                e.preventDefault();
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
    targets.forEach(function(target) {
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
            setTimeout(function() {
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
    setTimeout(function() {
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
            mdlrReferenceClose();
            e.preventDefault();
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
    storageButtons.forEach(function(storageButton) {
        storageButton.addEventListener('click', function(e) {
            mdlrStorageClear();
            //e.preventDefault();
        });
        storageButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrStorageClear();
                e.preventDefault();
            }
        });
    });
}

// Remove all content of local storage
function mdlrStorageClear() {
    localStorage.clear();
    mdlrStorageEvaluate();
}

// Evaluate whether there is local storage to delete
function mdlrStorageEvaluate() {
    if(localStorage.length > 0) {
        if(storageButtons.length > 0) {
            storageButtons.forEach(function(storageButton) {
                storageButton.disabled = false;
            });
        }
    } else {
        if(storageButtons.length > 0) {
            storageButtons.forEach(function(storageButton) {
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
    themeButtons.forEach(function(themeButton) {
        themeButton.addEventListener('click', function(e) {
            mdlrThemeSet(e.currentTarget.dataset.target);
            //e.preventDefault();
        });
        themeButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrThemeSet(e.currentTarget.dataset.target);
                e.preventDefault();
            }
        });
    });
}

// Highlight the active switch button
function mdlrThemeSwitch(theme) {
    const themeActiveClass = 'mdlr-variant-active';

    // Activate only the requested switch buttons
    themeButtons.forEach(function(themeButton) {
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
    themeClasses.forEach(function(themeClass) {
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
    backButtons.forEach(function(backButton) {
        backButton.addEventListener('click', function(e) {
            history.back();
            //e.preventDefault();
        });
        backButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                history.back();
                e.preventDefault();
            }
        });
    });
}

// Activate up buttons
if(upButtons.length > 0) {
    upButtons.forEach(function(upButton) {
        upButton.addEventListener('click', function(e) {
            window.scrollTo(0, 0);
            //e.preventDefault();
        });
        upButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                window.scrollTo(0, 0);
                e.preventDefault();
            }
        });
    });
}

// Activate PDF buttons
if(pdfButtons.length > 0) {
    pdfButtons.forEach(function(pdfButton) {
        pdfButton.addEventListener('click', function(e) {
            window.print();
            //e.preventDefault();
        });
        pdfButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                window.print();
                e.preventDefault();
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
    fullscreenButtons.forEach(function(fullscreenButton) {
        fullscreenButton.addEventListener('click', function(e) {
            mdlrFullscreenToggle(e.currentTarget);
            //e.preventDefault();
        });
        fullscreenButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrFullscreenToggle(e.currentTarget);
                e.preventDefault();
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
    entries.forEach(function(entry) {

        // Entering viewport
        if(entry.isIntersecting) {
            headerbars.forEach(function(headerbar) {
                headerbar.classList.remove('mdlr-variant-scrolled');
            });
        }

        // Exiting viewport
        else {
            headerbars.forEach(function(headerbar) {
                headerbar.classList.add('mdlr-variant-scrolled');
            });
        }
    });
}

// Initialise observer
const headerbarObserver = new IntersectionObserver(headerbarCallback, headerbarOptions);
const headerbarTargets = mdlrElements('.mdlr-function-scroll');
headerbarTargets.forEach(function(headerbarTarget) {
    headerbarObserver.observe(headerbarTarget);
});

/*
# Dropdown ####################################################################
*/

// Variable
const dropdowns = mdlrElements('.mdlr-function-dropdown');
const dropdownClass = 'mdlr-variant-active';
var dropdownTransition = 200;

// Calculate CSS transition duration
if(dropdowns.length > 0) {
    dropdownTransition = (parseFloat(window.getComputedStyle(dropdowns[0]).transitionDuration)) * 1000;
}

// Activate all dropdown handles
if(dropdowns.length > 0) {
    dropdowns.forEach(function(dropdown) {

        // On click
        dropdown.addEventListener('click', function(e) {
            mdlrDropdown(e.currentTarget);
            //e.preventDefault();
        });

        // On enter or space keypresses
        dropdown.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrDropdown(e.currentTarget);
                e.preventDefault();
            }
        });
    });
}

// Toggle a clicked dropdown handle and element
function mdlrDropdown(dropdown) {
    if(dropdown) {

        // If dropdown is open, close it
        if(dropdown.classList.contains(dropdownClass) ) {
            mdlrDropdownClose();
        }

        // If dropdown is closed, open it
        else {
            mdlrDropdownClose();
            setTimeout(function() {

                // Identify content element
                const element = document.getElementById(dropdown.getAttribute('aria-controls'));

                // Open dropdown
                mdlrDropdownOpen(dropdown, element)

                // Set one-time listeners for closing the dropdown (click, swipe, keypress)
                setTimeout(function() {
                    document.addEventListener('click', mdlrDropdownCloseConditions);
                    window.addEventListener('touchstart', mdlrDropdownCloseConditions);
                    window.addEventListener('keydown', mdlrDropdownCloseConditions);
                }, dropdownTransition);
            }, dropdownTransition);
        }
    }
}

// Open specific dropdown
function mdlrDropdownOpen(dropdown, element) {
    dropdown.setAttribute('aria-expanded', 'true');
    dropdown.classList.add(dropdownClass);
    element.classList.add(dropdownClass);
}

// Close all dropdowns
function mdlrDropdownClose() {
    dropdowns.forEach(function(dropdown) {

        // Identify content element
        const element = document.getElementById(dropdown.getAttribute('aria-controls'));

        // Close dropdown handle and content
        dropdown.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove(dropdownClass);
        element.classList.remove(dropdownClass);

        // Remove unnecessary listeners for closing the dropdown (click, swipe, keypress)
        document.removeEventListener('click', mdlrDropdownCloseConditions);
        window.removeEventListener('touchstart', mdlrDropdownCloseConditions);
        window.removeEventListener('keydown', mdlrDropdownCloseConditions);
    });
}

// Close conditions for listeners
function mdlrDropdownCloseConditions(e) {

    // Check for 'escape' keypress
    if(e.code) {
        if(e.code == 'Escape') {
            mdlrDropdownClose();
            e.preventDefault();
        }
    }

    // Check if click/swipe is outside focus element
    else {
        if(! e.target.closest('.mdlr-dropdown')) {
            mdlrDropdownClose();
            //e.preventDefault();
        }
    }
}

/*
# Hierarchy ###################################################################
*/

// Variable
const hierarchies = mdlrElements('.mdlr-function-hierarchy');

// Activate all toggles
if(hierarchies.length > 0) {
    hierarchies.forEach(function(hierarchy) {
        hierarchy.addEventListener('click', function(e) {
            mdlrHierarchy(e.currentTarget);
            //e.preventDefault();
        });
        hierarchy.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrHierarchy(e.currentTarget);
                e.preventDefault();
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
    modalOpeners.forEach(function(modalOpener) {
        modalOpener.addEventListener('click', function(e) {
            mdlrModalOpen(e.currentTarget);
            //e.preventDefault();
        });
        modalOpener.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrModalOpen(e.currentTarget);
                e.preventDefault();
            }
        });
    });
}

// Activate close buttons in modals
if(modalClosers.length > 0) {
    modalClosers.forEach(function(modalCloser) {
        modalCloser.addEventListener('click', function(e) {
            mdlrModalClose();
            //e.preventDefault();
        });
        modalCloser.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrModalClose();
                e.preventDefault();
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
    setTimeout(function() {
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
    modals.forEach(function(modal) {
        modal.classList.remove('mdlr-variant-active');

        // Close modal after transition
        setTimeout(function() {
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
            mdlrModalClose();
            e.preventDefault();
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
            mdlrModalClose();
            //e.preventDefault();
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
    toastClosers.forEach(function(toastCloser) {
        toastCloser.addEventListener('click', function(e) {
            mdlrToastClose();
            //e.preventDefault();
        });
        toastCloser.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrToastClose();
                e.preventDefault();
            }
        });
    });
}

// Open toast notification
function mdlrToastOpen(toastText) {

    // Close open notification and add delay to accomodate the transition
    // Delay also makes actions appear like they took time to compute
    mdlrToastClose()
    setTimeout(function() {

        // Add notification text
        toasts.forEach(function(toast) {
            const notifications = toast.getElementsByTagName('p');
            for(const notification of notifications) {
                notification.textContent = toastText;
            }

            // Show dialog
            toast.showModal();
            toast.setAttribute('aria-hidden', 'false');
            toast.classList.add('mdlr-variant-active');

        });

        // Remove notification after three seconds and transition bonus
        setTimeout(function() {
            mdlrToastClose();
        }, toastTransition + 3050);

    }, toastTransition + 50);
}

// Close toast notification
function mdlrToastClose() {

    // Remove active notifications
    toasts.forEach(function(toast) {
        toast.classList.remove('mdlr-variant-active');
        toast.setAttribute('aria-hidden', 'true');

        // Clear dialog element and notification text
        setTimeout(function() {
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
    copyButtons.forEach(function(copyButton) {
        copyButton.addEventListener('click', function(e) {
            mdlrCopy(e.currentTarget);
            //e.preventDefault();
        });
        copyButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrCopy(e.currentTarget);
                e.preventDefault();
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
                .then(function() {
                    mdlrToastOpen(successMessage);

                // Failure notification
                }, function() {
                    mdlrToastOpen(failureMessage);
                });

            // Error notification, especially in non-HTTPS contexts
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
    shareButtons.forEach(function(shareButton) {
        shareButton.addEventListener('click', function(e) {
            mdlrShare(e.currentTarget);
            //e.preventDefault();
        });
        shareButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrShare(e.currentTarget);
                e.preventDefault();
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
    shareButtons.forEach(function(shareButton) {
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
    mastodonButtons.forEach(function(mastodonButton) {
        mastodonButton.addEventListener('click', function(e) {
            mdlrMastodon(e.currentTarget);
            //e.preventDefault();
        });
        mastodonButton.addEventListener('keydown', function(e) {
            if(e.code == 'Enter' || e.code == 'Space') {
                mdlrMastodon(e.currentTarget);
                e.preventDefault();
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
