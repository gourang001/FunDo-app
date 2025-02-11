/* eslint-disable prettier/prettier */
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, `Name must be at least 3 characters long`],
      maxlength: [50, `Name must not exceed 50 characters`]
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: Number
    },
    password: {
      type: String,
      required: true,
      minlength: [8, `Password must be at least 8 characters`]
    }
  },

  {
    timestamps: true
  }
);

export default model('User', userSchema);
