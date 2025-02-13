import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
const SECRET_KEY = process.env.SECRET_KEY;

// Create new user
export const newUser = async (body) => {
  try {
    const hassPassword = await bcrypt.hash(body.password, 10);
    body.password = hassPassword;
    const data = await User.create(body);
    return { code: 201, data, message: 'User created successfully !!!!' };
  } catch (error) {
    return { code: 500, message: 'Error creating user', error: error.message };
  }
};

// Login user
export const loginUser = async (body) => {
  try {
    const { email, password } = body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { code: 400, message: 'Invalid email or password' };
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { code: 400, message: 'Invalid email or password' };
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      SECRET_KEY, // Secret key
      { expiresIn: '24h' } // Token expiry time
    );

    return {
      code: 200,
      data: { id: user._id, email: user.email, name: user.name, phone: user.phone, token },
      message: 'Login successful!'
    };
  } catch (error) {
    return { code: 500, message: 'Error logging in', error: error.message };
  }
};

let recentOtp;
export const forgotPassword = async (email) => {
  try {
    if (!email) {
      return { code: 400, message: 'Send email' };
    }

    let user = await User.findOne({ email });
    if (!user) {
      return { code: 400, message: 'User with this email does not exist' };
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    recentOtp = otp;

    return { code: 200, data: { otp }, message: 'OTP sent to email' };
  } catch (error) {
    return { code: 500, message: 'Error sending OTP', error: error.message };
  }
};

// Reset Password Function
export const resetPassword = async (email, otp, newPassword) => {
  try {
    if (recentOtp !== parseInt(otp)) {
      return { code: 400, message: 'OTP Does not Match' };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find user and update password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return { code: 400, message: 'User with this email does not exist' };
    }

    return { code: 200, message: 'Password reset successful' };
  } catch (error) {
    return { code: 500, message: 'Error resetting password', error: error.message };
  }
};
