class StorageAPI{
    static readAllNotes (){
        chrome.storage.local.get().then((items) => {
            console.log(items)
          });
    }

    static saveNote(id, title, content, color, lastModified ){
        const serializedNote = {"title" : title, "content" : content?content:"", "color" : color?color : "#d96c53d9", "lastModified" : lastModified}
        console.log(serializedNote)
        console.log(id)
        chrome.storage.local.set({id : serializedNote})

    }
}