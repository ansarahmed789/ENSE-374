import { notesList, createNote, applyUpvote, applyDownvote } from "../Model/model.js";
import { displayNotes } from "../View/view.js";

// Initializes and displays the notes for the current user
export function initializeNotes(user) {
    displayNotes(notesList, user);  // Renders notes to the view
}

// Adds a new note to the list, then refreshes the display
export function addNewNote(creator, text) {
    createNote(creator, text);  // Adds the note to the model
    displayNotes(notesList, creator);  // Updates the view with the new note
}

// Handles an upvote on a specified note and refreshes the display
export function handleUpvote(noteId, user) {
    applyUpvote(noteId, user);  // Applies upvote to the note in the model
    displayNotes(notesList, user);  // Refreshes the view to reflect the change
}

// Handles a downvote on a specified note and refreshes the display
export function handleDownvote(noteId, user) {
    applyDownvote(noteId, user);  // Applies downvote to the note in the model
    displayNotes(notesList, user);  // Refreshes the view to reflect the change
}
