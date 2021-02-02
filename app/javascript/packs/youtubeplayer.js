console.log("hi")
let addTrackSection
let isOpen = false

document.addEventListener('DOMContentLoaded', () => {
    addTrackSection = document.querySelector('.add-track-section')
    disappear()

    let addTrackButton = document.querySelector('.add-track-button')
    addTrackButton.addEventListener('click', () => {

        if(!isOpen){
            appear()
        } else{
            disappear()
        }
    })

})

function disappear() {
    addTrackSection.style.visibility="hidden"
    isOpen = false
}

function appear() {
    addTrackSection.style.visibility="initial"
    isOpen = true
}