/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import Note from '../models/note.model';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

// Create a new note
export const createNote = async (noteData) => {
    try {
        const note = await Note.create(noteData);
        return { code: 201, message: 'Note created', data: note };
    } catch (error) {
        return { code: 500, message: 'Error creating note', error: error.message };
    }
};

// Get all notes for a user
export const getNotes = async (userId) => {
    try {
        const notes = await Note.find({ userId, trash: false });

        if (!notes.length) {
            return { code: 404, message: 'No notes found' };
        }

        return { code: 200, message: 'Notes fetched successfully', data: notes };
    } catch (error) {
        return { code: 500, message: 'Error fetching notes', error: error.message };
    }
};

// Get a single note by ID
export const getNoteById = async (noteId, userId) => {
    try {
        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return { code: 404, message: 'Note not found' };
        }

        return { code: 200, message: 'Note fetched successfully', data: note };
    } catch (error) {
        return { code: 500, message: 'Error fetching note', error: error.message };
    }
};

// Update a note by ID
export const updateNoteById = async (noteId, userId, updateData) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId }, // Ensure user can only update their own notes
            updateData,
            { new: true } // Return updated note
        );

        if (!note) {
            return { code: 404, message: 'Note not found or unauthorized' };
        }

        return { code: 200, message: 'Note updated successfully', data: note };
    } catch (error) {
        return { code: 500, message: 'Error updating note', error: error.message };
    }
};

// delete
// Soft delete (toggle trash) a note by ID
export const deleteNote = async (noteId, userId) => {
    try {
        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return { code: 404, message: 'Note not found' };
        }

        // Toggle trash value instead of deleting
        note.trash = !note.trash;
        await note.save();

        return {
            code: 200,
            message: note.trash ? 'Note moved to trash' : 'Note restored',
            data: note
        };
    } catch (error) {
        return { code: 500, message: 'Error deleting/restoring note', error: error.message };
    }
};