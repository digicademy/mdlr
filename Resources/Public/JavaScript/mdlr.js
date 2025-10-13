/*
This file is part of the MDLR atomic web component library.

For the full copyright and license information, please read the
LICENSE.txt file that was distributed with this source code.
*/


/*
## Basics #####################################################################
*/

// General variables
const root = document.documentElement;

// Identify elements
function mdlrElements(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

// Activate buttons
function mdlrActivate(buttons, callback, clickedElementAtt = false) {
    for(const button of buttons) {

        // Click or touch
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if(clickedElementAtt) {
                callback(e.currentTarget);
            } else {
                callback();
            }
        });

        // Keyboard input
        button.addEventListener('keydown', (e) => {
            if(e.code == 'Enter' || e.code == 'Space') {
                e.preventDefault();
                if(clickedElementAtt) {
                    callback(e.currentTarget);
                } else {
                    callback();
                }
            }
        });
    }
}


/*
## Web app ####################################################################
*/

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('mdlr-sw.js')
}


/*
## Storage ####################################################################
*/

// Elements and buttons
const storageButtons = mdlrElements('.mdlr-function-storage');
mdlrActivate(storageButtons, mdlrStorageClear);

// Remove all content of local storage
function mdlrStorageClear() {
    localStorage.clear();
    mdlrStorageEvaluate();
    mdlrWatchlistView();
}

// Evaluate whether there is local storage to delete
function mdlrStorageEvaluate() {
    if(localStorage.length > 0) {
        for(const storageButton of storageButtons) {
            storageButton.disabled = false;
        }
    } else {
        for(const storageButton of storageButtons) {
            storageButton.disabled = true;
        }
    }
}

// Initially evaluate local storage
mdlrStorageEvaluate();


/*
## Theme ######################################################################
*/

// Elements and buttons
const themeButtons = mdlrElements('.mdlr-function-theme');
const themePictures = mdlrElements('picture.mdlr-variant-theme');
mdlrActivate(themeButtons, mdlrThemeSetClick, true);

// Highlight the active switch button
function mdlrThemeSwitch(theme) {
    const themeActiveClass = 'mdlr-variant-active';

    // Activate only the requested switch buttons
    for(const themeButton of themeButtons) {
        if(themeButton.dataset.target == theme) {
            themeButton.classList.add(themeActiveClass);
        } else {
            themeButton.classList.remove(themeActiveClass);
        }
    }
}

// Set requested theme class
function mdlrThemeSet(theme) {

    // Remove any previous theme classes
    const themeClasses = [
        'mdlr-theme-light',
        'mdlr-theme-dark'
    ];
    for(const themeClass of themeClasses) {
        root.classList.remove(themeClass);
    }

    // Add requested class and save user preference
    if(theme) {
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

// Get requested theme name from element
function mdlrThemeSetClick(clickedElement) {
    mdlrThemeSet(clickedElement.dataset.target);
}

// Initially activate theme
mdlrThemeSet(localStorage.getItem('theme'));


/*
## Back, up, and PDF ##########################################################
*/

// Elements and buttons
const backButtons = mdlrElements('.mdlr-function-back');
const upButtons = mdlrElements('.mdlr-function-up');
const pdfButtons = mdlrElements('.mdlr-function-pdf');
mdlrActivate(backButtons, history.back);
mdlrActivate(upButtons, mdlrScrollTop);
mdlrActivate(pdfButtons, window.print);

// Scroll to top
function mdlrScrollTop() {
    window.scrollTo(0, 0);
}


/*
## Fullscreen #################################################################
*/

// Elements and buttons
const fullscreenButtons = mdlrElements('.mdlr-function-fullscreen');
mdlrActivate(fullscreenButtons, mdlrFullscreenToggle, true);

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
## Headerbar ##################################################################
*/

// Elements and buttons
const headerbars = mdlrElements('.mdlr-variant-headerbar');

// Set up observer
const headerbarOptions = {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1
}

// Add or remove class when target element hits or exits viewport
const headerbarCallback = (entries, observer) => {
    for(const entry of entries) {

        // Entering viewport
        if(entry.isIntersecting) {
            for(const headerbar of headerbars) {
                headerbar.classList.remove('mdlr-variant-scrolled');
            }
        }

        // Exiting viewport
        else {
            for(const headerbar of headerbars) {
                headerbar.classList.add('mdlr-variant-scrolled');
            }
        }
    }
}

// Initialise observer
const headerbarObserver = new IntersectionObserver(headerbarCallback, headerbarOptions);
const headerbarTargets = mdlrElements('.mdlr-function-scroll');
for(const headerbarTarget of headerbarTargets) {
    headerbarObserver.observe(headerbarTarget);
}


/*
## Dropdown ###################################################################
*/

// Elements and buttons
const dropdowns = mdlrElements('.mdlr-dropdown');
const dropdownClass = 'mdlr-variant-active';

// Insert positions and transitions
for(const dropdown of dropdowns) {

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
}

// Manipulate dropdown and handle when opened/closed
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

        // Activate handle
        handle.classList.add(dropdownClass);

        // Avoid re-positioning the popover
        document.addEventListener('scroll', (e) => {
            dropdown.hidePopover();
        }, {
            once: true,
        });

    // Reset handle
    } else {
        handle.classList.remove(dropdownClass);
    }
}


