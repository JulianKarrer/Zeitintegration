// UTILS
const domelem = (name) => document.getElementById(name)

const HTML_COLOURS = {
  expl_eul: "#ff4a5d",
  semi_eul: "#fdb059",
  impl_eul: "#c1ff9a",
  adams_moult4: "#ffbb6e",
  adams_moult_3: "#ffc685",
  adams_moult2: "#ffd6a5",
  trapezoidal: "#f3e22e",
  impl_midpoint: "#9bf6ff",
  admas_bash4: "#77a5fe",
  glrk3: "#96c4fe",
  glrk4: "#9191fd",
  verlet: "#5cb8ff",
  naive_verlet: "#ae81ae",
  adams_bash2: "#ff5960",
  adams_bash3: "#ff6762",
  admas_bash4: "#ff8366",
  rk4: "#de58ff",
  rk3: "#ef8fff",
  rk2: "#ffc6ff",
}

// PLOTTING FUNCTIONS
const domainToCanvasSpace = (x, y, domain, w, h) => {return [
  x/domain.width*w - w*domain.xoff, 
  -y/domain.height*((1-domain.yoff)*h-10)+(1-domain.yoff)*h
]}

const graphInterpolate = (x,y,cur_x) => {
  let i = x.findIndex(elem => elem>=cur_x)
  let max = i>=0? y[i] : y.at(-1)
  let min = i>0? y[i-1] : y[0]
  if (i<0){min = y.at(-1)}
  let alpha = (cur_x-x[i-1])/(x[i]-x[i-1])
  alpha = alpha?alpha:0
  return min + alpha*(max-min)
}

const clear = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
} 

const plotFunction = (ctx, fn, domain, colour, width) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.beginPath();
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  [xInit,yInit] = domainToCanvasSpace(domain.width*domain.xoff,fn(domain.width*domain.xoff),domain,w,h)
  ctx.moveTo(xInit,yInit);
  for(let x = domain.width*domain.xoff; x<domain.width; x+=domain.width/w){
    [xCanv,yCanv] = domainToCanvasSpace(x,fn(x),domain,w,h)
    ctx.lineTo(xCanv,yCanv);
  }
  ctx.stroke();
}

const plotGraph = (ctx, x, y, domain, colour, width) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.beginPath();
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  let [xInit,yInit] = domainToCanvasSpace(x[0], y[0], domain, w, h)
  ctx.moveTo(xInit, yInit);
  for(let i = 0; i<x.length; i++){
    let [xVal,yVal] = domainToCanvasSpace(x[i], y[i], domain, w, h)
    ctx.lineTo(xVal, yVal);
  }
  ctx.stroke();
}


const plotGraphMap = (ctx, scatterMap, domain, colour, width, scale) => {  
  if (scatterMap && scatterMap.size <= 0) {return}
  let sorted = [...scatterMap.entries()].sort((a,b) => a[0] - b[0])
  let x = sorted.map((pair)=>pair[0])
  let y = sorted.map((pair)=>scale(pair[1]))
  let dom = {...domain, height: scale(domain.height)}

  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.beginPath();
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  let [xInit,yInit] = domainToCanvasSpace(x[0], y[0], dom, w, h)
  ctx.moveTo(xInit, yInit);
  for(let i = 0; i<x.length; i++){
    let [xVal,yVal] = domainToCanvasSpace(x[i], y[i], dom, w, h)
    ctx.lineTo(xVal, yVal);
  }
  ctx.stroke();
}

const plotScatterGraph = (ctx, scatterMap, domain, colour, width, scale) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  let dom = {...domain, height: scale(domain.height)}
  for (let [x, y] of scatterMap) {
    let [xVal,yVal] = domainToCanvasSpace(x, scale(y), dom, w, h)
    ctx.beginPath();
    ctx.arc(xVal, yVal, width, 0, 2 * Math.PI, false);
    ctx.fillStyle = colour;
    ctx.fill();
  }
}

const getScatterGraphBounds = (scatterMap) => {
  let Xmax = 0
  let Ymax = 0
  for (let [x, y] of scatterMap) {
    Xmax = Math.max(Xmax, x)
    Ymax = Math.max(Ymax, y)
  }
  return  {width: Xmax, height: Ymax, yoff: 0, xoff:0}
}

const boundsMax = (domA, domB) => {
  return {width: Math.max(domA.width, domB.width), height: Math.max(domA.height, domB.height), yoff: domA.yoff, xoff: domA.xoff}
}

const drawGraphError = (ctx, xs, ys, fn, domain, colour) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1;
  let error = 0
  for(let x = 0; x<domain.width; x+=domain.width/w){
    [xFunc,yFunc] = domainToCanvasSpace(x,fn(x),domain,w,h);
    let yGraph = graphInterpolate(xs, ys, x);
    [xGraphCanv,yGraphCanv] = domainToCanvasSpace(x,yGraph,domain,w,h);
    ctx.beginPath();
    ctx.moveTo(xFunc,yFunc);
    ctx.lineTo(xGraphCanv,yGraphCanv);
    ctx.stroke();
    error += Math.abs(fn(x)-yGraph)*(domain.width/w)
  }
  return error
} 

