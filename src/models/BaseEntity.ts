import * as mongoose from "mongoose";

export interface IBaseEntity {
  id: string;
  isDeleted: boolean;
}

export const BaseEntitySchema = new mongoose.Schema<IBaseEntity>({
  id: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true
  }
})