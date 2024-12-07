// a basic wordsearch puzzle

import { readFile } from 'fs/promises';

const input = await readFile('input.txt');

let sum_p1 = 0;

const lines = input.toString().split('\n');
// flip the lines to make it easier to iterate over columns
const cols = new Array(lines[0].length).fill('');

function processLine(line) {
	for (let i = 0; i < line.length; i++) {
		if (
			line[i] === 'X' &&
			line[i + 1] === 'M' &&
			line[i + 2] === 'A' &&
			line[i + 3] === 'S'
		) {
			sum_p1++;
		}

		if (
			line[i] === 'S' &&
			line[i + 1] === 'A' &&
			line[i + 2] === 'M' &&
			line[i + 3] === 'X'
		) {
			sum_p1++;
		}
	}
}

for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
	const line = lines[lineNumber];

	// get how many times XMAS or SAMX appears in the line
	processLine(line);

	// add the line to the columns
	for (let i = 0; i < line.length; i++) {
		cols[i] += line[i];
	}
}

// get the string from columns
for (const column of cols) {
	processLine(column);
}

// rotate the grid 45 degrees
// thank you u/Korka13
// TODO: read up how this works
function rotate45(data, fromBottom) {
	const length = { x: data[0].length, y: data.length };
	length.max = Math.max(length.x, length.y);

	const rotated = [];

	for (let k = 0; k <= 2 * (length.max - 1); k++) {
		const tempRow = [];
		for (let y = length.y - 1; y >= 0; y--) {
			let x = k - (fromBottom ? length.y - y : y);
			x >= 0 && x < length.x && tempRow.push(data[y][x]);
		}
		tempRow.length > 0 && rotated.push(tempRow);
	}
	return rotated;
}

const words = lines.map((line) => line.split(''));
const regex = /(?=(XMAS|SAMX))/g;

rotate45(words).forEach(
	(wordRow) => (sum_p1 += [...wordRow.join('').matchAll(regex)].length)
);

rotate45(words, true).forEach(
	(wordRow) => (sum_p1 += [...wordRow.join('').matchAll(regex)].length)
);

console.log(sum_p1);

// TODO: part 2