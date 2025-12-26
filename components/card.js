export const Card = ({ id, rune, active, correct, action }) => {
    const showCard = active || correct

    const div = document.createElement('div')
    div.className = 'card'
    div.id = `card_${id}`

    div.addEventListener('click', () => action(id))

    const front = document.createElement('div')
    front.className = 'face front'
    front.hidden = !showCard

    const back = document.createElement('div')
    back.className = 'face back'
    back.hidden = showCard

    const img = document.createElement('img')
    img.src = `./resources/runes/${rune}`
    front.appendChild(img)

    if (!showCard) {
        img.hidden = true
    }

    div.appendChild(front)
    div.appendChild(back)

   

    div.style.transformStyle = "preserve-3d"
    div.animate(
        [
            { transform: "perspective(900px) rotateY(-90deg)", opacity: 0, offset: 0 },
            { transform: "perspective(900px) rotateY(-60deg)", opacity: 0.4, offset: 0.45 },
            { transform: "perspective(900px) rotateY(0deg)", opacity: 1, offset: 1 }
        ],
        {
            duration: 800,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",           
            fill: "forwards"
        }
    )
    
    return div

}
