// This file handles all code relating to drag and drop behavior
// Additionally: talks to main.js just to swap around rankings and stuff
const draggedOverClass = "dragged-over";
const rankIndex = "rankIndex";

function createDragStartListener(tempRank) {
  return function (event) {
    event.dataTransfer.setData(rankIndex, tempRank)
  }
}

function createDragEnterListener() {
  return function (event) {
    let elem = event.target;
    addClass(elem, draggedOverClass);
  }
}

function createDragLeaveListener() {
  return function (event) {
    let elem = event.target;
    removeClass(elem, draggedOverClass);
  }
}

function createDragOverListener() {
  return function (event) {
    event.preventDefault();
  }
}

function createDropListener() {
  return function (event) {
    event.preventDefault();
    let elem = event.target;
    // get the two trainee indices
    draggedTraineeIndex = event.dataTransfer.getData(rankIndex);
    droppedTraineeIndex = elem.getAttribute("data-rankid");
    // swap them
    swapTrainees(draggedTraineeIndex, droppedTraineeIndex);
    // removeClass(elem, draggedOverClass);
  }
}

// Utility methods taken from https://jaketrent.com/post/addremove-classes-raw-javascript/
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}