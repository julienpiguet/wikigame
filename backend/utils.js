module.exports = {
  generateId: function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  arrayRemove: function (arr, value) {

    return arr.filter(function (ele) {
      return ele != value;
    });
  },

  arrayObjRemove: function (arr, id) {
    return arr.filter(function (ele) {
      return ele.id != id;
    });
  }
}