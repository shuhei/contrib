'use strict';

var names = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

function forIndex(index) {
  return names[index];
};

module.exports = {
  names: names,
  forIndex: forIndex
};
