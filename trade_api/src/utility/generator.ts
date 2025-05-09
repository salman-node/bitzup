export const GenerateUniqueID = (count:number, string:string, prefix:string) => {
    var str = "";
    for (var i = 0; i < count; i++) {
      if (string[i] != "-") {
        str += string[i];
      }
    }
    return (prefix + str).toUpperCase();
  };

  // module.exports.GenerateID = GenerateUniqueID/