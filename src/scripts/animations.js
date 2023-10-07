import anime from 'animejs/lib/anime.es'

export function bounceAnimation(domNode) {
    anime({
        targets: domNode,
        translateY: -5,
        direction: 'alternate',
        loop: true,
        easing: 'linear',
        duration: 1000,
    })
}

export function flipAnimation(domNode) {
    const isFlipped = domNode.classList.contains('flipped');
    const backRotation = isFlipped ? '0deg' : '180deg';
    const frontRotation = isFlipped ? '180deg' : '0deg';
    const cardInnerNode = domNode.querySelector('#inner')

    anime({
        targets: cardInnerNode,
        rotateY: [
            { value: frontRotation },
            { value: backRotation }
        ],
        duration: 300,
        easing: 'easeInOutCubic',
        complete: () => {
            domNode.classList.toggle('flipped');
        },
    });
}