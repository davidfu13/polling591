var request = require('request');
var path = require('path');
var express = require('express');
var app = express();
var jsonFileHandler = require('jsonfile');
var pushBulletHandler = require('./pushBulletHandler');
var $;
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});

function randInt(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}


function getUrl() {
    var priceLow = 6 - randInt(0, 5),
        priceHigh = 100000 + randInt(0, 5);

    return "https://rent.591.com.tw/index.php?" +
        "module=search&" +
        "action=rslist&" +
        "is_new_list=1&" +
        "type=1&" +
        "searchtype=1&" +
        "region=1&" +
        "listview=img&" +
        "section=3,5,7,8,10&" +
        "rentprice=" + priceLow + "," + priceHigh + "&" +
        "kind=0&" +
        "order=posttime&" +
        "orderType=desc&";
}


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
    return $(domHouse).find(".right p")[1];
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

function selectHousesToShow(jHousesOnFirstPage) {
    return jHousesOnFirstPage.slice(0, 5); // select first five newest houses
}

function request591() {

    request(getUrl(), function(error, response, body) {
        if (!error && response.statusCode == 200 && body !== null) {
            console.log('Fetch data from 591 successfully');

            var jResponse = JSON.parse(body);
            var jHousesOnFirstPage = getJsonHousesOnFristPageFromHTML(jResponse.main);

            jHousesToNotify = selectHousesToNotify(jHousesOnFirstPage);
            jHousesToShow = selectHousesToShow(jHousesOnFirstPage);

            console.log(jHousesOnFirstPage.slice(0, 3));
            console.log('==========Houses to Notify==========');
            console.log(jHousesToNotify);

            if (jHousesToNotify.length > 0) {
                // pushBulletHandler.notify(jHousesToNotify);
            }

        } else {
            console.log('error code == ' + response.statusCode);
        }
    });
}

request591();
setInterval(request591, 30000);