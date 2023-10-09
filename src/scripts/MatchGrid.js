import { Card } from "./Card";
import { flipAnimation } from "./animations";
import { Timer } from "./Timer";

import { SECONDS_IN_MS, SECONDS_IN_MIN } from "./constants";

let CARDS = []

let gameState = null

export class MatchGrid {
    #container
    #width
    #height
    #cols
    #rows
    #theme
    #board
    #timer

    constructor({container, width, height, cols, rows, time, theme}) {
        this.#container = container
        this.#width = width
        this.#height = height
        this.#cols = cols
        this.#rows = rows
        this.#theme = theme
        this.#timer = new Timer(time)
        gameState = new GameState();
        CARDS = []
        this.#board = null
    }

    render() {
        this.#generateBoard()

        this.#generateCards()
        this.#renderCards()

        this.#generatePauseOverlay()
        this.#generateLoseOverlay()

        this.#setTimerListeners()

        this.#setMouseWatchers()
    }

    #generatePauseOverlay() {
        const overlay =
            document.createElement('div')

        overlay.classList.add('pause__overlay')
        overlay.id = 'pause-overlay'
        overlay.innerHTML += '<span>⏵</span>'
        overlay.style.borderRadius = this.#theme.borderRadius
        this.#container.appendChild(overlay)
    }

    #generateLoseOverlay() {
        const overlay =
            document.createElement('div')

        overlay.classList.add('lose__overlay')
        overlay.id = 'lose-overlay'
        overlay.innerHTML += '<span>Game Over:(</span>'
        overlay.style.borderRadius = this.#theme.borderRadius
        this.#container.appendChild(overlay)
    }

    #generateBoard() {
        this.#board = document.createElement('div')
        this.#board.id = 'board'

        this.#styleGameBoard()

        for(let i = 0; i < this.#rows; i++) {
            const row = document.createElement('div')
            this.#styleBoardRow(row)
            this.#board.appendChild(row)
        }

        this.#container.appendChild(this.#board)
    }

    #setTimerListeners() {
        const timer = document.getElementById('timer')

        this.#timer.start()

        this.#handleTickAndRepaint(timer)

        this.#timer.on('stop', (_ms) => {
            document.getElementById('pause-overlay').style.display = CARDS.length <= 0 ? 'none' :'flex'
        })

        this.#timer.on('resume', (_ms) => {
            document.getElementById('pause-overlay').style.display = 'none'
        })

        this.#timer.on('end', (_ms) => {
            document.getElementById('lose-overlay').style.display = CARDS.length <= 0 ? 'none' :'flex'
        })
    }

    #handleTickAndRepaint(timerElement) {
        this.#timer.on('tick', (ms) => {
            let seconds = ms / SECONDS_IN_MS;
            const minutes = parseInt( (seconds / SECONDS_IN_MIN).toFixed(2));
            seconds = seconds % 60;
            timerElement.innerText = `${(minutes < 10 ? '0'+minutes : minutes)}:${seconds < 10 ? '0'+seconds : seconds}`
            if(CARDS.length <= 0) {
                this.#timer.stop()
            }
        })
    }

    #styleGameBoard() {
        this.#board.classList.add('game__board')
        this.#board.id = 'game-board'
        this.#board.style.padding = this.#theme.padding
        this.#board.style.backgroundColor = this.#theme.backgroundColor
        this.#board.style.border = this.#theme.border
        this.#board.style.fontSize = this.#theme.fontSize
        this.#board.style.fontWeight = this.#theme.fontWeight
        this.#board.style.borderRadius = this.#theme.borderRadius
        this.#board.style.maxWidth = this.#width + 'px'
        this.#board.style.maxHeight = this.#height + 'px'
        this.#board.style.width = '100vh'
        this.#board.style.height = '100vw'
        this.#board.style.gap = this.#theme.padding
    }

    #styleBoardRow(rowElement) {
        rowElement.classList.add('row')
        rowElement.style.width = '100%'
        rowElement.style.height = (this.#height / this.#rows).toString() + 'px'
        rowElement.style.gap = this.#theme.padding
    }

    #generateCards() {
        const cardTheme = {
            ...this.#theme.card,
            height: (this.#height / this.#rows) - this.#rows * this.#theme.padding + 'px',
            width: (this.#height / this.#rows).toString() + 'px'
        }
        let id = 1;
        for(let i= 0; i < this.#cardsCount; i += 2) {
            CARDS.push(new Card(id, `card${i}`, cardTheme, cardClick))
            CARDS.push(new Card(id, `card${i+1}`, cardTheme, cardClick))
            id++;
        }
        this.#shuffleCards(CARDS)
    }

    #shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]]
        }
        return cards;
    }

    #renderCards() {
        for(let i = 0; i < this.#rows; i++) {
            const row = this.#board.getElementsByClassName('row')
            for(let j = 0; j < this.#cols; j++) {
                CARDS[this.#getCardPosition(i, j)].render(row[i])
            }
        }
    }

    #getCardPosition(row, col) {
        return row * this.#cols + col
    }

    #setMouseWatchers() {
        document.getElementById('pause-overlay').addEventListener('mouseenter', () => {
            this.#timer.resume()
        })
        this.#board.addEventListener('mouseleave', () => {
            this.#timer.stop()
        })
    }

    get #cardsCount() {
        return this.#rows * this.#cols
    }
}

