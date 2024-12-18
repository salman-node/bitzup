"use strict";
exports.__esModule = true;
exports.GenerateUniqueID = void 0;
var GenerateUniqueID = function (count, string, prefix) {
    var str = "";
    for (var i = 0; i < count; i++) {
        if (string[i] != "-") {
            str += string[i];
        }
    }
    return (prefix + str).toUpperCase();
};
exports.GenerateUniqueID = GenerateUniqueID;
// module.exports.GenerateID = GenerateUniqueID/
//# sourceMappingURL=generator.js.map