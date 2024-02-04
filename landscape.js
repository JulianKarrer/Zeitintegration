

const populate_landscape = ()=>{
  for (ctx of [domelem("landscape").getContext("2d"), domelem("landscape2").getContext("2d"), domelem("landscape3").getContext("2d")]){
    const renderLandscape = ()=>{
      clear(ctx)

      let base_colour = "rgba(255, 255, 255, 0.6)"
      ctx.strokeStyle = base_colour
      ctx.fillStyle = base_colour
      ctx.lineWidth = 2;

      // define helper functions
      const domspace = (x,y)=>{
        const w = ctx.canvas.width
        const h = ctx.canvas.height
        return [(x/(16))*w+w/2, (y/10)*h+h/2]
      }
      const line_from_to = (sx, sy, tx, ty) => {
        ctx.beginPath();
        let [dsx, dsy] = domspace(sx, sy)
        ctx.moveTo(dsx, dsy);
        let [dtx, dty] = domspace(tx, ty)
        ctx.lineTo(dtx, dty);
        ctx.stroke();
      }
      const arrow_tip = (x, y, is_x, sign) => {
        ctx.beginPath();
        let [ox,oy] = domspace(x,y)
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + (is_x?-15:5) * (sign), oy+(is_x?-5:15) * (sign));
        ctx.lineTo(ox + (is_x?-15:-5)* (sign), oy+(is_x? 5:15) * (sign));
        ctx.fill();
      }
      const big_circle = (radius)=>{
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        let [ox,oy] = domspace(0,0);
        let [rx,ry] = domspace(radius,0);
        ctx.beginPath()
        ctx.arc(ox, oy, rx-ox, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // draw coordinate system
      line_from_to(-10,0,10,0)
      line_from_to(0,-10,0,10)
      arrow_tip(8,0,true,1)
      arrow_tip(-8,0,true,-1)
      arrow_tip(0,-5,false,1)
      arrow_tip(0,5,false,-1)

      // draw circles
      big_circle(1*1.6)
      big_circle(2*1.6)
      big_circle(3*1.6)
      big_circle(4*1.6)

      // draw error order labels
      ctx.font = "20px Quicksand";
      ctx.fillText("1st",   domspace(-0.9,-0.9)[0], domspace(-0.9,-0.9)[1])
      ctx.fillText("2nd",   domspace(-2.1,-2.1)[0], domspace(-2.1,-2.1)[1])
      ctx.fillText("3rd",   domspace(-3.2,-3.2)[0], domspace(-3.2,-3.2)[1])
      ctx.fillText("4th",   domspace(-4.4,-4.4)[0], domspace(-4.4,-4.4)[1])
      ctx.fillText("Order", domspace(-4.9,-4.7)[0]-ctx.measureText("Order").width/2, domspace(-4.9,-4.7)[1])

      // label axis
      ctx.font = "20px Quicksand";
      ctx.fillText("Multistep", domspace(0,5)[0]+15, domspace(0,5)[1]-5)
      ctx.fillText("Runge Kutta", domspace(0,-5)[0]+15, domspace(0,-5)[1]+15)
      ctx.fillText("Explicit", domspace(8,0)[0]-ctx.measureText("Explicit").width, domspace(8,0)[1]-15)
      ctx.fillText("Implicit", domspace(-8,0)[0], domspace(8,0)[1]-15)
    }
    renderLandscape()

    const dot_label = (x,y,label,colour,below) => {
      ctx.fillStyle = colour;
      let measure = ctx.measureText(label)
      let [ox,oy] = domspace(x,y)
      ctx.fillText(
        label, 
        ox - measure.width/2, 
        oy + (below?25:-10),
      )
      ctx.beginPath()
      ctx.arc(ox, oy, 5, 0, 2 * Math.PI)
      ctx.fill()
    }  
    const domspace = (x,y)=>{
      const w = ctx.canvas.width
      const h = ctx.canvas.height
      return [(x/10)*w+w/2, (y/10)*h+h/2]
    }

    // populate the grid
    ctx.font = "15px Quicksand";
    if (highlight_landscape){
      ctx.shadowColor = "#ffffffdd"
      ctx.shadowBlur = 10
    } else {
      ctx.shadowColor = ""
      ctx.shadowBlur = 0
    }

    dot_label(-0.5,    0,     "Implicit Euler",HTML_COLOURS.impl_eul, true)
    dot_label(0.5,    0,     "Explicit Euler",HTML_COLOURS.expl_eul, true)
    dot_label(0,    0,     "Semi-implicit Euler",HTML_COLOURS.semi_eul, false)
    dot_label(2.3,  1.8,   "Verlet",HTML_COLOURS.verlet, false)
    dot_label(1.0, -1.8,  "Runge Kutta 2 (Explicit Midpoint)",HTML_COLOURS.rk2, false)
    dot_label(-1.5,   0,     "Trapezoidal rule",HTML_COLOURS.trapezoidal, true)
    
    ctx.shadowColor = ""
    ctx.shadowBlur = 0

    dot_label(1.8,  -2.8, "Runge Kutta 3 (Classic)",HTML_COLOURS.rk3, false)
    dot_label(2.6, -3.8, "Runge Kutta 4 (Classic)",HTML_COLOURS.rk4, false)
    dot_label(1.0, 1.8,  "Adams–Bashforth 2",HTML_COLOURS.adams_bash2, true)
    dot_label(1.8, 2.8, "Adams–Bashforth 3",HTML_COLOURS.adams_bash3, true)
    dot_label(2.6, 3.8, "Adams–Bashforth 4",HTML_COLOURS.admas_bash4, true)
    dot_label(-2.6, 3.8, "Adams-Moulton 4",HTML_COLOURS.adams_moult4, true)
    dot_label(-1.8,  2.8, "Adams-Moulton 3",HTML_COLOURS.adams_moult3, true)
    dot_label(-1.0, 1.8,   "Adams-Moulton 2",HTML_COLOURS.adams_moult2, true)
    dot_label(-1.0, -1.8,  "Implicit Midpoint",HTML_COLOURS.impl_midpoint, true)
    // dot_label(1.8,  -2.8, "Gauss-Legendre 3",HTML_COLOURS.glrk3, true)
    dot_label(-2.6, -3.8,   "Gauss-Legendre 4",HTML_COLOURS.glrk4, true)
  }

  highlight_landscape = !highlight_landscape
}

let highlight_landscape = false

setTimeout(populate_landscape, 100)
setTimeout(()=>{ domelem("landscape").onclick = populate_landscape}, 600)
setTimeout(()=>{ domelem("landscape2").onclick = populate_landscape}, 600)