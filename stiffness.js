
const v_of_x = (x,k) => -k*x

const draw_stiffness = () => {
  let ctx = domelem("stiffness").getContext("2d")
  
  ctx.fillStyle="white"
  clear(ctx)
  // get stiffness and dt from UI
  let stiffness = parseInt(domelem("stiffness-k").value)
  domelem("stiffness-k-label").innerText="k="+stiffness
  let dt = parseFloat(domelem("stiff-dt").value)/1000
  domelem("stiff-dt-label").innerText="Δt="+dt.toFixed(2)
  // set domain width to number of steps
  let domain = {width: dt*20, height: 1.2, yoff: 0.5, xoff: 0}
  // integration
  let x_0 = 1

  let ts = Array.from(Array(Math.ceil(domain.width/dt)+1).keys()).map(x=>x*dt)
  let xs_euler_expl = [x_0]
  let xs_trapezoidal = [x_0]
  let xs_euler_impl = [x_0]
  for(const t of ts){
    if(t<dt){continue;}
    {
      // explicit euler
      let x = xs_euler_expl.at(-1);
      let v = v_of_x(x, stiffness)
      xs_euler_expl.push(x + v*dt)
    }
    {
      // implicit euler
      xs_euler_impl.push(xs_euler_impl.at(-1) / (1+stiffness*dt))
    }
    {
      // trapezoidal rule
      xs_trapezoidal.push(xs_trapezoidal.at(-1) * (1-stiffness/2*dt)/(1+stiffness/2*dt))
    }
  }

  // plot coordinate system
  plotCoordinateSystem(ctx, domain, "#888888", 2, "t", "x")
  // plot graphs
  plotGraph(ctx, ts, xs_euler_expl, domain, HTML_COLOURS.expl_eul, 2);
  plotGraph(ctx, ts, xs_euler_impl, domain, HTML_COLOURS.impl_eul, 2);
  plotGraph(ctx, ts, xs_trapezoidal, domain, HTML_COLOURS.trapezoidal, 2);
  // plot solution
  ctx.setLineDash([5, 5]);
  plotFunction(ctx, x => Math.exp(-x*stiffness), domain, "white", 2)
  ctx.setLineDash([]);
  // plot the time scale
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.strokeStyle="#888"
  ctx.beginPath();
  ctx.moveTo(w-20, h/2-10);
  ctx.lineTo(w-20, h/2+10);
  ctx.stroke();
  let time_label = ""+domain.width.toFixed(2)
  let measure = ctx.measureText(time_label)
  ctx.fillText(
    time_label, 
    w - measure.width, 
    h/2+30,
  )
  ctx.fillText(
    "0", 
    8, 
    h/2+20,
  )
}
setTimeout(()=>{draw_stiffness()}, 100)
domelem("stiffness-k").oninput = ()=>{draw_stiffness()}
domelem("stiff-dt").oninput = ()=>{draw_stiffness()}