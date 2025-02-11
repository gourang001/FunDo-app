/* eslint-disable prettier/prettier */
import User from '../models/user.model';
const bcrypt = require('bcrypt');

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
const SECRET_KEY = process.env.SECRET_KEY;


//create new user
export const newUser = async (body) => {
  const hassPassword = await bcrypt.hash(body.password, 10);
  body.password = hassPassword;
  const data = await User.create(body);
  return data;
};


export const loginUser = async (body) => {
  const { email, password } = body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.code = 400;
    throw error;
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.code = 400;
    throw error;
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user._id, email: user.email }, // Payload
    SECRET_KEY, // Secret key
    { expiresIn: '24h' } // Token expiry time
  );

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    token, // Return token to the user
  };
};
