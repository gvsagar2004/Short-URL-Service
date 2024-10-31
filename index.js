const express = require("express");
const {connectMongoDb} =require("./connect");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const app = express();
const PORT= 8001;

connectMongoDb("mongodb://127.0.0.1:27017/short-url")
.then(()=>console.log("MongoDB connected"));
app.use(express.json());

app.use("/url", urlRoute);

// dynmic route 
app.get("/:shortId", async (req,res)=>{
    // fetch from dbs nd redirect
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push: {
        visitHistory :{
            timestamps : Date.now(),
        }
    }});
    res.redirect(entry.redirectURL);
});

app.listen(PORT, ()=>console.log(`Server Started at PORT: ${PORT}`));