class GameState {
    #firsCard
    #secondCard

    set firstCard(id) {
        this.#firsCard = id
    }

    set secondCard(id) {
        this.#secondCard = id
    }

    get isOnCardOpened() {
        return !!this.#firsCard
    }

    get isTwoCardsOpened() {
        return !!this.#firsCard && !!this.#secondCard
    }

    isCardClickedSecond(uniqueId) {
        return this.#firsCard.uniqueId === uniqueId
    }

    checkCardsEquality() {
        const cards = {firstCard: this.#firsCard, secondCard: this.#secondCard}
        const falsyResult = {
            isEqual: false,
            ...cards
        }
        if(!this.isTwoCardsOpened) {
            return falsyResult
        }
        const result =  this.#firsCard.id === this.#secondCard.id ? {
            isEqual: true,
            ...cards
        } : falsyResult

        this.firstCard = undefined
        this.secondCard = undefined

        return result
    }
}

function cardClick(evt) {
    if(!gameState || evt.target.classList.contains('flipped')) {
        return
    }

    flipAnimation(evt.target)
    if(!gameState.isOnCardOpened) {
        gameState.firstCard = {
            id: +evt.target.dataset.id,
            uniqueId: evt.target.id,
        }
    } else {
        !gameState.isCardClickedSecond(evt.target.id) ? gameState.secondCard = {
            id: +evt.target.dataset.id,
            uniqueId: evt.target.id,
        } : undefined
    }
    if(!gameState.isTwoCardsOpened) {
        return
    }
    const result = gameState.checkCardsEquality()
    if(result.isEqual) {
        removeMatchedCards(result)
    } else {
        flipBackCards(result)
    }
    if(CARDS.length === 0) {
        setTimeout(() => {
            document.getElementById('game-board').innerHTML = '<span>Winner winner chicken dinner!:)</span>'
        }, 1000)
    }
}

function removeMatchedCards(result) {
    CARDS = CARDS.filter(item => item.id !== result.firstCard.id)
    setTimeout(() => {
        const matchedPair=
            document.querySelectorAll(`[data-id="${result.firstCard.id}"]`)
        matchedPair.forEach(item => {
            item.removeEventListener('click', cardClick)
            item.style.pointerEvents = 'none'
            item.style.opacity = '0'
        })
    }, 1000)
}

function flipBackCards(result) {
    const firstCard = document.querySelector(`#${result.firstCard.uniqueId}`)
    const secondCard = document.querySelector(`#${result.secondCard.uniqueId}`)
    setTimeout(() => {
        flipAnimation(firstCard)
        flipAnimation(secondCard)
    }, 1000)
}


