// Takes in name of csv and returns a local data structure with relevant info
function readFromCSV() {

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

populateTable();