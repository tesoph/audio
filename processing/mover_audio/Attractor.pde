class Attractor {
//Our Attractor is a simple object that doesn’t move. We just need a mass and a location.
  float mass;
  PVector location;
 float G= 1;
 PVector velocity;
  Attractor() {
    location = new PVector(width/2,height/2);
    mass = 60;
    velocity=new PVector(1,2);
  }
 
  void display() {
    stroke(0);
    fill(175,200);
    ellipse(location.x,location.y,20,20);
  }
  void update(){
 // location.add(velocity);
 }
  
  PVector attract(Mover m){
   PVector force = PVector.sub(location,m.location);
  float distance = force.mag();
  distance = constrain(distance,5,25);
  force.normalize();
//What’s the force’s magnitude?
  float strength = (G * mass * m.mass) / (distance * distance);
  force.mult(strength);
 
//Return the force so that it can be applied!
  return force;
  }
  
  PVector repel(Mover m){
   PVector force = PVector.sub(m.location,location);
  float distance = force.mag();
  distance = constrain(distance,5,25);
  force.normalize();
//What’s the force’s magnitude?
  float strength = (G * mass * m.mass) / (distance * distance);
  force.mult(strength);
 
//Return the force so that it can be applied!
  return force;
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
