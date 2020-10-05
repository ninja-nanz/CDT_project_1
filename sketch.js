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
let buttonSTN;
let buttonTakeAction;
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

var vid;
var playing = false;
var completion;
var introEnd = false;
var radialArcs = [];
var soundSpectrum;

//=========================================================================
// SETUP CODE
//=========================================================================

function preload() {
  
  headerFont = loadFont('/resources/VTCBayard-Regular.ttf');
  myFont1 = loadFont('/resources/VTCBayard-Regular.ttf');
  //myFont2 = loadFont('/resources/Courier.dfont');
  myFont3 = loadFont('/resources/VTCBayard-Regular.ttf');
  myFont4 = loadFont('/resources/VTCBayard-Regular.ttf');
  vid = createVideo("/resources/BLM_intro_new.mp4");
  bg = loadImage("resources/newbg.jpg");
  blm_chant = loadSound('resources/blm_chant_crop.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  col1 = color (196, 0, 0);
  col2 = color (60,179,113);
  col3 = color (235, 192, 52);
  
  vid.size(windowWidth, windowHeight); 
  vid.position(0,0);
  vid.play(); //auto play video on page load
  

  angleMode(DEGREES);
  colorMode(HSB,360,100,100)
  //createBackground();

  createButtons();
  createGlobalInputs(); // Create soundFile globally

  initRadialArcs();
  initSound();

  

  //FIREBASE
    // Our web app's Firebase configuration
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
  nameBoxInput.position(windowWidth - 630, windowHeight - 70);

  placeBoxInput = createInput().attribute('placeholder', 'YOUR REGION');
  placeBoxInput.position(windowWidth - 430, windowHeight - 70);

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
    buttonHey.position(windowWidth - 230, windowHeight - 70);

    buttonStop = createImg('./resources/stop.png');
    //buttonStop.style('background-color', col1);
    buttonStop.position(windowWidth - 230, windowHeight - 70);
    buttonStop.mousePressed(stopRecording);

    buttonRecord = createImg('./resources/record.png');
    //buttonRecord.style('background-color', col1);
    buttonRecord.position(windowWidth - 230, windowHeight - 70);
    buttonRecord.mousePressed(recordAudio);

    // buttonPlay = createButton('Play');
    // buttonPlay.style('background-color', col2);
    // buttonPlay.position(50, 110);
    // buttonPlay.mousePressed(playAudio);
    
    button = createButton('Submit');
    button.position(windowWidth - 120, windowHeight - 67);
    button.style('background-color', col3);
    // We pretend global variables nameBoxInput and soundFile exists
    button.mousePressed(newProtester)

    //buttonBLM = createButton('HEAR');
    //buttonBLM.position(10, windowHeight - 60);
    //buttonBLM.mousePressed(playBLM);

    buttonSTN = createButton('SAY THEIR NAMES');
    buttonSTN.position(50, windowHeight - 67);
    buttonSTN.style('background-color', col3);
    
    buttonTakeAction = createButton('TAKE ACTION');
    buttonTakeAction.position(230, windowHeight - 67);
    buttonTakeAction.style('background-color', col3);
  
}

//BACKGROUND 
function createBackground(){
  background(bg);
  textFont(headerFont);
  textSize(50)
  fill('#D7D7D7');
  noStroke();
  text('BLACK LIVES MATTER', 50, 60);
  textSize(60)
  text(protesters.length + ' VOICES', (windowWidth/2)-100, windowHeight - 25);
  //text('TAKE ACTION', 200, windowHeight - 50);


  
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

//function playBLM(){
//  blm_chant.play();
//}

//=========================================================================
// RADIAL ARCS
//=========================================================================


function initRadialArcs() {
  // pass settings into constructor (arcs,minRadius,maxRadius,baseline angle,maxStrokeWidth,minHue,maxHue)
  radialArcs[0] = new RadialArcs(40, height/2, width, 0, 1, 40, 50); // bass
  //radialArcs[1] = new RadialArcs(30, height/12, width, 1, 1, 255, 60); // treb
}

function updateRadialArcs() {
  radialArcs[0].updateArcs(getNewSoundDataValue("bass")); // bass
  //radialArcs[1].updateArcs(getNewSoundDataValue("bass")); // treb
}

function drawRadialArcs() {
  radialArcs[0].drawArcs(); // bass
  //radialArcs[1].drawArcs(); // treb
}

class RadialArcs { // -------------------------   RadialArcs Class -------------------------------
  constructor(arcCount, minR, maxR, baseR, maxStr, minH, maxH) {
    this.radialArcCount = arcCount;
    this.minRadius = minR;
    this.maxRadius = maxR;
    this.radialArcs = [];
    this.baselineR = baseR;
    this.maxStroke = maxStr;
    this.minHue = minH;
    this.maxHue = maxH;
    this.initArcs();
  }

  initArcs() {
    for(let a=0; a<this.radialArcCount; a++) { // create a new radialArc object x radialArcCount
      // pass vals into constructor (id,arcs,minRadius,maxRadius,cX, cY, baseline angle)
      this.radialArcs[a] = new RadialArc(a, this.radialArcCount, this.minRadius, this.maxRadius, this.baselineR, this.maxStroke, this.minHue, this.maxHue);   
    }
  }

  updateArcs(d)  {
    for(let a=this.radialArcs.length-1; a >= 0; a--) { // work backwards down array of arcs, 
      if(a>0) {
        this.radialArcs[a].setValue(this.radialArcs[a-1].getValue()); // taking value from arc in position ahead in array, so shifting values up the array of arcs by one.
      } else {
        this.radialArcs[a].setValue(d); // until last arc, update with new value from data
      }
    }
  }

  drawArcs()  {
    for(let a=0; a<this.radialArcs.length; a++) {  // loop through array of arcs calling "draw"
      this.radialArcs[a].redrawFromData();
    }
  }
}

class RadialArc { // -------------------------   RadialArc Class -------------------------------
  constructor(id, arcs, minR, maxR, baseR, maxStr, minH, maxH) {
    this.arcID = id;
    this.totalArcs = arcs;
    this.minRadius = minR; // min size of arc
    this.maxRadius = maxR; // max size of arc
    this.arcRadius = this.minRadius + (((this.maxRadius-this.minRadius)/this.totalArcs)*this.arcID+1); // size of THIS arc based on position in arcs
    this.maxStroke = maxStr;
    this.minHue = minH;
    this.maxHue = maxH;
    this.dataVal = 0;
    this.centerX = (windowWidth/2)-50; 
    this.centerY = windowHeight/2;
    this.arcMaxRadian = 20; // max length of arc around circumference
    this.arcBaseline = baseR;
    this.arcStartRadian = 0; // starting radian of arc
    this.arcEndRadian = 0; // end radian of this arc (based on data)
  }

  setValue(d) {
    this.dataVal = d;
  }

  getValue() {
    return this.dataVal;
  }

  redrawFromData() {
    this.updateArc();
    this.drawArc(); 
  }

  updateArc() {
    this.arcEndRadian = this.arcBaseline + (this.arcMaxRadian * this.dataVal); // start of arc (radians) based on data
    this.arcStartRadian = this.arcBaseline - (this.arcMaxRadian * this.dataVal); // end of arc (radians) based on data
  }

  drawArc() {
    this.dataColor = this.getDataHSBColor(this.dataVal); // get data scaled colour
    stroke(this.dataColor); // set stroke colour
    strokeWeight(map(this.dataVal,0,.5,0,this.maxStroke)); // set stroke weight based on data
    noFill(); // no fill in arc shape
    arc(this.centerX,this.centerY,this.arcRadius,this.arcRadius,this.arcStartRadian,this.arcEndRadian); // draw arc 
    arc(this.centerX,this.centerY,this.arcRadius,this.arcRadius,this.arcStartRadian-PI,this.arcEndRadian-PI); // draw reflected arc
  }

  getDataHSBColor(d) {
    this.dataHue = map(d,0,1,this.minHue,this.maxHue); // value moves across inout hue range
    this.dataSaturation = map(d,0,1,100,80); // higher value = lower saturation (more white, when combined with brightness)
    this.dataBrightness = map(d,0,1,10,100); // higher value = higher brightness (more white, when combined with saturation)
    return color(this.dataHue,this.dataSaturation,this.dataBrightness);
  }
}

function getNewSoundDataValue(freqType) {
  return map(fft.getEnergy(freqType),0,255,0,2); // get energy from frequency, scaled from 0 to 1
}

function initSound() {
  fft = new p5.FFT(0.4,1024); // (smoothing, bins)
  //soundFile.amp(0.7); 
}

function analyseSound() {
  soundSpectrum = fft.analyze(); // spectrum is array of amplitudes of each frequency
}

//=========================================================================
// PROTESTER CLASS
//=========================================================================
  
class Protester {
  constructor(name, soundFile) {
    this.x = random(width);
    this.y = random(100, height - 140);
    this.timestamp = new Date;
    this.speed = random(.5, 2);
    this.name = name;
    this.place = place;
    this.font = random([headerFont]); // swap out with string to test firebase
    this.soundFile = soundFile; // swap out with string to test firebase
    this.isBlocked = false;
    this.count = 0;
  }

  move() {
    this.x += this.speed;
    this.y = this.y; // add jiggle W

    if (this.x > width) {
      this.x = 0;
    }
  }

  display(mouseX, mouseY) {
    noFill();
    noStroke();
    rect(this.x, this.y-30, 80, 30);
    fill('#F6C516');
    textFont(this.font);
    textSize(50);
    text(this.name, this.x, this.y);
    this.mouseOnTop(mouseX, mouseY)

    //show date
    var dateMe = this.timestamp.getUTCMonth() + '.' + this.timestamp.getUTCDate() + '.' + this.timestamp.getUTCFullYear() 
    textFont(this.font);
    textSize(20);
     text(dateMe + ' ' + this.place, this.x, this.y+20);
     // text(this.place, this.x+60, this.y+20);
    if (mouseX && mouseY && this.isBlocked == false) {
      text(dateMe, this.x, this.y+20);
    } else {
      text('', this.x, this.y+20);
    }
    

  }

  mouseOnTop(mouseX, mouseY) {
    mouseXinBox = (this.x - 50 <= mouseX) && (mouseX <= this.x + 80);
    mouseYinBox = (this.y - 30 <= mouseY) && (mouseY <= this.y + 30);
    

    if (mouseXinBox && mouseYinBox && this.isBlocked == false) {
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
                                    soundFile=soundFile,
                                    place=placeBoxInput.value().toUpperCase()
                                    ); //place=placeBoxInput.value().toUpperCase(), 

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
  placeBoxInput.value('');
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
 

  
//Intro VIDEO
  background(0);
  
  completion = vid.time() / vid.duration();
  if (completion == 1) {
  vid.hide(); // main bg
  createBackground(); 
  analyseSound();
  updateRadialArcs();
  drawRadialArcs();

}

//PROTESTERS MOVING
  for (let i = 0; i < protesters.length; i++) {
    protesters[i].move();
    protesters[i].display(mouseX, mouseY);
  }

//=============WAVEFORM ==========
/*
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

/*
function mousePressed() {
  if (!playing) {
    vid.play();
    vid.time((mouseX/width) * vid.duration());
    playing = true;
  }
}
*/