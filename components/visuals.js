export const ScoreSheet = ({ moves, score, combo }) => {
    return( 
        `<div class="score-sheet"> 
            <span>Број потеза: ${moves}</span><span>Резултат: ${score}</span><span>Ланац погодака: ${combo}</span>
        </div>`
    )
}