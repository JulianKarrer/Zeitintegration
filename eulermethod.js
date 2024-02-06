
const euler_fn = (x) => Math.exp(x)-2
const euler_fn_deriv = (x) => Math.exp(x)

const euler_tangent_xt_1 = (x) => euler_fn(1) + euler_fn_deriv(1)*(x-1)
const euler_tangent_xt_2 = (offset) => ((x) => -6.67077+(x-0.38*offset)*7.389056)

const draw_euler_method = (time) => {
  for (const [ctx,i] of [[domelem("eulermethod").getContext("2d"),1], [domelem("eulermethod2").getContext("2d"), 2]]){
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
    const domspace = (x,y)=>{
      const w = ctx.canvas.width
      const h = ctx.canvas.height
      return [(x/5)*w+w/2, -(y/16.5)*h+h/2]
    }
    const arrow_tip_new = (x, y, is_x, sign) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (is_x?-15:5) * (sign), y+(is_x?-5:15) * (sign));
      ctx.lineTo(x + (is_x?-15:-5)* (sign), y+(is_x? 5:15) * (sign));
      ctx.fill();
    };

    // draw coordinate system
    let domain = {width: 5, height: 8, yoff: 0.5, xoff: -0.5}
    arrow_tip_new(width,height/2,true,1);
    plotCoordinateSystem(ctx, domain, "white", 2, "t", "x")

    // draw analytic function
    plotFunction(ctx, euler_fn, domain, "#ffffff88", 2)

    // draw methods
    if (i==2 || Reveal.getState().indexf === 0 || Reveal.getState().indexf >= 2){
      // draw explicit euler
      plotFunction(ctx, euler_tangent_xt_1, domain, HTML_COLOURS.expl_eul+"88", 2)
      dot_label(2, euler_tangent_xt_1(2), "", "white", true, 5)

    }  
    if (i==2 || Reveal.getState().indexf === 1 || Reveal.getState().indexf >= 2){
      // draw implicit euler
      let t = Reveal.getState().indexf === 2? 0: Math.max(0, Math.min(1, 2*Math.sin(Math.abs(time)/1000)))
      plotFunction(ctx, euler_tangent_xt_2(t), domain, HTML_COLOURS.impl_eul+"88", 2)
      dot_label(2, euler_tangent_xt_2(t)(2), "", "white", true, 5)
    }

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
    ctx.strokeStyle = "white"
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
      let t_line = domspace(2,0)[0]
      ctx.moveTo(t_line, 0);
      ctx.lineTo(t_line, height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(domspace(2.1,-4)[0], domspace(2.1,-4)[1]);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("t+h", 0, 10);
    ctx.restore();
  }

  // repeat animation
  requestAnimationFrame(draw_euler_method)
}
setTimeout(draw_euler_method, 100)
