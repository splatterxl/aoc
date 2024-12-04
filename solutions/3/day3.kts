import java.io.File

val input = File("input.txt").readText();
val part1 = Regex("""mul\((?<one>\d+),(?<two>\d+)\)""")

// part 2
val sum = part1.findAll(input).map {
    val (one, two) = it.groups.toList().drop(1).map { it!!.value.toInt() }

    one * two
}.sum()

println("Sum: $sum")

// part 2

val part2 = Regex("""mul\((?<one>\d+),(?<two>\d+)\)|do(?:n't)?\(\)""")
val results = part2.findAll(input)

var doing = true
var sum2 = 0

for (result in results) {
    when (result.value) {
        "don't()" -> doing = false
        "do()" -> doing = true
        else -> {
            if (!doing) continue

            val (one, two) = result.groups.toList().drop(1).map { it!!.value.toInt() }

            sum2 += one * two
        }
    }
}

println("Sum part 2: $sum2")