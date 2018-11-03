var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    afterConnection();
});


function afterConnection() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products", function (err, data) {
        if (err) throw err;

        for (var i = 0; i < data.length; i++) {
            console.log("ID: " + data[i].item_id + " || Product Name: " + data[i].product_name, + " || Department: " + data[i].department_name + " || Price: " + data[i].price + " || Stock: " + data[i].stock_quantity);
        }
        start();

    });
}

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "item_id",
            type: "input",
            message: "What is the ID of the product you want to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log('\nPlease enter a valid ID.');
                    return false;
                }
            }
        }, {
            name: 'stock_quantity',
            message: 'How many units would you like to buy?',
            type: 'input',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log('\nPlease enter a valid quantity.');
                    return false;
                }
            }

        })
        .then(function (answer) {
            var query = "SELECT * FROM bamazon.products WHERE ?";
            connection.query(query, { artist: answer.artist }, function (err, res) {
                postAuction();
            }
        else {
                    bidAuction();
                })
        });



}

connection.end();