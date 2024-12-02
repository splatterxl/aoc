import { readFile } from 'fs/promises';

const list = await readFile('./inputs/1.txt', 'utf-8')

// isolate the 2 lists
let list1 = [];
let list2 = [];

for (const line of list.split('\n')) {
  const [a, b] = line.split(/\s+/).map(Number);
  list1.push(a);
  list2.push(b);
}


list1 = list1.sort();
list2 = list2.sort();

let total = 0;

for (const [index, first] of list1.entries()) {
  const second = list2[index];

  const diff = second - first;

  total += Math.abs(diff);
}

console.log('difference:', total);

let similarity = 0;

for (const first of list1) {
  // how many times does it appear in list2
  const count = list2.filter((item) => item === first).length;

  similarity += first * count;
}

console.log('similarity:', similarity);