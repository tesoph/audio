
class Mover {

  //Our object has two PVectors: location and velocity.
  PVector location;
  PVector velocity;
  PVector acceleration;
  float topspeed;
  //float rad = radians(frameCount);
  //float angleCount = 7;    //// 1 - ...
  //float angle = getRandomAngle(direction);
  //boolean reachedBorder = false;
  float mass;
 // PVector wind=new PVector(0.01,0);
  
  Mover(float m_,float x_, float y_) {

    location = new PVector(x_, y_);
    velocity = new PVector(0, 0);
    acceleration = new PVector(-0.001, 0.01);
    topspeed=5;
    mass =m_;
  }

  void update() {
   // println(rad);
    //Motion 101: Location changes by velocity.
   // acceleration = PVector.random2D();
   // acceleration.normalize();
   //acceleration.mult(0.2);
    velocity.add(acceleration);
    velocity.limit(topspeed);
    location.add(velocity);
    acceleration.mult(0);
  }

  void display() {
    stroke(0);
    fill(175);
    rect(location.x,location.y,mass*10,mass*10);
   // ellipse(location.x, location.y, mass*10, mass*10);
   // line(width/2,height/2,location.x,location.y);
  }
 void applyForce(PVector force){
   //Making a copy of the PVector before using it!
   //PVector f =force.get();
   //f.div(mass);
  PVector f = PVector.div(force,mass);
   acceleration.add(f);
 }
 
  void checkEdges() {
    if (location.x > width) {
      // location.x = 0;
      velocity.x*=-1;
      // velocity.y *=-1;
    } else if (location.x < 0) {
      //  location.x = width;
      velocity.x*=-1;
      //  velocity.y *=-1;
    }

    if (location.y > height) {
      //  location.y = 0;
      velocity.y *=-1;
      //  velocity.x*=-1;
    } else if (location.y < 0) {
      // location.y = height;
      velocity.y*=-1;
      // velocity.x*=-1;
    }
  }

}
