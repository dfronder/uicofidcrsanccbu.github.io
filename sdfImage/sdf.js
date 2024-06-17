/*
 * FILE NAME   : sdf.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 17.06.2024
 * PURPOSE     : SDF Marching parabolas algorithm javascript library file.
 */

import {vec2, transpose} from "./mth.js";
import {buildOrData, imgWidth, imgHeight, black_count, white_count} from "./main.js";

const INF = 9999999;
let sdfImgData = [];
let buildSdfData = [];
let max_dist = 0;

function getCoef(length) {
  let coef = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  return coef[Math.floor(length  / 100)];
} // End of 'getCoef' function

function intersectParabolas(p, q) {
  let x = ((q.y + q.x * q.x) - (p.y + p.x * p.x)) / (2 * q.x - 2 * p.x);
  return vec2(x, undefined);
} // End of 'intersectParabolas' function

function findHullParabolas(singleRow, hullVertices, hullIntersections) {
  let k = 0;
  hullVertices[0].x = 0;
  hullIntersections[0].x = -INF;
  hullIntersections[1].x = +INF;
  for (let i = 1; i <= singleRow.length - 1; i++) {
    let q = vec2(i, singleRow[i]);
    let s = intersectParabolas(hullVertices[k], q);
    while (s.x <= hullIntersections[k].x) {
      k--;
      s = intersectParabolas(hullVertices[k], q);
    }
    k++;
    hullVertices[k] = q;
    hullIntersections[k] = s;
    hullIntersections[k + 1] = vec2(+INF, undefined);
  }
} // End of 'findHullParabolas' function

function marchParabolas(singleRow, hullVertices, hullIntersections) {
  let k = 1;
  for (let q = 0; q <= singleRow.length - 1; q++) {
    while (hullIntersections[k + 1].x < q)
      k++;
    singleRow[q] = (q - hullVertices[k].x) * (q - hullVertices[k].x) + hullVertices[k].y;
  }
} // End of 'marchParabolas' function

function horizontalPass(singleRow) {
  let hullVertices = [singleRow.length];
  let hullIntersections = [singleRow.length + 1];
  for (let i = 0; i < singleRow.length; i++) {
    hullVertices[i] = vec2();
  }
  for (let i = 0; i < singleRow.length + 1; i++) {
    hullIntersections[i] = vec2();
  }
  findHullParabolas(singleRow, hullVertices, hullIntersections);
  marchParabolas(singleRow, hullVertices, hullIntersections);
} // End of 'horizontalPass' function

export function buildSDF() {
  buildSdfData = [];
  sdfImgData = [];
  max_dist = 0;

  buildSdfData = [imgHeight];
  for (let i = 0; i < imgHeight; i++) {
    buildSdfData[i] = new Array(imgWidth);
  }
  if (white_count <= black_count) {
    for (let i = 0; i < imgHeight; i++) {
      for (let j = 0; j < imgWidth; j++) {
        if (buildOrData[imgWidth * i + j] == 0) {
          buildSdfData[i][j] = INF;
        } else {
          buildSdfData[i][j] = 0;
        }  
      }
    }
  } else {
    for (let i = 0; i < imgHeight; i++) {
      for (let j = 0; j < imgWidth; j++) {
        if (buildOrData[imgWidth * i + j] == 0) {
          buildSdfData[i][j] = 0;
        } else {
          buildSdfData[i][j] = INF;
        }
      }
    }
  }

  for (let row = 0; row < imgHeight; row++)
    horizontalPass(buildSdfData[row]);

  buildSdfData = transpose(buildSdfData, imgWidth, imgHeight);

  for (let row = 0; row < imgWidth; row++)
    horizontalPass(buildSdfData[row]);

  buildSdfData = transpose(buildSdfData, imgWidth, imgHeight);

  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
      buildSdfData[i][j] = Math.round(Math.sqrt(buildSdfData[i][j]));
      if (buildSdfData[i][j] > max_dist)
        max_dist = buildSdfData[i][j];
    }  
  }
} // End of 'buildSDF' function

export function drawSDF() {
  sdfImgData = new Uint8ClampedArray(imgWidth * imgHeight * 4);
  let coef = getCoef(imgHeight);

  if (black_count >= white_count) {
    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
          let pos = (y * imgWidth + x) * 4;
          sdfImgData[pos] = 255 - buildSdfData[y][x] * coef;
          sdfImgData[pos + 1] = 255 - buildSdfData[y][x] * coef;
          sdfImgData[pos + 2] = 255 - buildSdfData[y][x] * coef;
          sdfImgData[pos + 3] = 255;
      }
    }
  } else {
    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
          let pos = (y * imgWidth + x) * 4;
          sdfImgData[pos] = buildSdfData[y][x] * coef;
          sdfImgData[pos + 1] = buildSdfData[y][x] * coef;
          sdfImgData[pos + 2] = buildSdfData[y][x] * coef;
          sdfImgData[pos + 3] = 255;
      }
    }
  }

  let canvas = document.getElementById('sdfCan');
  let context = canvas.getContext('2d');
  let idata = context.createImageData(imgWidth, imgHeight);
  idata.data.set(sdfImgData);
  context.putImageData(idata, 0, 0);
} // End of 'drawSDF' function

/* END OF 'sdf.js' FILE */