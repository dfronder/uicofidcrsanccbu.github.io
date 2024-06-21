/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 21.06.2024
 * PURPOSE     : SDF Image main javascript file.
 */

let img = new Image();
let imgData = [];
export let buildOrData = [];
export let imgWidth = 0;
export let imgHeight = 0;
export let black_count = 0;
export let white_count = 0;

import {buildSDF, drawSDF} from "./sdf.js";

export function main() {
  let list = document.getElementById("images");
  let text = list.options[list.selectedIndex].text;
  if (text == `-- select an image --`)
  {
    let error = document.createElement("p");
    error.textContent = "ERROR: Image is not selected.";
    let gen = document.getElementById("gen");
    error.setAttribute("id", "errorHandle");
    gen.insertAdjacentElement("afterend", error);
    return false;
  } else {
    if (document.getElementById("errorHandle") != undefined) {
      document.getElementById("errorHandle").remove();      
    }
    img.src = `images/${text}`;
  }
  (buildOrData = []), (imgData = []),
  (imgWidth = 0), (imgHeight = 0), (black_count = 0), (white_count = 0);
  img.onload = () => {
    let i = 0;

    let oldOrCan = document.getElementById("originalCan");
    oldOrCan.remove();
    let oldSDFCan = document.getElementById("sdfCan");
    oldSDFCan.remove();

    let textOriginal = document.getElementById("originalText");
    let canvOr = document.createElement("canvas");
    canvOr.width = img.width;
    canvOr.height = img.height;
    canvOr.setAttribute("id", "originalCan");
    textOriginal.insertAdjacentElement("afterend", canvOr);
  
    let textSDF = document.getElementById("sdfText")
    let canvSDF = document.createElement("canvas");
    canvSDF.width = img.width;
    canvSDF.height = img.height;
    canvSDF.setAttribute("id", "sdfCan");
    textSDF.insertAdjacentElement("afterend", canvSDF);
  
    imgWidth = img.width;
    imgHeight = img.height;
  
    let context = canvOr.getContext('2d');
    context.drawImage(img, 0, 0, canvOr.width, canvOr.height);
  
    imgData = context.getImageData(0, 0, canvOr.width, canvOr.height).data;
  
    for (i = 0; i < imgData.length; i += 4) {
      buildOrData.push(imgData[i] /= 255);
      if (imgData[i] == 0) {
        black_count++;
      } else {
        white_count++;
      }
    }

    buildSDF();
    drawSDF();
  }
}

document.getElementById("gen").onclick = function() {main()};

/* END OF 'main.js' FILE */