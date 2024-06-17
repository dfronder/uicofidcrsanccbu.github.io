/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 17.06.2024
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
  let fileInp = document.getElementById("myFile");
  if (fileInp.files.length != 0) {
    img.src = URL.createObjectURL(fileInp.files[0]);
    $("#fileInp").val(null);
    if (document.getElementById("errorHandle") != undefined) {
      document.getElementById("errorHandle").remove();      
    }
  } else {
    let list = document.getElementById("images");
    let text = list.options[list.selectedIndex].text;
    if (text == `-- select an image --`)
    {
      let error = document.createElement("p");
      error.textContent = "ERROR: Image is not selected and not loaded.";
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
  }
  (buildOrData = []), (imgData = []),
  (imgWidth = 0), (imgHeight = 0), (black_count = 0), (white_count = 0);
  setTimeout(() => {
    let i = 0;

    // Remove canvases
    let oldOrCan = document.getElementById("originalCan");
    oldOrCan.remove();
    let oldSDFCan = document.getElementById("sdfCan");
    oldSDFCan.remove();

    // Original canvas
    let textOriginal = document.getElementById("originalText");
    let canvOr = document.createElement("canvas");
    canvOr.width = img.width;
    canvOr.height = img.height;
    canvOr.setAttribute("id", "originalCan");
    textOriginal.insertAdjacentElement("afterend", canvOr);
  
    // SDF canvas
    let textSDF = document.getElementById("sdfText")
    let canvSDF = document.createElement("canvas");
    canvSDF.width = img.width;
    canvSDF.height = img.height;
    canvSDF.setAttribute("id", "sdfCan");
    textSDF.insertAdjacentElement("afterend", canvSDF);
  
    // Get image size
    imgWidth = img.width;
    imgHeight = img.height;
  
    // Draw original
    let context = canvOr.getContext('2d');
    context.drawImage(img, 0, 0, canvOr.width, canvOr.height);
  
    // Get image data
    imgData = context.getImageData(0, 0, canvOr.width, canvOr.height).data;
  
    // Convert data
    for (i = 0; i < imgData.length; i += 4) {
      buildOrData.push(imgData[i] /= 255);
      if (imgData[i] == 0) {
        black_count++;
      } else {
        white_count++;
      }
    }
  }, 70)
  setTimeout(() => {
    buildSDF();
    drawSDF();
  }, 100);
} // End of 'main' function

document.getElementById("gen").onclick = function() {main()};

/* END OF 'main.js' FILE */