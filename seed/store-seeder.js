var Store = require("../models/store");
var mongoose = require("mongoose");

const { mongodb_url } = require("../config/config.js");
mongoose.connect(
  "mongodb+srv://admin:1234@cluster0.avu5zrm.mongodb.net/?retryWrites=true&w=majority"
);

store = new Store({
  opentime: "7:00",
  closetime: "22:00",
  status: "open",
});

store.save(function (err, result) {
    exitsave();
});

function exitsave() {
  mongoose.disconnect();
}
