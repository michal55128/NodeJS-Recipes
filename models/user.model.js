const bcrypt = require("bcrypt");
const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const resipesSchema=new mongoose.Schema({
  name: { type: String, required: true },
  recipeId: { type: mongoose.Types.ObjectId, ref: "recipes" },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String },
  role: { type: String, default: "guest", enum: ["admin", "user", "guest"] },
  // לשאול למה צריך אורח? אם אני לא שומרת אותו בכלל בדאטאבייס כי הוא אורח בלי נתונים אז מה הקטע?
  recipes:[resipesSchema],

});

userSchema.pre("save", function (next) {
  const salt = +process.env.BCRYPT_SALT | 10;
  bcrypt.hash(this.password, salt, async (err, hashPass) => {
    if (err) throw new Error(err.message);
    this.password = hashPass;
    next();
  });
});

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model("users", userSchema);

module.exports.userValidators = {
  signin: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10),
  }),
  signup: Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    password: Joi.string().min(6).max(10),
    // repeat_password: Joi.ref("password"),
    email: Joi.string().email().required(),
    city:Joi.string().required().min(1).max(100).pattern(/^[\p{L}\s-]+$/u),
    role:Joi.string().default('guest'),
    
  }),
};
module.exports.generateToken = (user) => {
  const privateKey = process.env.JWT_SECRET || "JWT_SECRET";
  const data = { role: user.role, user_id: user._id };
  const token = jwt.sign(data, privateKey, { expiresIn: "1h" });
  return token;
};

