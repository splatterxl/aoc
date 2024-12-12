use std::{collections::HashMap, fs};

fn main() {
    let input = fs::read_to_string("input.txt").unwrap();
    let numbers: Vec<u64> = input
        .split_whitespace()
        .map(|x| x.parse().unwrap())
        .collect();

    let mut count = 0;

    fn blink(
        stone: u64,
        current_depth: u32,
        limit: u32,
        memo: &mut HashMap<(u64, u32), u64>,
    ) -> u64 {
        if let Some(&result) = memo.get(&(stone, current_depth)) {
            return result;
        }

        let str = stone.to_string();

        let new: Vec<u64> = match stone {
            0 => vec![1],
            _ if str.len() % 2 == 0 => {
                // split through the middle
                let (left, right) = str.split_at(str.len() / 2);

                let left = left.parse::<u64>().unwrap();
                let right = right.parse::<u64>().unwrap();

                vec![left, right]
            }
            _ => vec![stone as u64 * 2024],
        };

        if current_depth == limit {
            let result = new.len() as u64;

            return result;
        }

        let mut total = 0;

        for stone in new {
            total += blink(stone, current_depth + 1, limit, memo);
        }

        memo.insert((stone, current_depth), total);

        total
    }

    let mut memo = HashMap::new();

    // part 1

    for number in numbers {
        count += blink(number, 1, 75, &mut memo);
    }

    println!("Answer: {}", count);
}
