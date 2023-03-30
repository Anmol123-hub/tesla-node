const express = require("express")
const cors = require("cors")
const path = require("path")

let mongoose = require("mongoose")
let config = require("./config.json")

let Schema = mongoose.Schema
let ObjectId = Schema.ObjectId
let fs = require('fs')
let app = express()
const PORT = process.env.PORT || 2525

app.use(express.static(path.join(__dirname+"/tesla_angular")))
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use(cors())


let Dealername = mongoose.model("Dealername", Schema({
    dealerId: Number,
    dealerName: String,
    dealerEmail: String,
    dealerPass: String,
    dealerCity: String,
    dealerAddress: String

}))
let Customerrequest = mongoose.model("Customerrequest", Schema({
    firstname: String,
    lastname: String,
    contact: Number,
    email: String,
    pincode: Number,
    dealerId: Number,
    date: String,
    time: String,
    carModel:String

}))
const string_mongo = `mongodb+srv://${config.username}:${config.password}@cluster0.t0n6iqu.mongodb.net/${config.dbname}?retryWrites=true&w=majority`
mongoose.connect(string_mongo).then((res) => console.log("Connected"))
    .catch((err) => console.log("Error", err))

app.get("/getdealerdetails", (req, res) => {
    Dealername.find().then((db) => res.send(db))

})
app.post("/customerrequest", (req, res) => {
    let a = req.body
    let customer = new Customerrequest({
        firstname: a.first,
        lastname: a.last,
        contact: a.contact,
        email: a.email,
        pincode: a.pincode,
        dealerId: a.dealerId,
        date: a.date,
        time: a.time,
        carModel:a.car
    })
    customer.save().then((updateRes) => res.send("Updated"))
})


app.listen(PORT)