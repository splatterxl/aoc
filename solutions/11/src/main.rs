use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt").unwrap();
    let numbers: Vec<u64> = input
        .split_whitespace()
        .map(|x| x.parse().unwrap())
        .collect();

    let mut count = 0;

    fn blink(number: u64, count: u32, limit: u32) -> u32 {
        let str = number.to_string();

        let new: Vec<u64> = match number {
            0 => vec![1],
            _ if str.len() % 2 == 0 => {
                // split through the middle
                let (left, right) = str.split_at(str.len() / 2);

                let left = left.parse::<u64>().unwrap();
                let right = right.parse::<u64>().unwrap();

                vec![left, right]
            }
            _ => vec![number as u64 * 2024],
        };

        if count == limit {
            return new.len() as u32;
        }

        let count = count + 1;

        let mut total = 0;

        for n in new {
            total += blink(n, count, limit);
        }

        return total;
    }

    // part 1

    for number in numbers {
        count += blink(number, 1, 25);
    }

    println!("Part 1: {}", count);

    // TODO: make this more efficient so that we can do part 2
}
