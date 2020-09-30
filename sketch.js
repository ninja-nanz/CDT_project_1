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
let col1, col2, col3;
let mic, recorder, soundFile;
let recordedAudio_ = false;
let counter = 0;
var nameBoxInput;

let mouseXinBox, mouseYinBox;
let mouseText;

let isHover = false;

//=========================================================================
// SETUP CODE
//=========================================================================

function preload() {
  headerFont = loadFont('/resources/VTCBayard-Regular.ttf');
  myFont1 = loadFont('/resources/CircularStd-Book.otf');
  //myFont2 = loadFont('/resources/Courier.dfont');
  myFont3 = loadFont('/resources/Karla-Bold.ttf');
  myFont4 = loadFont('/resources/Rubik-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(59, 59, 59);
  col1 = color (196, 0, 0);
  col2 = color (60,179,113);
  col3 = color (235, 192, 52);
  createButtons();
  createBackground();
  createGlobalInputs(); // Create soundFile globally
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
}

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
}

function createBackground(){
  background('#261F1D');
  textFont(headerFont);
  textSize(50)
  fill(235, 192, 52);
  noStroke();
  text('BLACK LIVES MATTER', 50 , windowHeight - 31);
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
  // console.log("recording");
}

function stopRecording() {
  recorder.stop();
  buttonStop.hide();
  // console.log("soundfile created");
}

function playAudio() {
  soundFile.play();
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
    this.font = random([headerFont]);
    this.soundFile = soundFile;
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
    fill('#261F1D');
    rect(this.x, this.y-29, 50, 30);
    fill('#F6C516');
    textFont(this.font);
    textSize(40);
    text(this.name, this.x, this.y);
    this.mouseOnTop(mouseX, mouseY)
  }

  mouseOnTop(mouseX, mouseY) {
    mouseXinBox = (this.x - 50 <= mouseX) && (mouseX <= this.x + 50);
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
  if (recordedAudio_ && nameBoxInput.value().length>0) {
    protesters.push(new Protester(name=nameBoxInput.value().toUpperCase(),
                                  soundFile=soundFile));
    counter ++;
    soundFile = new p5.SoundFile(); // reset soundFile Global
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


  for (let i = 0; i < protesters.length; i++) {
    protesters[i].move();
    protesters[i].display(mouseX, mouseY);
  }

  //let waveform = fft.waveform();
  // noFill();
  // beginShape();
  // for (let i = 0; i < waveform.length; i++){
  //   stroke(235, 192, 52);
  //   let x = map(i, 0, waveform.length, 730, 1200);
  //   let y = map( waveform[i], -1, 1, 0, 400);
  //   vertex(x,y);
  // }
  // endShape();
}
