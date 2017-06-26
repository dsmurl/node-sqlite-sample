'use strict';


/**
 *
 * {
 *      id: number
 *      model: text
 *      year: number
 *      color: text
 * }
 *
 */
function carsLayer(db) {
    db.serialize(function () {
            db.run("CREATE TABLE if not exists cars (id INTEGER PRIMARY KEY AUTOINCREMENT, year NUMBER, model TEXT, color TEXT)");
        }
    );

    function getCarObject(id, year, model, color) {
        return {
            id: id,
            year: year,
            model: model,
            color: color,
        }
    }

    function createCar(year, model, color, callback) {
        db.serialize(function () {
            let stmt = db.prepare("INSERT INTO cars VALUES (null, ?, ?, ?)");
            stmt.run(year, model, color);
            stmt.finalize();

            var newId = -1;
            db.each("select * from sqlite_sequence where name='cars'; ",
                function (err, row) {
                    newId = row.seq;
                },
                function() {
                    if (callback) {
                        callback(getCarObject(newId, year, model, color));
                    }
                }
            );
        });
    }

    function getCar(id, callback) {
        db.serialize(function () {
            var targetCar = null;
            db.each("SELECT * FROM cars where id = ?", id,
                function (err, row) {
                    targetCar = row;
                },
                function (err, rows) {
                    callback(targetCar);
                }
            );
        });
    }

    function printCars() {
        db.serialize(function () {
            var cars = [];
            db.each("SELECT * FROM cars",
                function (err, row) {
                    cars.push(row.id + ": " + row.year + ", " + row.model + ", " + row.color);
                },
                function () {
                    console.log("Cars");
                    console.log("----------");
                    cars.forEach(function (car) {
                        console.log(car);
                    });
                }
            );
        });
    }

    return {
        createCar: createCar,
        getCar: getCar,
        printCars: printCars,
    }
}

module.exports = carsLayer;
