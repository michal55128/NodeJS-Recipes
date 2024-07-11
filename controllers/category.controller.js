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

// exports.getCategoryById = async (req, res, next) => {
//     const id = req.params.id;
//     console.log(mongoose.Types.ObjectId.isValid(id));
//     if (!mongoose.Types.ObjectId.isValid(id))
//         next({ message: 'id is not valid' })
//    else{
//     Category.findById(id, { __v: false })
//     .populate({ path: 'recipes', select: '-__v -_id' })
//     .then(category => {
//         const recipes = [];
//         category.recipes.forEach(recipe => {
//             const matchingRecipe = recipes.find(r => r._id === recipe._id);
//             if (!matchingRecipe) {
//                 recipes.push(recipe); // הוספת המתכון למערך המתכונים אם הוא עדיין לא קיים שם
//             }
//         });
//         res.json(recipes); // החזרת המתכונים המעובדים
//     })
//     .catch(err => {
//         next({ message: 'category not found', status: 404 });
//     });
//    }
// };

exports.getCategoryById = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ message: 'Invalid category id', status: 400 });
  }

  try {
      const category = await Category.findById(id, { __v: false });

      if (!category) {
          return next({ message: 'Category not found', status: 404 });
      }

      const recipes = await Recipe.find({ nameCategory: category.description });

      res.json(recipes);

  } catch (err) {
      next({ message: 'Failed to fetch category and its recipes', status: 500 });
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
