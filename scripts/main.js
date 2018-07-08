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
  trainees = csvArrays.map(function(traineeArray) {
    trainee = {};
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

// If the user has saved a ranking via id then recover it here
// returns: List of ranked trainees
function getRanking() {}

// Uses populated local data structure from readFromCSV to populate table
function populateTable(trainees) {
  // Currently just duplicates the first table entry
  let table = document.getElementById("table__entry-container");
  exampleEntry = table.children[0];
  for (let i = 0; i < trainees.length; i++) {
    // table.appendChild(exampleEntry.cloneNode(true));
    table.insertAdjacentHTML('beforeend', populateTableEntry(trainees[i]));
  }
}

function populateTableEntry(trainee) {
  const tableEntry = `
  <div class="table__entry">
    <div class="table__entry-icon">
      <img class="table__entry-img" src="assets/trainees/${ trainee.image }" />
      <div class="table__entry-icon-border ${ trainee.grade.toLowerCase() }-rank-border"></div>
    </div>
    <div class="table__entry-text">
      <span class="name"><strong>${ trainee.name_romanized }</strong></span>
      <span class="hangul">(${ trainee.name_hangul })</span>
      <span class="company">${ trainee.company.toUpperCase() }</span>
    </div>
  </div>`;
  return tableEntry;
}

// Uses populated local data structure from getRanking to populate ranking
function populateRanking() {
  // Currently just duplicates first ranking entry
  let rowNums = [1, 2, 4, 5];
  let ranking = document.getElementById("ranking__pyramid");
  let rankRows = Array.from(ranking.children).slice(1); // remove the title element
  let rankEntry = rankRows[0].children[0];
  let currRank = 2;
  for (let i = 1; i < rowNums.length; i++) {
    let rankRow = rankRows[i];
    for (let j = 0; j < rowNums[i]; j++) {
      // clone and change the ranking number
      let newEntry = rankEntry.cloneNode(true);
      let badge = newEntry.getElementsByClassName(
        "ranking__entry-icon-badge"
      )[0];
      badge.textContent = currRank;
      rankRow.appendChild(newEntry);
      currRank++;
    }
  }
}

console.log(_);
// holds the list of all trainees
var trainees = [];
// holds the ordered list of rankings that the user selects
var ranking = [];
readFromCSV("./trainee_info.csv");
populateRanking();
