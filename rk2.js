const euler_tangent_t = (t, offy) => (x) => euler_fn(t) + euler_fn_deriv(t)*(x-t) - offy

let rk2_state = 0
const draw_rk2 = (time) => {
  const ctx = domelem("rk2").getContext("2d")
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  ctx.fillStyle="white"
  clear(ctx)
  
  // helper functions
  const dot_label = (x,y,label,colour,below,width) => {
    ctx.fillStyle = colour;
    let measure = ctx.measureText(label)
    let [ox,oy] = domspace(x,y)
    ctx.fillText(
      label, 
      ox - measure.width/2, 
      oy + (below?25:-10),
    )
    ctx.beginPath()
    ctx.arc(ox, oy, width, 0, 2 * Math.PI)
    ctx.fill()
  }  
  let domain = {width: 4.5, height: 6, yoff: 0.5, xoff: -0.5}
  const domspace = (x,y)=>{
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    return [(x/domain.width)*w+w/2, -(y/domain.height/(1.55*domain.height/domain.width))*h+h/2]
  }
  const arrow_tip_new = (x, y, is_x, sign) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (is_x?-15:5) * (sign), y+(is_x?-5:15) * (sign));
    ctx.lineTo(x + (is_x?-15:-5)* (sign), y+(is_x? 5:15) * (sign));
    ctx.fill();
  };

  // draw coordinate system
  arrow_tip_new(width,height/2,true,1);
  plotCoordinateSystem(ctx, domain, "white", 2, "t", "x")

  // draw analytic function
  plotFunction(ctx, euler_fn, domain, "#ffffff88", 2)

  // draw method
  ctx.font = "30px Quicksand";
  let font_colour = HTML_COLOURS.rk2
  let fn_colour = HTML_COLOURS.rk2
  let slope = euler_tangent_t(1.5, 0.45)(2)-euler_tangent_t(1.5, 0.45)(1)
  let final_est = (x)=>slope*(x-1)+euler_fn(1)
  if (rk2_state===0){
    plotFunction(ctx, euler_tangent_xt_1, domain, fn_colour+"ff", 2)
    dot_label(1.5, euler_fn(1.5)-0.45, "",   "white", true , 3)
    ctx.fillStyle = font_colour
    ctx.fillText("1. half Euler step",  width/20,  height/4)
  } else if (rk2_state===1){
    plotFunction(ctx, euler_tangent_t(1.5, 0.45), domain, fn_colour+"ff", 2)
    ctx.fillStyle = font_colour
    ctx.fillText("2. get v(t+0.5h)",  width/20,  height/4)
  } else {
    plotFunction(ctx, final_est, domain, fn_colour+"ff", 2)
    ctx.fillStyle = font_colour
    ctx.fillText("3. full Euler step",  width/20,  height/4)
  }
  dot_label(2, final_est(2), "",   "white", true , 3)
  dot_label(1.5, euler_fn(1.5)-0.45, "",   "white", true , 3)

  

  
  // set font
  ctx.font = "20px Quicksand";

  // draw points
  dot_label(-2, euler_fn(-2), "",   "white", true , 3)
  dot_label(-1, euler_fn(-1), "",   "white", true , 3)
  dot_label( 0, euler_fn( 0), "",   "white", true , 3)
  dot_label( 1, euler_fn( 1), "xᵗ", "white", false, 3)

  // draw h to show scale
  ctx.beginPath();
  ctx.strokeStyle = "white"
  let h_line_x =      domspace(-2,-0.4)[0]
  let h_line_x_end =  domspace(-1,-0.4)[0]
  let h_line_y =      domspace(-2,-0.4)[1]
  ctx.moveTo(h_line_x, h_line_y-5);
  ctx.lineTo(h_line_x, h_line_y+5);
  ctx.moveTo(h_line_x, h_line_y);
  ctx.lineTo(h_line_x_end, h_line_y);
  ctx.lineTo(h_line_x_end, h_line_y+5);
  ctx.lineTo(h_line_x_end, h_line_y-5);
  ctx.stroke();
  ctx.fillText("h", (h_line_x_end-h_line_x)/2+h_line_x-5, h_line_y + 25)

  // draw t+h line
  const draw_t_line = (label, x)=>{
    ctx.strokeStyle = "white"
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
      let t_line = domspace(x,0)[0]
      ctx.moveTo(t_line, 0);
      ctx.lineTo(t_line, height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.save();
    ctx.translate(domspace(x+0.1,-4)[0], domspace(x+0.1,-4)[1]);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(label, 0, 10);
    ctx.restore();
  }
  draw_t_line("t+h", 2)
  draw_t_line("t+0.5h", 1.5)

  // repeat animation
  requestAnimationFrame(draw_rk2)
}
setTimeout(draw_rk2, 100)
domelem("rk2").addEventListener("click", ()=>{rk2_state = (rk2_state+1)%3})