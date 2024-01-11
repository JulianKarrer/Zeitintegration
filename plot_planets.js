
let sketch1 = function(p) {
  let earth
  let sun
  let xs = []
  let vs = []
  let GM = 100
  let r = 150
  let playing = false
  zoom = 0
  let dt = 15
  let wish_dt = 15

  const grav_acc = (x) => {
    let r = Math.max(Math.sqrt(x.x*x.x+x.y*x.y), 1);
    let a = p5.Vector.mult(p5.Vector.normalize(x), -GM/(r*r))
    return a
  }

  const semiimplicit = (xs, vs, dt)=>{
    let a = grav_acc(xs.at(-1))
    let vnew = p5.Vector.add(vs.at(-1), p5.Vector.mult(a, dt))
    let xnew = p5.Vector.add(xs.at(-1), p5.Vector.mult(vnew, dt))
    vs.push(vnew)
    xs.push(xnew)
  }
  const explicit = (xs, vs, dt)=>{
    let a = grav_acc(xs.at(-1))
    let vnew = p5.Vector.add(vs.at(-1), p5.Vector.mult(a, dt))
    let xnew = p5.Vector.add(xs.at(-1), p5.Vector.mult(vs.at(-1), dt))
    vs.push(vnew)
    xs.push(xnew)
  }
  const verlet = (xs, vs, dt)=>{
    let a = grav_acc(xs.at(-1))
    if (xs.length <= 1) {
      // initialize
      let xnew = p5.Vector.add(
        xs.at(-1),
        p5.Vector.add(
          p5.Vector.mult(vs.at(-1), dt),
          p5.Vector.mult(a, dt*dt*0.5),
        )
      )
      xs.push(xnew)
    } else {
      // normal verlet
      let xnew = p5.Vector.sub(
        p5.Vector.mult(xs.at(-1), 2),
        p5.Vector.add(xs.at(-2), p5.Vector.mult(a, -dt*dt))
      )
      xs.push(xnew)
    }
  }
  const verletbad = (xs, vs, dt)=>{
    let a = grav_acc(xs.at(-1))
    if (xs.length <= 1) {
      // initialize
      return explicit(xs, vs, dt);
    } else {
      // normal verlet
      let xnew = p5.Vector.sub(
        p5.Vector.mult(xs.at(-1), 2),
        p5.Vector.add(xs.at(-2), p5.Vector.mult(a, -dt*dt))
      )
      xs.push(xnew)
    }
  }

  const init = ()=>{
    xs = [
      [p.createVector(r, 0)],
      [p.createVector(r, 0)],
      [p.createVector(r, 0)],
      [p.createVector(r, 0)],
    ]
    vs = [
      [p.createVector(0, -Math.sqrt(GM/r))],
      [p.createVector(0, -Math.sqrt(GM/r))],
      [p.createVector(0, -Math.sqrt(GM/r))],
      [p.createVector(0, -Math.sqrt(GM/r))],
    ]
    dt = wish_dt
  }

  const scroll_zoom = (event)=>{
    zoom -= event.deltaY/1000
  }

  p.setup = function() {
    let cnv = p.createCanvas(700, 700, domelem("planets1"));
    p.background(0, 0);
    p.imageMode(p.CENTER);
    earth = p.loadImage("earth.png");
    sun = p.loadImage("sun.png");
    last_time = p.millis()
    init()
    // restart on click
    cnv.mouseClicked(()=>{playing = true; init();});
    cnv.mouseWheel(scroll_zoom);
  };


  const drawTrajectory = (xs, vs, p, dt, colour, integrate) => {
    integrate(xs, vs, dt)
    if (xs.length > 200) {xs.shift()}

    // draw trajectory
    p.push()
      let prev = xs[0]
      for (let i=0; i<xs.length; i++){
        let c = p.color(colour)
        c.setAlpha( i/xs.length * 255)
        p.stroke(c)
        p.line(prev.x, prev.y, xs[i].x, xs[i].y)
        prev = xs[i]
      }
    p.pop()
    // draw earth
    p.push()
      p.translate(xs.at(-1).x, xs.at(-1).y);
      p.rotate(p.millis()/1000) // make earth rotate around itself
      p.image(earth, 0, 0, 30, 30);
    p.pop()
  } 

  p.draw = function() {
    // clear
    p.clear()
    p.fill(0,0,0,0);
    p.translate(p.width / 2, p.height / 2);
    p.scale(Math.exp(zoom))

    // draw optimal trajectory
    p.circle(0,0,r*2);
    p.stroke(p.color("#fff"))

    if (playing) {
      // drawTrajectory(xs[0], vs[0], p, dt, HTML_COLOURS.semi_eul, semiimplicit)
      drawTrajectory(xs[1], vs[1], p, dt, HTML_COLOURS.expl_eul, explicit)
      drawTrajectory(xs[2], vs[2], p, dt, HTML_COLOURS.verlet, verlet)
      drawTrajectory(xs[3], vs[3], p, dt, HTML_COLOURS.naive_verlet, verletbad)
    }

    // draw the sun
    p.image(sun, 0, 0, 150, 150);

    // query slider position
    wish_dt = parseFloat(domelem("verlet-init-dt").value)
    domelem("verlet-init-dt-label").innerText = "Δt="+wish_dt.toFixed(0)
  };
};

let planets1 = new p5(sketch1);