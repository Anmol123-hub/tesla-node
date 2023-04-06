const express = require("express")
const cors = require("cors")
const path = require("path")

let mongoose = require("mongoose")
let config = require("./config.json")

let Schema = mongoose.Schema
let ObjectId = Schema.ObjectId

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
    custId: Number,
    firstname: String,
    lastname: String,
    contact: Number,
    email: String,
    pincode: Number,
    dealerId: Number,
    date: String,
    time: String,
    carModel: String,
    request: String

}))

let Customerid = mongoose.model("Customerid", Schema({
    _id: String,
    sequence_value: Number,
}))
const string_mongo = `mongodb+srv://${config.username}:${config.password}@cluster0.t0n6iqu.mongodb.net/${config.dbname}?retryWrites=true&w=majority`
mongoose.connect(string_mongo).then((res) => console.log("Connected"))
    .catch((err) => console.log("Error", err))

app.get("/getdealerdetails", (req, res) => {
    Dealername.find().then((db) => res.send(db))
})

app.get("/getallcustomer", (req, res) => {
    Customerrequest.find().then((db) => res.send(db))

})

app.get("/admin",(req,res)=>{
    res.sendFile(__dirname + '/tesla_angular/index.html');
})
app.get("/login",(req,res)=>{
    res.sendFile(__dirname + '/tesla_angular/index.html');
})
app.get("/superadmin",(req,res)=>{
    res.sendFile(__dirname + '/tesla_angular/index.html');
})
app.get("/drive",(req,res)=>{
    res.sendFile(__dirname + '/tesla_angular/index.html');
})

app.post("/getcustomerrequests", (req, res) => {
    let a = req.body
    Customerrequest.find({ dealerId: a.id, request: "pending" }).then((db) => res.send(db))

})
app.post("/getaccepetdrequets", (req, res) => {
    let a = req.body
    Customerrequest.find({ dealerId: a.id, request: "accepted" }).then((db) => res.send(db))

})
app.post("/getrejectrequets", (req, res) => {
    let a = req.body
    Customerrequest.find({ dealerId: a.id, request: "reject" }).then((db) => res.send(db))

})


app.post("/customerrequest", (req, res) => {
    let a = req.body
    let id = 0
    Customerid.findById({ _id: "custId" }).then((db) => {
        id = db.sequence_value

        let customer = new Customerrequest({
            custId: id,
            firstname: a.first,
            lastname: a.last,
            contact: a.contact,
            email: a.email,
            pincode: a.pincode,
            dealerId: a.dealerId,
            date: a.date,
            time: a.time,
            carModel: a.car,
            request: "pending"
        })
        customer.save().then((updateRes) => res.send("Updated"))
        Customerid.findByIdAndUpdate({ _id: "custId" }).then((db) => {
            db.sequence_value = ++id
            db.save()
        })
    })
})

app.post("/checkdealer", (req, res) => {
    let a = req.body
    // console.log(a);
    Dealername.find({ dealerEmail: a.email, dealerPass: a.pass }).then((db) => {
        if (Object.keys(db).length == 0) {
            res.send("not found")
        }
        else {
            res.send("found")
        }
    })
})
app.post("/getdealerdeatils", (req, res) => {
    let a = req.body
    Dealername.find({ dealerEmail: a.Email }).then((db) => {
        if (Object.keys(db).length == 0) {
            res.send("not found")
        }
        else {
            res.send(db)
        }
    })
})

app.post("/updatestatus", (req, res) => {
    let a = req.body
    if (a.status === "accept") {
        Customerrequest.updateOne({ custId: { $eq: a.custId } }, { request: "accepted" }).then((db) => {
            if (Object.keys(db).length == 0) {
                res.send("not found")
            }
            else {
                res.send("Updated")
            }
        })
    }
    else{
        Customerrequest.updateOne({ custId: { $eq: a.custId } }, { request: "reject" }).then((db) => {
            if (Object.keys(db).length == 0) {
                res.send("not found")
            }
            else {
                res.send("Updated")
            }
        })
    }

})




app.listen(PORT)