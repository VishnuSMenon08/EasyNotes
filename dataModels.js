class DataValidationError extends Error{
    constructor(field, msg){
        super(msg)
        this.field = field;

    }
}

class Note{
    constructor(id=null, title=null, content=null, color=null, lastModified=null){
        this.title = title;
        this.content = content;
        this.color = color;
        this.lastModified = lastModified?lastModified:this._getUTCNow();
        this.id = id?id:this._generateUID();
    }

    _getUTCNow(){
        return new Date(Date.now()).toUTCString()
    }

    _convertToLocalTz(utcTimeStr){
        return Date(utcTimeStr)
    }

    _generateUID(){
        const timeStamp = Date.now()
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var uid = "";
        while(uid.length < 5){
            uid += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        uid = uid + "-" + timeStamp.toString()
        return uid
    }

    save(){
        const validators = new Map([
            ["title", this._validateTitle.bind(this)],
            ["content", this._validateContent.bind(this)],
        ])
        for (let [field, validator] of validators){
            if (!validator()){
                throw new DataValidationError(field, "validation failed")
            }
        }
        // StorageAPI.clearAllNotes()
        StorageAPI.saveNote(this.id, this.title, this.content, this.color, this.lastModified)
    }
    
    static readAllNotes(){
        const allNotesArr = StorageAPI.readAllNotes().then((allNotes) => {
            var allNotesArr = [];
            for(const note in allNotes){
                allNotesArr.push(new Note(
                    note, 
                    allNotes[note]["title"],
                    allNotes[note]["content"],
                    allNotes[note]["color"],
                    allNotes[note]["lastModified"],
                ))
            }
            allNotesArr.sort(function(a,b){
                return new Date(b.lastModified) - new Date(a.lastModified);
              });
            return allNotesArr
        })
        return allNotesArr
    }

    _validateTitle(){
        var validateFlag = this.title && this.title.length != 0?true:false
        validateFlag = validateFlag && this.title.length < 30?true:false
        return validateFlag
    }

    _validateContent(){
        if(!this.content){
            return true;
        }else{
            console.log(this.content)
            return this.content.length > 100?false: true
        }
    }
}

class NoteTile{
    constructor(noteBoard, note){
        this.noteBoard = noteBoard;
        this.note = note;
    }

    _trimDate(dateStr){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(dateStr)
        return date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()    
    }

    _trimTitle(title){
        return title.length > 15?title.slice(0, 13).trim() + "..": title
    }

    createTile(doc){
        var noteTile = doc.createElement("div")
        noteTile.classList.add("note-card")
        noteTile.classList.add("left")
        noteTile.id = this.note.id

        var noteTileInner = doc.createElement("div")
        noteTileInner.classList.add("note-card-controller")

        var dateElement = doc.createElement("p")
        dateElement.classList.add("title-date")
        dateElement.classList.add("left")
        dateElement.innerText = this._trimDate(this.note.lastModified)

        var bookmarkIcnContainer = doc.createElement("div")
        bookmarkIcnContainer.classList.add("icon-container")
        bookmarkIcnContainer.classList.add("right")
        bookmarkIcnContainer.title = "upcoming feature pin"

        var bookmarkIcn = doc.createElement("img")
        bookmarkIcn.src = "./icons/bookmark.svg"
        bookmarkIcn.alt = "pin"

        var clearDiv = doc.createElement("div")
        clearDiv.classList.add("clear")

        var noteTitle = doc.createElement("div")
        noteTitle.classList.add("note-title")
        noteTitle.innerText = this._trimTitle(this.note.title)

        var noteContent = doc.createElement("div")
        noteContent.classList.add("note")
        noteContent.innerHTML = this.note.content

        var noteFooter = doc.createElement("div")
        noteFooter.classList.add("note-footer")

        var editIcn = doc.createElement("img")
        editIcn.classList.add("left")
        editIcn.src = "./icons/edit.png";
        editIcn.alt = "edit"
        editIcn.title = "Edit"

        var deleteIcn = doc.createElement("img")
        deleteIcn.classList.add("right")
        deleteIcn.src = "./icons/delete.png"
        deleteIcn.alt = "delete"
        deleteIcn.title = "Delete"

        return this._formatNoteTile(
            noteTile, 
            noteTileInner, 
            dateElement, 
            bookmarkIcnContainer, 
            bookmarkIcn, 
            clearDiv,
            noteTitle,
            noteContent,
            noteFooter,
            editIcn,
            deleteIcn
        );
    }

    _formatNoteTile(noteTile, 
        noteTileInner, 
        dateElement, 
        bookmarkIcnContainer, 
        bookmarkIcn, 
        clearDiv,
        noteTitle,
        noteContent,
        noteFooter,
        editIcn,
        deleteIcn

    ){
        bookmarkIcnContainer.appendChild(bookmarkIcn)
        noteTileInner.appendChild(dateElement)
        noteTileInner.appendChild(bookmarkIcnContainer)
        noteTileInner.appendChild(clearDiv)
        noteFooter.appendChild(editIcn)
        noteFooter.appendChild(deleteIcn)

        noteTile.appendChild(noteTileInner)
        noteTile.appendChild(noteTitle)
        noteTile.appendChild(noteContent)
        noteTile.appendChild(noteFooter)
        noteTile.style.backgroundColor = this.note.color
        return noteTile
    }
}