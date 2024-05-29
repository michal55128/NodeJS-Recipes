const { Category } = require("../models/category.model");
const mongoose = require("mongoose");
const { Recipe } = require("../models/recipe.model");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select("-__v");
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
    const id = req.params.id;
    console.log(mongoose.Types.ObjectId.isValid(id));
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
   else{
    Category.findById(id, { __v: false }).populate("recipes").select("-__v")
    .then(c => {
        res.json(c);
    })
    .catch(err => {
        next({ message: 'category not found', status: 404 })
    })
   }
};

exports.getCategoriesWithRecipes = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("recipes").select("-__v");
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};
