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
            validate: function (value) {
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
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        console.log('\nPlease enter a valid quantity.');
                        return false;
                    }
                }


            }).then(function (answer) {
                return new Promise(function (resolve, reject) {
                    // query for all items in products table where the item_id is what was chosen
                    connection.query("SELECT * FROM products WHERE item_id=?", answer.item_id, function (err, res) {
                        if (err) reject(err);
                        resolve(res);
                    });

                }).then(function (result) {
                    // if there aren't enough of the item
                    if (answer.stock_quantity > result[0].stock_quantity) {
                        console.log ("Insufficient quantity!");
                        // if there are enough
                    } else {
                        var object = {};
                        // answer is the users responses to the prompts
                        object.answer = answer;
                        // result is the results of the query
                        object.result = result;
                        return object;
                    }
                })
            })
                

