const { getAllCategories, getCategoriesWithRecipes, getCategoryById } = require("../controllers/category.controller");
const express = require("express");


const router=express.Router();
router.get("/",getAllCategories);
router.get('/categoriesWithRecipes',getCategoriesWithRecipes);
router.get('/:id',getCategoryById);



module.exports=router;