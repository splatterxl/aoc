import { readFile, writeFile } from 'fs/promises';

enum Directions {
  Up = 0,
  Right = 90,
  Down = 180,
  Left = 270,
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

const input = await readFile('input.txt', 'utf8');

// turn into 2d array
const map = input.split('\n').map(row => row.split(''));

// find the starting position
let x = map.findIndex(row => row.includes('^'));
let y = map[x].findIndex(cell => cell === '^');

let direction: Directions = Directions.Up;

function turnRight() {
  direction += 90;

  // @ts-ignore
  if (direction === 360) {
    direction = Directions.Up;
  }
}

loop: while (true) {
  let newX = x + 0;
  let newY = y + 0;

  switch (direction as number) {
    case Directions.Up:
      newX--;
      break;
    case Directions.Right:
      newY++;
      break;
    case Directions.Down:
      newX++;
      break;
    case Directions.Left:
      newY--;
      break;
  }

  switch (map[newX]?.[newY]) {
    case '#':
      turnRight();
      console.log('turning right due to obstruction at', newX, newY);
      continue loop;
    case 'X':
    case '.':
      map[x][y] = 'X';
      x = newX;
      y = newY;
      console.log('moving to', x, y);
      break;
    case undefined:
      map[x][y] = 'X';
      console.log('out of bounds');
      break loop;
  }
}

console.log(map.map(row => row.filter(cell => cell === 'X').length).reduce((acc, curr) => acc + curr, 0));
writeFile('./output.txt', map.map(row => row.join('')).join('\n'));

// TODO: part 2