var path = require('path');
var express = require('express');
var app = express();
var request = require('request');

function randInt(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}


function getUrl() {
    var priceLow = 7000 - randInt(1, 20),
        priceHigh = 12000 + randInt(1, 20);

    return "https://rent.591.com.tw/index.php?" +
        "module=search&" +
        "action=rslist&" +
        "is_new_list=1&" +
        "type=1&" +
        "searchtype=1&" +
        "region=1&" +
        "listview=img&" +
        "section=1,2,3,6&" +
        "rentprice=" + priceLow + "," + priceHigh + "&" +
        "kind=2&" +
        "order=posttime&" +
        "orderType=desc&";
}

function getUrl2() {
    var priceLow = 7000 - randInt(1, 20),
        priceHigh = 12000 + randInt(1, 20);

    return "https://rent.591.com.tw/index.php?" +
        "module=search&" +
        "action=rslist&" +
        "is_new_list=1&" +
        "type=1&" +
        "searchtype=1&" +
        "region=3&" +
        "listview=img&" +
        "section=43&" +
        "rentprice=" + priceLow + "," + priceHigh + "&" +
        "kind=2&" +
        "order=posttime&" +
        "orderType=desc&";
}

function getUrlForGrace() {
    var priceLow = 8000 - randInt(1, 20),
        priceHigh = 12000 + randInt(1, 20);

    return "https://rent.591.com.tw/index.php?" +
        "module=search&" +
        "action=rslist&" +
        "is_new_list=1&" +
        "type=1&" +
        "searchtype=1&" +
        "region=1&" +
        "listview=img&" +
        "section=2,3&" +
        "rentprice=" + priceLow + "," + priceHigh + "&" +
        "kind=2&" +
        "order=posttime&" +
        "orderType=desc&";
}

app.get('/', function(req, res) {
    console.log('Someone is asking for index.html');
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/2', function(req, res) { // workaround for getting new taipei request
    console.log('Someone is asking for index.html');
    res.sendFile(path.join(__dirname + '/index2.html'));
});

app.get('/forGrace', function(req, res) { // workaround for Grace
    console.log('Someone is asking for indexForGrace.html');
    res.sendFile(path.join(__dirname + '/indexForGrace.html'));
});

app.get('/pushBulletHandler.js', function(req, res) {
    console.log('Someone is asking for pushBulletHandler.js');
    res.sendFile(path.join(__dirname + '/pushBulletHandler.js'));
});

app.get('/client.js', function(req, res) {
    console.log('Someone is asking for client.js');
    res.sendFile(path.join(__dirname + '/client.js'));
});

app.get('/client2.js', function(req, res) {
    console.log('Someone is asking for client2.js');
    res.sendFile(path.join(__dirname + '/client2.js'));
});

app.get('/clientForGrace.js', function(req, res) {
    console.log('Someone is asking for clientForGrace.js');
    res.sendFile(path.join(__dirname + '/clientForGrace.js'));
});

app.get('/poll', function(req, res) {
    console.log('Someone is polling');
    request(getUrl(), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
            console.log('Fetch data from 591-rent successfully');
        }
    });
});

app.get('/poll2', function(req, res) {
    console.log('Someone is polling (2)');
    request(getUrl2(), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
            console.log('Fetch data from 591-rent (2) successfully');
        }
    });
});

app.get('/pollForGrace', function(req, res) {
    console.log('Someone is polling (for grace)');
    request(getUrlForGrace(), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
            console.log('Fetch data from 591-rent (for grace) successfully');
        }
    });
});

app.listen(591);