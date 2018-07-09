// Takes in name of csv and populates necessary data in table
function readFromCSV(path) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", path, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        let allText = rawFile.responseText;
        let out = CSV.parse(allText);
        let trainees = convertCSVArrayToTraineeData(out);
        populateTable(trainees);
      }
    }
  };
  rawFile.send(null);
}

// Takes in an array of trainees and converts it to js objects
// Follows this schema:
/*
trainee: {
  id: ... // position in csv used for simple recognition
  name_romanized: ...
  name_hangul: ...
  name_japanese: ...
  company: ...
  grade: ...
  image: ...
  selected: ... // whether user selected them
}
*/
function convertCSVArrayToTraineeData(csvArrays) {
  trainees = csvArrays.map(function(traineeArray, index) {
    trainee = {};
    trainee.id = index;
    trainee.name_romanized = traineeArray[0];
    if (traineeArray[2] === "-") {
      // trainee only has hangul
      trainee.name_hangul = traineeArray[1];
    } else {
      trainee.name_japanese = traineeArray[1];
      trainee.name_hangul = traineeArray[2];
    }
    trainee.company = traineeArray[3];
    trainee.grade = traineeArray[4];
    trainee.image =
      trainee.name_romanized.replace(" ", "").replace("-", "") + ".jpg";
    console.log(trainee);
    return trainee;
  });
  return trainees;
}

// Constructor for a blank trainee
function newTrainee() {
  return {
    id: -1, // -1 denotes a blank trainee spot
    name_romanized: '&#8203;',
    company: '&#8203;',
    grade: 'no',
    image: 'emptyrank.png',
  };
}

// Constructor for a blank ranking list
function newRanking() {
  // holds the ordered list of rankings that the user selects
  let ranking = new Array(12);
  for (let i = 0; i < ranking.length; i++) {
    ranking[i] = newTrainee();
  }
  return ranking;
}

// rerender method for table (search box)
// TODO: this site might be slow to rerender because it clears + adds everything each time
function rerenderTable() {
  clearTable();
  populateTable(trainees);
  // populateRanking();
}

// rerender method for ranking
function rerenderRanking() {
  clearRanking();
  populateRanking();
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Clears out the table
function clearTable() {
  let table = document.getElementById("table__entry-container");
  // while (table.firstChild) {
  //   table.removeChild(table.firstChild);
  // }
  removeAllChildren(table);
}

// Clears out the ranking
function clearRanking() {
  // Currently just duplicates first ranking entry
  let ranking_chart = document.getElementById("ranking__pyramid");
  let rankRows = Array.from(ranking_chart.children).slice(1); // remove the title element
  // let rankEntry = rankRows[0].children[0];
  for (let i = 0; i < rowNums.length; i++) {
    let rankRow = rankRows[i];
    for (let j = 0; j < rowNums[i]; j++) {
      removeAllChildren(rankRow);
      // while (rankRow.firstChild) {
      //   rankRow.removeChild(rankRow.firstChild);
      // }
    }
  }
}

// If the user has saved a ranking via id then recover it here
// returns: List of ranked trainees
function getRanking() {}

// Uses populated local data structure from readFromCSV to populate table
function populateTable(trainees) {
  // Currently just duplicates the first table entry
  let table = document.getElementById("table__entry-container");
  exampleEntry = table.children[0];
  for (let i = 0; i < trainees.length; i++) {
    // generate and insert the html for a new trainee table entry
    table.insertAdjacentHTML("beforeend", populateTableEntry(trainees[i]));
    // add the click listener to the just inserted element
    let insertedEntry = table.lastChild;
    insertedEntry.addEventListener("click", function(event) {
      tableClicked(trainees[i]);
    });
  }
}

function populateTableEntry(trainee) {
  const tableEntry = `
  <div class="table__entry">
    <div class="table__entry-icon">
      <img class="table__entry-img" src="assets/trainees/${trainee.image}" />
      <div class="table__entry-icon-border ${trainee.grade.toLowerCase()}-rank-border"></div>
      ${
        trainee.selected
          ? '<img class="table__entry-check" src="assets/check.png"/>'
          : ""
      }
    </div>
    <div class="table__entry-text">
      <span class="name"><strong>${trainee.name_romanized}</strong></span>
      <span class="hangul">(${trainee.name_hangul})</span>
      <span class="company">${trainee.company.toUpperCase()}</span>
    </div>
  </div>`;
  return tableEntry;
}

// Uses populated local data structure from getRanking to populate ranking
function populateRanking() {
  // Currently just duplicates first ranking entry
  let ranking_chart = document.getElementById("ranking__pyramid");
  let rankRows = Array.from(ranking_chart.children).slice(1); // remove the title element
  // let rankEntry = rankRows[0].children[0];
  let currRank = 1;
  for (let i = 0; i < rowNums.length; i++) {
    let rankRow = rankRows[i];
    for (let j = 0; j < rowNums[i]; j++) {
      rankRow.insertAdjacentHTML("beforeend", populateRankingEntry(ranking[currRank - 1], currRank))
      // clone and change the ranking number
      // let newEntry = rankEntry.cloneNode(true);
      // let badge = newEntry.getElementsByClassName(
      //   "ranking__entry-icon-badge"
      // )[0];
      // badge.textContent = currRank;
      // rankRow.appendChild(newEntry);
      currRank++;
    }
  }
}

const abbreviatedCompanies = {
  "RAINBOW BRIDGE WORLD": "RBW",
  "BLOCKBERRY CREATIVE": "BBC",
  "INDIVIDUAL TRAINEE": "INDIVIDUAL",
}

function populateRankingEntry(trainee, currRank) {
  let modifiedCompany = trainee.company.toUpperCase();
  modifiedCompany = modifiedCompany.replace("ENTERTAINMENT", "ENT.");
  if (abbreviatedCompanies[modifiedCompany]) {
    modifiedCompany = abbreviatedCompanies[modifiedCompany];
  }
  const rankingEntry = `
  <div class="ranking__entry">
    <div class="ranking__entry-icon">
      <img class="ranking__entry-img" src="assets/trainees/${trainee.image}" />
      <div class="ranking__entry-icon-border ${trainee.grade.toLowerCase()}-rank-border"></div>
      <div class="ranking__entry-icon-badge bg-${trainee.grade.toLowerCase()}">${currRank}</div>
    </div>
    <div class="ranking__row-text">
      <div class="name"><strong>${trainee.name_romanized}</strong></div>
      <div class="company">${modifiedCompany}</div>
    </div>
  </div>`;
  return rankingEntry;
}

// Event handlers for table
function tableClicked(trainee) {
  // Set the trainee as selected
  if (trainee.selected) {
    trainee.selected = !trainee.selected;
    // Remove the trainee from the ranking
    removeRankedTrainee(trainee);
  } else {
    trainee.selected = true;
    // Add the trainee to the ranking
    addRankedTrainee(trainee);
  }
  console.log(trainee);
  rerenderTable();
  rerenderRanking();
}

// Finds the first blank spot for
function addRankedTrainee(trainee) {
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].id === -1) { // if spot is blank denoted by -1 id
      ranking[i] = trainee;
      return;
    }
  }
}

function removeRankedTrainee(trainee) {
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].id === trainee.id) { // if trainee's match
      ranking[i] = newTrainee();
      return;
    }
  }
}


// holds the list of all trainees
var trainees = [];
// holds the ordered list of rankings that the user selects
var ranking = newRanking();
const rowNums = [1, 2, 4, 5];
window.addEventListener("load", function () {
  populateRanking();
  readFromCSV("./trainee_info.csv");
});
