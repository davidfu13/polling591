function getMobileDevId() {
    var deviceList = PushBullet.devices().devices;
    var mobileDevId;

    deviceList.forEach(function(element, index, array) {
        if (element.icon === "phone") {
            mobileDevId = element.iden;
            return false;
        }
    });

    return mobileDevId;
}

function notifyNewHouseMobileOneHouse(jHouse) {
    PushBullet.push('link', getMobileDevId(), null, {
        title: jHouse.price + ' ' + jHouse.size + ' ' + jHouse.address,
        url: jHouse.link,
        body: jHouse.title + ' ' +
            jHouse.price + ' ' +
            jHouse.size + ' ' +
            jHouse.address + ' ' +
            jHouse.desc
    });
}

function notifyNewHouseMobile(jHousesToNotify) {
    PushBullet.APIKey = "o.5CrvTMg7sLSvkeQ533l1x61tFtgO1xVj";

    jHousesToNotify.forEach(function(element, index, array) {
        notifyNewHouseMobileOneHouse(element);
    });
}

function notifyNewHouseMobileForGrace(jHousesToNotify) {
    PushBullet.APIKey = "o.XmdR8wGFrQrcI10f1CrU7tjgJ5IqzsHp";

    jHousesToNotify.forEach(function(element, index, array) {
        notifyNewHouseMobileOneHouse(element);
    });
}