export const generateRuneArray = (n) => [...Array(n)].map((_, i) => `rune_${i}.png`)

const byField = (field) => (a, b) => a[field] - b[field]

export const shuffle = (arr) => arr.map(el => ({ el, rand: Math.random() }))
                                   .sort(byField('rand'))
                                   .map(({ el }) => el)

export const createCard = (rune, id, matchId) => ({ id, rune, active: false, correct: false, matchId })

export const createCardArray = (names) => {
    const matchId = (arr, index) => index % arr.length

    return [...names, ...names].map((name, index) => createCard(name, index, matchId(names, index)))
}

export const patchCard = (cards, id, patch) => cards.map(c => (c.id === id ? { ...c, ...patch } : c))

export const getActive = (cards) => cards.filter(c => c.active && !c.correct)

export const isAllCorrect = (cards) => cards.every(c => c.correct)

export const clearActiveNonCorrect = (cards) => cards.map(c => c.active && !c.correct ? { ...c, active: false} : c)

export const getUpdatedCardIds = (newCards, oldCards) => {
    // We don't care about other fields in terms of updates
    const activeOld = oldCards.map(card => ({ id: card.id, active:card.active })) 
    const activeNew = newCards.map(card => ({ id: card.id, active:card.active }))

    const mapOld = new Map(activeOld.map(obj => [obj['id'], obj])) // O(1) lookup

    return activeNew.filter(obj => JSON.stringify(obj) != JSON.stringify(mapOld.get(obj['id'])))
                    .map(c => c.id)
}

export const calculateScore = (moves) => moves.filter(move => move > 0).reduce((total, move) => total + move ** 2 + move + 3, 0)

export const windowConfirm = (text, action) => () => confirm(text) ? action.call() : ''

export const clone = (obj) => JSON.parse(JSON.stringify(obj))