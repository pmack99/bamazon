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
    // console.log("connected as id " + connection.threadId + "\n");
    afterConnection();
});


function afterConnection() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products", function (err, data) {
        if (err) throw err;

        for (var i = 0; i < data.length; i++) {
            console.log("ID: " + data[i].item_id + " || Product Name: " + data[i].product_name, + " || Department: " + data[i].department_name + " || Price: " + data[i].price + " || Stock: " + data[i].stock_quantity);
        }
        action();
    });
}

// everything above this line works!



// function which prompts the user for what action they should take
function action() {
    inquirer
        .prompt([{
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
                name: "quantity",
                message: "How many units would you like to buy?",
                type: 'input',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        console.log('\nPlease enter a valid quantity.');
                        return false;
                    }
                }
            

                .then(function(purchase) {
                    let item = purchase.item_id
                    let quantity = purchase.quantity
        
                    let queryStr = 'SELECT * FROM products WHERE ?';
        
                    connection.query(queryStr, { item_id: item }, function(err, res) {
                        if (err) throw err
        
                        if (res.length === 0) {
                            console.log("ERROR: Invalid Item ID. Please select a valid Item ID.")
                            displayInventory()
                        } else {
        
                            // set the results to the variable of productInfo
                            let productInfo = res[0]
        
                            if (quantity <= productInfo.stock_quantity) {
                                console.log(productInfo.product_name + "is in stock! Placing order now!")
                                console.log("\n")
        
                                // the updating query string
                                var updateQueryStr = "UPDATE products SET stock_quantity = " + (productInfo.stock_quantity - quantity) + " WHERE item_id = " + item
                                    // console.log('updateQueryStr = ' + updateQueryStr);
        
                                // Update the inventory
                                connection.query(updateQueryStr, function(err, data) {
                                    if (err) throw err;
        
                                    console.log("Your order has been placed!");
                                    console.log("Your total is $" + productInfo.price * quantity)
                                    console.log("\n")
        
                                    // End the database connection and close the app
                                    connection.end();
                                })
                            } else {
                                console.log("Sorry, there is not enough " + productInfo.product_name + " in stock.")
                                connection.end();
                            }
        
        
                        }
                    })
        
        
                })
            }
    


    