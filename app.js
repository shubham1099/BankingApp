const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("mongoose-type-email");

const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose.connect(
  "mongodb+srv://admin-shubham:shubh@cluster0.c8xq4.mongodb.net/account1DB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Customer = mongoose.model("Customer", {
  name: String,
  email: mongoose.SchemaTypes.Email,
  currentBalance: Number,
});

const historySchema = new mongoose.Schema({
  senderName: String,
  receiverName: String,
  money: Number,
});

const History = mongoose.model("History", historySchema);

const cust1 = new Customer({
  name: "SHUBHAM 1",
  email: "SHUBHAM1@gmail.com",
  currentBalance: 20000,
});

const cust2 = new Customer({
  name: "SHUBHAM 2",
  email: "SHUBHAM2@gmail.com",
  currentBalance: 32000,
});

const cust3 = new Customer({
  name: "SHUBHAM 3 ",
  email: "SHUBHAM3@yahoo.com",
  currentBalance: 12000,
});

const cust4 = new Customer({
  name: "SHUBHAM 4",
  email: "SHUBHAM4@gmail.com",
  currentBalance: 9000,
});

const cust5 = new Customer({
  name: "SHUBHAM 5",
  email: "SHUBHAM5@gmail.com",
  currentBalance: 72000,
});

const cust6 = new Customer({
  name: "SHUBHAM 6",
  email: "SHUBHAM6@gmail.com",
  currentBalance: 45000,
});

const cust7 = new Customer({
  name: "SHUBHAM 7",
  email: "SHUBHAM7@hotmail.com",
  currentBalance: 80000,
});

const cust8 = new Customer({
  name: "SHUBHAM 8",
  email: "SHUBHAM8@gmail.com",
  currentBalance: 100000,
});

const cust9 = new Customer({
  name: "SHUBHAM 9",
  email: "SHUBHAM9@gmail.com",
  currentBalance: 85000,
});

const cust10 = new Customer({
  name: "SHUBHAM 10",
  email: "SHUBHAM10@gmail.com",
  currentBalance: 97000,
});

const defaultItems = [
  cust1,
  cust2,
  cust3,
  cust4,
  cust5,
  cust6,
  cust7,
  cust8,
  cust9,
  cust10,
];
let foundItems = " ";

app.get("/money-transfer", function (req, res) {
  Customer.find({}, function (err, foundItems) {
    if (foundItems.length == 0) {
      Customer.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Inserted default items");
        }
      });
      res.redirect("/money-transfer");
    } else {
      res.render("customers", {
        newListItems: foundItems,
        danger: "",
        danger2: "",
      });
    }
  });
});

app.get("/view", function (req, res) {
  Customer.find({}, function (err, people) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        newPeople: people,
      });
    }
  });
});

app.get("/history", function (req, res) {
  History.find({}, function (err, historyData) {
    if (err) {
      console.log(err);
    } else {
      res.render("history", {
        data: historyData,
      });
    }
  });
});

app.post("/money-transfer", function (req, res) {
  // res.redirect("/");
  const amount = req.body.money;
  const Sender = req.body.sender;
  const Receiver = req.body.receiver;

  let num1 = 0;
  let num2 = 0;
  Customer.findOne(
    {
      name: Sender,
    },
    function (err, send) {
      num1 = send.currentBalance;

      if (amount > num1) {
        Customer.find({}, function (err, again) {
          res.render("customers", {
            newListItems: again,
            danger: " Not enough money in sender's account",
            danger2: "",
          });
        });
      } else if (Sender == Receiver) {
        Customer.find({}, function (err, again) {
          res.render("customers", {
            newListItems: again,
            danger: "",
            danger2: "Sender and Receiver can't be same. Please re-enter.",
          });
        });
      } else {
        num1 = parseInt(num1) - parseInt(amount);

        Customer.updateOne(
          {
            name: Sender,
          },
          {
            $set: {
              currentBalance: num1,
            },
          },
          function (err, res) {
            if (err) throw err;
            console.log("Sender document updated");
          }
        );

        // Database interation
        Customer.findOne(
          {
            name: Receiver,
          },
          function (err, receive) {
            num2 = receive.currentBalance;

            num2 = parseInt(num2) + parseInt(amount);

            Customer.updateOne(
              {
                name: Receiver,
              },
              {
                $set: {
                  currentBalance: num2,
                },
              },
              function (err, res) {
                if (err) throw err;
                console.log("Receiver account updated");
              }
            );
          }
        );

        const H1 = new History({
          senderName: Sender,
          receiverName: Receiver,
          money: amount,
        });

        H1.save();

        res.render("success", {
          sender: Sender,
          receiver: Receiver,
        });
        //res.redirect("/money-transfer");
      }
    }
  );
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started Successfully!!");
});
