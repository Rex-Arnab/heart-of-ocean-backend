require("dotenv").config();
let express = require("express");
let app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 5000;

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use(morgan("dev"));
app.use(helmet());
app.disable("x-powered-by");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom server error handler
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message)
    if (!err.statusCode) { err.statusCode = 500 } // Set 500 server code error if statuscode not set
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      message: err.message
    })
  }

  next()
})

app.use("/", require("./routes/baseRoute"));
app.use("/user", require("./routes/userRoute"));
app.use("/referral", require("./routes/referralRoute"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/product", require("./routes/productRoute"));

app.listen(PORT, function () {
  console.log(`app listening on ${PORT}!`);
});
