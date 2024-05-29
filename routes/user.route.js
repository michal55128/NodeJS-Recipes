
const express = require("express");
const { signIn, signUp, updateUser,getAllUsers } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth');
const { isAdmin } = require("../middlewares/isAdmin");

const router=express.Router();
router.post('/signIn',signIn);
router.post('/signUp',signUp);
router.put('/:id',auth,updateUser);
router.get("/",isAdmin, getAllUsers);
// router.get("/", getAllUsers);

module.exports=router;

