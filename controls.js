var STORAGE_KEY = 'theatreCart';
var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var world = document.getElementById('world');
var viewport = document.getElementById('viewport');
var detailsDiv = document.getElementById('details');
var cartList = document.getElementById('cart-list');
var totalSpan = document.getElementById('total');

var seats = [];       
var seatsById = {};   

function getCategory(row) {
  for (var i = 0; i < venue.categories.length; i++) {
    var c = venue.categories[i];
    if (row >= c.firstRow && row <= c.lastRow) return c;
  }
}

function makeSeats() {
  var leftStart = (venue.width - venue.columns * venue.spacing) / 2;
  for (var row = 1; row <= venue.rows; row++) {
    for (var col = 1; col <= venue.columns; col++) {
      var letter = LETTERS.charAt(row - 1);
      var id = letter + '-' + col;
      var seat = {
        id: id, letter: letter, number: col, category: getCategory(row),
        x: leftStart + (col - 1) * venue.spacing,
        y: venue.gridTop + (row - 1) * venue.spacing,
        taken: venue.takenSeats.indexOf(id) != -1
      };
      seats.push(seat);
      seatsById[id] = seat;
    }
  }
}

document.getElementById('venue-name').textContent = venue.name;
makeSeats();