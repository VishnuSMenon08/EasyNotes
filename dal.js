class StorageAPI{
    static readAllNotes (){
        const allItems = chrome.storage.local.get()
        return allItems;
    }

    static clearAllNotes(){
        chrome.storage.local.clear(() => {
            console.log('Everything was removed');
        });
    }

    static saveNote(id, title, content, color, lastModified ){
        const serializedNote = {"title" : title, "content" : content?content:"", "color" : color?color : "#d96c53d9", "lastModified" : lastModified}
        chrome.storage.local.set({[id] : serializedNote}, () => {
        })

    }
}