// Takes in name of csv and returns a local data structure with relevant info
function readFromCSV() {

}

// If the user has saved a ranking via id then recover it here
// returns: List of ranked trainees
function getRanking() {

}

// Uses populated local data structure from readFromCSV to populate table
function populateTable() {
  // Currently just duplicates the first table entry
  let table = document.getElementById("table__entry-container");
  exampleEntry = table.children[0];
  for (let i = 0; i < 10; i++) {
    table.appendChild(exampleEntry.cloneNode(true));
  }
}


// Uses populated local data structure from getRanking to populate ranking
function populateRanking() {
  // Currently just duplicates first ranking entry
  let rowNums = [1, 2, 4, 5]
  let ranking = document.getElementById("ranking__pyramid");
  let rankRows = Array.from(ranking.children).slice(1); // remove the title element
  console.log(rankRows);
  let rankEntry = rankRows[0].children[0];
  console.log(rankEntry);
  for (let i = 1; i < rowNums.length; i++) {
    let rankRow = rankRows[i];
    for (let j = 0; j < rowNums[i]; j++) {
      rankRow.appendChild(rankEntry.cloneNode(true));
    }
  }
}

populateTable();
populateRanking();