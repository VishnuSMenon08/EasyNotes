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
        console.log(this.lastModified)
    }

    _getUTCNow(){
        return new Date(Date.now()).toUTCString()
    }

    _convertToLocalTz(utcTimeStr){
        return Date(utcTimeStr)
    }

    save(){
        const validators = new Map([
            ["title", this._validateTitle.bind(this)],
        ])
        for (let [field, validator] of validators){
            if (!validator()){
                throw new DataValidationError(field, "validation failed")
            }
        }
    }

    _validateTitle(){
        return this.title && this.title.length != 0?true:false
    }
}