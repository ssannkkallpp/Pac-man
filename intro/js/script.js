// non-canvas code
var distance = function(a,b) {
            return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1],2));   
}

var is_between = function(a,b,c) {
    return distance(a,c) + distance(c,b) == distance(a,b);   
}

function clearGhost(x,y,radius,c,c1,c2,c3,dir,tentDir) {
    drawGhost(x,y,radius+3,c,c1,c2,c3,dir,tentDir);   
}
function rcollide(cx,cy,cr,rx,ry,w,h){
    var circle = {x:cx, y:cy,r:cr};
    var rect = {x:rx, y:ry, w:w, h:h};
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}
function drawGhost(x, y, radius, c, c1, c2, c3, dir, tentDir) {
    ctx.fillStyle = c;
    ctx.strokeStyle=c3;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI, 0, false);
    if(tentDir == "l") {
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x - radius, y + radius);
        ctx.lineTo(x - radius + (2 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x - radius + (2 * radius / 6), y + radius);
        ctx.lineTo(x - radius + (4 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x - radius + (4 * radius / 6), y + radius);
        ctx.lineTo(x - radius + (6 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x - radius + (6 * radius / 6), y + radius);
        ctx.lineTo(x - radius + (8 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x - radius + (8 * radius / 6), y + radius);
        ctx.lineTo(x - radius + (10 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x - radius + (10 * radius / 6), y + radius);
        ctx.lineTo(x - radius + (12 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x - radius + (12 * radius / 6), y + radius);
        ctx.lineTo(x + radius, y + radius);
        ctx.lineTo(x + radius, y);
    }

    else if(tentDir == "r") {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + radius, y + radius);
        ctx.lineTo(x + radius - (2 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x + radius - (2 * radius / 6), y + radius);
        ctx.lineTo(x + radius - (4 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x + radius - (4 * radius / 6), y + radius);
        ctx.lineTo(x + radius - (6 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x + radius - (6 * radius / 6), y + radius);
        ctx.lineTo(x + radius - (8 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x + radius - (8 * radius / 6), y + radius);
        ctx.lineTo(x + radius - (10 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x + radius - (10 * radius / 6), y + radius);
        ctx.lineTo(x + radius - (12 * radius / 6), y + radius - radius / 4);
        ctx.lineTo(x + radius - (12 * radius / 6), y + radius);
        ctx.lineTo(x - radius, y + radius);
        ctx.lineTo(x - radius, y);
    }

    ctx.stroke();
    // left eye
    ctx.fill();
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(x - radius / 2.5, y - radius / 5, radius / 3, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = c2;

    switch(dir) {
        case "u":
            ctx.arc(x - radius / 2.5, y - radius / 5 - (5 * radius / 24), radius / 8, 0, Math.PI * 2, true);
            break;
        case "d":
            ctx.arc(x - radius / 2.5, y - radius / 5 + (5 * radius / 24), radius / 8, 0, Math.PI * 2, true);
            break;
        case "l":
            ctx.arc(x - radius / 2.5 - (5 * radius / 24), y - radius / 5, radius / 8, 0, Math.PI * 2, true);
            break;
        case "r":
            ctx.arc(x - radius / 2.5 + (5 * radius / 24), y - radius / 5, radius / 8, 0, Math.PI * 2, true);
            break;
        default:
            ctx.arc(x - radius / 2.5, y - radius / 5, radius / 8, 0, Math.PI * 2, true);
            break;
    }
    ctx.fill();
    // right eye
    ctx.beginPath();
    ctx.fillStyle = c1;
    ctx.arc(x + radius / 2.5, y - radius / 5, radius / 3, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = c2;
    switch(dir) {
        case "u":
            ctx.arc(x + radius / 2.5, y - radius / 5 - (5 * radius / 24), radius / 8, 0, Math.PI * 2, true);
            ctx.fill();
            break;
        case "d":
            ctx.arc(x + radius / 2.5, y - radius / 5 + (5 * radius / 24), radius / 8, 0, Math.PI * 2, true);
            break;
        case "l":
            ctx.arc(x + radius / 2.5 - (5 * radius / 24), y - radius / 5, radius / 8, 0, Math.PI * 2, true);
            break;
        case "r":
            ctx.arc(x + radius / 2.5 + (5 * radius / 24), y - radius / 5, radius / 8, 0, Math.PI * 2, true);
            break;
        default:
            ctx.arc(x + radius / 2.5, y - radius / 5 , radius / 8, 0, Math.PI * 2, true);
            break;
    }
    ctx.fill();
}