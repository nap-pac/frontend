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
function addCard(containerId, cardTitle, cardSubtitle, cardStatus, cardBody, flagged=false) {
    let container = document.getElementById(containerId);
    let cat = containerId.slice(0,1);
    // update device count
    let countEl = document.getElementById("dev-count-" + cat);
    countEl.innerText = parseInt(countEl.innerText) + 1;
    // if flagged, then change to urgent
    if (cat == "f") {
        document.getElementById("acc-heading-f").classList.add("urgent");
    }
    // remove no devices text
    document.getElementById("no-devices-" + cat).classList.add("hidden");
    // random id
    let id = new Date().getTime() + "-" + Math.random().toString(36).substring(2, 8);
    let template = `
    <div id="card-${id}" subtitle="${cardSubtitle}" data-last-seen="${cardBody.lastSeen}" class="ml-4 block w-80 max-w-80 rounded-lg bg-dest-10 border-2 ${flagged ? "border-urgent" : "border-dest-form-border"} relative card-blend-${cardStatus} mb-4 overflow-y-clip">
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
        <div class="flex flex-col bg-dest-20 px-6 py-2 rounded-md bg-opacity-40 h-full">
            <!-- seen section -->
            <div class="flex items-center flex-col flex-start opacity-80">
                <!-- last seen -->
                <p class="text-2xl text-white w-full">Last Seen: <span data-card-time="${cardBody.lastSeen}">${cardBody.lastSeen}</span></p>
                <!-- first seen -->
                <p class="text-2xl text-white w-full">First Seen: <span data-card-time="${cardBody.firstSeen}">${cardBody.firstSeen}</span></p>
                <!-- times seen -->
                <p class="text-2xl text-white w-full">Times Seen: ${cardBody.timesSeen}</p>
            </div>
            <!-- control buttons -->
            <div class="flex items-center py-2">
                <!-- view btn -->
                <button class="border-2 border-dest-warning text-white text-xl font-normal rounded-xl px-8 m-0 hover:bg-dest-warning hover:border-dest-warning hover:text-white focus:outline-none focus:ring-2 focus:ring-dest-warning focus:ring-opacity-75 leading-tight" onclick="viewCard('${cardSubtitle}')">
                    <span class="opacity-80">View</span>
                </button>
                <!-- remove btn -->
                <button class="border-2 border-dest-danger text-white text-xl font-normal rounded-xl px-8 m-0 hover:bg-dest-danger hover:border-dest-danger hover:text-white focus:outline-none focus:ring-2 focus:ring-dest-danger focus:ring-opacity-75 leading-tight ml-3" onclick="toggleFlaggedCard('${id}')">
                    <span class="opacity-80">${flagged ? "Remove" : "Flag"}</span>
                </button>
            </div>
        </div>
    </div>`;
    container.innerHTML += template;
    let timesToUpdate = document.getElementById("card-" + id).querySelectorAll("span[data-card-time]");
    timesToUpdate.forEach((el) => {
        let time = el.getAttribute("data-card-time");
        el.innerHTML = relativeTime(time);
    });
}

function toggleFlaggedCard(id) {
    // get el
    let el = document.getElementById("card-" + id);
    // get subtitle
    let subtitle = el.getAttribute("subtitle");
    // get device
    let device;
    window.devices.find((dev) => {
        if (dev.mac == subtitle) {
            device = dev;
        }
    });
    // check if found
    if (typeof device == "string") {
        // not found
        alert("Device not found!");
        return;
    }
    removeCard(id);
    // check if flagged
    if (device.flagged) {
        removeFromFlagged(device.mac);
        addCard("a-devices-container", device.name, device.mac, "warning", {"lastSeen": device.lastSeen, "firstSeen": device.firstSeen, "timesSeen": device.timesSeen});
        // sort cards in container
        sortCards("a-devices-container");
    } else {
        addToFlagged(device.mac);
        removeFromWhitelist(device.mac);
        addCard("f-devices-container", device.name, device.mac, "danger", {"lastSeen": device.lastSeen, "firstSeen": device.firstSeen, "timesSeen": device.timesSeen}, true);
        // sort cards in container
        sortCards("f-devices-container");
    }
    
    device.flagged = !device.flagged;
}

