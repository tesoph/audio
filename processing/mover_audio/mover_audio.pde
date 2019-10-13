//Code adapted from Nature of Code chapters 1-3

import ddf.minim.*;
import ddf.minim.analysis.*;

Minim minim;
AudioInput song;
BeatDetect beat;
BeatListener bl;
AudioInput in;

//Declare Mover object.
Mover mover;
Mover[] movers = new Mover[250];
Attractor a;
// PVector wind=new PVector(900,0);PVector gravity = new PVector(0,0.1);
PVector gravity = new PVector(0,0.1);
void setup() {
  size(displayWidth, displayHeight);
  background(0);
  //Create Mover object.
  //mover = new Mover(width/2, height/2);
  for (int i = 0; i < movers.length; i++) {
    movers[i] = new Mover(2,width/2+random(-10,10), height/2);
  }
  a=new Attractor();
  
  
  
 minim = new Minim(this);
 
 song =  minim.getLineIn(minim.STEREO, 2048);
  beat = new BeatDetect(song.bufferSize(), song.sampleRate());
beat.setSensitivity(100);  
// kickSize = snareSize = hatSize = 16;
 // make a new beat listener, so that we won't miss any buffers for the analysis
 bl = new BeatListener(beat, song);  
}

void draw() {
  //println(movers.length);
  //background(0);
  noStroke();
  fill(0, 0, 0, 5); 
  rect(0, 0, width, height);
  stroke(0);
  a.display();
  a.update();
  a.checkEdges();
  //Call functions on Mover object.
  // mover.update();
  //mover.checkEdges();
  //mover.display();
  for (int i = 0; i < movers.length; i++) {
    // movers[i].applyForce(wind);
    //movers[i].applyForce(gravity);
    if(beat.isKick()==false){
    PVector f = a.attract(movers[i]);
    //f.normalize();
    f.mult(1);
    movers[i].applyForce(f);}
    
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
   // movers[i].applyForce(gravity);
    
   if (beat.isKick()) {
  PVector t=a.repel(movers[i]);
 // t.normalize();
  t.mult(5);
  movers[i].applyForce(t);
}
  }
   for(int i = 0; i < beat.detectSize(); ++i)
  {
    // test one frequency band for an onset
    if ( beat.isOnset(i))
    {
     // fill(0,200,0);
     // rect( i*10, 0, 10, height);
    }
  }
  int lowBand = 0;
  int highBand = 6;
  // at least this many bands must have an onset 
  // for isRange to return true
  int numberOfOnsetsThreshold = 3;
  if ( beat.isRange(lowBand, highBand, numberOfOnsetsThreshold) )
  {
    //fill(232,179,2,200);
    //rect(10*lowBand, 0, (highBand-lowBand)*10, height);
  }
}
 
void keyReleased() {
  if (key == 's' || key == 'S') {
    String stamp = timestamp("Project", ".png");
    println(stamp);
    String path = dataPath(stamp);
    println(path);
    saveFrame(path);
  }
}

static final String timestamp(final String name, final String ext) {
  return name + "-" + year() + nf(month(), 2) + nf(day(), 2) +
    "-" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2) + ext;
}

 
class BeatListener implements AudioListener
{
 private BeatDetect beat;
 private AudioInput source;
 
 BeatListener(BeatDetect beat, AudioInput source)
 {
   this.source = source;
   this.source.addListener(this);
   this.beat = beat;
 }
 
 void samples(float[] samps)
 {
   beat.detect(source.mix);
 }
 
 void samples(float[] sampsL, float[] sampsR)
 {
   beat.detect(source.mix);
 }
}
