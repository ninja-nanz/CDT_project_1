
let state = 0; // mousePress will increment from Record, to Stop, to Play
let button;
let mic, recorder, soundFile;
var sum_vol = 0, avg_vol = 0;
var w = 0;
var audio = [];

let myFont1, myFont2;

function preload() {
  myFont1 = loadFont('/resources/BebasNeue-Regular.ttf');
  myFont2 = loadFont('/resources/Doctor_Glitch.otf')
}


function setup() {        
  createCanvas(windowWidth, windowHeight);
  background(59, 59, 59);
  noStroke();
  textFont(myFont1);
 
  //createA('collective.html', 'collective');

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

function displayText() {
  textSize(70)
  fill(235, 192, 52);
  text('Black Lives Matter', 40, 100);

  textSize(30)
  text('Enable mic and click mouse to begin recording', 40, 180);
}


function draw() { 
  //background(59, 59, 59);

  clear();
  displayText();

 
 
  var vol = mic.getLevel();
  sum_vol += vol;
  if(frameCount%10==0) {
    avg_vol = map(sum_vol, 0, 5, 0, 200);
    sum_vol = 0;
  }
	w += 1*(avg_vol-w)+10;
	audio.push(w);
  ellipse(width*.5, height*.5, w+22, w+22);
  


}



function mousePressed() {
  // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
  if (state === 0 && mic.enabled) {
    // Tell recorder to record to a p5.SoundFile which we will use for playback
    recorder.record(soundFile);

    background(220,20,60);
    fill(235, 192, 52);
    text('Recording now! \nClick to stop.', 40, 180);
    state++;
  } else if (state === 1) {
    recorder.stop(); // stop recorder, and send the result to soundFile

    background(60,179,113);
    text('Recording stopped. \nClick to play', 40, 180);
    state++;
  } else if (state >= 2) {
    soundFile.play(); // play the result!
    //saveSound(soundFile, 'mySound.wav'); // save file
    background(59, 59, 59);
    text('Playing', 40, 180);
    button = createButton('Add to collective');
    button.position(40, 200);
    button.mousePressed(openCollective)
    state++;
  }

} 

function openCollective() {
  window.location.replace("collective.html");
  console.log('button is working')

}