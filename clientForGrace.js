function parseDomHouseTitle(domHouse) {
    return $(domHouse).find(".info .right .title strong").text().trim();
}

function parseDomHousePrice(domHouse) {
    return $(domHouse).find(".price strong").text().trim();
}

function parseDomHouseSize(domHouse) {
    return $(domHouse).find(".area").text().trim();
}

function parseDomHouseAddress(domHouse) {
    return $(domHouse).find(".right p")[1].innerText;
}

function parseDomHouseDesc(domHouse) {
    return $(domHouse).find(".right p")[2].innerText +
        ' ' +
        $(domHouse).find(".right p")[3].innerText;
}

function parseDomHouseLink(domHouse) {
    return 'https://rent.591.com.tw/' +
        $(domHouse).find(".right a")[0].getAttribute('href');
}

function parseDomHousePhotos(domHouse) {
    return 'no photo';
}

function parseDomHouse(domHouse) {
    var jHouse = {};

    jHouse.title = parseDomHouseTitle(domHouse);
    jHouse.price = parseDomHousePrice(domHouse);
    jHouse.size = parseDomHouseSize(domHouse);
    jHouse.address = parseDomHouseAddress(domHouse);
    jHouse.desc = parseDomHouseDesc(domHouse);
    jHouse.link = parseDomHouseLink(domHouse);
    jHouse.photos = parseDomHousePhotos(domHouse);

    return jHouse;
}

function getJsonHousesOnFristPageFromHTML(htmlHousesOnFirstPage) {
    var jHouses = [];
    var domHouses = $.parseHTML(htmlHousesOnFirstPage);

    domHouses.forEach(function(element, index, array) {
        if (index % 2 === 0) { // house element appears only at odd index
            return true; // continue
        }

        jHouses.push(parseDomHouse(element));
    });

    return jHouses;
}

var jHousesToShow = [];
var jHousesToNotify = [];

function selectHousesToNotify(jHousesOnFirstPage) {
    if (jHousesToShow.length === 0) {
        return jHousesOnFirstPage.slice(0, 1); // select the first one
    }

    for (var i = 0; i < jHousesOnFirstPage.length; ++i) {
        if (jHousesOnFirstPage[i].title === jHousesToShow[0].title) {
            return jHousesOnFirstPage.slice(0, i);
        }
    }

    return [];
}

function newerThan(jHousesToShow, jHousesOnFirstPage) {
    if (jHousesToShow.length === 0) {
        return false;
    }

    for (var i = 0; i < jHousesToShow.length; ++i) {
        if (jHousesOnFirstPage[0].title === jHousesToShow[i].title) {
            if (i >= 1) {
                return true;
            }
        }
    }

    return false;
}

function selectHousesToShow(jHousesOnFirstPage) {
    // sometimes the data got is not up-to-date, due to 591's cache mechanism and in this case,
    // our own matined houses to show list is adopted
    if (newerThan(jHousesToShow, jHousesOnFirstPage)) {
        return jHousesToShow;
    }
    return jHousesOnFirstPage.slice(0, 5); // select first five newest houses
}

function showNotifyWindowOneHouse(jHouse) {
    var notification = new Notification(jHouse.title, {
        body: jHouse.price + ' ' +
            jHouse.size + ' ' +
            jHouse.address + ' ' +
            jHouse.desc
    }).onclick = function(event) {
        event.preventDefault();
        window.open(jHouse.link, '_blank');
    };
}

function showNotifyWindow() {
    jHousesToNotify.forEach(function(element, index, array) {
        showNotifyWindowOneHouse(element);
    });
}

function notifyNewHouseDesktop() {
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        showNotifyWindow();
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                showNotifyWindow();
            }
        });
    }
}

function processResponse() {
    if (this.status == 200 && this.response !== null) {
        var jResponse = JSON.parse(this.response);
        var jHousesOnFirstPage = getJsonHousesOnFristPageFromHTML(jResponse.main);

        jHousesToNotify = selectHousesToNotify(jHousesOnFirstPage);
        jHousesToShow = selectHousesToShow(jHousesOnFirstPage);

        console.log(jHousesOnFirstPage);
        console.log(jHousesToShow);

        if (jHousesToNotify.length > 0) {
            // notifyNewHouseDesktop();
            notifyNewHouseMobileForGrace(jHousesToNotify);
        }
    }
}

function updateNewHouse() {
    var httpRequester = new XMLHttpRequest();

    httpRequester.onload = processResponse;
    httpRequester.open('GET',
        "http://localhost:591/pollForGrace",
        true);

    httpRequester.send();
}

updateNewHouse();

var pollingIntervalRangeSecMin = 30;
var pollingIntervalRangeSecMax = 90;

(function loop() {
    var randIntervalSec = Math.floor(
        Math.random() * (pollingIntervalRangeSecMax - pollingIntervalRangeSecMin + 1) + pollingIntervalRangeSecMin
    );
    console.log(randIntervalSec);
    setTimeout(function() {
        updateNewHouse();
        loop();
    }, randIntervalSec * 1000);
}());