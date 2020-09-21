let myFont1, myFont2;
var input;
let button;
let names = [];
function preload() {
  myFont1 = loadFont('/resources/BebasNeue-Regular.ttf');
  myFont2 = loadFont('/resources/Doctor_Glitch.otf')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(59, 59, 59);
  input = createInput();
  input.position(50, 300);
  button = createButton('Submit');
  button.position(50, 330);
  button.mousePressed(newName);
}

function newName() {
    fill(255,255,255)
    names.push(new Name(name=input.value()));
    //console.log(names)
  } 
  
  class Name {
    constructor(name) {
      this.x = random(width);
      this.y = random(400, height);
      this.speed = 1;
      this.name = name;
    }
  
    move() {
      this.x ++;
      this.y = this.y;
      
      if (this.x > width) {
      this.x = 0;
        
      }
    }
  
    display() {
      fill(235, 192, 52);
      textFont(myFont1);
      textSize(50);
      text(this.name, this.x, this.y);
    }
}

function draw() {
    background(59, 59, 59);
    textFont(myFont1);
    textSize(70)
    fill(235, 192, 52);
    text('Black Lives Matter', windowWidth/2, 100);
    text("Enter your name", 50, 230);
    for (let i = 0; i < names.length; i++) {
      names[i].move();
      names[i].display();
      //console.log(names)
    }
}