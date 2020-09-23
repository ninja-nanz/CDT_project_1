let headerFont, myFont1, myFont2, myFont3, myFont4;
let timer = 5
let button;
let names = [];
let buttonRecord;
let buttonPlay;
let buttonStop;
let col1, col2, col3;
let mic, recorder, soundFile;
var input;
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
  input = createInput();
  input.position(50, 220);
  button = createButton('Submit');
  button.position(50, 250);
  button.style('background-color', col3);
  button.mousePressed(newName);
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
  fft = new p5.FFT();

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
}

function recordAudio() {
  recorder.record(soundFile);
}

function stopRecording() {
  recorder.stop();
}

function playAudio() {
  soundFile.play();
}


function newName() {
    fill(255,255,255)
    names.push(new Name(name=input.value()));
    //console.log(names)
  } 
  
  class Name {
    constructor(name) {
      this.x = random(width);
      this.y = random(300, height);
      this.speed = random(.5, 2);
      this.name = name;
      this.font = random([myFont1,myFont3,myFont4]);
    }
  
    move() {
      this.x += this.speed;
      this.y = this.y;

      
      if (this.x > width) {
      this.x = 0;
        
      }
    }
  
    display() {
      fill(255, 255, 255, 80);
      textFont(this.font);
      textSize(30);
      text(this.name, this.x, this.y);
    }
}

function draw() {
    background(59, 59, 59);
    textFont(headerFont);
    textSize(70)
    fill(235, 192, 52);
    noStroke();
    text('Black Lives Matter', (windowWidth/2)-150, 100);
    textSize(30)
    text("Enter your name", 50, 200);

    for (let i = 0; i < names.length; i++) {
      names[i].move();
      names[i].display();
      //console.log(names)
    }

    let waveform = fft.waveform();
    noFill();
    beginShape();
    for (let i = 0; i < waveform.length; i++){
      stroke(235, 192, 52);
      let x = map(i, 0, waveform.length, 730, 1200);
      let y = map( waveform[i], -1, 1, 0, 400);
      vertex(x,y);
    }
    endShape();
}