let video;
let lektion1;
let lektion2;
let label = "waiting...";
let media1 = [];
let media2 = [];
let labels1 = [];
let labels2 = [];
let state = "menu";
let starImage;

// Funktion zum Vorladen der Ressourcen (Medien und Modelle)
function preload() {
  // Modelle laden und konfigurieren
  lektion1 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/72sxPva99/', { flipped: true ,noCache: true});
  lektion2 = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/lqng1X_Ep/', { flipped: true, noCache: true });
  
  starImage = loadImage('star/star.png');

  // Lektion 1 Medien (Bilder und Videos)
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

  // Lektion 2 Medien (Bilder und Videos)
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

// Funktion zur Initialisierung der Anwendung
function setup() {
  createCanvas(800, 500);
  video = createCapture(VIDEO, { flipped: true }); // Webcam aktivieren
  video.hide();

  // Modelle starten und mit Webcam verbinden
  lektion1.classifyStart(video, gotResults);
  lektion2.classifyStart(video, gotResults);

  // Event-Listener für Buttons
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

  document.getElementById('startseite').addEventListener('click', function () {
    hideAbschlussMeldung();
    toggleMenu(true); // Zurück zur Startseite
  });
  
  document.getElementById('lektion-wiederholen-button').addEventListener('click', function () {
    hideAbschlussMeldung(); // Abschlussmeldung ausblenden
  
    // Überprüfe den aktuellen Zustand (state), um die richtige Lektion zu starten
    if (state === "lektion1") {
      startLektion1(); // Lektion 1 starten
    } else if (state === "lektion2") {
      startLektion2(); // Lektion 2 starten
    }
  });
}

// Ergebnisse der Klassifikation verarbeiten
function gotResults( results) {
  if (results[0].confidence > 0.99) {
    label = results[0].label;           // Erkannte Geste
  } else {
    label = "not recognized";           // Keine gültige Geste erkannt
  }
}

function startLektion1() {
  console.log("Starting Lektion 1");
  state = "lektion1"; // Zustand setzen
  console.log("State updated to:", state);
  currentIndex = 1;
  progressCount = 0;
  recognizedGestures.clear(); // Erkannten Gesten zurücksetzen
  label = "waiting...";
  toggleMenu(false);
  toggleLessonControls(true);
}

function startLektion2() {
  console.log("Starting Lektion 2");
  state = "lektion2"; // Zustand setzen
  console.log("State updated to:", state);
  currentIndex = 1;
  progressCount = 0;
  recognizedGestures.clear(); // Erkannten Gesten zurücksetzen
  label = "waiting...";
  toggleMenu(false);
  toggleLessonControls(true);
}

// Hauptmenü ein-/ausblenden
function toggleMenu(show) {
  const startseite = document.getElementById('startseite');
  if (startseite) {
    if (show) {
      console.log("Zeige Startseite an.");
      startseite.style.display = "block";
    } else {
      console.log("Verstecke Startseite.");
      startseite.style.display = "none";
    }
  } else {
    console.error("Element #startseite nicht gefunden.");
  }
}

// Steuerung der Lektion ein-/ausblenden
function toggleLessonControls(show) {
  console.log(`Toggling lesson controls: ${show}`);
  const lessonControls = document.getElementById('lesson-controls');
  if (lessonControls) {
    lessonControls.style.display = show ? "block" : "none";
  } else {
    console.error("Element mit ID 'lesson-controls' wurde nicht gefunden.");
  }
}

// Hauptzeichenfunktion
function draw() {
  background(245, 245, 220);

  if (state === "lektion1" || state === "lektion2") {
    drawState();
  }
}

let wordRecognized = false; 
//let progressCount = 1;
let isProgressUpdated = false;
let recognizedGestures = new Set(); // Speichert erkannte Gesten

// Medien und Benutzer-Video zeichnen
function drawState() {
  const startseite = document.getElementById('startseite');
  if (startseite && state !== "menu" && startseite.style.display !== "none") {
    console.warn("WARNUNG: Startseite sollte ausgeblendet sein, ist aber sichtbar.");
    startseite.style.display = "none"; // Erzwingt das Ausblenden
  }

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
  const mediaX = 70; // X-Position des Mediums
  const mediaY = 60; // Y-Position des Mediums 100

  // Aktuelles Medium anzeigen
  if (current.type === "image") {
    image(current.media, mediaX, mediaY, mediaSize, mediaSize);
  } else if (current.type === "video") {
    image(current.media, mediaX, mediaY, mediaSize, mediaSize);
    current.media.loop();
  }

  // Benutzer-Video
  const userVideoX = 350; // X-Position
  const userVideoY = 60; // Y-Position 100 
  const userVideoWidth = 320; // Breite
  const userVideoHeight = 240; // Höhe

  image(video, userVideoX, userVideoY, userVideoWidth, userVideoHeight);

  // Überprüfung, ob das aktuelle Wort erkannt wurde
  if (labels[currentIndex] === label && !recognizedGestures.has(labels[currentIndex])) {
    wordRecognized = true; // Zustand dauerhaft setzen
    recognizedGestures.add(labels[currentIndex]); // Geste zum Set hinzufügen
    progressCount += 1; // Fortschritt erhöhen
    console.log(`Erkannt: ${label}, Fortschritt: ${progressCount}`);
  }

  // Fortschrittsanzeige: Stern und Zahl nebeneinander
  const starSize = 40; 
  const starX = width / 2 - 40; 
  const starY = 15; 
  const textX = starX + starSize; 
  const textY = starY + starSize / 2; 

  // Sternsymbol anzeigen
  image(starImage, starX, starY, starSize, starSize);

  // Fortschrittszahl anzeigen
  textSize(24);
  textAlign(LEFT, CENTER); // Text linksbündig, vertikal zentriert
  fill(0);
  text(progressCount, textX, textY);

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

  // der aktuelle Gebaerde Medium anzeigen
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(labels[currentIndex], mediaX + mediaSize / 2, mediaY + mediaSize + 20); // Oberhalb des Mediums anzeigen

  // Erkannter Label
  text(label, userVideoX + userVideoWidth / 2, userVideoY + userVideoHeight + 30); // Unterhalb des Benutzer-Videos anzeigen

  // Fortschrittsanzeige in 2er-Schritten
  let totalGestures = state === "lektion1" ? media1.length : media2.length;

  // Anzeige des Fortschritts oben rechts
  text(`${currentIndex} / ${totalGestures}`, width / 2, 10); 
}

function keyPressed() {
  if (key === ' ') { // Leertaste
    console.log("Leertaste gedrückt");
    nextGesture();
  } else if (keyCode === ENTER) { // Enter-Taste
    console.log("Enter gedrückt");
    nextGesture();
  }
}

// Nächste Geste auswählen
function nextGesture() {
  // Button deaktivieren und Status zurücksetzen
  wordRecognized = false; // Rücksetzen für das nächste Medium
  currentIndex = (currentIndex + 1) % (state === "lektion1" ? media1.length : media2.length);

  label = "waiting...";

  const nextButton = document.getElementById('next-button');
  nextButton.style.backgroundColor = 'gray';
  nextButton.setAttribute('disabled', true); // Button deaktivieren
}

function showAbschlussMeldung() {
  const abschlussMeldung = document.getElementById('abschluss-meldung');
  abschlussMeldung.classList.remove('hidden'); // Abschlussmeldung anzeigen
  abschlussMeldung.style.display = 'block';

  const zurStartseiteButton = document.getElementById('zur-startseite-button');
  const lektionWiederholenButton = document.getElementById('lektion-wiederholen-button');

  console.log(`Aktueller Zustand (state): ${state}`); 

  // Dynamisch den Text und die Funktionalität des Buttons anpassen
  if (state === "lektion1") {
    lektionWiederholenButton.textContent = "Lektion 1 wiederholen";
    lektionWiederholenButton.onclick = function () {
      console.log("Lektion 1 Wiederholen-Button geklickt");
      hideAbschlussMeldung();
      startLektion1();
    };
  } else if (state === "lektion2") {
    lektionWiederholenButton.textContent = "Lektion 2 wiederholen";
    lektionWiederholenButton.onclick = function () {
      console.log("Lektion 2 Wiederholen-Button geklickt");
      toggleLessonControls(false);
      hideAbschlussMeldung();
      startLektion2();
    };
  } else {
    console.error(`Unbekannter Zustand: ${state}`);
  }

  // Button: Zur Startseite
  zurStartseiteButton.onclick = function () {
    console.log("Zur Startseite geklickt");
    state = "menu";
    toggleLessonControls(false);
    hideAbschlussMeldung();
    toggleMenu(true); // Zurück zur Startseite
  };

  // Punkteanzeige aktualisieren
  const punktzahl = progressCount;
  const abschlussText = document.getElementById('abschluss-text');
  abschlussText.textContent = `Lektion abgeschlossen, Punktzahl: ${punktzahl}`;
}

function hideAbschlussMeldung() {
  const abschlussMeldung = document.getElementById('abschluss-meldung');
  abschlussMeldung.classList.add('hidden'); // Abschlussmeldung verstecken
  abschlussMeldung.style.display = 'none';
}

// Lektion schließen
function closeLesson() {
  console.log("Schließe Lektion und zeige Abschlussmeldung.");
  toggleMenu(false);
  showAbschlussMeldung();
}