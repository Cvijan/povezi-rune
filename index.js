import { Card } from "./components/card.js"
import { ActionTypes, cardClick, DifficultyMap, reset, resolvePending, update } from "./actions.js"
import { calculateScore, createCardArray, generateRuneArray, getUpdatedCardIds, shuffle, windowConfirm } from "./utils/utils.js"
import { ScoreSheet } from "./components/visuals.js"

const dispatchWithTimeout = () => {
    let t

    return (action) => {
        const prevCards = state.cards
        state = update(state, action)

        if (action.type == ActionTypes.RESET) render(state)
        if (state.cards !== prevCards || state.gameOver) render(state, prevCards)

        if (state.pending) {
            const delay = state.pending.type === 'mismatch' ? 850 : 0

            t = setTimeout(() => {
                dispatch(resolvePending())
            }, delay)
        }
        else clearTimeout(t)
    }
}

const dispatch = dispatchWithTimeout()

const render = (state, prevCards) => {
    const root = document.querySelector('#root')
    const score = document.querySelector('#score')

    const scoreSheetHtml = ScoreSheet({ moves: state.moves.length, score: calculateScore(state.moves), combo: state.combo })
    score.innerHTML = scoreSheetHtml

    let cardContainer = document.querySelector('main')

    if (!cardContainer) {
        cardContainer = document.createElement('main')
    }

    cardContainer.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(state.cards.length))}, 1fr)`
    cardContainer.style.gridTemplateRows = `repeat(${Math.ceil(Math.sqrt(state.cards.length))}, 1fr)`

    if (prevCards) {
        let updatedCardIds = getUpdatedCardIds(state.cards, prevCards)

        state.cards
            .filter(card => updatedCardIds.includes(card.id))
            .forEach(card => {
                let cardElement = document.querySelector(`#card_${card.id}`)
                cardElement.replaceWith(Card({ ...card, action: () => dispatch(cardClick(card.id))}))
            })
    }
    else {
        cardContainer.innerHTML = ''
        let cardElements = state.cards.map(card => Card({ ...card, action: () => dispatch(cardClick(card.id))}))
        cardElements.forEach(el => {
            cardContainer.appendChild(el)
        })
    }
    
    root.appendChild(cardContainer)
}

let state = {
    cards: shuffle(createCardArray(generateRuneArray(DifficultyMap['MEDIUM']))),
    combo: 0,
    moves: [],
    gameOver: false,
    pending: null,
}

const btnEasy = document.querySelector('#btn-easy')
const btnMedium = document.querySelector('#btn-medium')
const btnHard = document.querySelector('#btn-hard')

const confirmTxt = (difficulty) => `Да ли сте сигурни? (Ресет игре на: ${difficulty})`

btnEasy.addEventListener('click', windowConfirm(confirmTxt('Лако'), () => dispatch(reset('EASY'))))
btnMedium.addEventListener('click', windowConfirm(confirmTxt('Средње'), () => dispatch(reset('MEDIUM'))))
btnHard.addEventListener('click', windowConfirm(confirmTxt('Тешко'), () => dispatch(reset('HARD'))))

render(state)




