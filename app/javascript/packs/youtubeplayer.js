console.log("hi");
let addTrackSection;
let isOpen = false;
let overlay;
let addTrack;

document.addEventListener("DOMContentLoaded", () => {
  addTrackSection = document.querySelector(".add-track-section");
  overlay = document.querySelector(".add-track__overlay");
  addTrack = document.getElementById("addtrack");

  addTrack.addEventListener("click", () => {
    disappear();
  });

  overlay.addEventListener("click", () => {
    disappear();
  });
  let addTrackButton = document.querySelector(".musicbar__link");
  addTrackButton.addEventListener("click", () => {
    if (!isOpen) {
      appear();
    } else {
      disappear();
    }
  });
});

function disappear() {
  addTrackSection.style.transform = "translate(-43%, -50%) scale(0)";
  overlay.style.visibility = "hidden";
  overlay.style.display = "none";
  isOpen = false;
}

function appear() {
  addTrackSection.style.transform = "translate(-43%, -50%) scale(1)";
  overlay.style.visibility = "initial";
  overlay.style.display = "flex";
  isOpen = true;
}
