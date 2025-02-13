// /* eslint-disable quotes
/* eslint-disable prettier/prettier */
import HttpStatus from 'http-status-codes';
import *as NoteService from '../services/note.service';

import Note from '../models/note.model';

export const createNote = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
      return res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: 'Title and description are required',
      });
  }

  if (!req.user || !req.user.id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized: No user ID found' });
  }

  const response = await NoteService.createNote({ title, description, userId: req.user.id });
  res.status(response.code).json(response);
};


export const getNotes = async (req, res, next) => {
  const response = await NoteService.getNotes(req.user.id);
  res.status(response.code).json(response);
};


export const getNoteById = async (req, res, next) => {
  const response = await NoteService.getNoteById(req.params.id, req.user.id);
  res.status(response.code).json(response);
};



// update note by ID
export const updateNoteById = async (req, res, next) => {
  const response = await NoteService.updateNoteById(req.params.id, req.user.id, req.body);
  res.status(response.code).json(response);
};


// Soft delete (toggle trash) a note by ID
export const deleteNote = async (req, res, next) => {
  const response = await NoteService.deleteNote(req.params.id, req.user.id);
  res.status(response.code).json(response);
};