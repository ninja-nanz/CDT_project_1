let myFont1, myFont2;
function preload() {
  myFont1 = loadFont('/resources/BebasNeue-Regular.ttf');
  myFont2 = loadFont('/resources/Doctor_Glitch.otf')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(59, 59, 59);
  textFont(myFont1);
  textSize(70)
  fill(235, 192, 52);
  text('Black Lives Matter', windowWidth/2, 100);
}

function draw() {
}
