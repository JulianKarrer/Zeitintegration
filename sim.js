
const sim_h = 800
const sim_w = 1300
const bxs = 200
const particle_mass = 1
const spring_stiffness = 800//80
const damping = 0.95
const new_list = ()=>[[0,0], [0,0],[0,0],[0,0]]
const new_pos = (offx) => [
  [offx-bxs/2,sim_h/4+bxs/2], 
  [offx+bxs/2,sim_h/4+bxs/2], 
  // [size/2,      size/4-bxs*Math.sqrt(3)/2+bxs/2], 
  [offx+bxs/2,sim_h/4-bxs/2], 
  [offx-bxs/2,sim_h/4-bxs/2], 
]
const pos1 = new_pos(sim_w/4)
const vel1 = new_list()
const acc1 = new_list()

const pos2 = new_pos(3*sim_w/4)
const vel2 = new_list()
const acc2 = new_list()

// define the rest length of springs
const rest_length = (i,j) => {
  // return bxs
  if (Math.abs(i-j)<1.5 || i===0&&j===3 || i===3&&j===0){
    return bxs
  } else {
    return Math.SQRT2 * bxs
  }
}

const draw_sim = (time) => {
  // compute dt
  const dt = 0.16 //2/spring_stiffness*2.0
  // compute forces
  const get_neightbours = (i)=>{
    let res = []
    for (let j = 0; j<pos1.length; j++){if (i!==j){res.push(j)}}
    return res
  }
  const dist = (i,j,pos) => {
    let dx = pos[i][0] - pos[j][0]
    let dy = pos[i][1] - pos[j][1]
    return Math.sqrt(dx*dx+dy*dy)
  }
  const compute_acc = (pos, vel, acc) => {
    for (let i = 0; i<pos.length; i++){
      // gravity
      acc[i][1] = 9.81
      // elastic force
      for (const j of get_neightbours(i)){
        // elastic acceleration
        let coeff = spring_stiffness/(particle_mass*rest_length(i,j)) * (dist(i,j,pos) - rest_length(i,j))/dist(i,j,pos)
        let dir_x = pos[j][0] - pos[i][0]
        let dir_y = pos[j][1] - pos[i][1]
        acc[i][0] += dir_x*coeff
        acc[i][1] += dir_y*coeff
        // damping acceleration
        acc[i][0] += damping/particle_mass * (vel[j][0] - vel[i][0])* dir_x*dir_x/(dist(i,j,pos)*dist(i,j,pos))
        acc[i][1] += damping/particle_mass * (vel[j][1] - vel[i][1])* dir_x*dir_x/(dist(i,j,pos)*dist(i,j,pos))
      }
    }
  }

  // time integration functions
  const semi_euler = (pos, vel, acc, dt) => {
    compute_acc(pos, vel, acc)
    for (let i = 0; i<pos.length; i++){
      vel[i][0] += acc[i][0] * dt
      vel[i][1] += acc[i][1] * dt
      pos[i][0] += vel[i][0] * dt
      pos[i][1] += vel[i][1] * dt
    }
  }
  const verlet = (pos, vel, acc, dt) => {
    compute_acc(pos, vel, acc)
    for (let i = 0; i<pos.length; i++){
      newx = 2*pos[i][0]-prevpos[i][0]+dt*dt*acc[i][0]
      newy = 2*pos[i][1]-prevpos[i][1]+dt*dt*acc[i][1]
      prevpos[i][0] = pos[i][0]
      prevpos[i][1] = pos[i][1]
      pos[i][0] = newx
      pos[i][1] = newy
    }
  }
  const rk4 = (pos, vel, acc, dt) => {
    // 1
    compute_acc(pos, vel, acc)
    let x_s = new_list()
    let v_s = new_list()
    for (let i = 0; i<pos.length; i++){
      x_s[i][0] = pos[i][0] + dt/2* vel[i][0]
      x_s[i][1] = pos[i][1] + dt/2* vel[i][1]
      v_s[i][0] = vel[i][0] + dt/2* acc[i][0]
      v_s[i][1] = vel[i][1] + dt/2* acc[i][1]
    }
    // 2
    let a_s = new_list()
    compute_acc(x_s, v_s, a_s)
    let x_ss = new_list()
    let v_ss = new_list()
    for (let i = 0; i<pos.length; i++){
      x_ss[i][0] = x_s[i][0] + dt/2* v_s[i][0]
      x_ss[i][1] = x_s[i][1] + dt/2* v_s[i][1]
      v_ss[i][0] = v_s[i][0] + dt/2* a_s[i][0]
      v_ss[i][1] = v_s[i][1] + dt/2* a_s[i][1]
    }
    // 3
    let a_ss = new_list()
    compute_acc(x_ss, v_ss, a_ss)
    let x_sss = new_list()
    let v_sss = new_list()
    for (let i = 0; i<pos.length; i++){
      x_sss[i][0] = x_ss[i][0] + dt/2* v_ss[i][0]
      x_sss[i][1] = x_ss[i][1] + dt/2* v_ss[i][1]
      v_sss[i][0] = v_ss[i][0] + dt/2* a_ss[i][0]
      v_sss[i][1] = v_ss[i][1] + dt/2* a_ss[i][1]
    }
    // 4
    let a_sss = new_list()
    compute_acc(x_sss, v_sss, a_sss)
    // update
    for (let i = 0; i<pos.length; i++){
      pos[i][0] += dt/6*(vel[i][0]+2*v_s[i][0]+2*v_ss[i][0]+v_sss[i][0])
      pos[i][1] += dt/6*(vel[i][1]+2*v_s[i][1]+2*v_ss[i][1]+v_sss[i][1])
      vel[i][0] += dt/6*(acc[i][0]+2*a_s[i][0]+2*a_ss[i][0]+a_sss[i][0])
      vel[i][1] += dt/6*(acc[i][1]+2*a_s[i][1]+2*a_ss[i][1]+a_sss[i][1])
    }
  }

  // enforce boundary conditions
  const enforce_boundary_conditions = (pos, vel, acc) => {
    for (let i = 0; i<pos.length; i++){
      if (pos[i][1]>sim_h-10){
        pos[i][1] = sim_h-10
        vel[i][1] = -vel[i][1]
      }
    }
  }

  // draw 
  const ctx = domelem("sim").getContext("2d")
  ctx.lineWidth=3
  clear(ctx)
  const draw_pos = (pos, colour) => {
    ctx.strokeStyle=colour
    ctx.fillStyle=colour

    ctx.beginPath()
    ctx.moveTo(pos[0][0], pos[0][1])
    ctx.lineTo(pos[1][0], pos[1][1])
    ctx.lineTo(pos[2][0], pos[2][1])
    ctx.lineTo(pos[3][0], pos[3][1])
    ctx.lineTo(pos[0][0], pos[0][1])
    ctx.lineTo(pos[2][0], pos[2][1])
    ctx.moveTo(pos[1][0], pos[1][1])
    ctx.lineTo(pos[3][0], pos[3][1])
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(pos[0][0], pos[0][1], 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pos[1][0], pos[1][1], 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pos[2][0], pos[2][1], 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(pos[3][0], pos[3][1], 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // execute timestep
    // rk4
  rk4(pos1, vel1, acc1, dt)
  enforce_boundary_conditions(pos1, vel1, acc1)
  draw_pos(pos1, "#de58ff")
    // semi euler
  for (let i=0; i<4; i++){
    semi_euler(pos2, vel2, acc2, dt/4)
    enforce_boundary_conditions(pos2, vel2, acc2)
  }
  draw_pos(pos2, "#fdb059")

  // draw floor and prepare next frame
  ctx.fillStyle="#ffffff88"
  ctx.fillRect(0, sim_h-8, sim_w, sim_h);
  requestAnimationFrame(draw_sim)
}
setTimeout(()=>{requestAnimationFrame(draw_sim)}, 100)