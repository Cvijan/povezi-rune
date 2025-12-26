import { clearActiveNonCorrect, getActive, patchCard, isAllCorrect, createCardArray, shuffle, generateRuneArray, clone } from "./utils/utils.js"

export const ActionTypes = {
    CARD_CLICK: 'CARD_CLICK',
    RESET: 'RESET',
    RESOLVE_PENDING: 'RESOLVE_PENDING'
}

export const DifficultyMap = {
    'EASY': 5,
    'MEDIUM': 9,
    'HARD': 14
}

export const cardClick = (cardId) => ({ type: ActionTypes.CARD_CLICK, payload: { cardId } })
export const reset = (difficulty) => ({ type: ActionTypes.RESET, payload: { difficulty } })
export const resolvePending = () => ({ type: ActionTypes.RESOLVE_PENDING })

export const update = (state, action) => {
    switch (action.type) {
        case ActionTypes.RESET: {
            const { difficulty } = action.payload
            
            return {
                cards: shuffle(createCardArray(generateRuneArray(DifficultyMap[difficulty]))),
                combo: 0,
                moves: [],
                gameOver: false,
                pending: null,
            }
        }

        case ActionTypes.CARD_CLICK: {
            let tmpState = clone(state)

            if (state.gameOver) return state
            if (state.pending) {
                tmpState = resolve(state)
            }

            const { cardId } = action.payload

            const clicked = tmpState.cards.find((c) => c.id === cardId)
            if (!clicked) return tmpState
            if (clicked.correct) return tmpState
            if (clicked.active) return tmpState

            const active = getActive(tmpState.cards)
            if (active.length >= 2) return tmpState

            const cards = patchCard(tmpState.cards, cardId, { active: true })

            const nowActive = getActive(cards)
            if (nowActive.length < 2) {
                return { ...tmpState, cards, _updated: true }
            }

            const [a, b] = nowActive
            const isMatch = a.matchId === b.matchId

            return {
                ...tmpState,
                cards,
                pending: { type: isMatch ? 'match' : 'mismatch', ids: [a.id, b.id] }
            }
        }

        case ActionTypes.RESOLVE_PENDING: {
            return state.pending ? resolve(state) : state
        }

        default:
            return state
    }
}

const resolve = (state) => {
    const { pending } = state
    if (!pending) return state

    if (pending.type === 'match') {
        const [id1, id2] = pending.ids
        let cards = state.cards
        cards = patchCard(cards, id1, { correct: true })
        cards = patchCard(cards, id2, { correct: true })

        const gameOver = isAllCorrect(cards)

        return {
            ...state,
            cards,
            combo: state.combo + 1,
            moves: [...state.moves, state.combo + 1],
            gameOver,
            pending: null,
        }
    }

    return {
        ...state,
        combo: 0,
        moves: [...state.moves, 0],
        gameOver: false,
        cards: clearActiveNonCorrect(state.cards),
        pending: null,
    }
}
