function clear_pacman(x,y,r,col) {
    ctx.beginPath();
    ctx.arc(x, y, r+1, 0, 2 * Math.PI, false);
    ctx.fillStyle = col;
    ctx.strokeStyle=col;
    ctx.fill();
    ctx.stroke();
}

function forward_pacman(x,y,r,col) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0.25 * Math.PI, 1.25 * Math.PI, false);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0.75 * Math.PI, 1.75 * Math.PI, false);
    ctx.fill();
}
        
function backward_pacman(x,y,r,col) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0.75 * Math.PI, 1.75 * Math.PI, true);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0.25 * Math.PI, 1.25 * Math.PI, true);
    ctx.fill();
}
        
function downward_pacman(x,y,r,col) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0.25 * Math.PI, 1.25 * Math.PI, true);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 1.75 * Math.PI, 0.75 * Math.PI, true);
    ctx.fill();
}
        
function upward_pacman(x,y,r,col) {
    ctx.beginPath();
    ctx.arc(x, y, r, 1.25 * Math.PI, 0.25 * Math.PI, true);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0.75 * Math.PI, 1.75 * Math.PI, true);
    ctx.fill();      
}