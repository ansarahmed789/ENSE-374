let notesModel = []; // Array to store the notes
let noteIdCounter = 0; // Counter to generate unique ID for each note

const noteColors = ['#ff7eb9', '#ff65a3', '#7afcff', '#feff9c', '#fff740']; // Array of preset colors to assign to each note

// Function to add a new note to the notesModel array
function addNote(title, contents) {
    const newNote = {
        id: noteIdCounter++,
        title: title,
        contents: contents,
        color: noteColors[notesModel.length % noteColors.length] //
    };
    notesModel.push(newNote);
    updateView(); 
}

// Function to update the DOM and display all notes
function updateView() {
    const notesContainer = document.getElementById('notes-container'); 
    notesContainer.innerHTML = ''; 

    // Loop through each note in the notesModel array
    notesModel.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card', 'col-md-3', 'card');
        noteCard.style.backgroundColor = note.color;

        // Define the HTML structure of the note card, including title, content, and burn button
        noteCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${note.title}</h5>  <!-- Display the note title -->
                <p class="card-text">${note.contents}</p> <!-- Display the note contents -->
                <button class="btn btn-danger" onclick="burn(${note.id})">Burn</button> <!-- Button to remove the note -->
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// Event listener for the form submission
document.getElementById('note-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Get values from here
    let noteTitle = document.getElementById('note-title').value; 
    let noteContents = document.getElementById('note-contents').value;

    //  Add the new note and clearing the title and contents section 
    addNote(noteTitle, noteContents);
    document.getElementById('note-title').value = ''; 
    document.getElementById('note-contents').value = ''; 
});

// Function to remove a note based on its ID
function burn(noteId) {
    notesModel = notesModel.filter(note => note.id !== noteId); 
    updateView();
}