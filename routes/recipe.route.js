const { addRecipe, getRecipesByUser, getAllRecipes, getRecipeById, getrecipesByPreparationTime,updateRecipe,deleteRecipe } = require("../controllers/recipe.controller");
const express = require("express");
const { auth } = require('../middlewares/auth');


const router=express.Router();
router.post('/addRecipe',addRecipe);
router.get('/:id',getRecipeById);
router.get("/", getAllRecipes);
router.get('/userId/:id',getRecipesByUser);
router.get('/getByTime/:maxTime',getrecipesByPreparationTime);
router.put('/:id',auth,updateRecipe);
router.delete('/:id',auth,deleteRecipe);


//האם לבדוק את הטוקן גם בהוספה או שרק בעדכון?


module.exports=router;
