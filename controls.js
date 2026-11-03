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

function drawVenue() {
  world.style.width = venue.width + 'px';
  world.style.height = venue.height + 'px';
  var stage = document.createElement('div');
  stage.className = 'stage';
  stage.textContent = 'STAGE';
  stage.style.width = venue.stageWidth + 'px';
  stage.style.height = venue.stageHeight + 'px';
  stage.style.lineHeight = venue.stageHeight + 'px';
  stage.style.left = (venue.width - venue.stageWidth) / 2 + 'px';
  stage.style.top = venue.stageTop + 'px';
  world.appendChild(stage);

  var leftStart = (venue.width - venue.columns * venue.spacing) / 2;
  for (var row = 1; row <= venue.rows; row++) {
    var label = document.createElement('div');
    label.className = 'row-letter';
    label.textContent = LETTERS.charAt(row - 1);
    label.style.left = leftStart - 28 + 'px';
    label.style.top = venue.gridTop + (row - 1) * venue.spacing + 2 + 'px';
    world.appendChild(label);
  }

  for (var i = 0; i < seats.length; i++) {
    var seat = seats[i];
    var btn = document.createElement('button');
    btn.className = 'seat';
    btn.setAttribute('data-id', seat.id);
    btn.title = 'Row ' + seat.letter + ', seat ' + seat.number;
    btn.style.setProperty('--fill', seat.category.fill);
    btn.style.setProperty('--edge', seat.category.edge);
    btn.style.left = seat.x + 'px';
    btn.style.top = seat.y + 'px';
    seat.button = btn;
    world.appendChild(btn);
  }
}

function drawLegend() {
  var html = '';
  for (var i = 0; i < venue.categories.length; i++) {
    var c = venue.categories[i];
    html += '<span><i class="swatch" style="background:' + c.fill + '; border-color:' + c.edge + '"></i>' + c.name + ' $' + c.price + '</span>';
  }
  html += '<span><i class="swatch" style="background:#ffd83a; border-color:#8a6d00"></i>In cart</span>';
  html += '<span><i class="swatch" style="background:#b5b5b5; border-color:#888"></i>Unavailable</span>';
  document.getElementById('legend').innerHTML = html;
}

document.getElementById('venue-name').textContent = venue.name;
makeSeats();
drawVenue();
drawLegend();

var inspectedId = null;
var cart = []; // Placeholder for now

function inspectSeat(id) {
  inspectedId = id;
  updateAll();
}

function showDetails() {
  var seat = seatsById[inspectedId];
  if (!seat) {
    detailsDiv.innerHTML = '<p class="hint">Click on a seat to see its details.</p>';
    return;
  }
  var inCart = cart.indexOf(seat.id) != -1;
  var status = 'Available';
  var buttonText = 'ADD TO CART';
  var disabled = '';

  if (seat.taken) {
    status = 'Unavailable';
    buttonText = 'NOT AVAILABLE';
    disabled = 'disabled';
  } else if (inCart) {
    status = 'Already in your cart';
    buttonText = 'ALREADY IN CART';
    disabled = 'disabled';
  }

  detailsDiv.innerHTML =
    '<p class="seat-title">Row ' + seat.letter + ' - Seat ' + seat.number + '</p>' +
    '<p class="category">Category: ' + seat.category.name + '</p>' +
    '<p class="price">$' + seat.category.price + '</p>' +
    '<p class="status">Status: ' + status + '</p>' +
    '<button class="add-btn" id="add-btn" ' + disabled + '>' + buttonText + '</button>';

  document.getElementById('add-btn').onclick = function () {
    if (typeof addToCart === 'function') addToCart(seat.id);
  };
}

function showSeatStates() {
  for (var i = 0; i < seats.length; i++) {
    var seat = seats[i];
    var cls = 'seat';
    if (seat.taken) cls += ' taken';
    if (cart.indexOf(seat.id) != -1) cls += ' in-cart';
    if (seat.id == inspectedId) cls += ' inspected';
    seat.button.className = cls;
  }
}

function updateAll() {
  showSeatStates();
  showCart();
  showDetails();
}

world.addEventListener('click', function (e) {
  var id = e.target.getAttribute('data-id');
  if (id) inspectSeat(id);
});

function addToCart(id) {
  var seat = seatsById[id];
  if (seat.taken || cart.indexOf(id) != -1) return;
  cart.push(id);
  updateAll();
}

function showCart() {
  cartList.innerHTML = '';
  var total = 0;
  if (cart.length == 0) {
    cartList.innerHTML = '<li>Your cart is empty.</li>';
  }
  for (var i = 0; i < cart.length; i++) {
    var seat = seatsById[cart[i]];
    total += seat.category.price;
    var li = document.createElement('li');
    li.innerHTML = '<span>Row ' + seat.letter + ', Seat ' + seat.number +
      '<small>' + seat.category.name + ' - $' + seat.category.price + '</small></span>';
    var removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.setAttribute('data-remove', seat.id);
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  }
  totalSpan.textContent = '$' + total;
}

function removeFromCart(id) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i] != id) newCart.push(cart[i]);
  }
  cart = newCart;
  updateAll();
}

cartList.addEventListener('click', function (e) {
  var id = e.target.getAttribute('data-remove');
  if (id) removeFromCart(id);
});

updateAll();