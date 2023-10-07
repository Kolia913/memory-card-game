export class Card {
    #id
    #uniqueId
    #theme
    #flipped
    #onClick

    constructor(id, uniqueId, theme, onClick) {
        this.#id = id
        this.#uniqueId = uniqueId
        this.#theme = theme
        this.#onClick = onClick
        this.#flipped = false
    }

    render(containerNode) {
        const card = document.createElement('div')
        card.dataset.id = this.#id
        card.id = this.#uniqueId
        card.innerHTML = '<div class="card-inner" id="inner">' +
            `<div class="card-front" id="front">${this.id}</div>` +
            '<div class="card-back" id="back"></div>' +
            '</div>'
        this.#styleCard(card)
        card.addEventListener('click', this.#onClick)
        containerNode.appendChild(card)
    }

    #styleCard(cardNode) {
        const cardFront = cardNode.querySelector('#front')
        const cardBack = cardNode.querySelector('#back')

        this.#addBasicCardStyle(cardNode)
        this.#addStylesForCardAnimation(cardNode)

        this.#addBasicSideStyle(cardFront, this.#theme.frontBackgroundColor)
        this.#addBasicSideStyle(cardBack, this.#theme.backBackgroundColor)
    }

    #addBasicCardStyle(cardNode) {
        cardNode.classList.add('card');
        cardNode.style.border = this.#theme.border
        cardNode.style.borderRadius = this.#theme.borderRadius
        cardNode.style.textAlign = 'center'
        cardNode.style.display = 'flex'
        cardNode.style.cursor = 'pointer'

        cardNode.style.perspective = '1000px';
        cardNode.style.width = this.#theme.width;
        cardNode.style.height = this.#theme.height;
        cardNode.style.position = 'relative';
    }

    #addBasicSideStyle(cardSideElement, color) {
        cardSideElement.style.backgroundColor = color
        cardSideElement.style.pointerEvents = 'none'
        cardSideElement.style.width = '100%'
        cardSideElement.style.height = '100%'
        cardSideElement.style.display = 'flex'
        cardSideElement.style.justifyContent = 'center'
        cardSideElement.style.alignItems = 'center'
        cardSideElement.style.borderRadius = this.#theme.borderRadius
    }

    #addStylesForCardAnimation(cardNode) {

        const cardInnerNode = cardNode.querySelector('#inner')
        const frontNode = cardInnerNode.querySelector('#front')
        const backNode = cardInnerNode.querySelector('#back')

        cardNode.style.perspective = '1000px'
        cardNode.style.transformStyle = 'preserve-3d'
        cardNode.style.transition = 'transform 0.5s'

        this.#addCardInnerStyle(cardInnerNode)

        this.#addStylesForCardFrontAnimation(frontNode)
        this.#addStylesForCardBackAnimation(backNode)
    }

    #addCardInnerStyle(cardInnerNode) {
        cardInnerNode.style.width = '100%';
        cardInnerNode.style.height = '100%';
        cardInnerNode.style.transformStyle = 'preserve-3d';
        cardInnerNode.style.transition = 'transform 0.3s';
        cardInnerNode.style.justifyContent = 'center'
        cardInnerNode.style.alignItems = 'center'
        cardInnerNode.style.pointerEvents = 'none'
    }


    #addStylesForCardFrontAnimation(frontNode) {
        frontNode.style.width = '100%';
        frontNode.style.height = '100%';
        frontNode.style.position = 'absolute';
        frontNode.style.backfaceVisibility = 'hidden';
        frontNode.style.transform = 'rotateY(180deg)';
    }

    #addStylesForCardBackAnimation(backNode) {
        backNode.style.width = '100%';
        backNode.style.height = '100%';
        backNode.style.position = 'absolute';
        backNode.style.backfaceVisibility = 'hidden';
    }

    get id() {
        return this.#id
    }
}