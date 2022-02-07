'use strict'

module.exports = (...data) => {
    const string = data[0]
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  