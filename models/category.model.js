

const mongoose = require('mongoose');

const resipesSchema=new mongoose.Schema({
    name: { type: String, required: true },
    recipeId: { type: mongoose.Types.ObjectId, ref: "recipes" },
  });
const categorySchema=new mongoose.Schema({
description:{type:String,required:true},
recipes:[resipesSchema],
})

module.exports.categorySchema=categorySchema;
module.exports.Category=mongoose.model('categories',categorySchema);

