'use strict';

var names = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function forIndex(index) {
  return names[index];
}

module.exports = {
  names: names,
  forIndex: forIndex
};
