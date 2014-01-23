'use strict';

var color = {
  colors: [
    '#eeeeee',
    '#d6e685',
    '#8cc665',
    '#44a340',
    '#1e6823'
  ],
  colorIndex: function (count) {
    if (count <= 0) return 0;
    else if (count <= 3) return 1;
    else if (count <= 6) return 2;
    else if (count <= 9) return 3;
    else return 4;
  },
  forCount: function (count) {
    return color.colors[color.colorIndex(count)];
  }
};

module.exports = color;
