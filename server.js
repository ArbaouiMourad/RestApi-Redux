const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");

const assert = require("assert");
const app = express();

//midlleware
app.use(express.json());

//connect db
const mongo_url = "mongodb://localhost:27017";
const dataBase = "first-api";

MongoClient.connect(mongo_url,{ useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null, "data base connexion failed");
  const db = client.db(dataBase);


  //API

  //ADD one
  app.post("/add_contact", (req, res) => {
    let newContact = req.body;
    db.collection("contactlist").insertOne(newContact, (err, data) => {
      if (err) res.send("cant add contact");
      else res.send("contact added");
    });
  });

  //GET all
  app.get("/contacts", (req, res) => {
    db.collection("contactlist")
      .find()
      .toArray((err, data) => {
        if (err) res.send("cant fetch contactlist");
        else res.send(data);
      });
  });

  //GET one
  app.get("/contacts/:id", (req, res) => {
    console.log(req.params.id)
    let Id = ObjectID(req.params.id);
    db.collection("contactlist")
    .findOne({_id:Id}, (err, data) => {                   //id
      if (err) res.send("cant fetch contactlist");
      else res.send(data);
    });
  });
 // modifier
  app.put("/modify_contact/:id", (req, res) => {
    console.log(req.params.id)
    let id = ObjectID(req.params.id);
    let modifieContact = req.body;
    db.collection("contactlist")
    .findOneAndUpdate(
      { _id: id },                           //id
      {$set: {...modifieContact} },           // contact à modifier
      (err, data) => {
        if (err) res.send("cant modify contact");
        else res.send("contact was modified");
      }
    );
  });
// delete
  app.delete("/contacts/:id", (req, res) => {
    let contactToRemove =  ObjectID(req.params.id);
    db.collection("contactlist")
    .findOneAndDelete(
      { _id: contactToRemove },   //id
      (err, data) => {
        if (err) res.send("cant delete the contact ");
        else res.send("contact was deleted");
      }
    );
  });
});

//open port
app.listen(5000, err => {
  if (err) console.log("server err");
  else console.log("server is running on port 5000");
});
