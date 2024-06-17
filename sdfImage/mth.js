/*
 * FILE NAME   : mth.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 17.06.2024
 * PURPOSE     : Math javascript library file.
 */

class _vec2 {
  constructor(x, y) {
    if (x == undefined) {
      this.x = 0, this.y = 0;
    } else if (typeof x == 'object') {
      if (x.length == 2) {
        this.x = x[0], this.y = x[1];  
      } else {
        this.x = x.x, this.y = x.y;
      }
    } else {
      if (y == undefined) {
        this.x = x, this.y = x, this.z = x;
      } else {
        this.x = x, this.y = y;
      }
    }
  } // End of 'constructor' function
} // End of '_vec2' class

export function vec2(...args) {
  return new _vec2(...args);
} // End of 'vec2' function

export function transpose(array) {
  if (array[0].length > 0) {
    let newArray = [];
    for (let i = 0; i < array[0].length; i++) {
      newArray[i] = [];
    }
    for (let i = 0; i < array[0].length; i++) {
      for (let j = 0; j < array.length; j++) {
          newArray[i].push(array[j][i]);
      }
    }
    return newArray;
  }
} // End of 'transpose' function

/* END OF 'mth.h' FILE */