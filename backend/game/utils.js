module.exports = {
  generateId: function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
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

  arrayObjRemove: function (arr, obj) {
    return arr.filter(function (ele) {
      return ele.id != obj.id;
    });
  }
}