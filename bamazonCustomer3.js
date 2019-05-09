var inquirer = require("inquirer");

var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'bamazonDB',
  port      : '3306'
});

//Connects to mySql Server
connection.connect(function(err) {
    if (err) {
    return console.error("connected as id " + err.stack);
  }
  console.log('Connected to the MySQL server.');
})

//Query the products from database 'products' and display in console; and run userPrompt
connection.query(
  `SELECT * FROM products`,
  function (err, res) {
  if (err) throw err;
  console.log(res);
  userPrompt();
  })

//UserPrompt should prompt the user to input item by ID number and quantity and run a function to see if that item is in stock.  if the item is in stock, then run a function that has them confirm they want it at that price, and then confirm purchase, and then change the database to reflect that the change in inventory
function userPrompt() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Insert Item by ID Number",
        name: "id"
      },
      {
        type: "input",
        message: "How many units would you like to purchase?",
        name: "quantity"
      }
    ])
    .then(function(response) {
        // console.log(response.id);
        // console.log(response.quantity);
        checkInStock(response.id, response.quantity);
        }
        );
  };

  function checkInStock(x, y) {
    connection.query(
      `SELECT stock_quantity FROM products WHERE item_id = '${x}'`,
      function (err, result) {
        if (err) throw err;
        var stockQuantityObject = (JSON.parse(JSON.stringify(result)));
        var stockQuantity = stockQuantityObject[0].stock_quantity;
        // console.log(stockQuantity);
        if (y <= stockQuantity) {
          console.log("It's in Stock!")
          purchaseItem(x);
        }
        else if (stockQuantity <= y) {
          console.log(`only ${stockQuantity} in stock!`);
        }
        else if (stockQuantity = 0) {
          console.log("Out of Stock!");
        }
    })
  }

  function purchaseItem(x, y) {
    connection.query(
      `SELECT price FROM products WHERE item_id = '${x}'`,
      function (err, result) {
        if (err) throw err;
        var priceObject = (JSON.parse(JSON.stringify(result)));
        // console.log(priceObject);
        var priceVar = parseInt(priceObject[0].price);
        console.log(`The cost is $${priceVar} each`);
        confirmPurchase(x);
      },
    )
    }

    function confirmPurchase() {
      inquirer
      .prompt([
    {
      type: "confirm",
      message: "Please confirm Purchase",
      name: "confirm",
      default: true
    },
  ]) 
      .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
          console.log(`Thank you for purchasing '${x}'`);
          updateInventory();
        }
      })
        };

   function updateInventory() {
    console.log();
    //  connection.query(
    //    UPDATE `products` SET `column_name` = `new_value' [WHERE condition];

   }

// connection.end(function(err) {});