function removeCard(id) {
    let el = document.getElementById("card-" + id);
    // get parent container
    let parentId = el.parentElement.id;
    let cat = parentId.slice(0,1);
    // update device count
    let countEl = document.getElementById("dev-count-" + cat);
    countEl.innerText = parseInt(countEl.innerText) - 1;
    // if no devices, then show no devices text
    if (countEl.innerText == "0") {
        document.getElementById("no-devices-" + cat).classList.remove("hidden");
        // check if flagged container
        if (cat == "f") {
            document.getElementById("acc-heading-f").classList.remove("urgent");
        }
    }
    // remove card
    el.remove();
}

function sortCards(containerId) {
    // get container
    let container = document.getElementById(containerId);
    // get cards
    let cards = container.children;
    // sort cards
    let sorted = Array.from(cards).sort((a, b) => {
        let aTime = parseInt(a.getAttribute("data-last-seen"))*1000
        let bTime = parseInt(b.getAttribute("data-last-seen"))*1000
        return new Date(bTime) - new Date(aTime);
    });
    // remove all cards
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // add sorted cards
    sorted.forEach((card) => {
        container.appendChild(card);
    });
}

// view card
async function viewCard(id) {
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
    let device;
    window.devices.find((dev) => {
        if (dev.mac == id) {
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

    // set times
    document.getElementById("current-device-last-seen-t").innerText = new Date(device.lastSeen*1000).toLocaleString();
    document.getElementById("current-device-last-seen-r").setAttribute("data-card-time", device.lastSeen);
    document.getElementById("current-device-last-seen-r").innerText = relativeTime(device.lastSeen);

    document.getElementById("current-device-first-seen-t").innerText = new Date(device.firstSeen*1000).toLocaleString();
    document.getElementById("current-device-first-seen-r").setAttribute("data-card-time", device.firstSeen);
    document.getElementById("current-device-first-seen-r").innerText = relativeTime(device.firstSeen);

    document.getElementById("current-device-times-seen").innerText = device.timesSeen;
    

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
    await getLocationForDevice(id).then((locationData) => {
        replaceMarkers();
    });
}

// function for relative time
const relativeTime = (time, now = new Date().getTime()) => {
    // get time difference
    let diff = now - parseInt(time*1000);
    let retStr = "";
    // check if less than 10 seconds
    if (diff < 10000) {
        retStr = "Just now";
    } else if (diff < 60000) {
    // check if less than 1 minute
        retStr = Math.floor(diff / 1000) + "s";
    } else if (diff < 3600000) {
    // check if less than 1 hour
        retStr = Math.floor(diff / 60000) + "m " + Math.floor((diff % 60000) / 1000) + "s";
    } else if (diff < 86400000) {
    // check if less than 1 day
        retStr = Math.floor(diff / 3600000) + "h " + Math.floor((diff % 3600000) / 60000) + "m";
    } else {
        // days
        retStr = Math.floor(diff / 86400000) + "d " + Math.floor((diff % 86400000) / 3600000) + "h";
    }
    return retStr;
}

// register each card to update time
const registerCardTime = () => {
    // get all cards
    let now = new Date().getTime();
    let cards = document.querySelectorAll("[data-card-time]");
    // loop through cards
    cards.forEach((card) => {
        // get time
        let time = card.getAttribute("data-card-time");
        // set time
        card.innerHTML = relativeTime(time, now);
    });
};

// let relativeTimeInterval = setInterval(registerCardTime, 1000);

const getCookie = (name) => {
    let cookie = document.cookie.split("; ").find((row) => row.startsWith(name));
    if (cookie) {
        return cookie.split("=")[1];
    } else {
        return null;
    }
};

// fetch device data from /api/devices
const fetchDevices = async () => {
    // fetch data
    await fetch("/api/devices/")
        .then((res) => res.json())
        .then((data) => {
            // set devices
            // only get first 100
            data = data.data
            // data = data.slice(0, 100);
            window.devices = data;
            console.log("Fetched " + data.length + " devices");
        });
};

// get lists
const getLists = async () => {
    // fetch data
    await fetch("/api/lists/")
        .then((res) => res.json())
        .then((data) => {
            // set devices
            window.lists = data.data;
            console.log("Fetched whitelist and flagged lists");
        });
};

const addToWhitelist = async (mac) => {
    // post
    await fetch("/api/lists/whitelist/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            "mac": mac,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
};

const removeFromWhitelist = async (mac) => {
    // post
    await fetch("/api/lists/whitelist/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            "mac": mac,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
};

const addToFlagged = async (mac) => {
    // post
    await fetch("/api/lists/flagged/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            "mac": mac,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
}

const removeFromFlagged = async (mac) => {
    // post
    await fetch("/api/lists/flagged/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            "mac": mac,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
}

const updateDeviceName = async (mac, name) => {
    // post
    await fetch("/api/device/'" + mac + "'/name/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            "name": name,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
};

const getLocationForDevice = async (mac) => {
    // post
    await fetch("/api/locations/device/'" + mac + "/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Got location for device " + mac + " with " + data.data.length + " data points");
        window.curMapData = data.data;
    });
}

// page ready
document.addEventListener("DOMContentLoaded", async () => {
    // register drag scroll
    await fetchDevices()
    await getLists();
    startTime = window.performance.now();
    for (let ii = 0; ii<window.devices.length; ii++) {
        let device = window.devices[ii];
        let dev = {
            "mac": device[0],
            "name": device[1],
            "firstSeen": device[2],
            "lastSeen": device[3],
            "timesSeen": device[4],
            "flagged": false, // will sort out later
            "whitelist": false, // will sort out later
        }
        // check if in whitelist
        for (let jj = 0; jj<window.lists.whitelist.length; jj++) {
            if (window.lists.whitelist[jj][0] == dev.mac) {
                dev.whitelist = true;
                break;
            }
        }
        // check if flagged
        for (let jj = 0; jj<window.lists.flagged.length; jj++) {
            if (window.lists.flagged[jj][0] == dev.mac) {
                dev.flagged = true;
                break;
            }
        }
        window.devices[ii] = dev;
        if (dev.whitelist) {
            addCard("w-devices-container", dev.name, dev.mac, dev.whitelist ? "success" : dev.flagged ? "danger" : "warning", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen})
        } else if (dev.flagged) {
            addCard("f-devices-container", dev.name, dev.mac, dev.whitelist ? "success" : dev.flagged ? "danger" : "warning", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen}, true)
        } else {
            addCard("a-devices-container", dev.name, dev.mac, dev.whitelist ? "success" : dev.flagged ? "danger" : "warning", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen})
        }
    }
    console.log(window.lists)
    // time taken
    endTime = window.performance.now();
    console.log("Page load took " + (endTime - startTime) + "ms");
});

const setPredefined = () => {
    const knownDevices = [
        ['D0:21:F9:93:D2:FD', 'Ubiquiti Camera'],
        ['50:2F:9B:C4:1B:2A', 'Development Laptop'],
        ['B6:52:58:22:37:C1', 'iPhone X'],
    ];
    knownDevices.forEach((device) => {
        updateDeviceName(device[0], device[1]);
        addToWhitelist(device[0]);
    });
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

// for (let i = 0; i < devData.length; i++) {
//     let dev = devData[i];
//     addCard("w-devices-container", dev.name, dev.mac, "success", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen})

//     addCard("f-devices-container", dev.name, dev.mac, dev.whitelist ? "success" : dev.flagged ? "danger" : "warning", {"lastSeen": dev.lastSeen, "firstSeen": dev.firstSeen, "timesSeen": dev.timesSeen})
// }

// document.getElementById("acc-heading-f").classList.add("urgent");

