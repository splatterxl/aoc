import java.io.File

val grid = File("input.txt").readText().split("\n").map { it.toCharArray().map { digit -> digit.digitToInt() } }

fun List<List<Int>>.getAllCoordinates(value: Int): Set<Pair<Int, Int>> {
    return this.mapIndexed { y, row ->
        row.mapIndexed { x, elevation ->
            if (elevation == value) {
                Pair(x, y)
            } else null
        }
    }.flatten().filterNotNull().toSet()
}

val trailheads = grid.getAllCoordinates(0)
val peaks = grid.getAllCoordinates(9)

var rating = 0
var score = 0

for (head in trailheads) {
    val (x, y) = head
    val elevation = grid[y][x]
    // visited 9's
    val visited: MutableSet<Pair<Int, Int>> = mutableSetOf()

    fun findPaths(current: Pair<Int, Int>, value: Int) {
        val (x, y) = current

        // find neighbours around in all sides
        val neighbours = listOf(
            Pair(x - 1, y),
            Pair(x + 1, y),
            Pair(x, y - 1),
            Pair(x, y + 1)
        )

        for (neighbour in neighbours) {
            val (x, y) = neighbour
            if (x < 0 || y < 0 || x >= grid[0].size || y >= grid.size) {
                continue
            }

            val neighbourElevation = grid[y][x]

            if (neighbourElevation != value + 1) continue
            if (neighbourElevation == 9) {
                rating += 1
                if (visited.contains(neighbour).not()) score += 1
                visited.add(neighbour)
                continue
            }

            findPaths(neighbour, neighbourElevation)
        }
    }

    findPaths(head, elevation)
}

println("Scores: $score")
println("Ratings: $rating")