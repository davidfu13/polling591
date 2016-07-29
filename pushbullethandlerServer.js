var PushBullet = require('pushbullet');
var PushBulletPusher = new PushBullet('o.5CrvTMg7sLSvkeQ533l1x61tFtgO1xVj');

var getIphoneDeviceIdFrom = function(deviceList) {
    var phoneDeviceId;

    deviceList.forEach(function(element, index, array) {
        if (element.icon === "phone") {
            iphoneDeviceId = element.iden;
            return false;
        }
    });

    return phoneDeviceId;
};

var notifyOneHouseToDev = function(jHouse, deviceId) {
    var title = jHouse.price + ' ' + jHouse.size + ' ' + jHouse.address,
        body = jHouse.title + ' ' +
        jHouse.price + ' ' +
        jHouse.size + ' ' +
        jHouse.address + ' ' +
        jHouse.desc + ' ' +
        jHouse.link;

    PushBulletPusher.note(deviceId, title, body, function(error, response) {

    });
};

module.exports = {
    notify: function(jHousesToNotify) {
        PushBulletPusher.devices(function(error, response) {
            var deviceList = response.devices;
            var phoneDeviceId = getIphoneDeviceIdFrom(deviceList);

            jHousesToNotify.forEach(function(element, index, array) {
                notifyOneHouseToDev(element, phoneDeviceId);
            });
        });
    }
};