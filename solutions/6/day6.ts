import { readFile } from 'fs/promises';

const input = await readFile('input.txt', 'utf8');

const map = input.split('\n').map((line) => line.split(''));

// clone original map
const guard = '^';

// find the guard in the map
const initialX = map.findIndex((line) => line.includes(guard));
const initialY = map[initialX].indexOf(guard);

enum Direction {
	Up = 0,
	Right = 1,
	Down = 2,
	Left = 3
}

/*

....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...

*/

// rules (part 1)
// if an obstacle is ahead of us, turn right
// otherwise move forward

// returns true if we are in a loop
// false if out of bounds
function processMap(map, verbose = false): [boolean, Set<string>, string[][]] {
	// set current direction to up
	let direction = 0;

	const positionsVisited = new Set<string>();
	let x = initialX + 0;
	let y = initialY + 0;

	while (true) {
		const newPos = {
			x,
			y
		};

		if (positionsVisited.has(`${x},${y},${direction}`)) {
			return [true, positionsVisited, map];
    }
    
    positionsVisited.add(`${x},${y},${direction}`);

		switch (direction) {
			case Direction.Up:
				newPos.x--;
				break;
			case Direction.Right:
				newPos.y++;
				break;
			case Direction.Down:
				newPos.x++;
				break;
			case Direction.Left:
				newPos.y--;
				break;
		}

		// check if the new position is out of bounds
		if (map[newPos.x]?.[newPos.y] === undefined) {
			return [false, positionsVisited, map];
		}

		// check if the new position is an obstacle
		if (map[newPos.x][newPos.y] === '#' || map[newPos.x][newPos.y] === 'O') {
			// console.log('turning right', Direction[direction], 'to', Direction[(direction + 1) % 4]);
			direction = (direction + 1) % 4;

			if (verbose) {
				map[x][y] = '+';
			}
		} else {
			// mark current position with O
			// console.log('moving from', x, y, 'to', newPos.x, newPos.y, 'direction', Direction[direction]);

			x = newPos.x;
			y = newPos.y;

			if (!verbose) map[x][y] = 'X';
			else {
				if (map[x][y] !== '^') {
					switch (direction) {
						case Direction.Up:
						case Direction.Down:
							map[x][y] = '|';
							break;
						case Direction.Right:
						case Direction.Left:
							map[x][y] = '-';
							break;
					}
				}
			}
		}
	}
}

const [isLoop, history, finalMap] = processMap(map);

console.log(
	'finished part 1',
	isLoop,
	finalMap.flat().filter((c) => c === 'X').length
);
console.log(finalMap.map((line) => line.join('')).join('\n'));

const h = [...history];

let sum_p2 = 0;
const done = new Set<string>();

for (const item of h.slice(1)) {
	const [x, y, direction] = item.split(',').map((n) => parseInt(n, 10));
	if (done.has(`${x},${y}`)) {
		continue;
	}

	map[x][y] = 'O';

	done.add(`${x},${y}`);

	const [isLoop, _, finalMap] = processMap(map, true);

	if (isLoop) {
		sum_p2++;

		process.stdout.write(' - valid out of ' + h.length + ' \r' + sum_p2);
	}

	map[x][y] = '.';
}

console.log('\nfinished part 2', sum_p2);
