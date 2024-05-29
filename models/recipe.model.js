const mongoose = require("mongoose");
const Joi = require('joi');

const layersSchema = new mongoose.Schema({
  description: { type: String },
  components: { type: [String] },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "name is require"] },
  description: { type: String },
  nameCategory: { type: String, required: true },
  //?? מה הקטגוריה תיהיה איידי של קטגוריה מסוג סטרינג או ממש מופע של קטגוריה כאילו קשר
  //categoryId: [{ type: mongoose.Types.ObjectId, ref: 'category' }]
  preparationTimeInMinute: { type: Number, min: 1 },
  level: { type: Number, default: 1, enum: [1, 2, 3, 4, 5] },
  addDate: { type: Date, required: true },
  layers: [layersSchema],
  Preparation: { type: [String] },
  image: { type: String },
  isPrivate: {type: Boolean},
  user: userSchema,
});

module.exports.recipeValidators = {
  addRecipeAndUpdate: Joi.object().keys({
    name: Joi.string().required().label('Name'),
    description: Joi.string().label('Description'),
    nameCategory: Joi.string().required().label('Category Name'),
    preparationTimeInMinute: Joi.number().integer().min(1).label('Preparation Time In Minute'),
    level: Joi.number().integer().min(1).max(5).default(1).label('Level'),
    addDate: Joi.date().iso().required().label('Add Date'),
    layers: Joi.array().items(Joi.object({
        description: Joi.string().label('Layer Description'),
        components: Joi.array().items(Joi.string()).label('Layer Components')
    })).label('Layers'),
    Preparation: Joi.array().items(Joi.string()).label('Preparation'),
    image: Joi.string().label('Image'),
    isPrivate: Joi.boolean().label('Is Private').messages({'boolean.base': 'The isPrivate field must be a boolean value'}),
    user: Joi.object({
        name: Joi.string().required().label('User Name'),
        userId: Joi.string().required().label('User ID')
    }).label('User')
  })
};

module.exports.recipeSchema = recipeSchema;
module.exports.Recipe = mongoose.model("recipes", recipeSchema);
