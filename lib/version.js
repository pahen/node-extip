var package = JSON.parse(require("fs").readFileSync(__dirname + "/../package.json"));
exports.version = package.version;