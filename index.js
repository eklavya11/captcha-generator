"use strict";

const Canvas = require("canvas");
Canvas.registerFont(require('path').resolve(__dirname, "./assets/fonts/Swift.ttf"), { family: "swift" });

const alternateCapitals = str => [...str].map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]()).join(""),
  randomText = () => alternateCapitals(Math.random().toString(36).replace(/[^a-z]+/gi, "").substring(0, 6)),
  shuffleArray = (arr) => {
    let i = arr.length,
      temp, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== i) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * i);
      i -= 1;
      // And swap it with the current element.
      temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }

    return arr;
  }

class Captcha {
  constructor() {

    // Initialize canvas
    this._canvas = Canvas.createCanvas(200, 200);
    let ctx = this._canvas.getContext('2d');

    // Set background color
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillRect(0, 0, 200, 200);

    // Draw background noise
    for (let i = 0; i < 10000; i++) {
      ctx.beginPath();
      let color = "#";
      while (color.length < 7) color += Math.round(Math.random() * 16).toString(16);
      ctx.fillStyle = color;
      ctx.arc(
        Math.round(Math.random() * 200), // X coordinate
        Math.round(Math.random() * 200), // Y coordinate
        Math.random(), // Radius
        0, // Start angle
        Math.PI * 2 // End angle
      );
      ctx.fill();
    }

    // Set style for circles
    ctx.fillStyle = "#555";
    ctx.lineWidth = 0;

    // Draw 80 circles
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.round(Math.random() * 180) + 10, // X coordinate
        Math.round(Math.random() * 180) + 10, // Y coordinate
        Math.round(Math.random() * 7), // Radius
        0, // Start angle
        Math.PI * 2 // End angle
      );
      ctx.fill();
    }

    // Set style for lines
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;

    // Draw 10 lines
    ctx.beginPath();
    let coords = [];
    for (let i = 0; i < 4; i++) {
      if (!coords[i]) coords[i] = [];
      for (let j = 0; j < 5; j++) coords[i][j] = Math.round(Math.random() * 40) + (j * 40);
      if (!(i % 2)) coords[i] = shuffleArray(coords[i]);
    }

    for (let i = 0; i < coords.length; i++) {
      if (!(i % 2)) {
        for (let j = 0; j < coords[i].length; j++) {
          if (!i) {
            ctx.moveTo(coords[i][j], 0);
            ctx.lineTo(coords[i + 1][j], 200);
          } else {
            ctx.moveTo(0, coords[i][j]);
            ctx.lineTo(200, coords[i + 1][j]);
          }
        }
      }
    }

    // Fill all the plotted line strokes
    ctx.stroke();

    // Set style for text
    ctx.font = 'normal 50px swift';
    ctx.fillStyle = '#222';

    // Set position for text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(Math.round((Math.random() * 50) - 25) + 100, Math.round((Math.random() * 50) - 25) + 100);
    ctx.rotate(Math.random() - 0.5);

    // Set text value and print it to canvas
    ctx.beginPath();
    this._value = "";
    while (this._value.length !== 6) this._value = randomText();
    ctx.fillText(this._value, 0, 0);

  };

  get value() {
    return this._value;
  }

  get PNGStream() {
    return this._canvas.createPNGStream();
  }

}

module.exports = Captcha;
