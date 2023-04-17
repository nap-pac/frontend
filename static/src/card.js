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
    // random id
    let id = new Date().getTime() + "-" + Math.random().toString(36).substring(2, 8);
    let template = `
    <div id="card-${id}" subtitle="${cardSubtitle}" class="ml-4 block w-80 max-w-80 rounded-lg bg-dest-10 border-2 border-dest-form-border relative card-blend-${cardStatus} mb-4">
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
                <button class="border-2 border-dest-warning text-white text-xl font-normal rounded-xl px-8 m-0 hover:bg-dest-warning hover:border-dest-warning hover:text-white focus:outline-none focus:ring-2 focus:ring-dest-warning focus:ring-opacity-75 leading-tight" onclick="viewCard('${id}')">
                    <span class="opacity-80">View</span>
                </button>
                <!-- remove btn -->
                <button class="border-2 border-dest-danger text-white text-xl font-normal rounded-xl px-8 m-0 hover:bg-dest-danger hover:border-dest-danger hover:text-white focus:outline-none focus:ring-2 focus:ring-dest-danger focus:ring-opacity-75 leading-tight ml-3">
                    <span class="opacity-80">Remove</span>
                </button>
            </div>
        </div>
    </div>`;
    container.innerHTML += template;
}

// view card
function viewCard(id) {
    // create backdrop
    let backdrop = document.createElement("div");
    backdrop.setAttribute("id", "backdrop");
    backdrop.classList.add("bg-gray-900", "bg-opacity-50", "dark:bg-opacity-80", "fixed", "inset-0", "z-30");
    backdrop.addEventListener("click", () => {
        document.getElementById("backdrop").remove();
        document.getElementById("current-device-container").classList.add("hidden");
    });
    document.body.appendChild(backdrop);
    // get device
    let device = document.getElementById(`card-${id}`).getAttribute("subtitle");
    devData.find((dev) => {
        if (dev.mac == device) {
            device = dev;
        }
    });
    // check if found
    if (typeof device == "string") {
        // not found
        document.getElementById("backdrop").remove();
        alert("Device not found!");
        return;
    }
    // set title
    document.getElementById("current-device-title").innerText = device.name; 

    // set status
    let status = document.getElementById("current-device-status");
    status.classList.remove("bg-dest-success", "status-success", "bg-dest-warning", "status-warning", "bg-dest-danger", "status-danger", "bg-dest-info", "status-info");
    let deviceStatus = device.whitelist ? "success" : device.flagged ? "danger" : "warning";
    status.classList.add(`bg-dest-${deviceStatus}`, `status-${deviceStatus}`);

    // update container
    let container = document.getElementById("current-device-container");
    container.classList.remove("hidden");
    // set tags
    let tagContainer = document.getElementById("current-device-tags");
    tagContainer.innerHTML = "";
    // loop through tags
    // none
    if (!device.tags || device.tags.length == 0) {
        tagContainer.innerHTML = '';
    } else {
        device.tags.forEach((tagName) => {
            // find tag
            let tData = tagData.find((tag) => {
                if (tag.name == tagName) {
                    return tag;
                }
            });
            // check if found
            if (typeof tData == "undefined") {
                // not found
                return;
            }
            // create tag
            let tagTemplate = `<div class="flex items-center mr-2 mb-2">
                <div class="border-2 flex items-center justify-center rounded-xl px-1 text-white" style="border-color: ${tData.color}">
                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-white opacity-80" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.3 5.71a.9959.9959 0 0 0-1.41 0L12 10.59 7.11 5.7a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
                    </svg>
                    <span class="opacity-80 px-1 text-lg">${tData.name}</span>
                </div>
            </div>`;
            tagContainer.innerHTML += tagTemplate;
        });
    }
    let addTagTemplate = `<div class="flex items-center mr-2 mb-2">
            <div class="border-2 flex items-center justify-center rounded-xl px-1 text-white">
                <span class="opacity-80 px-1 text-lg">Add Tag</span>
            </div>
        </div>`;
    tagContainer.innerHTML += addTagTemplate;

    // set logs
    let logContainer = document.getElementById("current-device-logs");
    logContainer.innerHTML = "";
    // loop through logs
    if (!device.logs || device.logs.length == 0) {
    // if no logs
        logContainer.innerHTML = `<div class="text-white text-md opacity-60">No logs found</div>`;
    } else {
        device.logs.forEach((log) => {
            // create log
            let logTemplate = `<div class="rounded-lg bg-dest-10 border-2 border-dest-form-border px-2 py-1 text-md font-firacode text-white mb-2 bg-dest-20">
                <span class="opacity-60">${log.time}</span>
                <span class="opacity-80">${log.event}</span>
            </div>`
            logContainer.innerHTML += logTemplate;
        });
    }
    if (!window.loadedMap) {
        loadMap();
        window.loadedMap = true;
    }
}

const tagData = [
    {
        "name": "Apple",
        "color": "#CE7C00",
    },
    {
        "name": "TEST",
        "color": "#003ACE",
    }
]

const devData = [
    {
        "name": "Sean's iPhone",
        "mac": "12:32:AB:B6:78:9E",
        "whitelist": true,
        "flagged": false,
        "lastSeen": "2s",
        "firstSeen": "21m 5s",
        "timesSeen": "17",
        "tags": [
            "Apple",
            "TEST"
        ],
        "logs": [
            {
                "time": "2023-01-01 12:00:00",
                "event": "Device seen"
            },
            {
                "time": "2023-01-01 12:00:02",
                "event": "Device seen"
            },
            {
                "time": "2023-01-01 12:00:04",
                "event": "Device added to whitelist"
            },
            {
                "time": "2023-01-01 12:00:06",
                "event": "Device seen"
            },
        ]
    },
    {
        "name": "Device Name",
        "mac": "00:00:00:00:00:00",
        "whitelist": false,
        "flagged": false,
        "lastSeen": "TIMESTAMP",
        "firstSeen": "TIMESTAMP",
        "timesSeen": "TIMES SEEN",
    },
    {
        "name": "Device Name",
        "mac": "00:00:00:00:00:01",
        "whitelist": false,
        "flagged": true,
        "lastSeen": "TIMESTAMP",
        "firstSeen": "TIMESTAMP",
        "timesSeen": "TIMES SEEN",
    },
    {
        "name": "Device Name",
        "mac": "00:00:00:00:00:02",
        "whitelist": true,
        "flagged": false,
        "lastSeen": "TIMESTAMP",
        "firstSeen": "TIMESTAMP",
        "timesSeen": "TIMES SEEN",
    }
]

for (let i = 0; i < devData.length; i++) {
    let dev = devData[i];
    addCard("w-devices-container", dev.name, dev.mac, "success", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen})

    addCard("f-devices-container", dev.name, dev.mac, dev.whitelist ? "success" : dev.flagged ? "danger" : "warning", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen})
}
