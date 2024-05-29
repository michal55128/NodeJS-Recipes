
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");


const { pageNotFound, serverNotFound } = require("./middlewares/handleErrors");
const userRouter = require("./routes/user.route");
const recipeRouter = require("./routes/recipe.route");
const categoryRouter = require("./routes/category.route");



require('dotenv').config();
require('./config/db');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("wellcome");
});

app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/categories", categoryRouter);

app.use('/images', express.static('imageUplaod'));

app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});

