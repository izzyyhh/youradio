console.log("hi")
let addTrackSection
let isOpen = false
let overlay
let addTrack

document.addEventListener('DOMContentLoaded', () => {

    

    addTrackSection = document.querySelector('.add-track-section')
    overlay = document.querySelector('.add-track__overlay')
    addTrack = document.getElementById('addtrack')
    disappear()

    addTrack.addEventListener('click', () => {
        disappear()
    })


    overlay.addEventListener('click', () => {
        disappear()
    })
    let addTrackButton = document.querySelector('.musicbar__link')
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
    overlay.style.visibility="hidden"
    isOpen = false
}

function appear() {
    addTrackSection.style.visibility="initial"
    overlay.style.visibility="initial"
    isOpen = true
}