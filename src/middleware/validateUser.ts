import Joi from 'joi';
import JoiExpress from 'express-joi-validation';

import { IUser } from "../models/User";


const userSchema = Joi.object<IUser>({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().integer().min(4).max(130).required(),
})

export const userValidator = JoiExpress.createValidator({
  statusCode: 400,
}).body(userSchema);

