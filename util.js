let Util = {};
let https =  require("https");

Util.hexToHSL = function(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}

Util.makeColourVisible = function(hex) {
    if (hex) {
        let [h, s, l] = Util.hexToHSL(hex);

        let newL = Math.max(l, 100 - l, 85 - (Math.max(100 - s, 20) * 15 / 20));
        return "hsl(" + h + ", " + s + "%, " + newL + "%)";
    }
    
    return "#db188a";
};

Util.hGet = function(url, headers) {
    return new Promise((resolve, reject) => {
        https.get(url, {headers: headers}, (href) => {
            let buffer = Buffer.from([]);

            href.on("data", (data) => {
                buffer = Buffer.concat([buffer, data]);
            });

            href.on("end", () => {
                resolve(buffer.toString());
            });

            href.on("error", (err) => {
                reject(err);
            });
        });
    });
};

Util.hPost = function(url, headers, body) {
    return new Promise((resolve, reject) => {
        let req = https.request(url, {headers: headers, method: "POST"}, (href) => {
            let buffer = Buffer.from([]);

            href.on("data", (data) => {
                buffer = Buffer.concat([buffer, data]);
            });

            href.on("end", () => {
                resolve(buffer.toString());
            });

            href.on("error", (err) => {
                reject(err);
            });
        });
        if (body) { req.write(body); }
        req.end();
    });
};

Util.hPatch = function(url, headers, body) {
    return new Promise((resolve, reject) => {
        let req = https.request(url, {headers: headers, method: "PATCH"}, (href) => {
            let buffer = Buffer.from([]);

            href.on("data", (data) => {
                buffer = Buffer.concat([buffer, data]);
            });

            href.on("end", () => {
                resolve(buffer.toString());
            });

            href.on("error", (err) => {
                reject(err);
            });
        });
        if (body) { req.write(body); }
        req.end();
    });
};

Util.hDelete = function(url, headers, body) {
    return new Promise((resolve, reject) => {
        let req = https.request(url, {headers: headers, method: "DELETE"}, (href) => {
            let buffer = Buffer.from([]);

            href.on("data", (data) => {
                buffer = Buffer.concat([buffer, data]);
            });

            href.on("end", () => {
                resolve(buffer.toString());
            });

            href.on("error", (err) => {
                reject(err);
            });
        });
        if (body) { req.write(body); }
        req.end();
    });
};

module.exports = Util;