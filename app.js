
console.log("HI FROM NOTES APP")
const createElement = document.querySelector(".create")
const colorSilder = document.querySelector(".slider")
const colorSelectors = [
    document.getElementById("R-pane"),
    document.getElementById("G-pane"),
    document.getElementById("B-pane"),
    document.getElementById("C-pane")
]

const uiStateController = new UiStateController(document)

const changeColour = () => {
    uiStateController.dispatchEventControllers('slider-change')
}

const selectColor = (selector) => {
    const eventParams = {
        "current-pallet" : selector,
        "inactive-pallet" : colorSelectors.filter((c_sel) => {
            if (c_sel !== selector) return c_sel;
        })
    }
    uiStateController.dispatchEventControllers('select-color', eventParams)
}

const createNote = () => {
    uiStateController.dispatchEventControllers('create-note')
}

createElement.addEventListener("click", createNote)
colorSilder.addEventListener("change", changeColour)
colorSelectors.forEach((selector) => {selector.addEventListener('click', ()=> {
    selectColor(selector)
})})


// const openCreateWindow = () => {

// }