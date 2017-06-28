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
        db.serialize(() => {
            let stmt = db.prepare("INSERT INTO cars VALUES (null, ?, ?, ?)");
            stmt.run(year, model, color);
            stmt.finalize();

            let newId = -1;
            db.each("select * from sqlite_sequence where name='cars'; ",
                (err, row) => {
                    newId = row.seq;
                },
                (err, rows) => {
                    if (callback) {
                        callback(getCarObject(newId, year, model, color));
                    }
                }
            );
        });
    }

    function removeCar(id, callback) {
        db.serialize(() => {
            getCar(id, (car) => {
                if (car !== null) {
                    let stmt = db.prepare("DELETE FROM cars WHERE id = ?");
                    stmt.run(id);
                    stmt.finalize();
                }
                if (callback) {
                    callback(car);
                }
            });
        });
    }

    function getCar(id, callback) {
        db.serialize(() => {
            let targetCar = null;
            db.each("SELECT * FROM cars where id = ?", id,
                (err, row) => {
                    targetCar = row;
                },
                (err, rows) => {
                    if (callback) {
                        callback(targetCar);
                    }
                }
            );
        });
    }

    function getCars(callback) {
        db.serialize(function () {
            const cars = [];
            db.each("SELECT * FROM cars",
                (err, row) => {
                    cars.push(row);
                },
                (err, rows) => {
                    if (callback) {
                        callback(cars);
                    }
                }
            );
        });
    }

    return {
        createCar: createCar,
        removeCar: removeCar,
        getCar: getCar,
        getCars: getCars,
    }
}

module.exports = carsLayer;
