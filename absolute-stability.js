draw_abs_stability = () => {
  // create glsl canvas
  fetch("shader.frag").then(x => x.text()).then(shader_text=>{
    let sandbox = new GlslCanvas(domelem("abs-stab-glsl"));
    sandbox.load(shader_text);
    sandbox.setUniform("u_selection",stability_selection*0.1); 
  })
}
const draw_abs_stability_coords = ()=>{
  const ctx = domelem("abs-stability").getContext("2d")
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  ctx.fillStyle="white"
  clear(ctx)
  
  // helper functions
  const domspace = (x,y)=>{
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    return [(x/6)*w+w/2, -(y/6)*h+h/2]
  }
  const arrow_tip_new = (x, y, is_x, sign) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (is_x?-15:5) * (sign), y+(is_x?-5:15) * (sign));
    ctx.lineTo(x + (is_x?-15:-5)* (sign), y+(is_x? 5:15) * (sign));
    ctx.fill();
  };

  // draw coordinate system
  let domain = {width: 6, height: 6, yoff: 0.5, xoff: -0.5}
  arrow_tip_new(width,height/2,true,1);
  plotCoordinateSystem(ctx, domain, "white", 2, "Re", "Im")

  // draw h to show scale
  ctx.beginPath();
  ctx.strokeStyle = "white"
  for(let x=-2; x<=2.1; x++){
    if(Math.abs(x-0.1)<0.5){continue;}
    ctx.moveTo(domspace(x,0)[0], domspace(x,0)[1]-10);
    ctx.lineTo(domspace(x,0)[0], domspace(x,0)[1]+10);
  }
  for(let y=-2; y<=2.1; y++){
    if(Math.abs(y-0.1)<0.5){continue;}
    ctx.moveTo(domspace(0,y)[0]-10, domspace(0,y)[1]);
    ctx.lineTo(domspace(0,y)[0]+10, domspace(0,y)[1]);
  }
  ctx.stroke();
}
setTimeout(draw_abs_stability_coords, 100)