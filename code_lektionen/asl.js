// let filenames1 = ['a.jpg', 'b.jpg','k.jpg','l.png','boy.png', 'girl.gif', 'meet.png', 'deaf.gif', 'help.webp','name.jpg', 'i_me.jpeg','no.gif', 'please.webp']; //'this' picture fehlt noch
// let filenames2 = ['d.jpg', 'f.jpg','g.gif','i.jpg', 'name.jpg', 'need.gif', 'nice.webp', 'sorry.webp', 'thank_you.jpg', 'yes.jpg']; //'hearing.', 'how.', 'know.',

let video;
let lektion1;
let lektion2;
let label = "waiting...";
let images1 = [];
let images2 = [];
let labels1 = [];
let labels2 = [];
let currentIndex = 0;
//let handPose;
//let hands = [];
let  state = "menu";

function preload() {
  lektion1 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/72sxPva99/', { flipped: true ,noCache: true});
  lektion2 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/lqng1X_Ep/', { flipped: true ,noCache: true});
  // handPose = ml5.handPose({ flipped: true });
  console.log('lektionen loaded');

  let filenames1 = ['a.jpg', 'b.jpg', 'k.jpg', 'l (L).png', 'boy.png', 'girl.gif', 'meet.png', 'deaf.gif', 'help.webp', 'name.jpg', 'i me.jpeg', 'no.gif', 'please.webp'];
  for (let i = 0; i < filenames1.length; i++) {
    images1.push(loadImage(`images/${filenames1[i]}`));
    labels1.push(filenames1[i].split('.')[0]);
     console.log(`Loaded ${filenames1[i]}`); // Log each image filename
  }

  let filenames2 = ['d.jpg', 'f.jpg', 'g.gif', 'i.jpg', 'name.jpg', 'need.gif', 'nice.webp', 'sorry.webp', 'thank you.jpg', 'yes.jpg'];
  for (let i = 0; i < filenames2.length; i++) {
    images2.push(loadImage(`images/${filenames2[i]}`));
    labels2.push(filenames2[i].split('.')[0]);
     console.log(`Loaded ${filenames1[i]}`); // Log each image filename
  }
}

function setup() {
  createCanvas(800, 500);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  lektion1.classifyStart(video,gotResults);
  lektion2.classifyStart(video,gotResults);


document.getElementById('lektion1-button').addEventListener('click', function() {
  console.log('Lektion 1 button clicked');
  startLektion1();
});

document.getElementById('lektion2-button').addEventListener('click', function() {
  console.log('Lektion 2 button clicked');
  startLektion2();
});

document.getElementById('next-button').addEventListener('click', function() {
  console.log('Next button clicked');
  nextGesture();
});

document.getElementById('close-button').addEventListener('click', function() {
  console.log('Close button clicked');
  closeLesson();
});
}

function gotResults(results) {
  if (results[0].confidence > 0.99) {
    label = results[0].label;
  } else {
    label = "not recognized";
  }
}

function startLektion1() {
  console.log("Starting Lektion 1");
  state = "lektion1";
      console.log("State updated to:", state);
  currentIndex = 0;
  label = "waiting...";
  toggleMenu(false);
  toggleLessonControls(true);
  //drawState();
}

function startLektion2() {
  console.log("Starting Lektion 2");
 
  state = "lektion2";
     console.log("State updated to:", state);
  currentIndex = 0;
  label = "waiting...";
  toggleMenu(false);
  toggleLessonControls(true);
  //drawState();
}

function toggleMenu(show) {
  console.log(`Toggling menu: ${show}`);
  document.getElementById('menu').style.display = show ? "block" : "none";
}

function toggleLessonControls(show) {
  console.log(`Toggling lesson controls: ${show}`);
  document.getElementById('lesson-controls').style.display = show ? "block" : "none";
}

function closeLesson() {
  state = "menu";
  toggleLessonControls(false);
  toggleMenu(true);
}
function mousePressed() {
  if (state === "lektion1") {
    currentIndex = (currentIndex + 1) % images1.length;
  } else if (state === "lektion2") {
    currentIndex = (currentIndex + 1) % images2.length;
  }
}

function nextGesture() {
  if (state === "lektion1") {
    currentIndex = (currentIndex + 1) % images1.length;
  } else if (state === "lektion2") {
    currentIndex = (currentIndex + 1) % images2.length;
  }
  label = "waiting...";
  const nextButton = document.getElementById('next-button');
  nextButton.style.backgroundColor = 'gray';
  nextButton.setAttribute('disabled', true);
}




function drawState() {

    let images = state === "lektion1" ? images1 : images2;
    let labels = state === "lektion1" ? labels1 : labels2;

    // Zeige aktuelles Bild
    image(images[currentIndex], 50, 100, 300, 200);
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
   text(`${labels[currentIndex]}`, 50, 80);


    // Zeige Video
    image(video, 300, 100, 320, 240);

    // Feedback bei richtigem Label
    if (labels[currentIndex] === label) {
      fill(0, 255, 0, 100);
      noStroke();
      rect(300, 100, 320, 240);
       const nextButton = document.getElementById('next-button');
  nextButton.style.backgroundColor = 'green';
   nextButton.removeAttribute('disabled');
    }

    // Zeige erkannten Text
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(label, 460, 380);
}
function draw() {
  background(245, 245, 220);


  if (state === "lektion1" || state === "lektion2") {
    drawState();
  }
    else  {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text("Wähle eine Lektion", width / 2, height / 2 - 50);
  }
}
