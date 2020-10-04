//=========================================================================
// DECLARE VARIABLES
//=========================================================================

let headerFont, myFont1, myFont2, myFont3, myFont4;
let timer = 5;

let button;
let protesters = [];
let buttonRecord;
let buttonPlay;
let buttonStop;
let buttonBLM;
let col1, col2, col3;
let mic, recorder, soundFile;
let recordedAudio_ = false;
let counter = 0;
var nameBoxInput;

let mouseXinBox, mouseYinBox;
let mouseText;
let fft;
let bg;
let bg_alpha;
let blm_chant;

var database;

//=========================================================================
// SETUP CODE
//=========================================================================

function preload() {
  
  headerFont = loadFont('/resources/VTCBayard-Regular.ttf');
  myFont1 = loadFont('/resources/VTCBayard-Regular.ttf');
  //myFont2 = loadFont('/resources/Courier.dfont');
  myFont3 = loadFont('/resources/VTCBayard-Regular.ttf');
  myFont4 = loadFont('/resources/VTCBayard-Regular.ttf');
  blm_chant = loadSound('resources/blm_chant_crop.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg = loadImage("resources/asphalt.jpg");
  col1 = color (196, 0, 0);
  col2 = color (60,179,113);
  col3 = color (235, 192, 52);
  angleMode(DEGREES);
  createButtons();
  createBackground();
  createGlobalInputs(); // Create soundFile globally


  //FIREBASE

    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyC3vnH1MziFfhsd7YfzmPM8ozmguP-9KMQ",
      authDomain: "cdt-project-1.firebaseapp.com",
      databaseURL: "https://cdt-project-1.firebaseio.com",
      projectId: "cdt-project-1",
      storageBucket: "cdt-project-1.appspot.com",
      messagingSenderId: "655903075193",
      appId: "1:655903075193:web:564d41f7fe083229f75da8"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();

    console.log(firebase);
    
    
}

function createGlobalInputs() {
  // Text input
  nameBoxInput = createInput().attribute('placeholder', 'YOUR NAME');
  nameBoxInput.position(windowWidth - 450, windowHeight - 65);

  mic = new p5.AudioIn();   // create an audio in
  mic.start(); // enable browser mic  
  recorder = new p5.SoundRecorder(); // create a sound recorder
  recorder.setInput(mic); // connect the mic to the recorder
  soundFile = new p5.SoundFile(); // create an empty soundFile
  fft = new p5.FFT();
}

//RECORD BUTTONS

function createButtons() {
  buttonHey = createImg('./resources/play.png');
  buttonHey.position(windowWidth - 180, windowHeight - 65);

  buttonStop = createImg('./resources/stop.png');
  //buttonStop.style('background-color', col1);
  buttonStop.position(windowWidth - 180, windowHeight - 65);
  buttonStop.mousePressed(stopRecording);

  buttonRecord = createImg('./resources/record.png');
  //buttonRecord.style('background-color', col1);
  buttonRecord.position(windowWidth - 180, windowHeight - 65);
  buttonRecord.mousePressed(recordAudio);

  // buttonPlay = createButton('Play');
  // buttonPlay.style('background-color', col2);
  // buttonPlay.position(50, 110);
  // buttonPlay.mousePressed(playAudio);

  button = createButton('Submit');
  button.position(windowWidth - 100, windowHeight - 50);
  button.style('background-color', col3);
  // We pretend global variables nameBoxInput and soundFile
  // exists
  button.mousePressed(newProtester)

  buttonBLM = createButton('HEAR');
  buttonBLM.position(10, windowHeight - 60);
  buttonBLM.mousePressed(playBLM);
}

//BACKGROUND 
function createBackground(){
  background(bg);
  textFont(headerFont);
  textSize(50)
  fill(235, 192, 52);
  noStroke();
  text('BLACK LIVES MATTER', 50, windowHeight - 31);
  //textSize(25)
  //text("Enter your name", 50, 200);
  //fill(255, 255, 255, 80);
  //textSize(20)
  // text(counter + " voices", width-200, 200);
  //countdown();
  //text(timer, windowWidth - 150, windowHeight - 65);
}

//=========================================================================
// AUXILIARY AUDIO FUNCTIONS
//=========================================================================

function recordAudio() {
  recorder.record(soundFile);
  recordedAudio_ = true;
  buttonRecord.hide();
  console.log("recording");
}

function stopRecording() {
  recorder.stop();
  buttonStop.hide();
  console.log("soundfile created");
}

function playAudio() {
  soundFile.play();
}

function playBLM(){
  blm_chant.play();
}

//=========================================================================
// PROTESTER CLASS
//=========================================================================
  
class Protester {
  constructor(name, soundFile) {
    this.x = random(width);
    this.y = random(100, height - 140);
    this.speed = random(.5, 2);
    this.name = name;
    this.font = random([headerFont]); // swap out with string to test firebase
    this.soundFile = soundFile; // swap out with string to test firebase
    this.isBlocked = false;
    this.count = 0;
    // To add soundwave, timestamp, (maybe speechrecognition)
  }

  move() {
    this.x += this.speed;
    this.y = this.y;

    if (this.x > width) {
      this.x = 0;
    }
  }

  display(mouseX, mouseY) {
    noFill();
    rect(this.x, this.y-29, 50, 30);
    fill('#F6C516');
    textFont(this.font);
    textSize(40);
    text(this.name, this.x, this.y);
    this.mouseOnTop(mouseX, mouseY)
  }

  mouseOnTop(mouseX, mouseY) {
    mouseXinBox = (this.x - 50 <= mouseX) && (mouseX <= this.x + 80);
    mouseYinBox = (this.y - 30 <= mouseY) && (mouseY <= this.y + 30);
    if (mouseXinBox && mouseYinBox && this.isBlocked == false) {
      //console.log("hi");
      this.isBlocked = true;
      this.count = frameCount;
      this.soundFile.play();
      this.speed = 0;
    } 
    if (this.count < frameCount-100 && this.isBlocked==true){
      this.isBlocked = false;
      this.speed = random(.5, 2);
    }
  }
  
}

// Operates with global variables nameBoxInput and soundFile
function newProtester() {
  var protestorData = new Protester(name=nameBoxInput.value().toUpperCase(),
                                    soundFile=soundFile);

  if (recordedAudio_ && nameBoxInput.value().length>0) {
    protesters.push(protestorData);
    counter ++;
    soundFile = new p5.SoundFile(); // reset soundFile Global

    //PUSH TO FIREBASE
    var ref = database.ref('protestordata');
    console.log(protestorData)
    // ref.push(protestorData); //The functions in the soundFile and font is blocking push to firebase
  }
  else {
    if (nameBoxInput.value().length>0){
      text("Please enter your name")
    }
    if (recordedAudio_) {
      text("Please record your message")
    }
  }

  buttonRecord.show();
  buttonStop.show();
  nameBoxInput.value('');
  console.log('' +new Date);
}


function mouseOut() {
  return true;
}

function mouseReleased() {
  return true;
}

//=========================================================================
// DRAW PAGE
//=========================================================================

function draw() {
  createBackground();
  // TODO: Improve background or frame rates

//PROTESTERS MOVING
  for (let i = 0; i < protesters.length; i++) {
    protesters[i].move();
    protesters[i].display(mouseX, mouseY);
  }

//=============WAVEFORM ==========
  let waveform = fft.waveform();
  noFill();
  translate(windowWidth/2, windowHeight/2);
  beginShape();
  for (let i = 0; i < 360; i++){
    stroke(255);
    strokeWeight(10);
    //let x = map(i, 0, waveform.length, 350, 600);
    var r = map(waveform[i], 0, 3, 80, 150);
    var x = r * cos(i);
    var y = r * sin(i);
    //let y = map( waveform[i], -1, 1, 10, 1875);
    vertex(x,y);
  }
  endShape();

  /*
  beginShape();
  for (let i = 0; i < 360; i++){
    stroke(235, 192, 52);
    //let x = map(i, 0, waveform.length, 350, 600);
    var r = map(waveform[i], -1, 1, 100, 200);
    var x = r * cos(i);
    var y = r * sin(i);
    //let y = map( waveform[i], -1, 1, 10, 1875);
    vertex(x,y);
  }
  endShape();
  */

  beginShape();
  for (let i = 0; i < 360; i++){
    stroke(235, 192, 52);
    //let x = map(i, 0, waveform.length, 350, 600);
    var r = map(waveform[i], -1, 1, 300, 400);
    var x = r * cos(i);
    var y = r * sin(i);
    //let y = map( waveform[i], -1, 1, 10, 1875);
    vertex(x,y);
  }
  endShape();
  
  /*
  beginShape();
  for (let i = 0; i < 360; i++){
    stroke(235, 192, 52);
    //let x = map(i, 0, waveform.length, 350, 600);
    var r = map(waveform[i], 0, 1, 400, 500);
    var x = r * cos(i);
    var y = r * sin(i);
    //let y = map( waveform[i], -1, 1, 10, 1875);
    vertex(x,y);
  }
  endShape();
  */
  
}
