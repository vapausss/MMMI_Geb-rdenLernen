let video;
let lektion1;
let lektion2;
let label = "waiting...";
let media1 = [];
let media2 = [];
let labels1 = [];
let labels2 = [];
let currentIndex = 0;
let state = "menu";

function preload() {
  // Stelle sicher, dass die URLs korrekt sind und die Modelle geladen werden können
  lektion1 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/72sxPva99/model.json', { flipped: true ,noCache: true});
  lektion2 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/lqng1X_Ep/model.json', { flipped: true ,noCache: true});

  let filenames1 = [
    { type: "image", path: "a.jpg" },
    { type: "image", path: "b.jpg" },
    { type: "image", path: "k.jpg" },
    { type: "image", path: "l (L).png" },
    { type: "video", path: "boy.mp4" },
    { type: "video", path: "girl.mp4" },
    { type: "video", path: "meet.mp4" },
    { type: "video", path: "deaf.mp4" },
    { type: "video", path: "help.mp4" },
    { type: "video", path: "i me.mp4" },
    { type: "video", path: "no.mp4" },
    { type: "video", path: "please.mp4" },
    { type: "video", path: "this.mp4" }
  ];

  for (let file of filenames1) {
    if (file.type === "image") {
      let img = loadImage(`media/${file.path}`);
      media1.push({ type: "image", media: img });
    } else if (file.type === "video") {
      let vid = createVideo(`media/${file.path}`);
      vid.hide();
      media1.push({ type: "video", media: vid });
    }
    labels1.push(file.path.split('.')[0]); 
  }

  let filenames2 = [
    { type: "image", path: "d.jpg" },
    { type: "image", path: "f.jpg" },
    { type: "image", path: "g.jpg" },
    { type: "image", path: "i.jpg" },
    { type: "video", path: "hearing.mp4" },
    { type: "video", path: "name.mp4" },
    { type: "video", path: "nice.mp4" },
    { type: "video", path: "need.mp4" },
    { type: "video", path: "sorry.mp4" },
    { type: "video", path: "thank you.mp4" },
    { type: "video", path: "yes.mp4" },
    { type: "video", path: "hearing.mp4" },
    { type: "video", path: "how.mp4" },
    { type: "video", path: "know.mp4" }
  ];
  
  for (let file of filenames2) {
    if (file.type === "image") {
      let img = loadImage(`media/${file.path}`);
      media2.push({ type: "image", media: img });
    } else if (file.type === "video") {
      let vid = createVideo(`media/${file.path}`);
      vid.hide();
      media2.push({ type: "video", media: vid });
    }
    labels2.push(file.path.split('.')[0]); 
  }
}

