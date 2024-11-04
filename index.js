const express = require("express");
const { connectMongoDb } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const URL = require("./models/url");
const path = require("path");
const staticRouter = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const { url } = require("inspector");
const exp = require("constants");
const app = express();
const PORT = 8001;

connectMongoDb("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB connected")
);

app.set("view engine", "ejs"); // said that we want to user ssr using ejs
// btao ejs file kaha h
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/test", async (req, res) => {
  const allurls = await URL.find({});
  // u can even pass variables
  return res.render("home", {
    urls: allurls,
  });
});

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRouter);

// dynmic route
app.get("/url/:shortId", async (req, res) => {
  // fetch from dbs nd redirect
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
