let notes = [
    { id: 1, content: "I like apples", votes: 0, user: "User A", votesByUser: {} },
    { id: 2, content: "I hate oranges", votes: 0, user: "User B", votesByUser: {} },
    { id: 3, content: "I like bananas", votes: 0, user: "User C", votesByUser: {}}
];

// Default current user
let currentUser = "User A";

// This function handles switching users 
function switchUser(user) {
    currentUser = user; 
    document.querySelector(".accordion-button").innerHTML = `Logged in as ${user}`; 
    displayNotes(); 
}

// Add new note function
function addNewNote() {
    const noteContent = document.getElementById("noteInput").value;
    
    if (noteContent.trim()) {
        notes.push({
            id: notes.length + 1,
            content: noteContent,
            votes: 0,
            user: currentUser,
            votesByUser: {}
        });

        // Clear the input field 
        document.getElementById("noteInput").value = "";
        displayNotes();
    }
}

// Display notes based on the current user
function displayNotes() {
    const noteList = document.getElementById("noteList");
    noteList.innerHTML = ""; 

    notes.forEach((note, index) => {
        const listItem = document.createElement("div");
        listItem.className = "input-group mb-3";

        // Note content display
        listItem.innerHTML = `
            <input type="text" class="form-control" value="${note.content}" disabled>
        `;

        // Vote buttons container
        const voteContainer = document.createElement("span");
        voteContainer.className = "input-group-text";

        if (note.user !== currentUser) {
            voteContainer.innerHTML = `
                <button type="button" class="btn btn-success ${note.votesByUser[currentUser] === 'upvote' ? 'active' : ''}" onclick="vote(${index}, 'upvote')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-danger ${note.votesByUser[currentUser] === 'downvote' ? 'active' : ''}" onclick="vote(${index}, 'downvote')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V8.5z"/>
                    </svg>
                </button>
                <button class="btn">${note.votes}</button>
            `;
        } else {
            voteContainer.innerHTML = `<button class="btn">${note.votes}</button>`;
        }

        listItem.appendChild(voteContainer); 
        noteList.appendChild(listItem);
    });
}

// This function handles the Voting logic
function vote(noteIndex, voteType) {
    const note = notes[noteIndex];

    // Get the current user's vote on this note
    const currentVote = note.votesByUser[currentUser];

    if (currentVote === voteType) {
        // Remove the user's vote
        delete note.votesByUser[currentUser];

        // Adjust the vote count accordingly
        if (voteType === 'upvote') {
            note.votes--; 
        } else if (voteType === 'downvote') {
            note.votes++; 
        }
    } else {
        if (currentVote === 'upvote') {
            note.votes--; 
        } else if (currentVote === 'downvote') {
            note.votes++; 
        }

        // Apply the new vote
        note.votesByUser[currentUser] = voteType;

        // Adjust the vote count based on the new vote
        if (voteType === 'upvote') {
            note.votes++; 
        } else if (voteType === 'downvote') {
            note.votes--; 
        }
    }

    displayNotes();
}

document.querySelectorAll("#dropdownMenuButton1 + .dropdown-menu .dropdown-item").forEach(item => {
    item.addEventListener('click', function () {
        switchUser(this.textContent);
    });
});

document.getElementById("addNoteBtn").addEventListener('click', addNewNote);

displayNotes();
