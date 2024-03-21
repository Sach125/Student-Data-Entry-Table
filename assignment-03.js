var table = document.getElementById("table");
var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
var datas=table.getElementsByTagName("td");
var th = table.getElementsByTagName("th");
var unsub = document.querySelector(".unsubtext");

var currentGrade = 0; 
var originalAverages = []; // original values of avg
var letterGrades = []; // Array to store letter grades
var avgPos = 7; // position of the avg column
var currentColumns = 7; // current amount of columns
var amountofAssignments = 5;
var currentRows = 7; // current amount of columns
var columnnumber = 6;// amount of columns up to the most recent column before avg 

function toggleGradeRepresentation() {
  currentGrade = (currentGrade + 1) % 3; // Toggle between different representations
updateGrade();
}

function updateGrade() { //switch different grade 
    var title;
    if (currentGrade === 0) {
    title = "Average [%]"; // Percent Grade
    } else if (currentGrade === 1) {
    title = "Average [Letter]"; // American Letter Grade
    } else {
    title = "Average [4.0]"; // American 4.0 Grade
    }

    th[avgPos].innerHTML = title;

 // Update each row with the corresponding grade representation
    for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var avg = parseFloat(originalAverages[i]);

    if (currentGrade === 0) {
      // Percent Grade
    cells[avgPos].innerHTML = avg;
    } else if (currentGrade === 1) {
      // American Letter Grade conversion
      cells[avgPos].innerHTML = letterGrades[i]; // Pass the current average to the function
    } else {
      //4.0 scale conversion 
    cells[avgPos].innerHTML = convertTo4Point0Grade(originalAverages[i]);
    }
}
}

function convertToLetterGrade(avg) {
if (avg >= 93) {
    return 'A';
} else if (avg >= 90) {
    return 'A-';
} else if (avg >= 87) {
    return 'B+';
} else if (avg >= 83) {
    return 'B';
} else if (avg >= 80) {
    return 'B-';
} else if (avg >= 77) {
    return 'C+';
} else if (avg >= 73) {
    return 'C';
} else if (avg >= 70) {
    return 'C-';
} else if (avg >= 67) {
    return 'D+';
} else if (avg >= 63) {
    return 'D';
} else if (avg >= 60) {
    return 'D-';
} else {
    return 'F';
}
}
function convertTo4Point0Grade(average) {
if (average >= 93) {
    return '4.0';
} else if (average >= 90) {
    return '3.7';
} else if (average >= 87) {
    return '3.3';
} else if (average >= 83) {
    return '3.0';
} else if (average >= 80) {
    return '2.7';
} else if (average >= 77) {
    return '2.3';
} else if (average >= 73) {
    return '2.0';
} else if (average >= 70) {
    return '1.7';
} else if (average >= 67) {
    return '1.3';
} else if (average >= 63) {
    return '1.0';
} else if (average >= 60) {
    return '0.7';
} else {
    return '0.0';
}
}


function getAvg() { // get avg of assignments and update for it
  var unsubmittedCount = 0; // Initialize count for unsubmitted assignments

  for (var i = 0; i < rows.length; i++) {  // Iterate over each row
    var cells = rows[i].getElementsByTagName("td");
    var sum = 0;


    for (var j = 2; j < currentColumns; j++) {
    var cellContent = cells[j].innerHTML.trim();

      if (cellContent === "-") { // Check for unsubmitted assignments
        cells[j].style.background = "yellow";
        unsubmittedCount++;
    }
        else {
        sum += parseFloat(cellContent);
    }
    }

    var avg = Math.round(sum / amountofAssignments);  // Calculate the average
    if (avg > 100) { // make sure it cant go above 100
        avg = 100;
    }

    if (avg <= 60) {
        cells[avgPos].style.background = "red";
        cells[avgPos].style.color = "white";
    }
    else if (avg >= 60) {
        cells[avgPos].style.background = " rgb(214, 212, 212)";
        cells[avgPos].style.color = "black";
    }
    // Update the "Average (%)" column for the current row
    cells[avgPos].innerHTML = avg;
    unsub.innerHTML = "Unsubmitted Assignments: " + unsubmittedCount;
    originalAverages[i] = avg; // Store the original average value
    letterGrades[i] = convertToLetterGrade(avg); // Store the letter grade
    }
}

/*
    On window load---
    Generate random name and student number for each student
    Get average of assignments
    make assignment cells editable
*/

