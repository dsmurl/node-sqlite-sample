var dbLayer = require('./db/dbLayer.js');
var check;

var db = dbLayer('cars.db');

var createdNewCar = function(newCar) {
    console.log("Made New Car: ", newCar);
};

console.log("createCars");
db.cars.createCar(1968, "Cougar", "Red", createdNewCar);
db.cars.createCar(2013, "Infinity", "Black", createdNewCar);
db.cars.createCar(1998, "Ranger", "Blue", createdNewCar);
db.cars.createCar(1977, "F150", "Black");

db.cars.getCar(2, function(car) {
    console.log("Found car: ", car);
});


db.cars.getCar(5, function(car) {
    console.log("Found car: ", car);
});

db.cars.printCars();

db.close();
