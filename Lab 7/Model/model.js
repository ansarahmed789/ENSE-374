// An empty array to hold all notes as objects
export let notesList = [];

// createNote adds a new note to the list with given creator and content
export function createNote(creator, content) {
  const noteEntry = {
    id: notesList.length + 1, // Creates a simple ID based on the current length of the list
    creator: creator,           
    content: content,        
    upvotes: [],              
    downvotes: []             
  };
  notesList.push(noteEntry);  
}

// applyUpvote lets a user upvote a note, or remove their upvote if they've already added one
export function applyUpvote(noteId, user) {
  notesList.forEach(note => {  
    if (note.id === noteId) {  // Find the note that matches the given ID
      // If the user hasn’t upvoted yet, add them to upvotes and remove from downvotes if needed
      if (!note.upvotes.includes(user)) {
        note.upvotes.push(user);  // Add the user to upvotes
        note.downvotes = note.downvotes.filter(voter => voter !== user); // Remove from downvotes if present
      } else {
        // If the user already upvoted, remove their upvote
        note.upvotes = note.upvotes.filter(voter => voter !== user);
      }
    }
  });
}

// applyDownvote allows a user to downvote a note or remove their downvote if they've already done so
export function applyDownvote(noteId, user) {
  notesList.forEach(note => {  
    if (note.id === noteId) {  
      // If the user hasn’t downvoted yet, add them to downvotes and remove from upvotes if needed
      if (!note.downvotes.includes(user)) {
        note.downvotes.push(user);  // Add the user to downvotes
        note.upvotes = note.upvotes.filter(voter => voter !== user); // Remove from upvotes if present
      } else {
        // If the user already downvoted, remove their downvote (toggle off)
        note.downvotes = note.downvotes.filter(voter => voter !== user);
      }
    }
  });
}