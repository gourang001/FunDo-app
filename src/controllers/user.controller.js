import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service.js';

export const newUser = async (req, res, next) => {
  const response = await UserService.newUser(req.body);
  res.status(response.code).json(response);
};

export const loginUser = async (req, res, next) => {
  const response = await UserService.loginUser(req.body);
  res.status(response.code).json(response);
};

export const forgotPassword = async (req, res, next) => {
  const response = await UserService.forgotPassword(req.body.email);
  res.status(response.code).json(response);
};

export const resetPassword = async (req, res, next) => {
  const response = await UserService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
  res.status(response.code).json(response);
};
