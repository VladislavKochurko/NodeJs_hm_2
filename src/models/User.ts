import * as mongoose from "mongoose";

import { BaseEntitySchema, IBaseEntity } from "./BaseEntity";

export interface IUser extends IBaseEntity {
  login: string;
  password: string;
  age: number;
}

export interface IUserModel extends IUser {};

const UserSchema: mongoose.Schema = new mongoose.Schema<IUser>({
    ...BaseEntitySchema.obj,
    login: {type: String, required: true},
    password: {type: String, required: true},
    age: {type: Number, required: true},
}, { versionKey: false });

export default mongoose.model<IUserModel>('User', UserSchema);