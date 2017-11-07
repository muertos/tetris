const canvas = document.getElementById('tetris'); 	//I'm really not sure why I need this
const context = canvas.getContext('2d'); 			//same as above

//sets the scale. If I don't do this, the tetris "blocks" will be 1*1 pixel
context.scale(20, 20);

//first tetris piece
const matrix = [
	[0, 0, 0],
	[1, 1, 1],
	[0, 1, 0],
];

function collide(arena, player) {
	const [m, o] = [player.matrix, player.pos];
	//????
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] != 0 && 
				(arena[y + o.y] && arena[y + o.y][x + o.x]) != 0) {
				return true;
			}
		}
	}
	return false;
}

function createMatrix(w, h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

const player = {
	pos: {x: 5, y: 5},
	matrix: matrix
};

//??????????? I don't understand the forEach
function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = 'green';
				context.fillRect(x + offset.x,
								 y + offset.y,
								 1, 1);
			}
		});
	});
}

function draw() {
	context.fillStyle = "#000"; //set the background of the canvas (note, this does not actually fill the backgroud in)
	context.fillRect(0, 0, canvas.width, canvas.height); //this actually fills the background
	drawMatrix(arena, {x: 0, y: 0}); //draw the entire tetris board
	drawMatrix(player.matrix, player.pos); //draw the canvas with the current moving tetris piece
}

function playerDrop() {
		player.pos.y++;
		if (collide(arena, player)) {
			player.pos.y--;
			merge(arena, player);
			player.pos.y = 0;
		}
		//set dropCounter to 0 because reasons
		dropCounter = 0;
}

function playerMove(dir) {
	player.pos.x += dir;
	if (collide(arena, player)) {
		player.pos.x -= dir;
	}
}

function playerRotate(dir) {
	rotate(player.matrix, dir);
	if (collide(arena, player)) {
		rotate(player.matrix, -dir);
	}
}

function rotate(matrix, dir) {
	for (let y = 0; y < matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
					matrix[x][y],
					matrix[y][x]
			] = [
					matrix[y][x],
					matrix[x][y]
					];
		}
	}
	if (dir > 0) {
		matrix.forEach(row => row.reverse());
	} else {
		matrix.reverse();
	}
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
	const deltaTime = time - lastTime;
	lastTime = time;
	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		player.pos.y++;
		dropCounter = 0;
	}

	draw(); // draw things
	requestAnimationFrame(update); //not sure what this is about
}

function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value != 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		})
	})
}
const arena = createMatrix(12,20);
//log all the things!
//console.log(arena); console.table(arena);

document.addEventListener('keydown', event => {
	console.log(event);
	if (event.keyCode == 37) {
		playerMove(-1);
	}
	if (event.keyCode == 39) {
		playerMove(1);
	}
	if (event.keyCode == 40) {
		playerDrop();
	}
	//if q is pressed, rotate counter clockwise
	if (event.keyCode == 81 ) {
		playerRotate(1);
	}
	//is w is pressed, rotate clockwise
	if (event.keyCode == 87) {
		playerRotate(-1);
	}
});

//main loop
update(); 