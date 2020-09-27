//=========================================================================
// DECLARE VARIABLES
//=========================================================================

let headerFont, myFont1, myFont2, myFont3, myFont4;
let timer = 5
let button;
let protesters = [];
let buttonRecord;
let buttonPlay;
let buttonStop;
let col1, col2, col3;
let mic, recorder, soundFile;
let counter = 0;
var input;

//=========================================================================
// SETUP CODE
//=========================================================================

function preload() {
  headerFont = loadFont('/resources/BebasNeue-Regular.ttf');
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
}

function createButtons() {
  buttonRecord = createButton('Record');
  buttonRecord.style('background-color', col1);
  buttonRecord.position(50, 80);
  buttonRecord.mousePressed(recordAudio);

  buttonStop = createButton('Stop');
  buttonStop.style('background-color', col1);
  buttonStop.position(120, 80);
  buttonStop.mousePressed(stopRecording);
  
  buttonPlay = createButton('Play');
  buttonPlay.style('background-color', col2);
  buttonPlay.position(50, 110);
  buttonPlay.mousePressed(playAudio);

  input = createInput();
  input.position(50, 220);
  
  button = createButton('Submit');
  button.position(50, 250);
  button.style('background-color', col3);
  button.mousePressed(newProtester);  
}

//=========================================================================
// AUXILIARY AUDIO FUNCTIONS
//=========================================================================

function recordAudio() {
  // create an audio in
  mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();

  recorder.record(soundFile);
  
  return soundFile;
}

function stopRecording() {
  recorder.stop();
}

function playAudio() {
  soundFile.play();
}


function newProtester() {
  fill(255,255,255);
  
  soundFile = 'hola'
  protesters.push(new Protester(name=input.value(),
                                soundFile=soundFile));
  counter ++;
  //console.log(protesters)
} 

//=========================================================================
// PROTESTER CLASS
//=========================================================================
  
  class Protester {
    constructor(name, soundFile) {
      this.x = random(width);
      this.y = random(300, height);
      this.speed = random(.5, 2);
      this.name = name;
      this.font = random([myFont1,myFont3,myFont4]);
      this.soundFile = soundFile;
      this.name = name+soundFile;
    }
  
    move() {
      this.x += this.speed;
      this.y = this.y;

      if (this.x > width) {
        this.x = 0;
      }
    }
  
    display() {
      fill(59,59,59);
      rect(this.x, this.y-29, 150, 30);
      fill(255, 255, 255, 80);
      textFont(this.font);
      textSize(30);
      text(this.name, this.x, this.y);
    }
}

//=========================================================================
// DRAW PAGE
//=========================================================================

function draw() {
  //background(59, 59, 59);
  textFont(headerFont);
  textSize(70)
  fill(235, 192, 52);
  noStroke();
  text('Black Lives Matter', (windowWidth/2)-150, 100);
  textSize(30)
  text("Enter your protester", 50, 200);
  fill(255, 255, 255, 80);
  textSize(20)
  text(counter + " voices", width-200, 200);

  for (let i = 0; i < protesters.length; i++) {
    protesters[i].move();
    protesters[i].display();
    //console.log(protesters)
  }

  // let waveform = fft.waveform();
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