function setup() {
  createCanvas(800, 500);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Verwende die korrekte Methode 'classify'
  lektion1.classifyStart(video, gotResults);
  lektion2.classifyStart(video, gotResults);

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

  document.getElementById('zur-startseite-button').addEventListener('click', function () {
    hideAbschlussMeldung();
    toggleMenu(true); // Zurück zur Startseite
  });
  
  document.getElementById('lektion-wiederholen-button').addEventListener('click', function () {
    hideAbschlussMeldung();
    startLektion1(); // Lektion 1 wiederholen
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
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
}

function startLektion2() {
  console.log("Starting Lektion 2");
  state = "lektion2";
  console.log("State updated to:", state);
  currentIndex = 0;
  label = "waiting...";
  toggleMenu(false);
  toggleLessonControls(true);
}

function toggleMenu(show) {
  console.log(`Toggling menu: ${show}`);
  document.getElementById('startseite').style.display = show ? "block" : "none";
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

// In der Endversion entfernen, wenn der Erkennungsalgo fehlerfreier ist
function mousePressed() {
  if (state === "lektion1") {
    currentIndex = (currentIndex + 1) % media1.length;
  } else if (state === "lektion2") {
    currentIndex = (currentIndex + 1) % media2.length;
  }
}

function nextGesture() {
  // Button deaktivieren und Status zurücksetzen
  wordRecognized = false; // Rücksetzen für das nächste Medium
  currentIndex = (currentIndex + 1) % (state === "lektion1" ? media1.length : media2.length);

  progressCount += 1; 

  // Optional: Maximalwert auf die Gesamtanzahl der Gebärden begrenzen
  if (progressCount > (state === "lektion1" ? media1.length : media2.length)) {
    progressCount = state === "lektion1" ? media1.length : media2.length;
  }

  label = "waiting...";

  const nextButton = document.getElementById('next-button');
  nextButton.style.backgroundColor = 'gray';
  nextButton.setAttribute('disabled', true); // Button deaktivieren
}

let wordRecognized = false; 
let progressCount = 1;

function drawState() {
  let media, labels;

  if (state === "lektion1") {
    media = media1;
    labels = labels1;
  } else if (state === "lektion2") {
    media = media2;
    labels = labels2;
  }

  let current = media[currentIndex];

  if (!current) {
    console.error("Ungültiger Index oder kein Medium gefunden:", currentIndex);
    return;
  }

  // Quadrat für die Medien
  const mediaSize = 240; // Größe des Quadrats
  const mediaX = 70; // X-Position des Mediums 50
  const mediaY = 100; // Y-Position des Mediums

  // Aktuelles Medium anzeigen
  if (current.type === "image") {
    image(current.media, mediaX, mediaY, mediaSize, mediaSize);
  } else if (current.type === "video") {
    image(current.media, mediaX, mediaY, mediaSize, mediaSize);
    current.media.loop();
  }

  // Benutzer-Video
  const userVideoX = 350; // X-Position 340
  const userVideoY = 100; // Y-Position
  const userVideoWidth = 320; // Breite
  const userVideoHeight = 240; // Höhe

  image(video, userVideoX, userVideoY, userVideoWidth, userVideoHeight);

  // Überprüfung, ob das aktuelle Wort erkannt wurde
  if (labels[currentIndex] === label) {
    wordRecognized = true; // Zustand dauerhaft setzen
  }

  // Button-Aktivierung bei erfolgreicher Erkennung
  const nextButton = document.getElementById('next-button');
  if (wordRecognized) {
    fill(0, 255, 0, 100); // Grün mit Transparenz
    noStroke();
    rect(userVideoX, userVideoY, userVideoWidth, userVideoHeight); // Rechteck zeichnen

    nextButton.style.backgroundColor = 'green';
    nextButton.removeAttribute('disabled'); // Button aktivieren
  } else {
    nextButton.style.backgroundColor = 'gray';
    nextButton.setAttribute('disabled', true); // Button deaktivieren
  }

  // Label des aktuellen Mediums
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(labels[currentIndex], mediaX + mediaSize / 2, mediaY - 20); // Oberhalb des Mediums anzeigen

  // Erkannter Label
  text(label, userVideoX + userVideoWidth / 2, userVideoY + userVideoHeight + 30); // Unterhalb des Benutzer-Videos anzeigen

  // Fortschrittsanzeige in 2er-Schritten
  let totalGestures = state === "lektion1" ? media1.length : media2.length;

  // Anzeige des Fortschritts oben rechts
  text(`${progressCount} / ${totalGestures}`, width - 20, 20);
}

function draw() {
  background(245, 245, 220);

  if (state === "lektion1" || state === "lektion2") {
    drawState();
  }
}

function closeLesson() {
  // Wechsel zur Abschlussmeldung
  state = "menu";
  toggleLessonControls(false);
  toggleMenu(false);
  showAbschlussMeldung();
}

function showAbschlussMeldung() {
  const abschlussMeldung = document.getElementById('abschluss-meldung');
  abschlussMeldung.classList.remove('hidden'); // Abschlussmeldung anzeigen
  abschlussMeldung.style.display = 'block';

  // Optional: Punkteanzeige aktualisieren
  const punktzahl = progressCount; // Beispiel: Fortschrittsanzeige als Punkte
  const abschlussText = document.getElementById('abschluss-text');
  abschlussText.textContent = `Lektion abgeschlossen, Punktzahl: ${punktzahl}`;
}

function hideAbschlussMeldung() {
  const abschlussMeldung = document.getElementById('abschluss-meldung');
  abschlussMeldung.classList.add('hidden'); // Abschlussmeldung ausblenden
  abschlussMeldung.style.display = 'none';
}