const calculateGraphError = (xs, ys, fn, domain, ctx)=>{
  const w = ctx.canvas.width
  let error = 0
  for(let x = 0; x<domain.width; x+=domain.width/w){
    let yGraph = graphInterpolate(xs, ys, x);
    error += Math.abs(fn(x)-yGraph)*(domain.width/w)
  }
  return error
}

const plotCoordinateSystem = (ctx, domain, colour, width, xlabel, ylabel) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;

  // horizontal line
  ctx.beginPath();
  let [x,y] = domainToCanvasSpace(-domain.width, 0, domain, w, h)
  ctx.moveTo(x, y);
  [x,y] = domainToCanvasSpace(domain.width, 0, domain, w, h)
  ctx.lineTo(x, y);
  ctx.stroke();
  // vertical line
  ctx.beginPath();
  [x,y] = domainToCanvasSpace(0.01, -domain.height, domain, w, h)
  ctx.moveTo(x, y);
  [x,y] = domainToCanvasSpace(0.01, domain.height, domain, w, h)
  ctx.lineTo(x, y);
  ctx.stroke();
  // label
  ctx.font = "20px Quicksand";
  ctx.fillStyle = colour;
  let measure = ctx.measureText(xlabel)
  ctx.fillText(
    xlabel, 
    w - measure.width - 5, 
    h*(1-domain.yoff)-10
  )
  ctx.fillText(ylabel, 20 - domain.xoff*w, 22)
  // arrow tip horizontal
  ctx.beginPath();
  [x,y] = domainToCanvasSpace(domain.width, 0, domain, w, h)
  ctx.moveTo(x, y);
  ctx.lineTo(x-15, y-5);
  ctx.lineTo(x-15, y+5);
  ctx.fill();
  // arrow tip vertical
  ctx.beginPath();
  [x,y] = domainToCanvasSpace(0.01, domain.height, domain, w, h)
  ctx.moveTo(x, y);
  ctx.lineTo(x+5, y+15);
  ctx.lineTo(x-5, y+15);
  ctx.fill();
}


// integration schemes
const approximateFnFrom2ndDeriv = (x_0, v_0, fn_deriv_2, dt, tmax, scheme) => {
  let ts = [0]
  let xs = [x_0]
  let x = x_0 
  let v = v_0
  for(let t_cur = 0; t_cur<=tmax; t_cur+=dt){
    [x,v] = scheme(x,v,dt,fn_deriv_2, xs)
    ts.push(t_cur)
    xs.push(x)
  }
  return [ts,xs]
}

const explicitEuler = (x,v,dt,fn_deriv_2, xs) => {
  let a = fn_deriv_2(x)
  let new_x = x + v*dt
  let new_v = v + a*dt
  return [new_x, new_v]
}
const semiImplicitEuler = (x,v,dt,fn_deriv_2, xs) => {
  let a = fn_deriv_2(x)
  let newV = v + a*dt
  let newX = x + newV*dt
  return [newX, newV]
}
// const rungeKutta2Heun = (x,v,dt,fn_deriv_2, xs) => {
//   let a = fn_deriv_2(x)
//   let xStar = x + v*dt
//   let vStar = v + a*dt
//   let aStar = fn_deriv_2(xStar)
//   let newX = x+dt*(v+vStar)/2
//   let newV = v+dt*(a+aStar)/2
//   return [newX, newV]
// }
const rungeKutta4 = (x,v,dt,fn_deriv_2, xs) => {
  // 1
  let a = fn_deriv_2(x)
  let x_s = x + dt/2*v
  let v_s = v + dt/2*a
  // 2
  let a_s = fn_deriv_2(x_s)
  let x_ss = x + dt/2*v_s
  let v_ss = v + dt/2*a_s
  // 3
  let a_ss = fn_deriv_2(x_ss)
  let x_sss = x + dt*v_ss
  let v_sss = v + dt*a_ss
  // 4
  a_sss = fn_deriv_2(x_sss)
  // result
  let newX = x + dt*(v + 2*v_s + 2*v_ss + v_sss)/6
  let newV = v + dt*(a + 2*a_s + 2*a_ss + a_sss)/6
  return [newX, newV]
}
const verlet = (x,v,dt,fn_deriv_2, xs) => {
  if (xs.length <= 1) {return explicitEuler(x,v,dt,fn_deriv_2,xs);}
  let a = fn_deriv_2(x)
  let newX = 2*x - xs.at(-2) + dt*dt*a
  return [newX, v]
}

// plot manipulation
const scaleLog = y => Math.log(y)
const scaleLin = y => y
const scaleSqt = y => Math.sqrt(y)


