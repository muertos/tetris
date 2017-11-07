const canvas = document.getElementById('tetris'); 	//I'm really not sure why I need this
const context = canvas.getContext('2d'); 			//same as above

//sets the scale. If I don't do this, the tetris "blocks" will be 1*1 pixel
context.scale(20, 20);

//first tetris piece



function createPiece(type) {
	if (type == 'T') {
		return [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
			];
	} else if (type == 'I') {
		return [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			];
	} else if (type == 'O') {
		return [
			[0, 0, 0],
			[1, 1, 0],
			[1, 1, 0],
			];
	} else if (type == 'J') {
		return [
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0],
			];
	} else if (type == 'L') {
		return [
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
			];
	} else if (type == 'O') {
		return [
			[1, 1],
			[1, 1],
			];
	} else if (type == 'S') {
		return [
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0],
			];
	} else if (type == 'Z') {
		return [
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0],
			];
	} 
	return  [[0]];
}

const matrix = createPiece('O');

const player = {
	pos: {x: 0, y: 0},
	matrix: matrix
};

function playerReset() {
	const pieces = 'IOJLOSZ';
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y = 0;
	player.pos.x = 	(arena[0].length / 2 | 0) -
					(player.matrix[0].length / 2 | 0);
	if (collide(arena, player)) {
		arena.forEach(row => row.fill(0));
	}

}


//playerReset();

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
			playerReset();
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
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while (collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if (offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}

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
