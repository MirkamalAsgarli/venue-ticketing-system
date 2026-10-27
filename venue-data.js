var venue = {
  name: 'Solstice Theatre',
  width: 760,
  height: 560,
  stageTop: 20,
  stageWidth: 320,
  stageHeight: 80,
  rows: 12,
  columns: 20,
  gridTop: 140,      
  seatSize: 22,
  spacing: 30,       
  categories: [
    { name: 'VIP',     price: 50, firstRow: 1, lastRow: 3,  fill: 'rgba(142, 68, 173, 0.45)', edge: '#8e44ad' },
    { name: 'Plus',    price: 25, firstRow: 4, lastRow: 7,  fill: 'rgba(52, 120, 220, 0.40)', edge: '#2f6fd0' },
    { name: 'Economy', price: 15, firstRow: 8, lastRow: 12, fill: '#c5eeb5',                  edge: '#5fa24d' }
  ],
  takenSeats: [
    'A-9', 'A-10', 'B-4', 'B-15', 'C-7', 'C-8', 'C-12', 'D-3', 'D-18', 'E-10', 'E-11', 'F-6', 'F-14', 'G-2',
    'G-19', 'H-5', 'H-6', 'H-7', 'I-13', 'J-1', 'J-9', 'K-16', 'K-17', 'L-4', 'L-10', 'L-11'
  ]
};