// ERROR ORDER GRAPHS
const sin = (x)=>Math.sin(x*(2*Math.PI)/5 + Math.PI/2)
const deriv2 = (x)=>-(4*Math.PI*Math.PI)/25*x
let errorExplicit = new Map()
let errorSemiImplicit = new Map()
let errorVerlet = new Map()
let errorRk4 = new Map()
renderErrorOrder = ()=>{
  // read settings from sliders
  let h = parseInt(domelem("error-order-dt").value)
  let dt = h / 2000
  domelem("error-order-dt-label").innerText = "Δt="+dt.toFixed(3)
  let domWidth = parseInt(domelem("error-order-domain").value)
  domelem("error-order-domain-label").innerText = "Domain: "+ domWidth
  let domain = {width: domWidth, height: 6, yoff: 0.5, xoff:0}
  let showError = domelem("error-show-integral").checked
  // create context and draw graphs
  let ctx = domelem("error-order").getContext("2d")
  clear(ctx)
  plotFunction(ctx, sin, domain, "#666666", 2)


  let [t,x] = approximateFnFrom2ndDeriv(1, 0, deriv2, dt, domain.width, explicitEuler);
  if (error_show_functions.get("error-button-ee")){plotGraph(ctx, t, x, domain, HTML_COLOURS.expl_eul, 2);}
  if (showError){
    errorExplicit.set(h, drawGraphError(ctx, t, x, sin, domain, "rgba(255,74,93, 0.2)")) 
  } else {
    errorExplicit.set(h, calculateGraphError(t, x, sin, domain, ctx))
  }

  [t,x] = approximateFnFrom2ndDeriv(1, 0, deriv2, dt, domain.width, semiImplicitEuler);
  if (error_show_functions.get("error-button-se")){plotGraph(ctx, t, x, domain, HTML_COLOURS.semi_eul, 2);}
  if (showError){
    errorSemiImplicit.set(h, drawGraphError(ctx, t, x, sin, domain, "rgba(253,176,89, 0.2)")) 
  } else {
    errorSemiImplicit.set(h, calculateGraphError(t, x, sin, domain, ctx))
  }
  
  [t,x] = approximateFnFrom2ndDeriv(1, 0, deriv2, dt, domain.width, verlet);
  if (error_show_functions.get("error-button-ve")){plotGraph(ctx, t, x, domain, HTML_COLOURS.verlet, 2);}
  errorVerlet.set(h, calculateGraphError(t, x, sin, domain, ctx));

  [t,x] = approximateFnFrom2ndDeriv(1, 0, deriv2, dt, domain.width, rungeKutta4);
  if (error_show_functions.get("error-button-rk")){plotGraph(ctx, t, x, domain, HTML_COLOURS.rk4, 2);}
  errorRk4.set(h, calculateGraphError(t, x, sin, domain, ctx));

  plotCoordinateSystem(ctx, domain, "white", 2, "t", "x")

  // create context and draw error plots
  ctx = domelem("error-magnitude").getContext("2d")
  clear(ctx)
  domain = getScatterGraphBounds(errorRk4)
  domain = boundsMax(getScatterGraphBounds(errorSemiImplicit), domain)
  domain = boundsMax(getScatterGraphBounds(errorVerlet), domain)
  let scale = domelem("error-logscale").checked ? scaleLog : scaleLin;
  plotGraphMap(ctx, errorExplicit, domain, HTML_COLOURS.expl_eul, 3, scale)
  plotGraphMap(ctx, errorRk4, domain, HTML_COLOURS.rk4, 3, scale);
  plotGraphMap(ctx, errorVerlet, domain, HTML_COLOURS.verlet, 3, scale);
  plotGraphMap(ctx, errorSemiImplicit, domain, HTML_COLOURS.semi_eul, 3, scale);
  plotCoordinateSystem(ctx, domain, "white", 2, "Δt", "Error")
}


// SET UP LISTENERS AN UPDATE EVENTS
// re-render
setTimeout(renderErrorOrder,100)
domelem("error-show-integral").onchange = ()=>{renderErrorOrder()}
domelem("error-logscale").onchange = ()=>{renderErrorOrder()}
domelem("error-order-dt").oninput = ()=>{renderErrorOrder()}
domelem("error-order-domain").oninput = ()=>{
  errorExplicit = new Map()
  errorSemiImplicit = new Map()
  errorVerlet = new Map()
  errorRk4 = new Map()
  renderErrorOrder()
}
// update which graph to show
const updateErrorGraphLayout = ()=>{
  if(Reveal.getState().indexf >= 0){
    domelem("error-graphs").classList.add("swapped")
  } else {
    domelem("error-graphs").classList.remove("swapped")
  }
}
updateErrorGraphLayout()
Reveal.on( 'slidechanged', () => { updateErrorGraphLayout()} )
Reveal.on( 'fragmentshown', () => { updateErrorGraphLayout()} );
Reveal.on( 'fragmenthidden', () => { updateErrorGraphLayout()} );
// update available timesteps
domelem("error-big-dt").onchange = (e)=>{domelem("error-order-dt").max = e.target.checked?5000:1000}
