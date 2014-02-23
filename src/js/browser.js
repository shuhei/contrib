'use strict';

function isMobileWebkit() {
  return /webkit.*mobile/i.test(window.navigator.userAgent);
}

module.exports = {
  isMobileWebkit: isMobileWebkit
};
