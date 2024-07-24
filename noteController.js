class UiStateController{
    static EVENTS = {
        sliderChange : "slider-change",
        selectColor : "select-color",
        createNote : "create-note",
        colorUpdate : "color-update",
        boldText : "bold-text",
        italicText : "italic-text",
        underlineText : "underline-text"
    }
    constructor(doc){
        this.document = doc
        this.controllers = this.initControllers(this.document)
        this.eventControllerMap = this.mapEventControllers()
    }

    initControllers() {
        return {
            "slideController" : new SliderController(this.document),
            "noteController" : new NoteController(this.document),
            "buttonController" : new ButtonController(this.document),
            "editController" : new EditController(this.document)
        };
    }
    mapEventControllers(){
        const eventControllerMap = new Map([
            [UiStateController.EVENTS.sliderChange, [this.controllers["slideController"]]],
            [UiStateController.EVENTS.selectColor, [this.controllers["noteController"]]],
            [UiStateController.EVENTS.colorUpdate, [this.controllers["noteController"]]],
            [UiStateController.EVENTS.createNote, [this.controllers["noteController"], this.controllers["buttonController"]]],
            [UiStateController.EVENTS.boldText, [this.controllers["editController"]]],
            [UiStateController.EVENTS.italicText, [this.controllers["editController"]]],
            [UiStateController.EVENTS.underlineText, [this.controllers["editController"]]],

        ])
        return eventControllerMap
    }
    dispatchEventControllers(domEvent, ...eventParams){
        for( var controller of this.eventControllerMap.get(domEvent) ){
            controller.dispatch(domEvent, ...eventParams)
        }
    }

}

class SliderController{
    static sliderEvents = {
        sliderChange : "slider-change"
    }
    constructor(doc){
        this.colorSilder = doc.querySelector(".slider")
        this.custColorPane = doc.getElementById('C-pane')
        this.eventFunctionMap = this.mapEventFunction()
    }

    mapEventFunction(){
        const eventFunctionMap = new Map([
            [SliderController.sliderEvents.sliderChange, this.dispatchSliderChange.bind(this)]
        ])
        return eventFunctionMap
    }

    dispatchSliderChange(){
        this.custColorPane.style.backgroundColor  = hexConverter(parseInt(this.colorSilder.value))

    }
    
    dispatch(domEvent, ...eventParams){
        return this.eventFunctionMap.get(domEvent)(...eventParams)
    }

}

class NoteController {
    static noteControllerEvents = {
        createNote : "create-note",
        selectColor : "select-color",
        colorUpdate : "color-update"
    }
    constructor(doc){
        this.notesBoard = doc.querySelector(".notes-board");
        this.noteWindow = doc.querySelector(".add-note-container");
        this.noteWindowTitle = doc.querySelector(".notes-title");
        this.noteWindowArea = doc.querySelector(".notes-area");
        this.currentNote = null;
        this.initColorSelector(doc)
        this.eventFunctionMap = this.mapEventFunction();
    }

    initColorSelector(doc){

        const enforceStyle = (docElement, style) => {
            const currentStyle = docElement.getAttribute("style")
            const updatedStyle = currentStyle?currentStyle+ " "+ style: style
            docElement.setAttribute("style", updatedStyle)
            return docElement

        }
        this.custColorPane = enforceStyle(doc.getElementById('C-pane'), "background-color: #b6c239d9;");
        this.redColorPane = enforceStyle(doc.getElementById('R-pane'), "background-color: #d96c53d9;");
        this.greenColorPane = enforceStyle(doc.getElementById('G-pane'),"background-color: #6ccd6cd9;");
        this.blueColorPane = enforceStyle(doc.getElementById('B-pane'), "background-color: #3e83ddd9;");

        this.selectedPane = this.redColorPane
    }

    mapEventFunction(){
        const eventFunctionMap = new Map([
            [NoteController.noteControllerEvents.selectColor, this.dispatchColorChange.bind(this)],
            [NoteController.noteControllerEvents.createNote, this.dispatchCreateNote.bind(this)],
            [NoteController.noteControllerEvents.colorUpdate, this.dispatchColorPicker.bind(this)],
        ])
        return eventFunctionMap
    }

