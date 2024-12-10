fn main() {
    let input = include_str!("../input.txt").trim();

    let numbers: Vec<u32> = input.chars().map(|c| c.to_digit(10).unwrap()).collect();
    let mut buf: Vec<File> = Vec::new();

    #[derive(Debug, Copy, Clone)]
    struct File {
        size: i32,
        data: Option<i32>,
    }

    // step 1. compute the initial buffer
    // given: 2333133121414131402
    // return: 00...111...2...333.44.5555.6666.777.888899

    for (i, digit) in numbers.into_iter().enumerate() {
        // even = file size
        // odd = empty bytes

        buf.push(File {
            size: digit as i32,
            data: match i % 2 {
                0 => Some((i / 2) as i32),
                1 => None,
                _ => unreachable!(),
            },
        })
    }

    // step 2. clean up buffer
    // by moving the leftmost filled byte to the rightmost empty byte

    {
        let mut buf: Vec<Option<i32>> = buf
            .iter()
            .map(|file| vec![file.data; file.size as usize])
            .flatten()
            .collect();

        // remove trailing empty bytes
        while let Some(&None) = buf.last() {
            buf.pop();
        }

        while let Some(position) = buf.iter().position(Option::is_none) {
            let last = buf.iter().last();

            buf[position] = *last.unwrap();

            buf.pop();
        }

        let mut checksum: i64 = 0;

        for (i, byte) in buf.iter().enumerate() {
            match byte {
                Some(byte) => {
                    checksum += (i as i64) * (*byte as i64);
                }
                None => (),
            }
        }

        println!("Checksum [part 1]: {}", checksum);
    }

    {
        // part 2

        // now moving whole files at a time

        let mut list = buf.clone();

        let order = list
            .clone()
            .iter()
            .filter(|file| file.data.is_some())
            .rev()
            .cloned()
            .collect::<Vec<File>>();

        let str = order
            .iter()
            .map(|file| file.data.unwrap().to_string())
            .collect::<Vec<String>>()
            .join(",");

        for File { data, size } in order {
            let first_suitable = list.iter().position(|f| f.data.is_none() && f.size >= size);
            if first_suitable.is_none() {
                continue;
            }
            let first_suitable_idx = first_suitable.unwrap();
            let first_suitable = list[first_suitable_idx];
            let idx = list.iter().position(|f| f.data == data).unwrap();

            if first_suitable_idx < idx {
                list[first_suitable_idx] = File { size, data };
                list[idx].data = None;

                if first_suitable.size > size {
                    list.insert(
                        first_suitable_idx + 1,
                        File {
                            size: first_suitable.size - size,
                            data: None,
                        },
                    );
                }
            }
        }

        // compute the buffer

        let buf: Vec<i32> = list
            .iter()
            .map(|file| vec![file.data.unwrap_or(-1); file.size as usize])
            .flatten()
            .collect();

        let mut checksum: i64 = 0;

        for (i, byte) in buf.iter().enumerate() {
            match byte {
                -1 => (),
                _ => {
                    checksum += (i as i64) * (*byte as i64);
                }
            }
        }

        println!("Checksum [part 2]: {}", checksum);
    }
}
