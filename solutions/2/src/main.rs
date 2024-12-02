fn main() {
    let input = include_str!("../input.txt");

    let mut sum_p1 = 0;
    let mut sum_p2 = 0;

    for line in input.lines() {
        let digits: Vec<u32> = line.split_whitespace().map(|c| c.parse::<u32>().unwrap()).collect();

        let safe = is_safe(digits.clone());

        if safe {
            sum_p1 += 1;
            sum_p2 += 1;
        } else {
            for i in 0..digits.len() {
                let mut digits_copy = digits.clone();
                digits_copy.remove(i);

                let safe = is_safe(digits_copy);

                if safe {
                    sum_p2 += 1;
                    break;
                }
            }
        }
    }

    println!("Safe: [1] {sum_p1} [2] {sum_p2}");
}

#[derive(PartialEq)]
enum Change {
    Increase,
    Decrease,
    None,
}

fn is_safe(digits: Vec<u32>) -> bool {
    let mut change = Change::None;

    let mut prev: Option<u32> = None;
    let mut safe = true;

    for current in digits {

        match prev {
            Some(prev) => {
                let current_change = if current < prev {
                    Change::Decrease
                } else if current > prev {
                    Change::Increase
                } else {
                    Change::None
                };

                if change != current_change && change != Change::None {
                    safe = false;
                    break;
                }

                change = current_change;

                let difference = match change {
                    Change::Decrease => prev - current,
                    Change::Increase => current - prev,
                    Change::None => 0,
                };

                if 1 > difference || difference > 3 {
                    safe = false;
                    break;
                }
            }
            None => (),
        }

        prev = Some(current);
    }

    safe
}