    dispatchCreateNote(){
        this.noteWindow.style.backgroundColor = this.selectedPane.style.backgroundColor
        this.currentNote = new NotesDTO(title=null, content=null, color=this.noteWindow.style.backgroundColor)
        this.toggleBoard(this.noteWindow, this.notesBoard)

    }

    toggleBoard(activeBoard, inactiveBoard){
        activeBoard.style.visibility = "visible";
        inactiveBoard.style.visibility = "hidden";
    }

    dispatchColorChange(eventParams){
        const currentPalet = eventParams['current-pallet'];
        const inactivePallet = eventParams['inactive-pallet'];
        currentPalet.style.border = "2px outset";
        this.selectedPane = currentPalet
        inactivePallet.forEach((item) => {
            item.style.border = null;
        })
    }

    dispatchColorPicker(){
        this.noteWindow.style.backgroundColor = this.selectedPane.style.backgroundColor
    }
    
    dispatch(domEvent, ...eventParams){
        return this.eventFunctionMap.get(domEvent)(...eventParams)
    }
}

class ButtonController{
    static buttonControlEvents = {
        createNote : "create-note",
    }
    constructor(doc){
        this.createButton =  doc.querySelector(".create")
        this.colorPickerButton = doc.querySelector(".change-color")
        this.eventFunctionMap = this.mapEventFunction()
        
    }

    mapEventFunction(){
        const eventFunctionMap = new Map([
            [ButtonController.buttonControlEvents.createNote, this.dispatchCreateNote.bind(this)],
        ])
        return eventFunctionMap
    }

    dispatchCreateNote(){
        this.colorPickerButton.style.visibility = "visible";
        this.createButton.style.visibility = "hidden";
    }

    dispatch(domEvent, ...eventParams){
        return this.eventFunctionMap.get(domEvent)(...eventParams)
    }
}

class EditController {
    static editControlEvents = {
        boldText : "bold-text",
        italicText : "italic-text",
        underlineText : "underline-text"
    }
    constructor(doc){
        this.document = doc
        this.btnBold = doc.getElementById("btn-bold")
        this.btnItalics = doc.getElementById("btn-italics")
        this.btnUnderline = doc.getElementById("btn-underline")
        this.noteWindowArea = doc.querySelector(".notes-area");
        this.eventFunctionMap = this.mapEventFunction()
    }

    mapEventFunction(){
        const eventFunctionMap = new Map([
            [EditController.editControlEvents.boldText, this.dispatchTextFormatter.bind(this)],
            [EditController.editControlEvents.italicText, this.dispatchTextFormatter.bind(this)],
            [EditController.editControlEvents.underlineText, this.dispatchTextFormatter.bind(this)]
        ])
        return eventFunctionMap
    }
    dispatchTextFormatter(eventParams){
        const domEvent = eventParams["dom-event"]
        switch(domEvent){
            case EditController.editControlEvents.boldText:
                this._applyBold()
                break
            case EditController.editControlEvents.italicText:
                this._applyItalics()
                break
            case EditController.editControlEvents.underlineText:
                this._applyUL()
                break
            default:
                break
        }
    }

    _applyBold(){
        this.toggleActiveClass(this.btnBold)
        this.noteWindowArea.focus()
        this.document.execCommand("bold", false, null)
    }
    _applyItalics(){
        this.toggleActiveClass(this.btnItalics)
        this.noteWindowArea.focus()
        this.document.execCommand("italic", false, null)
    }
    _applyUL(){
        this.toggleActiveClass(this.btnUnderline)
        this.noteWindowArea.focus()
        this.document.execCommand("underline", false, null)
    }

    toggleActiveClass(btn){
        btn.classList.contains("btn-active")?btn.classList.remove("btn-active"):btn.classList.add("btn-active")
    }

    dispatch(domEvent, ...eventParams){
        return this.eventFunctionMap.get(domEvent)(...eventParams)
    }
}

class NoteTileFactory {
    constructor (){}
    createNote(){
        return new NoteTile
    }
}
class NoteWindowFactory {
    constructor (){}
    createNote(){
        return new NoteWindow()
    }
}

class NoteWindow {
    constructor(){

    }
}