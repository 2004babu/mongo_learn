const express = require("express");
const exphbs = require("express-handlebars");
const dotenv=require('dotenv').config();
const app = express();
const dbo = require("./db");
const body_parser = require("body-parser");
const ObjectId= dbo.ObjectId;
///////set view engine////////
app.engine(
  "hbs",
  exphbs.engine({
    layoutsDir: "views/",
    defaultLayout: "index",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

///////body-parser
app.use(body_parser.urlencoded({ extended: true }));

///////Read Operation ///////
app.get("/", async (req, res) => {
    let database = await dbo.getdatabase();
    const collection = database.collection("books");
    const curser = collection.find({});
    let books = await curser.toArray();

    let message;
    let edit_id,edit_book;


    if (req.query.edit_id) {
        edit_id=req.query.edit_id;
        edit_book = await collection.findOne({ _id: new ObjectId(edit_id) });

    }
  
  switch (req.query.status) {
    case "1":  
      message = "Insert Success ";
      break;
    case "2":  
      message = "update  Success ";
      break;
    case "3":  
      message = "delete  Success ";
      break;

    default:
      break;
  }

  res.render("index", { message, books,edit_id,edit_book });
});

////////insert operation /////
app.post("/store_book", async (req, res) => {
  let database = dbo.getdatabase();
  let collection = (await database).collection("books");
  let book = { title: req.body.title, author: req.body.author };
  await collection.insertOne(book);
  return res.redirect("/?status=1");
});
 ///////update database ./////
 app.post("/update_book/", async (req, res) => {
    let database = dbo.getdatabase();
    let collection = (await database).collection("books");
    let id=req.query.edit_id;
    let book = { title: req.body.title, author: req.body.author };
    await collection.updateOne({_id:new ObjectId(id)},{$set:book});
    return res.redirect("/?status=2");
  });
  //////delete operation ////
  app.get('/delete',async(req,res)=>{
    const database=await dbo.getdatabase();
    const collection=database.collection('books')
    await collection.deleteOne({_id:new ObjectId(req.query.delete_id)})
    res.redirect('/?status=3')
  })
/////////host ////////
app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8000");
});
