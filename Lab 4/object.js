function createNote(id, creator, text) {
    return{
        id: id,
        creator: creator,
        text: text,
        upvotes: [],
        downvotes: [],
        time: new Date()

    };
}

let note1 = createNote(1, User1, "This is the first sticky note!");
let note2 = createNote(1, User2, "Here’s a second note with more content!");
let note3 = createNote(1, User3, "Final note for testing purposes.");

note1.upvotes.push("User1");
note2.downvotes.push("User2");
note3.upvotes.push("User1" , "User2");

console.log(note1, note2, note3);

