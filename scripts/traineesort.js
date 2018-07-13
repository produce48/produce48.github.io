// File holds lots of sorting logic for the filter checkboxes

// always initially sort by id
var activeCompares = [idCompare]
var showEliminated = false;
var showTop12 = false;

// This a compare by id on the trainees and guarantees stability of the sort
function idCompare(trainee1, trainee2) {
  if (trainee1.id < trainee2.id) {
    return -1;
  }
  else if (trainee1.id > trainee2.id) {
    return 1;
  }
  return 0;
}

// compare by whether trainee is eliminated and put eliminated at bottom
function eliminatedAtBottomCompare(trainee1, trainee2) {
  if (trainee1.eliminated && !trainee2.eliminated) {
    return 1;
  }
  else if (!trainee1.eliminated && trainee2.eliminated) {
    return -1;
  }
  return 0;
}

// uses all compares in the activeCompare to return a final -1 or 1 or 0
function combinedCompare(trainee1, trainee2) {
  let finalCompare = 0;
  for (let compareFunc of activeCompares) {
    let result = compareFunc(trainee1, trainee2);
    if (result != 0) {
      finalCompare = result;
    }
  }
  return finalCompare;
}

// returns a list of sorted trainees based on the active compares
function sortedTrainees(trainees) {
  let sortedTrainees = trainees.slice();
  sortedTrainees.sort(combinedCompare);
  return sortedTrainees;
}

// Event handler for when user checks show eliminated
function showEliminatedClick(event) {
  console.log(event);
  let checkbox = event.target;
  if (checkbox.checked) {
    activeCompares.push(eliminatedAtBottomCompare);
    showEliminated = true;
  } else {
    // remove the show eliminated compare
    let i = activeCompares.indexOf(eliminatedAtBottomCompare)
    if (i >= 0) activeCompares.splice(i, 1);
    showEliminated = false;
  }
  sortRenderTable();
  rerenderRanking();
}

function showTop12Click(event) {
  let checkbox = event.target;
  if (checkbox.checked) {
    showTop12 = true;
  } else {
    showTop12 = false;
  }
  rerenderTable();
  rerenderRanking();
}

// sort and rerender the table after applying sorting changes
function sortRenderTable() {
  filteredTrainees = sortedTrainees(filteredTrainees);
  rerenderTable();
}
