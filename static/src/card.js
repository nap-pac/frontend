/**
 * @fileoverview Scripts for the card component.
 * @file frontend\static\src\card.js
 * @version 1.0.0
 */


/**
 * @function addCard
 * @description Adds a card to a specified container.
 * @param {string} containerId The ID of the container to add the card to.
 * @param {string} cardTitle The title of the card.
 * @param {string} cardSubtitle The subtitle of the card.
 * @param {string} cardStatus The status of the card. Can be one of the following: 'danger', 'warning', 'info', 'success'.
 * @param {Object} cardBody The body of the card.
 * @param {string} cardBody.lastSeen The last time text
 * @param {string} cardBody.firstSeen The first seen text
 * @param {string} cardBody.timesSeen The times seen text
 * @example addCard("w-devices-container", "Device Name", "00:00:00:00:00:00", "success", {"lastSeen": "TIMESTAMP", "firstSeen": "TIMESTAMP", "timesSeen": "TIMES SEEN"})
 * @example addCard("w-devices-container", "Sean's iPhone", "12:32:AB:B6:78:9E", "success", {"lastSeen": "2s", "firstSeen": "21m 5s", "timesSeen": "17"})
 */
function addCard(containerId, cardTitle, cardSubtitle, cardStatus, cardBody) {
    let container = document.getElementById(containerId);
    let template = `
    <a href="#" class="ml-4 block w-80 max-w-80 rounded-lg bg-dest-10 border-2 border-dest-form-border relative card-blend-${cardStatus} mb-4">
        <!-- top section of card -->
        <div class="flex flex-col flex-start flex-wrap content-start p-4 pb-2">
            <!-- top row -->
            <div class="flex items-center">
                <!-- status indicator circle with drop shadow -->
                <div class="w-3 h-3 rounded-full bg-dest-${cardStatus} mr-2 status-${cardStatus} ml-2"></div>
                <!-- status text -->
                <p class="text-2xl font-semibold text-white ml-1">${cardTitle}</p>
            </div>
            <div class="flex items-center">
                <!-- status text -->
                <p class="text-md text-white ml-2 opacity-60 font-firacode">${cardSubtitle}</p>
            </div>
        </div>
        <!-- bottom section of card -->
        <div class="flex flex-col bg-dest-20 px-6 py-2 rounded-md bg-opacity-40">
            <!-- seen section -->
            <div class="flex items-center flex-col flex-start opacity-80">
                <!-- last seen -->
                <p class="text-2xl text-white w-full">Last Seen: ${cardBody.lastSeen}</p>
                <!-- first seen -->
                <p class="text-2xl text-white w-full">First Seen: ${cardBody.firstSeen}</p>
                <!-- times seen -->
                <p class="text-2xl text-white w-full">Times Seen: ${cardBody.timesSeen}</p>
            </div>
            <!-- control buttons -->
            <div class="flex items-center py-2">
                <!-- view btn -->
                <button class="border-2 border-dest-warning text-white text-xl font-normal rounded-xl px-8 m-0 hover:bg-dest-warning hover:border-dest-warning hover:text-white focus:outline-none focus:ring-2 focus:ring-dest-warning focus:ring-opacity-75 leading-tight">
                    <span class="opacity-80">View</span>
                </button>
                <!-- remove btn -->
                <button class="border-2 border-dest-danger text-white text-xl font-normal rounded-xl px-8 m-0 hover:bg-dest-danger hover:border-dest-danger hover:text-white focus:outline-none focus:ring-2 focus:ring-dest-danger focus:ring-opacity-75 leading-tight ml-3">
                    <span class="opacity-80">Remove</span>
                </button>
            </div>
        </div>
    </a>`;
    container.innerHTML += template;
}

addCard("w-devices-container", "Device Name", "00:00:00:00:00:00", "success", {"lastSeen": "TIMESTAMP", "firstSeen": "TIMESTAMP", "timesSeen": "TIMES SEEN"})
addCard("w-devices-container", "Device Name", "00:00:00:00:00:00", "warning", {"lastSeen": "TIMESTAMP", "firstSeen": "TIMESTAMP", "timesSeen": "TIMES SEEN"})
addCard("w-devices-container", "Device Name", "00:00:00:00:00:00", "danger", {"lastSeen": "TIMESTAMP", "firstSeen": "TIMESTAMP", "timesSeen": "TIMES SEEN"})