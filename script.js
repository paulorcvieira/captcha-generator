let submitButton = document.getElementById('submit-button');
let userInput = document.getElementById('user-input');
let canvas = document.getElementById('canvas');
let reloadButton = document.getElementById('reload-button');
let browserDetailRef = document.getElementById('browser-detail');
let locationDetailRef = document.getElementById('location-detail');
let detailsRef = document.getElementById('details');
let osDetailRef = document.getElementById('os-detail');
let ipDetailRef = document.getElementById('ip-detail');
let codeDetailRef = document.getElementById('code-detail');
let termsCheckboxRef = document.getElementById('terms-checkbox');
let text = "";

const browserList = [
  { name: "Firefox", value: "Firefox" },
  { name: "Opera", value: "OPR" },
  { name: "Edge", value: "Edg" },
  { name: "Chrome", value: "Chrome" },
  { name: "Safari", value: "Safari" }
]

const os = [
  { name: "Android", value: "Android" },
  { name: "iPhone", value: "iPhone" },
  { name: "iPad", value: "iPad" },
  { name: "Macintosh", value: "Mac" },
  { name: "Linux", value: "Linux" },
  { name: "Windows", value: "Win" },
]

// generate text
const textGenerator = () => {
  let generatedText = "";
  /* string.fromCharCode gives ASCII value from a give number */
  // total 6 letters hence loop of 3
  for (let i = 0; i < 2; i++) {
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

submitButton.addEventListener('click', function () {
  if (!detailsRef.classList.contains('hide')) {
    detailsRef.classList.add('hide');
  }
  
  if (userInput.value === "") {
    alert("Enter the text in the image!");
  } else if (!termsCheckboxRef.checked) {
    alert("Please accept the terms and conditions!");
  } else if (String(userInput.value).toLocaleLowerCase() === text.toLocaleLowerCase()) {
    codeDetailRef.innerHTML = userInput.value;
    detailsRef.classList.remove('hide');
    
    // generate new captcha
    triggerFunction();
    
    // call browserChecker when page loads
    browserChecker();
  } else {
    alert("Wrong code!");
    triggerFunction();
  }
});

// get user info
let browserChecker = () => {
  // useragent contains browser details and OS details but we need to separate them
  let userDetails = navigator.userAgent;
  fetch('https://api64.ipify.org?format=json').then(response => {
    Promise.resolve(response.json()).then(data => {
      ipDetailRef.innerHTML = data.ip;
    })
  });

  // error check location
  const checkError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        locationDetailRef.innerHTML = "Please allow access to location.";
        break;
      case error.POSITION_UNAVAILABLE:
        // usually fired for firefox
        locationDetailRef.innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        locationDetailRef.innerHTML = "The request to get user location timed out.";
        break;
    }
  }

  // show location
  const showLocation = async (position) => {
    // we user the nominatim API for getting actual address from latitude and longitude
    let response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    );
    // store response object in data
    let data = await response.json();
    locationDetailRef.innerHTML = `${data.address.city}/${data.address.country}`;
  }

  // geolocation API is used to get geographical position os a user and is available inside the navigator object
  if (navigator.geolocation) {
    // return position (latitude and longitude) of the browser or error
    navigator.geolocation.getCurrentPosition(showLocation, checkError);
  } else {
    // for old browsers i.e IE
    locationDetailRef.innerHTML = "This browser does not support geolocation.";
  }

  for (let i in browserList) {
    // check if string contains any value from the array
    if (userDetails.includes(browserList[i].value)) {
      // extract browser name  and version from the string
      browserDetailRef.innerHTML = browserList[i].name || "Unknown Browser";
      break;
    }
  }
  for (let i in os) {
    // check if string contains any value from the object
    if (userDetails.includes(os[i].value)) {
      // extract OS name from object
      osDetailRef.innerHTML = os[i].name || "Unknown OS";
      break;
    }
  }
}

window.onload = () => {
  // call triggerFunction when page loads
  triggerFunction()
};