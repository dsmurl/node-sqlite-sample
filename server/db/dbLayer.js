var sqlite3 = require('sqlite3');
var carsLayer = require('./carsLayer');

function dbLayer(db_filename) {
    var db = new sqlite3.Database(db_filename);

    function close() {
        db.close();
    }

    return {
        cars: carsLayer(db),
        close: close,
    }
}

module.exports = dbLayer;
