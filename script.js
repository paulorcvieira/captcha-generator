let submitButton = document.getElementById('submit-button');
let userInput = document.getElementById('user-input');
let canvas = document.getElementById('canvas');
let reloadButton = document.getElementById('reload-button');
let text = "";

// generate text
const textGenerator = () => {
  let generatedText = "";
  /* string.fromCharCode gives ASCII value from a give number */
  // total 6 letters hence loop of 3
  for (let i = 0; i < 3; i++) {
    // random number between 65 and 90
    generatedText += String.fromCharCode(randomNumber(65, 90));
    // random number between 97 and 122
    generatedText += String.fromCharCode(randomNumber(97, 122));
    // random number between 48 and 57
    generatedText += String.fromCharCode(randomNumber(48, 57));
  }
  return generatedText;
}

// Generate random numbers between a given range
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

userInput.addEventListener('click', function () {
  this.setSelectionRange(0, this.value.length);
})

// canvas part
function drawStringOnCanvas(string) {
  // the getContext() function returns the drawing context that has all the drawing properties and functions needed to draw on the canvas
  const ctx = canvas.getContext('2d');
  // clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // array of text color
  const textColors = ["rgb(110, 76, 191)", "rgb(0, 0, 0)", "rgb(130, 130, 130)"];
  // space between each letter
  const letterSpace = 150 / string.length;
  for (let i = 0; i < string.length; i++) {
    // define initial space on X axis
    const xInitialSpace = 25;
    // set the font and size
    ctx.font = "20px Roboto Mono";
    // set the font color
    ctx.fillStyle = textColors[randomNumber(0, 2)];
    // set the text alignment
    ctx.textAlign = "center";
    // set the text baseline
    ctx.textBaseline = "middle";
    // draw the text
    ctx.fillText(
      string[i],
      xInitialSpace + i * letterSpace,
      randomNumber(25, 40),
      100
    );
  }

}

// initial function
const triggerFunction = () => {
  // clear input
  userInput.value = "";
  text = textGenerator();
  // randomize the text so that everytime the position of numbers and small letters is random
  text = [...text].sort(() => Math.random() - 0.5).join('');
  drawStringOnCanvas(text);
}

// call triggerFunction for reload button
reloadButton.addEventListener('click', triggerFunction);

// call triggerFunction when page loads
window.onload = () => triggerFunction();

submitButton.addEventListener('click', function () {
  if (userInput.value === "") {
    alert("Enter the text in the image!");
  } else if (String(userInput.value).toLocaleLowerCase() === text.toLocaleLowerCase()) {
    alert("Correct code!");
  } else {
    alert("Wrong code!");
    triggerFunction();
  }
});