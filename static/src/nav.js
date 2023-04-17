/**
 * @fileoverview Scripts for the navigation bar.
 * @file frontend\static\src\nav.js
 * @version 1.0.0
 */

/**
 * @function addNavPill
 * @description Adds a pill to a link in the navigation bar.
 * @param {string} linkId The ID of the link to add the pill to.
 * @param {string} pillText The text to display in the pill.
 * @param {string} pillType The type of pill to display. Can be one of the following: 'danger', 'warning', 'info', 'success'.
 */
function addNavPill(linkId, pillText, pillType) {
    let link = document.getElementById(linkId);
    // Check if the link of that type already exists
    if (link.querySelector(`.bg-dest-${pillType}`)) {
        // edit the html
        link.querySelector(`.bg-dest-${pillType}`).innerHTML = pillText;
    } else {
        let template = `<span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-1 text-sm font-medium rounded-lg bg-dest-${pillType} text-white">${pillText}</span>`;
        link.innerHTML += template;
    }
}

/**
 * @function removeNavPill
 * @description Removes a pill from a link in the navigation bar.
 * @param {string} linkId The ID of the link to remove the pill from.
 * @param {string} pillType The type of pill to remove. Can be one of the following: 'danger', 'warning', 'info', 'success'.
 */
function removeNavPill(linkId, pillType) {
    let link = document.getElementById(linkId);
    let pill = link.querySelector(`.bg-dest-${pillType}`);
    if (pill) pill.remove();
}

/**
 * @function updateNavPills
 * @description Updates the pills in a given link in the navigation bar.
 * @param {string} linkId The ID of the link to update the pills in.
 * @param {Object} pills An object of pills to add. The key is the type of pill, and the value is the text to display.
 * @example
 * // Input:
 * // "nav-alerts", { 'danger': '1', 'warning': '2' }
 */
function updateNavPills(linkId, pills) {
    let link = document.getElementById(linkId);
    const validPillTypes = ['danger', 'warning', 'info', 'success'];
    for (let pillType of validPillTypes) {
        if (pills[pillType]) {
            addNavPill(linkId, pills[pillType], pillType);
        } else {
            removeNavPill(linkId, pillType);
        }
    }
}

// onclick events
document.getElementById("drawer-navigation-btn").onclick = function() {
    document.getElementById("main-content").classList.remove("translate-x-64")
}
document.getElementById("drawer-trigger-btn").onclick = function() {
    document.getElementById("main-content").classList.add("translate-x-64")
}

// onload check for mobile view
document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth < 576) {
        document.getElementById("drawer-navigation").classList.add("-translate-x-64")
    } else {
        // hide close menu option
        document.getElementById("drawer-navigation-btn").classList.add("hidden")
        // add constant margin 64 
        document.getElementById("main-content").classList.add("ml-64")
    }
})

// onclick, check if div with attribute drawer-backdrop is clicked
document.addEventListener("click", function(e) {
    if (e.target.hasAttribute("drawer-backdrop")) {
        document.getElementById("main-content").classList.remove("translate-x-64")
    }
})

updateNavPills("nav-alerts", { 'danger': '3', 'warning': '18' })
updateNavPills("nav-logs", { 'danger': '1' })
