'use strict';

function storeCursor (state, x, y) {
  return ['demo.position', {x: x, y: y}];
}

module.exports = {
  type: 'ActionMap',
  func: function() {
    return {
      'touch0': [{call: storeCursor}]
    };
  }
};