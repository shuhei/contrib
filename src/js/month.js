'use strict';

var month = {
  names: [
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
  ],
  forIndex: function (index) {
    return month.names[index];
  }
};

module.exports = month;