window.onload = function () {
  getAvg(); // run function on window load

  // Toggle grade representation 
    th[avgPos].addEventListener("click", toggleGradeRepresentation);

  // Event listeners for cell editing
    for (var i = 0; i < datas.length; i++) {
        datas[i].addEventListener("click", function () {
        var cell = this;
        if (cell.hasAttribute('data-clicked') || cell.classList.contains('avg') || cell.id === 'avg') {
            return;
    }
    
    cell.setAttribute('data-clicked', 'yes');
    cell.setAttribute('data-text', cell.innerHTML);

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = cell.innerHTML;
      input.style.width = cell.offsetWidth - (2 * cell.clientLeft) + "px";
      input.style.height = cell.offsetHeight - (2 * cell.clientTop) + "px";
    input.style.border = "0px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "inherit";
    input.style.textAlign = "inherit";


    input.onblur = function () {
        var td = input.parentElement;
        var original_text = input.parentElement.getAttribute('data-text');
        var edited_text = input.value.trim(); // Trim whitespace from input value

        // Validate the input
        if (cell.id === 'name' || cell.id === 'sid') {
          // For name and sid cells, accept any value
        edited_text = edited_text.trim();
        }
        else {
          // For other cells, validate if it's a number between 0 and 100
        if (isNaN(edited_text) || edited_text < 0 || edited_text > 100) {
            edited_text = '-';
        }
        }
        

        // Update the cell content and recalculate average
        if (original_text !== edited_text) {
        td.removeAttribute('data-clicked');
        td.removeAttribute('data-text');
        cell.innerHTML = edited_text;
        getAvg();
        } else {
        td.removeAttribute('data-clicked');
        td.removeAttribute('data-text');
        cell.innerHTML = original_text;
          console.log("Nothing is changed"); // If you click accidentally
        }
    };

      // push the changes to the cell
    cell.innerHTML = '';
    cell.style.cssText = 'padding: 0px 0px'
    cell.append(input);
    cell.firstElementChild.select();
    });
}
// Event listener for adding new row
var AddRows = document.querySelector(".AddRows");
AddRows.addEventListener("click", function () {
    addNewRow();
});
};

function addNewRow() {
    var table = document.getElementById("table");
    var tbody = table.getElementsByTagName("tbody")[0];
    var newRow = tbody.insertRow(tbody.rows.length);

    // Get the number of columns in the table
    var numColumns = table.getElementsByTagName("thead")[0].rows[0].cells.length;

    // Add cells to the new row
    for (var i = 0; i < numColumns; i++) {
        var cell = newRow.insertCell(i);
        cell.innerHTML = "-";

        // Add event listener for cell editing to each cell
        cell.addEventListener("click", function () {
            var cell = this;
            if (cell.hasAttribute('data-clicked') || cell.classList.contains('avg') || cell.id === 'avg') {
                return;
            }
            cell.setAttribute('data-clicked', 'yes');
            cell.setAttribute('data-text', cell.innerHTML);

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.value = cell.innerHTML;
            input.style.width = cell.offsetWidth - (2 * cell.clientLeft) + "px";
            input.style.height = cell.offsetHeight - (2 * cell.clientTop) + "px";
            input.style.border = "0px";
            input.style.fontFamily = "inherit";
            input.style.fontSize = "inherit";
            input.style.textAlign = "inherit";

            input.onblur = function () {
                var td = input.parentElement;
                var original_text = input.parentElement.getAttribute('data-text');
                var edited_text = input.value.trim(); // Trim whitespace from input value

                if (td.cellIndex <= 1) {
                    edited_text = edited_text.trim();
                } else {
                    // Validate the input for other columns
                    if (isNaN(edited_text) || edited_text < 0 || edited_text > 100) {
                        edited_text = '-';
                    }
                }

                // Update the cell content and recalculate average
                if (original_text !== edited_text) {
                    td.removeAttribute('data-clicked');
                    td.removeAttribute('data-text');
                    cell.innerHTML = edited_text;
                    getAvg();
                } else {
                    td.removeAttribute('data-clicked');
                    td.removeAttribute('data-text');
                    cell.innerHTML = original_text;
                    console.log("Nothing is changed"); // If you click accidentally
                }
            };

            // push the changes to the cell
            cell.innerHTML = '';
            cell.style.cssText = 'padding: 0px 0px';
            cell.append(input);
            cell.firstElementChild.select();
        });
    }

    // Calculate average for the new row
    getAvg();
}

