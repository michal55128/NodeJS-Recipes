const mongoose = require("mongoose");
const { Recipe, recipeValidators } = require("../models/recipe.model");
const { Category } = require("../models/category.model");

exports.getAllRecipes = async (req, res, next) => {
  let { search, page, perPage } = req.query;

  search ??="";
  page ??= 1;
  perPage ??= 20;

  try {
    const recipes = await Recipe.find({ name: new RegExp(search), isPrivate: false } )
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select("-__v");
    return res.json(recipes);

  } catch (error) {
    next(error);
  }
};

exports.getRecipeById = (req, res, next) => {
  const id = req.params.id;
  console.log(mongoose.Types.ObjectId.isValid(id));
  if (!mongoose.Types.ObjectId.isValid(id))
    next({ message: "id is not valid" });
  else {
    Recipe.findById(id, { __v: false })
      .then((c) => {
        res.json(c);
      })
      .catch((err) => {
        next({ message: "recipe not found", status: 404 });
      });
  }
};

exports.getRecipesByUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const recipes = await Recipe.find({ "user.userId": userId })
      .populate("user", "username email -_id")
      .select("-__v");
    return res.json(recipes);
  } catch (error) {
    next(error);
  }
};

exports.getrecipesByPreparationTime = async (req, res, next) => {
  const maxPreparationTime = parseInt(req.params.maxTime);
  try {
    const recipes = await Recipe.find({
      preparationTimeInMinute: { $lte: maxPreparationTime, isPrivate: false},
    })
      .populate("user", "name email -_id")
      .select("-__v");
    return res.json(recipes);
  } catch (error) {
    next(error);
  }
};

exports.addRecipe = async (req, res, next) => {
  try {
  
    const v = recipeValidators.addRecipeAndUpdate.validate(req.body);
    if (v.error) return next({ message: v.error.message });
    else {
      const nameCategory = req.body.nameCategory;
      let category = await Category.findOne({ description: nameCategory });
      if (!category) {
        category = new Category({ description: nameCategory });
        await category.save();
      }
      category.recipes.push({ _id: req.body._id, name: req.body.name });
      await category.save();
      const recipe = new Recipe(req.body);
      await recipe.save();
      return res.status(201).json(recipe);
    }
  } catch {
    next(error);
  }
};


// exports.addRecipe = async (req, res, next) => {
//     console.log("addrecipe");
//   try {
//       const recipeDataString = req.body.recipe;
//       const recipeData = JSON.parse(recipeDataString);
//       const imageName = req.file ? req.file.filename : null;
//       const { name, description, level, preparationHours, preparationMinutes, isPrivate, imageUrl, nameCategory, newCategories, layers, components, preparationInstructions, user } = recipeData;
//       const totalPreparationTime = (preparationHours * 60) + preparationMinutes;

//       const processedLayers = layers.map(layer => ({
//           description: layer.description,
//           components: layer.components.map(ingredient => ingredient.description).filter(description => description)
//       }));
//       const prepInstructionsArray = preparationInstructions.map(instr => instr.step).filter(step => step);

//       const newRecipe = new Recipe({
//           name,
//           description,
//           nameCategory: nameCategory,
//           preparationTime: totalPreparationTime,
//           level: level,
//           addDate: new Date(),
//           layers: processedLayers,
//           preparationTimeInMinute: prepInstructionsArray,
//           imageName: imageName,
//           imageUrl: `${req.protocol}://${req.get('host')}/images/${imageName}`,
//           isPrivate: isPrivate === 'כן',
//           user: {
//               _id: user._id,
//               name: user.name
//           }
//       });
//       await newRecipe.save();

//       const categoryPromises = newRecipe.categories.map(async category => {
//           let c = await Category.findOne({ name: category });
//           if (!c) {
//               c = new Category({ name: category, recipes: [] });
//               await c.save();
//           }
//           c.recipes.push({ _id: newRecipe._id, name: newRecipe.name });
//           await c.save();
//       });

