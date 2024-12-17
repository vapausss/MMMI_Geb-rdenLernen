
let video;
let classifier; //später statt dessen lektion1 & lektion2
let label = "waiting...";
let images = []; // Array to store the loaded images
let labels = []; // Array to store image labels (filenames)
let currentIndex = 0; // Track the current image index
let handPose;
let hands = [];
let button;

function preload() {
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/qn90_QVWC/', { flipped: true }); 
  handPose = ml5.handPose({ flipped: true }); 
  let filenames = ['a.jpg', 'boy.png', 'girl.gif', 'meet.png', 'deaf.gif', 'name.jpg','name.gif','i_me.jpeg', 'help.webp'];
 for (let i = 0; i < filenames.length; i++) {
    // Load images and save their filenames
    images.push(loadImage(`images/${filenames[i]}`));

    // Extract the part before .png/.jpg and save as label
    let label = filenames[i].split('.')[0];
    labels.push(label);
 }
}
//später den code rausnehmen
function mousePressed() {
  currentIndex = (currentIndex + 1) % images.length; // Loop back to 0
}
function nextGesture() {
  // Move to the next image
  currentIndex = (currentIndex + 1) % images.length;
  label = "waiting...";
  //resetting the buttom
  button.style('background-color', 'gray');
  button.attribute('disabled', true);
}

function gotResults(results) {
   console.log(results[0], results[1],results[2]);
  if (results[0].confidence > 0.95) {
    label = results[0].label;
  }
  else{label= "not recognized";}
}
function gotHands(results) {
  console.log(results);
  hands = results;
}

function drawHands() {
  if (hands.length > 0) {
    let hand = hands[0];
    if (hand.confidence > 0.1) {
      // Draw hand keypoints
      for (let i = 0; i < hand.keypoints.length; i++) {
        let keypoint = hand.keypoints[i];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x + 400, keypoint.y + 120, 10); // Adjust coordinates for video offset
      }
    }
  }
}

function setup() {
  createCanvas(800, 500); 
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  classifier.classifyStart(video, gotResults);
  handPose.detectStart(video, gotHands); 
  // Create the button 
  button = createButton('Next Gesture');
  button.position(150, 330); // Position the button under the gesture picture
  button.style('background-color', 'gray');
  button.style('color', 'white');
  button.attribute('disabled', true);
  button.mousePressed(nextGesture);
}

function draw() {
  // Set beige background
  background(245, 245, 220); 

  // Display the image on the left
 image(images[currentIndex], 50, 100, 300, 200);  
  fill(0);
  textSize(18);
  textAlign(LEFT, TOP);
  text(` ${labels[currentIndex]}`, 50, 80); // Display the label

  // Draw the video 
  image(video, 300, 100, 320, 240); 

  if (labels[currentIndex] === label) {
    //visual feedback
    fill(0, 255, 0, 100); 
    noStroke(); 
    rect(300, 100, 320, 240); 
    //button adjustments
   button.style('background-color', 'green'); 
    button.removeAttribute('disabled'); 
  }

  // Display the label under the video
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
 text(label, 460, 380); // Centered under the video

  if (labels[currentIndex] === label) {
    fill(0, 255, 0,100);
  }
}

