export function displayNotes(notes, currentUser) {
    const noteContainer = $(".accordion");
    noteContainer.empty(); // Clear container for fresh rendering

    // Loop through each note to extract relevant details
    notes.forEach(note => {
        const { id: noteId, creator: noteAuthor, text: noteText, upvotes, downvotes } = note;
        const rating = upvotes.length - downvotes.length;

        // Check if the note belongs to the logged-in user
        if (noteAuthor === currentUser) {
            // Display user’s own note without upvote/downvote buttons
            noteContainer.prepend(`
                <div class="input-group" data-note-id="${noteId}">
                    <input type="text" class="form-control" placeholder="${noteText}" disabled aria-label="Your Note">
                    <span class="input-group-text">${rating}</span>
                </div>
            `);
        } else {
            // Display other users' notes with upvote/downvote options
            noteContainer.prepend(`
                <div class="input-group" data-note-id="${noteId}">
                    <input type="text" class="form-control" placeholder="${noteText}" disabled aria-label="Note">

                    <!-- Upvote Button -->
                    <button type="button" class="btn ${upvotes.includes(currentUser) ? 'btn-success' : 'btn-outline-success'} upvote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v14.5a.5.5 0 0 1-1 0V1.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </button>

                    <!-- Downvote Button -->
                    <button type="button" class="btn ${downvotes.includes(currentUser) ? 'btn-danger' : 'btn-outline-danger'} downvote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 1-.5-.5V1.5a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
                        </svg>
                    </button>

                    ${upvotes.includes(currentUser) || downvotes.includes(currentUser) ? `<span class="input-group-text">${rating}</span>` : ''}
                </div>
            `);
        }
    });
}