//       await Promise.all(categoryPromises);

//       return res.status(201).json(newRecipe);
//   } catch (error) {
//       next(error);
//   }
// }



exports.updateRecipe = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ message: "id is not valid" });
  }
  try {
    req.body.layers.forEach((layer) => delete layer._id);
    delete req.body.user._id;
    delete req.body._id;
    console.log("Request Body:", req.body);
    const v = recipeValidators.addRecipeAndUpdate.validate(req.body);
    if (v.error) {
      return next({ message: v.error.message });
    }
    const newCategoryName = req.body.nameCategory;
    const oldRecipe = await Recipe.findById(id);
    if (oldRecipe.nameCategory !== newCategoryName) {
      const oldCategory = await Category.findOne({
        description: oldRecipe.nameCategory,
      });
      if (oldCategory) {
        oldCategory.recipes.pull(id);
        await oldCategory.save();
      }
      let newCategory = await Category.findOne({
        description: newCategoryName,
      });
      if (!newCategory) {
        newCategory = new Category({ description: newCategoryName });
        await newCategory.save();
      }
      newCategory.recipes.push({ _id: id, name: oldRecipe.name });
      await newCategory.save();
    } else {
      const currentCategory = await Category.findOne({
        description: newCategoryName,
      });
      if (currentCategory) {
        const recipeIndex = currentCategory.recipes.findIndex(
          (recipe) => recipe._id.toString() === id
        );
        if (recipeIndex !== -1) {
          currentCategory.recipes[recipeIndex].name = req.body.name;
          await currentCategory.save();
        }
      }
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ) 
    .select("-__v");
    return res.status(200).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ message: "id is not valid" });
  }
  try {
    const categoryName = req.body.nameCategory;
    const category = await Category.findOne({ description: categoryName });
    if (category) {
      category.recipes.pull(id);
      if (category.recipes.length === 0) {
        await Category.findByIdAndDelete(category._id);
      } else {
        await category.save();
      }
    }
    await Recipe.findByIdAndDelete(id);
    return res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    next(error);
  }
};



// exports.updateRecipe = async (req, res, next) => {
//   const id = req.params.id;
//   console.log(id);
//   if (!mongoose.Types.ObjectId.isValid(id))
//       next({ message: 'id is not valid' })
//   try {
//       const recipeDataString = req.body.recipe;
//       console.log(recipeDataString);
//       const recipeData = JSON.parse(recipeDataString);
//       console.log(recipeData);
//       const { name, description, difficulity, preparationHours, preparationMinutes, isPrivate, imageName, imageUrl, categories, layers, preparationInstructions, user
//       } = recipeData;
//       const newImageName = req.file ? req.file.filename : imageName;
//       const updatedImageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${newImageName}` : imageUrl;
//       const totalPreparationTime = (preparationHours * 60) + preparationMinutes;

//       const processedLayers = layers.map(layer => ({
//           description: layer.description,
//           ingredients: layer.ingredients.map(ingredient => ingredient.name).filter(name => name)
//       }));
//       const prepInstructionsArray = preparationInstructions.map(instr => instr.step).filter(step => step);

//       const newRecipe = new Recipe({
//           _id: id,
//           name,
//           description,
//           categories: categories,
//           preparationTimeInMinute: totalPreparationTime,
//           level: difficulity,
//           addDate: new Date(),
//           layers: processedLayers,
//           Preparation: prepInstructionsArray,
//           imageName: newImageName,
//           imageUrl: updatedImageUrl,
//           isPrivate: isPrivate === 'no',
//           user: {
//               _id: user._id,
//               name: user.name
//           }
//       });
//       const updatedFields = newRecipe.toObject();
//       const recipe = await Recipe.findByIdAndUpdate(id,
//           { $set: updatedFields }, { new: true });

//       return res.json(recipe);
//   } catch (error) {
//       next(error)
//   }
// }