let notesModel = [];

const noteColors = ['#ff7eb9', '#ff65a3', '#7afcff', '#feff9c', '#fff740'];

function addNote(title, contents) {
    const newNote = {
        id: Date.now(),  
        title: title,
        contents: contents,
        color: noteColors[notesModel.length % noteColors.length]
    };
    notesModel.push(newNote);
    updateView();
}

function updateView() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; 

    notesModel.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card', 'col-md-3', 'card');
        noteCard.style.backgroundColor = note.color;

        noteCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <p class="card-text">${note.contents}</p>
                <button class="btn btn-danger" onclick="burn(${note.id})">Burn</button>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}

document.getElementById('note-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const noteTitle = document.getElementById('note-title').value;
    const noteContents = document.getElementById('note-contents').value;

    if (noteTitle.trim() && noteContents.trim()) {
        addNote(noteTitle, noteContents);
        document.getElementById('note-title').value = ''; 
        document.getElementById('note-contents').value = ''; 
    }
});

function burn(noteId) {
    notesModel = notesModel.filter(note => note.id !== noteId);
    updateView();
}