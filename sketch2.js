let headerFont, myFont1, myFont2, myFont3, myFont4;
var input;
let button;
let names = [];
function preload() {
  headerFont = loadFont('/resources/BebasNeue-Regular.ttf');
  myFont1 = loadFont('/resources/CircularStd-Book.otf');
  myFont2 = loadFont('/resources/Courier.dfont');
  myFont3 = loadFont('/resources/Karla-Bold.ttf');
  myFont4 = loadFont('/resources/Rubik-Regular.ttf');
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
      this.speed = random(1, 4);
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
      fill(235, 192, 52);
      textFont(this.font);
      textSize(50);
      text(this.name, this.x, this.y);
    }
}

function draw() {
    background(59, 59, 59);
    textFont(headerFont);
    textSize(70)
    fill(235, 192, 52);
    text('Black Lives Matter', windowWidth/2, 100);
    textSize(30)
    text("Enter your name", 50, 230);
    for (let i = 0; i < names.length; i++) {
      names[i].move();
      names[i].display();
      //console.log(names)
    }
}