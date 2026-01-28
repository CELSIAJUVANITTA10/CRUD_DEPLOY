// Import the libraries - express - mongoose - cors
require("dotenv").config;

const express = require("express");
const mongoose=require("mongoose");
const cors=require("cors");

//Create Express Server

const app=express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// Create a Model

const Person = mongoose.model("Person",{name:String,age:Number},"person");

// Read all the peoples
app.get("/",async(req,res)=>{
    const people=await Person.find();
    res.json(people);
})
//Add new peoples
app.post("/",async(req,res)=>{
    const newPerson = await Person.create(req.body);
    res.json(newPerson);
})
app.put("/:id",async(req,res)=>{
    const updated=await Person.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true
        }
    );
    res.json(updated);
});

app.delete("/:id",async(req,res)=>{
    await Person.findByIdAndDelete(req.params.id);
    res.json({message:"Person deleted"});
});


//Connection
const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

