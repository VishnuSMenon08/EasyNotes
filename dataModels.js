class DataValidationError extends Error{
    constructor(field, msg){
        super(msg)
        this.field = field;

    }
}

class Note{
    constructor(title=null, content=null, color=null){
        this.title = title;
        this.content = content;
        this.color = color;
        this.lastModified = this._getUTCNow();
        this.id = this._generateUID();
        console.log(this.lastModified)
        console.log(this.id)
        // this.storageAPI = new StorageAPI()
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
        ])
        for (let [field, validator] of validators){
            if (!validator()){
                throw new DataValidationError(field, "validation failed")
            }
        
        StorageAPI.saveNote({id : this.id, title : this.title, content : this.content, color : this.color, lastModified : this.lastModified})
        StorageAPI.readAllNotes()
        }
    }

    _validateTitle(){
        console.log(this)
        return this.title && this.title.length != 0?true:false
    }
}