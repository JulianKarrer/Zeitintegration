
function fact(num){
  let res=1;
  for (let i = 2; i <= num; i++)
    res = res * i;
  return res;
}

let draw_taylor_order = 1
const draw_taylor = () => {
  let ctx = domelem("taylor").getContext("2d")
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.fillStyle="white"
  clear(ctx)
  let domain = {width: 15, height: 3, yoff: 0.5, xoff: -0.5}
  const arrow_tip_new = (x, y, is_x, sign) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (is_x?-15:5) * (sign), y+(is_x?-5:15) * (sign));
    ctx.lineTo(x + (is_x?-15:-5)* (sign), y+(is_x? 5:15) * (sign));
    ctx.fill();
  };
  arrow_tip_new(w,h/2,true,1);
  

  const plotTaylor = (ctx, n, domain, colour, width) => {
    const fn = (x)=>{
      return Array.from({length: n}, (_, i) => i).map((k)=>{
        return Math.pow(-1,k)*Math.pow(x,1+2*k)/fact(1+2*k)
      }).reduce((sum, number) => sum + number)
    };
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

  // if (draw_taylor_order>10){plotFunction(ctx, Math.sin, domain, "red", 2)}
  plotFunction(ctx, Math.sin, domain, "red", 2)
  for(let i=1; i<draw_taylor_order; i++){
    plotTaylor(ctx, i, domain, (i===draw_taylor_order-1)?("white"):("#666"), (i===draw_taylor_order-1)?(2):(1))
  }
  // plotFunction(ctx, (x)=>x-Math.pow(x,3)/fact[3]+Math.pow(x,5)/fact[5]-Math.pow(x,7)/fact[7]+Math.pow(x,9)/fact[9], domain, "red", 2)
  plotCoordinateSystem(ctx, domain, "white", 2, "t", "x")
}

setTimeout(draw_taylor, 100)
domelem("taylor").onclick = ()=>{draw_taylor_order=(10, draw_taylor_order+1)%13; draw_taylor();}