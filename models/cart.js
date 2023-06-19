module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id, price, additionalChoices, additionalNote, callback) {
    console.log('Notes: ' + additionalNote);
    console.log('Option: ' + additionalChoices);
  
    var detailKey = id + '-' + additionalChoices + '-' + additionalNote;
    var storedItem = this.items[detailKey];
    if (!storedItem) {
      storedItem = this.items[detailKey] = {
        item: item,
        qty: 0,
        price: 0,
        additionalChoices: additionalChoices,
        additionalNote: additionalNote
      };
    }
  
    storedItem.qty++;
    storedItem.onePrice =  parseFloat(price)
    storedItem.price = parseFloat(price) * storedItem.qty;
    this.totalQty++;
    this.totalPrice += parseFloat(price);
  
    if (callback) {
      callback();
    }
  };

  this.reduceByOne = function(id, callback) {
    var item = this.items[id];
    if (item) {
      item.qty--;
      item.price -= item.onePrice;
      this.totalQty--;
      this.totalPrice -= item.onePrice;
  
      if (item.qty <= 0) {
        delete this.items[id];
      }
    }
    callback();
  };

  this.removeItem = function(id, callback) {
    var item = this.items[id];
    if (item) {
      this.totalQty -= item.qty;
      this.totalPrice -= item.price;
      delete this.items[id];
      callback();
    }
  };

  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      var item = this.items[id];
      arr.push({
        item: item.item,
        qty: item.qty,
        price: item.price,
        additionalChoices: item.additionalChoices,
        additionalNote: item.additionalNote,
      });
    }
    return arr;
  };
};
