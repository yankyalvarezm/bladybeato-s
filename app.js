var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("mongoose");
var cors = require("cors");

var indexRouter = require("./routes/index.routes");
var authRouter = require("./routes/auth.routes");
var marcaRouter = require("./routes/marca.routes")
var modeloRotuer = require("./routes/modelo.routes")
var carroRouter = require("./routes/carro.routes")

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);
app.enable("trust proxy");

app.use(
  cors({
    origin: [process.env.REACT_APP_URI], // <== URL of our future React app
  })
);

// app.use(
//     cors()
//   );
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/marca", marcaRouter)
app.use("/modelo", modeloRotuer)
app.use("/carro", carroRouter)

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
module.exports = app;
