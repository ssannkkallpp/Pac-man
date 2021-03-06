  function setCookie(cname, cvalue) {
        // set cookie with name = cname and val = cvalue
        document.cookie = cname + "=" + cvalue + "; " + "expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
    
    function getCookie(cname) {
        // return the value of cookie cname
        // return empty string if cname doesn't exist
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
    


    var canvas;
    var ctx;
    var l=500;
    var direction;
    var level;
    if(getCookie("level") == "") {
        setCookie("level", "1");
        level=Number(getCookie("level"));
    }
    else level = Number(getCookie("level"));
    if(level == 0) {
        setCookie("level", "1");
        level = 1;
    }
    var timer_running = false;
    var lives=3;
    var eating_sound;
    var is_powerful;
    var is_scared;
    var score;
    var set;
    var blink=0;
    var power_clock
    var tentDir;
    var duration;
    var count;
    var scare_clock;
    var seconds;
    var eaten_dots = [];
    var times;
    
    var blink; // boolean variable to make the power dots blink
    var limit = 300 - ((level - 1) * 40); // How often do the ghosts stay scared
    var time_limit = 40 - ((level - 1) * 5); // how often are the ghosts moving 
    
    // sounds
    var eat_ghost = new Audio("assets/audio/eatghost.mp3");
    var eating = new Audio("assets/audio/eating.short.mp3");
    var eat_pill = new Audio("assets/audio/eatpill.mp3");
    var opening_song = new Audio("assets/audio/opening_song.mp3");
    var siren = new Audio("assets/audio/siren.mp3");
    var die = new Audio("assets/audio/die.mp3");

    // fruit images
    var cherry = new Image();
    var strawberry = new Image();
    var apple = new Image();
    var orange = new Image();

    cherry.src = "assets/fruits/cherry.png";
    strawberry.src = "assets/fruits/strawberry.png";
    apple.src = "assets/fruits/apple.png";
    orange.src = "assets/fruits/orange.png";

    var B = [[50, 25, 50, l - 25], [l - 50, 25, l - 50, l - 25], [50, 25, l - 50, 25], [50, l / 2 - 75, l - 50, l / 2 - 75], [50, l / 2 + 75, l - 50, l / 2 + 75], [50, l - 25, l - 50, l - 25], [50, 100, l - 50, 100], [50, l - 100, l - 50, l - 100], [150, 100, 150, l - 100], [l - 150, 100, l - 150, l - 100], [0, l / 2, 50, l / 2], [l - 5, l / 2, l - 50, l / 2]];
    var matrix = [];
    for(var i=0;i<100;i++) matrix[i] = [];

    for(var i=0;i<100;i++) {
        for(var j=0;j<100;j++) matrix[i].push(1);
    }
    
    for(var i=0;i<B.length;i++) {
        var a=B[i][0]; 
        var b=B[i][1];
        var c=B[i][2];
        var d=B[i][3];
        if(a == c) {
            for(var j=b/5;j<=d/5;j++) matrix[j][a/5] = 0;  
        }
        else {
            for(var j=a/5;j<=c/5;j++) matrix[b/5][j] = 0;   
        }
    }

    var grid = new PF.Grid(100,100,matrix);
    var finder = new PF.AStarFinder();  
    var x, y; //pacman current position
    var monsters = []; //ghost current position
    var dir = 0; //pacman current direction of movement
    var nextdir = 0; //pacman next requested direction
    var dots = []; //array of dot locations
    var A; //lines containing dots on which all movement must happen
    var slowdown = 3;//how many steps of the pacman should the ghost move one step
    var power_count;
    var power_dots = [[50, 75], [l - 50, 75], [50, l - 75], [l - 50, l - 75]];
    initDots();
    initialize();
    draw();

    var clockcount = 0;//clock tick counter
    var step=5; //how much does an object move in a step, should be a divisor of 25


    function placeBackground() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, l, l);
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 7;
        roundRect(ctx, 0, -5, 25, l / 2 - 25, 5, "blue");
        roundRect(ctx, 0, l / 2 + 25, 25, l / 2 - 20, 5, "blue");
        roundRect(ctx, l - 25, -5, 25, l / 2 - 25, 5, "blue");
        roundRect(ctx, l - 25, l / 2 + 25, 25, l / 2 - 20, 5, "blue");
     //   roundRect(ctx, 175, l / 2 - 50, 150, 100);
        roundRect(ctx, 75, 50, l - 150, 25);
        roundRect(ctx, 75, l / 2 + 100, 50, 25);
        roundRect(ctx, 175, l / 2 + 100, 150, 25);
   //     roundRect(ctx, 275, l / 2 + 100, 50, 25);
        roundRect(ctx, 375, l / 2 + 100, 50, 25);
        roundRect(ctx, 75, l / 2 - 50, 50, 100);
        roundRect(ctx, 375, l / 2 - 50, 50, 100);
        roundRect(ctx, 75, l / 2 + 175, l - 150, 25);
        roundRect(ctx, 75, 125, 50, 25);
        roundRect(ctx, 175, 125, 150, 25);
        roundRect(ctx, 375, 125, 50, 25);
        roundRect(ctx, -25, -25, 0, 0);
        ctx.moveTo(l / 2 + 70, l / 2 - 50);
        ctx.quadraticCurveTo(175 + 150, l / 2 - 50, 175 + 150, l / 2 - 50 + 5);
        ctx.lineTo(175 + 150, l / 2 - 50 + 100 - 5);
        ctx.quadraticCurveTo(175 + 150, l / 2 - 50 + 100, 175 + 150 - 5, l / 2 - 50 + 100);
        ctx.lineTo(175 + 5, l / 2 - 50 + 100);
        ctx.quadraticCurveTo(175, l / 2 - 50 + 100, 175, l / 2 - 50 + 100 - 5);
        ctx.lineTo(175, l / 2 - 50 + 5);
        ctx.quadraticCurveTo(175, l / 2 - 50, 175 + 5, l / 2 - 50);
        ctx.lineWidth = 8;
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }

    function placeDots(c1, c2) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = c1;
        ctx.fillStyle = c2;

        for(var i = 0; i < dots.length; i++)
        {
            ctx.beginPath();
            var dotx = dots[i][0];
            var doty = dots[i][1];
            ctx.moveTo(dotx, doty);
            ctx.arc(dotx, doty, 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    
    }

    function placePowerDots(c1,c2) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = c1;
        ctx.lineWidth = 1;
        ctx.fillStyle = c2;
        for(var j = 0; j < power_dots.length; j++) {
            ctx.beginPath();
            var pdotx = power_dots[j][0];
            var pdoty = power_dots[j][1];
            ctx.moveTo(pdotx, pdoty);
            ctx.arc(pdotx, pdoty, 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
    function initDots() {
        for (var i = 75; i <= l - 75; i += 25) {
            dots.push([i, 25]);
            dots.push([i, 100]);
            dots.push([i, 400]);
            dots.push([i, (l / 2) - 75]);
            dots.push([i, (l / 2) + 75]);
            dots.push([i, l - 25]);
        }
        for(var j = 25; j <= l - 25; j += 25) {
            dots.push([50, j]);
            dots.push([l - 50, j]);
        }
        for(var k = 125; k <= l - 125; k += 25) {
        if(k != 100 && k != l / 2 - 75 && k != l / 2 + 75 && k != 400) {              dots.push([150, k]);
            dots.push([l - 150, l - k]);
            }
        }
    }

    //a,b are location coordinates, col is overall color, col1 and col2 are for the eyes
    function placeGhost(a,b,col,col1,col2,col3) { 
			     var radius=15;
			     ctx.fillStyle = col;
                 ctx.strokeStyle = col3;
			     ctx.beginPath();
			     ctx.arc(a, b, radius, Math.PI, 0, false);
			     ctx.moveTo(a - radius, b);
			     ctx.lineTo(a - radius, b + radius - radius / 4);
			     ctx.lineTo(a - radius + radius / 3, b + radius);
			     ctx.lineTo(a - radius + radius / 3 * 2, b + radius - radius / 4);
			     ctx.lineTo(a, b + radius);
			     ctx.lineTo(a + radius / 3, b + radius - radius / 4);
			     ctx.lineTo(a + radius / 3 * 2, b + radius);
			     ctx.lineTo(a + radius, b + radius - radius / 4);
			     ctx.lineTo(a + radius, b);
                 ctx.lineWidth=3;
                 ctx.stroke();
			     // left eye
			     ctx.fill();
			     ctx.fillStyle = col1;
			     ctx.beginPath();
			     ctx.arc(a - radius / 2.5, b - radius / 5, radius / 3, 0, Math.PI * 2, true);
			     ctx.fill();
			     ctx.beginPath();
			     ctx.fillStyle = col2;
			     ctx.arc(a - radius / 2.5, b - radius / 5, radius / 8, 0, Math.PI * 2, true);
			     ctx.fill();
			     // right eye
			     ctx.beginPath();
			     ctx.fillStyle = col1;
			     ctx.arc(a + radius / 2.5, b - radius / 5, radius / 3, 0, Math.PI * 2, true);
			     ctx.fill();
			     ctx.beginPath();
			     ctx.fillStyle = col2;
			     ctx.arc(a + radius / 2.5, b - radius / 5 , radius / 8, 0, Math.PI * 2, true);
			     ctx.fill();
     }


    //a,b are location coordinates, col is overall color
   function placePacman(a,b,d,col){
        var r = 13;
        switch (d) {
            case 2:
                open ? upward_pacman(a,b,r,col) : clear_pacman(a,b,r-1,col);
                if(set == 2) {
                    open = !open;
                    set = 0;
                }
                else set++;
                break;
            case -2:
                open ? downward_pacman(a,b,r,col) : clear_pacman(a,b,r-1,col);
                if(set == 2) {
                    open = !open;
                    set = 0;
                }
                else set++;
                break;
            case -1:
                open ? backward_pacman(a,b,r,col) : clear_pacman(a,b,r-1,col);
                if(set == 2) {
                    open = !open;
                    set = 0;
                }
                else set++;
                break;
            case 1:
                open ? forward_pacman(a,b,r,col) : clear_pacman(a,b,r-1,col);
                if(set == 2) {
                    open = !open;
                    set = 0;
                }
                else set++;
                break;
            default:
                (timer_running) ? clear_pacman(a,b,r,col) : forward_pacman(a,b,r,col);
        }
    }

    function initialize() {
      canvas  = document.getElementById("PacScreen");
      ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      A = [[50, 25, 50, l - 25], [l - 50, 25, l - 50, l - 25], [50, 25, l - 50, 25], [50, l / 2 - 75, l - 50, l / 2 - 75], [50, l / 2 + 75, l - 50, l / 2 + 75], [50, l - 25, l - 50, l - 25], [50, 100, l - 50, 100], [50, l - 100, l - 50, l - 100], [150, 100, 150, l - 100], [l - 150, 100, l - 150, l - 100], [-5, l / 2, 50, l / 2], [l - 5, l / 2, l - 50, l / 2], [0, l / 2, 50, l / 2], [l - 50, l / 2, l, l / 2]];
      dir=0;
  //    direction = "d";
      is_powerful = 0;  
      is_scared = 0;
      duration=40;
      tentDir="l";
      fruit_on_screen = 0;
      count=1;
      times = 0;
      newdir=0; 
      power_clock=0; 
      scare_clock=0;
      blink = 0;
      score=0;
      seconds=0;
      x = 250;
      y = l - 100;
      console.log("the level is", level);
      document.getElementById("level").innerHTML = "<b> Level: " + level + "</b> &nbsp; &nbsp; &nbsp; &nbsp;";
  //    gx=25;
    //  gy=150;
      monsters = [[l / 2,l / 2 - 25,"red","d",0], [l/2-50,l/2, "lightblue", "d",0], [l/2, l/2+25, "pink", "d", 0], [l/2+50,l/2, "orange", "d", 0]];
        document.getElementById("lives").innerHTML = "<b> Lives: " + lives + "</b>";
      set=0;
    }


    
    function draw() {
      // load sprites on to the screen

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, l, l);
      placeBackground();
      placeDots("white","orange");
      placePowerDots("white","orange");
      placePacman(x,y,dir,"yellow");
      removeDot(x,y);
      for(var i=0;i<monsters.length;i++){
        drawGhost(monsters[i][0],monsters[i][1],15,monsters[i][2],"white","blue", "black", monsters[i][3], tentDir);
      }
    }


    //find neighbors of a dot at coordinate p in dots[], so such a dot can be redrawn if it is still in dots[]
    function findNeighbors(arr,p) {
        var tmp=[];
	for (var i=0;i<arr.length;++i) {
		if ((Math.abs(arr[i][0]-p[0])<=25) && (Math.abs(arr[i][1]-p[1])<=25)) {tmp.push(i);};			
	}
        return(tmp);
    }

   
     function find(arr,p) {
         // utility function to find index of p in arr if exists
	   for (var i=0;i<arr.length;i++) {
		  if ((arr[i][0]==p[0]) && (arr[i][1]==p[1])) {return(i);};	
	   }
        return(-1);
     }

    //redraw any dots around location a,b that are still in dots[]
    function redrawDot(a,b) {
	   var idx = findNeighbors(dots,[a,b]);
        for (var i=0;i<idx.length;i++) {
		   var d=dots[idx[i]];
		   ctx.fillStyle = "orange";
		   ctx.lineWidth=1;
		   ctx.strokeStyle = "white";
		   ctx.moveTo(d[0],d[1]);
		   ctx.arc(d[0], d[1], 2, 0, 2 * Math.PI);
		   ctx.stroke();
           ctx.fill();
           
	   }
       idx = findNeighbors(power_dots, [a,b]);
 //      console.log("power dot index is", idx);
       for(var i=0;i<idx.length;i++) {
           var p = power_dots[idx[i]];
           ctx.lineWidth = 2;
           ctx.strokeStyle = "white";
           ctx.stroke();
           ctx.lineWidth = 1;
           ctx.moveTo(p[0], p[1]);
           ctx.arc(p[0], p[1], 8, 0, 2 * Math.PI); 
           ctx.fillStyle="orange";
           ctx.fill();
        }
    }

    //remove dot at location a,b
    function removeDot(a,b) {
        removeDuplicates(eaten_dots);
	    var idx = find(dots,[a,b]);
        if (idx>=0) {
            eaten_dots.push([a,b]);
            dots.splice(idx,1); 
            if(times > 0) {
                score+=20; 
            }
            else times++;
            document.getElementById("score").innerHTML = "<b> Score: " + score + "</b> &nbsp; &nbsp; &nbsp; &nbsp;";
        }
        idx = find(power_dots, [a,b]);
        if(idx>=0) {
            power_dots.splice(idx,1); 
            if(times > 0) {
                score+=100;
            }
            else times++;
            eat_pill.play();
            document.getElementById("score").innerHTML = " <b> Score: " + score + "</b> &nbsp; &nbsp; &nbsp; &nbsp;";
            is_powerful=1;
        }
        return;
     }
 
    function redrawPacman(prevX,prevY) {
	   placePacman(prevX,prevY,0,"black");
	   placePacman(x,y,dir,"yellow");		     
    }
    
    
    function redrawGhost(prevX, prevY, index, freight) {
        clearGhost(prevX,prevY,15,"black", "black", "black", "black", monsters[index][3], tentDir);
        redrawDot(prevX, prevY);
        if(freight == 0) {
            drawGhost(monsters[index][0], monsters[index][1], 15, monsters[index][2], "white", "blue", "black", monsters[index][3], tentDir);   
        }
        else if(freight == 1) {
            drawGhost(monsters[index][0], monsters[index][1], 15, "darkblue", "white", "blue", "black", monsters[index][3], tentDir);   
        }
        else if(freight == 2) {
            drawGhost(monsters[index][0], monsters[index][1], 15, "black", "white", "blue", "black", monsters[index][3], tentDir); 
        }
    }



    function moveRandom(inx, iny, prevDir) {
    // find a random direction to move in from inx,iny given that   
    // you cannot move in direction prevDir
    var u = admits(2, inx, iny);
    var d = admits(-2, inx, iny);
    var l = admits(-1, inx, iny);
    var r = admits(1,inx, iny);

    var moves = ["u", "d", "l", "r"];
    if(u == false)  moves.splice(moves.indexOf("u"), 1);
    if(d == false)  moves.splice(moves.indexOf("d"), 1);
    if(l == false)  moves.splice(moves.indexOf("l"), 1);
    if(r == false)  moves.splice(moves.indexOf("r"), 1);

    if(prevDir == "u") moves.splice(moves.indexOf("d"), 1);
    if(prevDir == "d") moves.splice(moves.indexOf("u"), 1);
    if(prevDir == "l") moves.splice(moves.indexOf("r"), 1);
    if(prevDir == "r") moves.splice(moves.indexOf("l"), 1);

    var move = moves[Math.floor(Math.random()*moves.length)];
    var a = inx, b = iny;
    switch(move) {
        case "u":
            b -= 5;
            break;
        case "d":
            b += 5;
            break;
        case "l":
            a -= 5;
            break;
        case "r":
            a += 5;
            break;
        default: 
            console.log("check code");
    }
    return [a, b, move];
    }
    
    function onLine(a, b, x1, y1, x2, y2){
        // is a,b on the line with endpoints (x1,y1) and (x2,y2)
        if ((x1==x2) && (Math.abs(x1-a)==0) && (y1<=b && b<=y2)) {return(true)}
        if ((y1==y2) && (Math.abs(y1-b)==0) && (x1<=a && a<=x2)) {return(true)}
	return(false)								     
    }

    function getLines(a, b) {
       // return all the lines of the grid which contain the point
       // a,b
	   var hits=[];				
        for (var i=0;i<A.length;++i) {
	    if (onLine(a, b, A[i][0],A[i][1],A[i][2],A[i][3])) {hits.push(A[i])};
	}
        return(hits);	    
    }

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        // draw a rectangle with rounded edges.
        if (typeof stroke == "undefined" ) {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
        }   

    function admits(d,a,b) { 
        //at a,b, can one move in direction d
         var h=getLines(a,b);
         for (var i=0;i<h.length;++i) {
		var l=h[i];
                switch(d) {
                 case -1:  if (l[1]==l[3] && a>l[0]) {return(true)};break; //left
                 case 1:  if (l[1]==l[3] && a<l[2]) {return(true)};  break; //right
                 case 2:  if (l[0]==l[2] && b>l[1]) {return(true)}  ;break; //up
                 case -2:  if (l[0]==l[2] && b<l[3]) {return(true)};break; //dn
                 default:break;
            }   				      
        }
        if(a == 25 && b == l/2 && d == -1) return (true);
        if(a == l-25 && b == l/2 && d == 1) return (true); 
        return(false);
    }

 //   var count=0;
    function keydn(event) {
                // event handler     
                var key=event.which;
                switch(key) {
                case 37: nextdir=-1;break; //left
                case 39: nextdir=1;break; //right
                case 38: nextdir=2;break; //up
                case 40: nextdir=-2;break; //dn
                default: nextdir=0;break;
            }   
    }

    function opposite_direction(d) {
        if(d == "d") return "u";
        if(d == "l") return "r";
        if(d == "u") return "d";
        if(d == "r") return "l";
    }
    //make ghost move from prevX,prevY towards pacman by picking the admissible direction that takes it closest
    //new location of the ghost is returned
    function pacmanDeath() {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 1;
        var a1 = 315, a2 = 225;
        var vanish = setInterval(function() {
            if(a2 > 90) {
                a1++;
                a2--;
            }
            else clearInterval(vanish);
            ctx.fillStyle = "black";
            ctx.fillRect(x - 21, y - 21, 42, 42);
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, 13, (a1 / 180 * Math.PI), (a2 / 180 * Math.PI));
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();
        }, 10);
    }
    function moveSP(prevX, prevY, tx, ty) {
        // returns first move in shortest path from point
        // prevX, prevY to point tx, ty if 1 exists
        // returns prevX, prevY if no such path is found
        // The path is calculated through the A* algorithm
        console.log(prevX,prevY,tx,ty);
        var copy = grid.clone();
        var path = finder.findPath(prevX/5,prevY/5,tx/5,ty/5,copy);
        if(path.length == 0) {
            console.log("check code in moveSp");
            return [prevX,prevY];   
        }
        else return [path[1][0] * 5, path[1][1] * 5];

    }
    function moveOut(w) {
        var tx, ty;
        switch(w) {
            case 0:
                var blinky = setInterval(function() {
                    tx = monsters[w][0]
                    ty = monsters[w][1]
                    if(monsters[w][1] <= 175) clearInterval(blinky);
                    else {
                        monsters[w][1] = monsters[w][1] - 1;
                        redrawGhost(tx,ty,w,0);                 }
                }, duration / 5);
                break;
            case 2:
                var pinky = setInterval(function() {
                    tx = monsters[w][0]
                    ty = monsters[w][1]
                    if(monsters[w][1] <= 175) clearInterval(pinky);
                    else {
                        monsters[w][1] = monsters[w][1]-1;
                       redrawGhost(tx,ty,w,0); 
                    }
                }, duration / 5);
                break;
            case 1:
                var inky = setInterval(function() {
                    tx = monsters[w][0]
                    ty = monsters[w][1]
                    if(monsters[w][1] <= 175) clearInterval(inky);
                    else {
                        monsters[w][1] = monsters[w][1] - 1;
                        redrawGhost(tx,ty,w,0); 
                    }
                }, duration / 5);
                break;
            case 3:
                var clyde = setInterval(function() {
                    tx = monsters[w][0]
                    ty = monsters[w][1]
                    if(monsters[w][1] <= 175) clearInterval(clyde);
                    else {
                        monsters[w][1] = monsters[w][1] - 1;
                        redrawGhost(tx,ty,w,0); 
                    }
                }, duration / 5);
                break;
        }
    }
    function collision(x1,y1,r1,x2,y2,r2) {
        if(distance([x1,y1], [x2,y2]) < (r1+r2)) return (true);
        else return(false);
    }
    function removeDuplicates(array) {
        for(var i = 0; i < array.length; i++) {
            for(var j = 0; j < array.length; j++) {
                if(array[j] == array[i] && j != i) {
                    array.splice(j, 1);
                }
            }
        }
    }

    function update() {
         clockcount++;
         //update pacman
         siren.play();
         var prevX=x;
         var prevY=y;
         if (admits(nextdir,x,y)) {dir=nextdir;nextdir=0}
         if (admits(dir,x,y)) {
            switch(dir) {
               case -1:
                    if(x == 25 && y == l/2) x = l-40;   
                    else x=x-step; 
                    break;
               case 1:
                    if(x == l-30 && y == l/2) x=25;
                    else x=x+step;
                    break;
               case 2: y=y-step;  break;
               case -2: y=y+step; break;
               default: break;
            }
         for(var i = 0; i < dots.length; i++) {
            if(dots[i][0] == x && dots[i][1] == y) eating.play();
         }
         if(blink == 0) { placePowerDots("white", "orange"); blink=1; }
         else { placePowerDots("black", "black"); blink = 0; }
         removeDot(x,y); //if seed at x,y exists in dots, remove from dots
         redrawPacman(prevX,prevY); //erase pacman from prevX,prevY, draw at x,y
         }
        
        // move ghosts out of the ghost house
         if(count == Math.round(duration / 4)) moveOut(0);
         if(count == Math.round(duration / 2)) moveOut(2);
         if(count == Math.round(3 * duration / 4)) moveOut(1);
         if(count == duration) moveOut(3); 
        
        
         //update ghost
         if(scare_clock == 0) {
            for(var i=0;i<monsters.length;i++) {
                monsters[i][4] = 0;   
            }
         }

         if(scare_clock < limit && scare_clock>0) {
            for(var i=0;i<monsters.length;i++) {
                console.log("monster 4 is", monsters[i][4]);
                if(monsters[i][4] == 1) {
                    var prevX=monsters[i][0];
                    var prevY=monsters[i][1];
         //make ghost move towards pacman by picking the admissible direction that takes it closest
                    var move = moveRandom(prevX, prevY, monsters[i][3]);
    //              console.log(gx, gy);
                    monsters[i][0] = move[0];
                    monsters[i][1] = move[1];
                    monsters[i][3] = move[2];
                    redrawGhost(prevX,prevY,i,2);
                }
            }
            scare_clock++;
         }
         if (clockcount % slowdown==0) {return};
         if(is_powerful && power_clock<limit && seconds == 0) {
            for(var i=0;i<monsters.length;i++) {
                var prevX=monsters[i][0];
                var prevY=monsters[i][1];
                if(monsters[i][4] == 0) {
                    if(monsters[i][3] == "d") {
                        monsters[i][1] = monsters[i][1] + 5;
                        monsters[i][3] = opposite_direction(monsters[i][3]);
                    }
                    if(monsters[i][3] == "u") {
                        monsters[i][1] = monsters[i][1] - 5   ;
                        monsters[i][3] = opposite_direction(monsters[i][3]);

                    }   
                    if(monsters[i][3] == "l") {
                        monsters[i][0] = monsters[i][0] - 5 ;  
                        monsters[i][3] = opposite_direction(monsters[i][3]);

                    }
                    if(monsters[i][3] == "r") {
                        monsters[i][0] = monsters[i][0] + 5;   
                        monsters[i][3] = opposite_direction(monsters[i][3]);
                    }
                    redrawGhost(prevX,prevY,i,1);
                
                    seconds=1;
                    power_clock++;  
                }
            }
         }
         else if(is_powerful && power_clock<limit && seconds==1) {
            for(var i=0;i<monsters.length;i++) {
                var prevX=monsters[i][0];
                var prevY=monsters[i][1];
         //make ghost move towards pacman by picking the admissible direction that takes it closest
                if(monsters[i][4] == 0) {
                    var move = moveRandom(prevX, prevY, monsters[i][3]);
     //       console.log(gx, gy);
                    monsters[i][0] = move[0];
                    monsters[i][1] = move[1];
                    monsters[i][3] = move[2];
                    redrawGhost(prevX,prevY,i,1);
                }
            }
            power_clock++;
         }
         else {
         is_powerful=0;
         scare_clock=0;
         power_clock=0;
         for(var i=0;i<monsters.length;i++) {
            var prevX=monsters[i][0];
            var prevY=monsters[i][1];
         //make ghost move towards pacman by picking the admissible direction that takes it closest
            if(i == 0) {
                var move = moveSP(prevX,prevY, x, y);
                monsters[i][0] = move[0];
                monsters[i][1] = move[1];
            }
            else if(i == 1) {
                var temp = getLines(x,y);
                if(temp[0][0] == temp[0][2] && prevX == temp[0][0]) {
                    var move = moveSP(prevX, prevY, x, y);   
                }
                else if(temp[0][1] == temp[0][3] && prevY == temp[0][1]) 
                {
                    var move = moveSP(prevX, prevY, x, y);   
                }
                
                else var move = moveSP(prevX, prevY, temp[0][0], temp[0][1]);  
                monsters[i][0] = move[0];
                monsters[i][1] = move[1];
            }
            
            else {
                var move = moveRandom(prevX, prevY, monsters[i][3]);
     //       console.log(gx, gy);
                monsters[i][0] = move[0];
                monsters[i][1] = move[1];
                monsters[i][3] = move[2];
            }
            redrawGhost(prevX,prevY,i,0); //erase ghost from prevX,prevY, draw at gx,gy
         }
         }
        


         
        if(tentDir == "r") tentDir = "l";
        else if(tentDir == "l") tentDir = "r";

        ctx.fillStyle = "black";
        
        if(eaten_dots.length == 20 || eaten_dots.length == 120) {
            ctx.drawImage(cherry, l / 2- 20, l / 2 + 130, 40, 40);
            if(x == l / 2 && y == l - 100) {
                score += 150;
                ctx.fillRect(l / 2 - 20, l / 2 + 130, 40, 40);
                document.getElementById("score").innerHTML = " <b> Score: " + score + "</b> &nbsp; &nbsp; &nbsp; &nbsp;";
            }
        }


        if(eaten_dots.length == 50 || eaten_dots.length == 100) {
            ctx.drawImage(strawberry, l / 2- 20, l / 2 + 130, 40, 40);
            if(x == l / 2 && y == l - 100) {
                score += 150;
                ctx.fillRect(l / 2 - 20, l / 2 + 130, 40, 40);
                document.getElementById("score").innerHTML = " <b> Score: " + score + "</b> &nbsp; &nbsp; &nbsp; &nbsp;";
            }
        }


        if(x <= 20) {
            clear_pacman(x, y, 15, "black");
            x = l - 30;
            placePacman(x, y, -1, "yellow");
        }
        else if(x >= l - 20) {
            clear_pacman(x, y, 15, "black");
            x = 30;
            placePacman(x, y, 1, "yellow");
        }
        
        for(var i = 0; i < monsters.length; i++) {
            if(monsters[i][0] <= 20) {
                var tx=monsters[i][0];
                var ty=monsters[i][1];
                //drawGhost(monster[i][0], monster[i][1], 18, "black", "black", "black", "black", "l", "l");
                monsters[i][0] = l - 30;
                redrawGhost(tx, ty, i, 0);
            }
            else if(monsters[i][0] >= l - 20) {
                //drawGhost(monster[i][0], monster[i][1], 18, "black", "black", "black", "black", "l", "l");
                var tx=monsters[i][0];
                var ty=monsters[i][1];
                monsters[i][0] = 30;
                redrawGhost(tx,ty,i,0);
            }
        }
      for (i = 0; i < monsters.length; i++) {
            if (collision(monsters[i][0], monsters[i][1], 15, x, y, 13)) {
                if (is_powerful && power_clock < 500) {
                    score += 150;
                    eat_ghost.play();
                    scare_clock++;
                    monsters[i][4] = 1;
                }
                else {
                     redrawGhost(monsters[0][0], monsters[0][1], 0);
                     redrawGhost(monsters[1][0], monsters[1][1], 1);
                     redrawGhost(monsters[2][0], monsters[2][1], 2);
                     redrawGhost(monsters[3][0], monsters[3][1], 3);
                     die.play();
                     pacmanDeath();
                     stop_game();
                     if (lives > 1) {
                     lives--;
                     setTimeout(function () {
                     alert("You lose");
                     initialize();
                     draw();
                     }
                     , 2000);
                     }
                     else {
                     setTimeout(function () {
                     alert("Game Over.");
                     var temp = Number(getCookie("level"));
                     temp-=1;
                     setCookie("level", temp.toString());
                     window.location.reload();
                     }
                     , 2000);
                     }
                }
            }
        }
        //clearCanvas();
        //console.log(dots.length, power_dots.length);
        if (dots.length == 0 && power_dots.length == 0) {
            stop_game();
            alert("You won");
            var temp;
            if(level <= 5) {    
                temp = Number(getCookie("level"));
                temp+=1;
                setCookie("level", temp.toString());
                window.location.reload();
            }
            else {
                temp = 1;
                setCookie("level", temp.toString());
                window.location.reload();
            }
     
        }
        if (count <= duration) count += 1;
    }
    
    function play_game() {
        initialize();
        draw();
        opening_song.play();
        setTimeout(function() {
            timer_running = true;
            timer = setInterval(update, 40);
            window.addEventListener("keydown", keydn, true);
        }, 4000)
    }
    function stop_game() {
        clearInterval(timer);
        timer_running = false;
        window.removeEventListener("keydown", keydn, true);
    }