/*
## Select #####################################################################
*/

// Elements and buttons
const selectForms = mdlrElements('.mdlr-function-select-form');
mdlrActivate(selectForms, mdlrSelectForm, true);

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
    for(const popoverItem of popoverItems) {
        popoverItem.ariaSelected = 'false';
    }
    for(const popoverItemIcon of popoverItemIcons) {
        popoverItemIcon.setAttributeNS(null, 'href', '#icon-blank');
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
## Modal ######################################################################
*/

// Elements and buttons
const modals = mdlrElements('.mdlr-modal');
const modalOpeners = mdlrElements('.mdlr-function-modal');
const modalClosers = mdlrElements('.mdlr-function-modal-close');
mdlrActivate(modalOpeners, mdlrModalOpen, true);
mdlrActivate(modalClosers, mdlrModalClose);

// Open a specific modal
function mdlrModalOpen(clickedElement) {

    // Retrieve modal to open and identify the opener
    const modalId = clickedElement.getAttribute('aria-controls');
    const modal = document.getElementById(modalId);
    const focusId = clickedElement.dataset.focus;
    const focusElement = document.getElementById(focusId);

    // Show dialog
    modal.showModal();

    // Focus specific element if supplied
    // Timeout required to avoid issues with changing display property
    if(focusElement) {
        setTimeout(() => {
            focusElement.focus();
        }, 300);
    }
}

// Close all modals
function mdlrModalClose() {
    for(const modal of modals) {
        modal.close();
    }
}


/*
## Toast ######################################################################
*/

// Elements and buttons
const toasts = mdlrElements('.mdlr-toast');
const toastClosers = mdlrElements('.mdlr-function-toast-close');
mdlrActivate(toastClosers, mdlrToastClose);

// Open toast notification
function mdlrToastOpen(toastText) {

    // Add notification text
    for(const toast of toasts) {
        const notifications = toast.getElementsByTagName('p');
        for(const notification of notifications) {
            notification.textContent = toastText;
        }

        // Show popover
        toast.showPopover();
    }

    // Auto-remove notification after three seconds
    // Timeout required but may accidentally close successive notification as well
    setTimeout(() => {
        mdlrToastClose();
    }, 3000);
}

// Close toast notification
function mdlrToastClose() {

    // Hide popover
    for(const toast of toasts) {
        toast.hidePopover();

        // Clear notification text
        const notifications = toast.getElementsByTagName('p');
        for(const notification of notifications) {
            notification.textContent = '';
        }
    }
}


/*
## Copy #######################################################################
*/

// Elements and buttons
const copyButtons = mdlrElements('.mdlr-function-copy');
mdlrActivate(copyButtons, mdlrCopy, true);

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
## Share ######################################################################
*/

// Elements and buttons
const shareButtons = mdlrElements('.mdlr-function-share');
mdlrActivate(shareButtons, mdlrShare, true);

// Enable share buttons only when the browser feature is available
if(navigator.canShare && navigator.canShare({
    title: 'Sample headline',
    text: 'Sample text',
    url: 'https://www.adwmainz.de/'
    })) {
    for(const shareButton of shareButtons) {
        if(shareButton.parentElement.hidden == true) {
            shareButton.parentElement.hidden = false;
        }
        else {
            shareButton.hidden = false;
        }
    }
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
## Mastodon ###################################################################
*/

// Elements and buttons
const mastodonButtons = mdlrElements('.mdlr-function-mastodon');
mdlrActivate(mastodonButtons, mdlrMastodon, true);

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
## Watchlist ##################################################################
*/

const watchlistAdders = mdlrElements('.mdlr-function-watchlist-add');
const watchlistCsvs = mdlrElements('.mdlr-function-watchlist-csv');
const watchlistJsons = mdlrElements('.mdlr-function-watchlist-json');
const watchlistClearers = mdlrElements('.mdlr-function-watchlist-clear');
const watchlistEmpties = mdlrElements('.mdlr-function-watchlist-empty');
const watchlistSerialisations = mdlrElements('.mdlr-function-watchlist-serialisations');
mdlrActivate(watchlistAdders, mdlrWatchlistAdd, true);
mdlrActivate(watchlistCsvs, mdlrWatchlistCsv);
mdlrActivate(watchlistJsons, mdlrWatchlistJson);
mdlrActivate(watchlistClearers, mdlrWatchlistSet);

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
    for(const watchlistAdder of watchlistAdders) {
        watchlistAdder.disabled = false;
        const watchlistAdderIcon = watchlistAdder.querySelector('svg > use');
        watchlistAdderIcon.setAttributeNS(null, 'href', '#icon-add');
    }

    // Remove existing list from DOM
    const watchlistLists = mdlrElements('.mdlr-function-watchlist-list');
    for(const watchlistList of watchlistLists) {
        watchlistList.remove();
    }

    // Retrieve watchlist
    const watchlist = mdlrWatchlistGet();
    for(const watchlistEmpty of watchlistEmpties) {
        const buttonRemove = watchlistEmpty.dataset.remove;
        const messageFailure = watchlistEmpty.dataset.failure;

        // Either hide empty note if the list has items
        if(Object.keys(watchlist).length > 0) {
            watchlistEmpty.classList.add('mdlr-variant-hidden');

            // Show serialisations
            for(const watchlistSerialisation of watchlistSerialisations) {
                watchlistSerialisation.classList.remove('mdlr-variant-hidden');
            }

            // Build list
            let newList = document.createElement('ul');
            newList.classList.add('mdlr-boxedlist', 'mdlr-variant-compact', 'mdlr-function-watchlist-list');
            watchlistEmpty.after(newList);

            // Build list items
            for(const [key, value] of Object.entries(watchlist)) {
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
                mdlrActivate([newButton], mdlrWatchlistRemove, true);

                // Link
                let newLink = document.createElement('a');
                newLink.href = encodeURI(key); // Content escaped via function
                newEntry.appendChild(newLink);

                // Link > strong
                let newLinkStrong = document.createElement('strong');
                newLinkStrong.textContent = value[0]; // Content auto-escaped via property
                newLink.appendChild(newLinkStrong);

                // Span
                let newSpan = document.createElement('span');
                newSpan.textContent = value[1]; // Content auto-escaped via property
                newEntry.appendChild(newSpan);

                // Deactivate respective add buttons
                for(const watchlistAdder of watchlistAdders) {
                    if(watchlistAdder.dataset.target == encodeURI(key)) {
                        watchlistAdder.disabled = true;
                        const watchlistAdderIcon = watchlistAdder.querySelector('svg > use');
                        watchlistAdderIcon.setAttributeNS(null, 'href', '#icon-checkmark');
                    }
                }
            }

        // Or only show note if the list is empty
        } else {
            watchlistEmpty.classList.remove('mdlr-variant-hidden');
            for(const watchlistSerialisation of watchlistSerialisations) {
                watchlistSerialisation.classList.add('mdlr-variant-hidden');
            }
        }
    }
}

// Initially update watchlist view
mdlrWatchlistView();

// Save watchlist as CSV file
function mdlrWatchlistCsv() {

    // Retrieve watchlist
    const watchlist = mdlrWatchlistGet();

    // Generate CSV
    let csv = '"URL","Label","Type"';
    for(const [key, value] of Object.entries(watchlist)) {
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

















/*
## Hierarchy ##################################################################
*/

/*// Elements and buttons
const hierarchies = mdlrElements('.mdlr-function-hierarchy');
mdlrActivate(hierarchies, mdlrHierarchy, true);

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
*/




/*// Show a functioning install button if the app is not installed yet
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
## Timeline ###################################################################
*/

/*// Elements and buttons
const timelineRegions = mdlrElements('.mdlr-function-timeline');

// Activate all copy buttons
for(const timelineRegion of timelineRegions) {
    timelineRegion.addEventListener('mouseover', (e) => {
        e.preventDefault();
        mdlrTimelineHighlight(e.currentTarget);
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
}*/


/*
## Info button ################################################################
*/

/*// Elements and buttons
const infoButtons = mdlrElements('.mdlr-function-info');
const infoPopovers = mdlrElements('.mdlr-info > ol > li');
mdlrActivate(infoButtons, mdlrInfoOpen, true);

// Show info popover on demand
function mdlrInfoOpen(clickedElement) {

    // Identify the popover to open
    let targetId = clickedElement.href;
    targetId = targetId.substring(targetId.indexOf('#') );
    let targets = mdlrElements(targetId);

    // Close popover if it is already open
    for(const target of targets) {
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
            setTimeout(() => { // TODO Remove when converting to popover
                document.addEventListener('click', mdlrInfoCloseConditions);
                window.addEventListener('resize', mdlrInfoCloseConditions);
                document.addEventListener('touchstart', mdlrInfoCloseConditions);
                document.addEventListener('keydown', mdlrInfoCloseConditions);
            }, 50);
        }
    }
}

// Close info popover on demand
function mdlrInfoClose() {

    // Close popovers
    for(const infoPopover of infoPopovers) {
        infoPopover.classList.remove('mdlr-variant-active');
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
}*/


/*
## Reference link #############################################################
*/

/*// Elements and buttons
const referenceLinks = mdlrElements('.mdlr-function-reference');
mdlrActivate(referenceLinks, mdlrReferenceOpen, true);

// Show reference popover on demand
function mdlrReferenceOpen(clickedElement) {

    // Identify the reference to show
    let targetId = clickedElement.href;
    targetId = targetId.substring(targetId.indexOf('#') );
    let targets = mdlrElements(targetId);

    // Close popover if it is already open
    for(const target of targets) {
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
            setTimeout(() => { // TODO Remove when converting to popover
                document.addEventListener('click', mdlrReferenceCloseConditions);
                window.addEventListener('resize', mdlrReferenceCloseConditions);
                document.addEventListener('touchstart', mdlrReferenceCloseConditions);
                document.addEventListener('keydown', mdlrReferenceCloseConditions);
            }, 50);
        }
    }
}

// Close reference popover on demand
function mdlrReferenceClose() {

    // Close popovers
    let referencePopover = document.getElementById('temporary-reference');
    referencePopover.classList.remove('mdlr-variant-active');
    setTimeout(() => { // TODO Remove when converting to popover
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
}*/