// Event listener for adding new column
var addColumnButton = document.querySelector(".AddColumn");
addColumnButton.addEventListener("click", function () {
    addNewColumn();
    getAvg();
});
var assignNO = 5;
function addNewColumn() {
    var table = document.getElementById("table");
    var tbody = table.getElementsByTagName("tbody")[0];
    var thead = table.getElementsByTagName("thead")[0];
    var numRows = tbody.rows.length;
    assignNO++;
    var newAssignNO = assignNO;
    avgPos++;
    currentColumns++;
    columnnumber++;
    amountofAssignments++;

    // Create a new header cell
    var th = document.createElement("th");
    th.textContent = "Assignment " + newAssignNO; // Use the updated assignment number
    th.style.textAlign = "center";
    th.style.background = "rgb(87, 86, 86)";

    // Insert the new header cell between "Assignment x" and "Average" columns
    var assignmentIndex = columnnumber; // Index of the "Assignment x" column
    var insertionIndex = Math.min(assignmentIndex, avgPos);
    thead.rows[0].insertBefore(th, thead.rows[0].cells[insertionIndex]);

  // loop through the amount of columns and insert a new one between previous assignment and averages
for (var i = 0; i < numRows; i++) {
    var cell = tbody.rows[i].insertCell(insertionIndex);
    cell.innerHTML = "-";
    cell.style.textAlign = "right";

    cell.addEventListener("click", function () {
        var cell = this;
        if (cell.hasAttribute('data-clicked') || cell.classList.contains('avg') || cell.id === 'avg') {
            return;
        }
        cell.setAttribute('data-clicked', 'yes');
        cell.setAttribute('data-text', cell.innerHTML);

        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = cell.innerHTML;
        input.style.width = cell.offsetWidth - (2 * cell.clientLeft) + "px";
        input.style.height = cell.offsetHeight - (2 * cell.clientTop) + "px";
        input.style.border = "0px";
        input.style.fontFamily = "inherit";
        input.style.fontSize = "inherit";
        input.style.textAlign = "right";

        input.onblur = function () {
            var td = input.parentElement;
            var original_text = input.parentElement.getAttribute('data-text');
            var edited_text = input.value.trim(); // Trim whitespace from input value

            // Allow any value for the first two columns
            if (td.cellIndex <= 1) {
                edited_text = edited_text.trim();
            } else {
                // Validate the input for other columns
                if (isNaN(edited_text) || edited_text < 0 || edited_text > 100) {
                    edited_text = '-';
                    setYellowBackground();
                }
            }
            
            // Update the cell content
            if (original_text !== edited_text) {
                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                cell.innerHTML = edited_text;
                getAvg();
            } else {
                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                cell.innerHTML = original_text;
                console.log("Nothing is changed"); // If you click accidentally

        }
        };
        // push the changes to the cell
        cell.innerHTML = '';
        cell.style.cssText = 'padding: 0px 0px';
        cell.append(input);
    cell.firstElementChild.select();

    });
}
getAvg();
}
document.querySelector(".reset").addEventListener("click", resetTable);

function resetTable() {
    // Get the table body
    var table = document.getElementById("table");
    var tbody = table.getElementsByTagName("tbody")[0];

    // Clear all rows except the header
    while (tbody.rows.length > 1) {
        tbody.deleteRow(6);
    }

    // Reset global variables to their initial values
    currentGrade = 0;
    originalAverages = [];
    letterGrades = [];
    avgPos = 7;
    currentColumns = 7;
    amountofAssignments = 5;
    currentRows = 7;
    columnnumber = 6;

       // Delete specific column(s)
        var rows = table.getElementsByTagName("tr");

       // If the column was found, delete it from each row
        for (var j = 3; j < rows.length; j++) {
            rows[j].deleteCell(4);
        }
}

document.querySelector(".del").addEventListener("click", deleteSecondToLastColumn);

function deleteSecondToLastColumn() {
    // Get the table
    var table1 = document.getElementById("table");

    // Get all rows in the table body
    var tbody = table1.getElementsByTagName("tbody")[0];
    var rows1 = tbody.getElementsByTagName("tr");

    // Iterate through each row in the table body
    for (var i = 0; i < rows1.length; i++) { 
        // Get the index of the second-to-last cell
        var secondToLastCellIndex = rows1[i].cells.length - 2;
        // Delete the second-to-last cell
        rows1[i].deleteCell(secondToLastCellIndex);
    }

    // Get the table header
    var thead = table1.getElementsByTagName("thead")[0];
    var headerRow = thead.getElementsByTagName("tr")[0]; // Assuming the header is in the first row of thead

    // Get the index of the second-to-last cell in the header
    var secondToLastHeaderCellIndex = headerRow.cells.length - 2;
    // Delete the second-to-last cell in the header
    headerRow.deleteCell(secondToLastHeaderCellIndex);
}
