let textStr = "silly goose";
let layers = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(96);
  textAlign(CENTER, CENTER); // Center align the text
  frameRate(5); // Animation speed
}

function draw() {
  background("#fff4f4");

  // !!! This shit is for centering the textStr
  // Find the center of the canvas
  let x = width / 2;
  let y = height / 2;

  // Calculate the total width of the text string
  let totalWidth = 0;
  for (let i = 0; i < textStr.length; i++) {
    totalWidth += textWidth(textStr[i]);
  }

  // Adjust the starting x position to center the text
  x -= totalWidth / 2;

  // !!! End textStr centering

  // Loop through the text layers
  for (let j = 0; j < layers; j++) {
    // Add a random offset to the x and y position
    let xOffset = random(-4, 4);
    let yOffset = random(-4, 4);
    let currentX = x + xOffset; // Reset the x position (so the text is overlayed)

    // Loop through the text string
    for (let i = 0; i < textStr.length; i++) {
      // Fill the text with a random color
      fill(randomColor());
      text(textStr[i], currentX, y + yOffset); // Draw the text at the current position
      currentX += textWidth(textStr[i]); // Shift right the x position by the width of the current character
    }
  }
}

function randomColor() {
  // Generate a more saturated color using HSL
  colorMode(HSL);
  let h = random(360); // Hue
  let s = random(50, 100); // Saturation (50-100%)
  let l = random(30, 80); // Lightness (30-80%)
  let a = 100; // Alpha (100% opaque)
  let c = color(h, s, l, a);
  colorMode(RGB); // Switch back to RGB for other parts of the code
  return c;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
