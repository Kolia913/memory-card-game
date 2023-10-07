import './styles/index.css'
import { bounceAnimation } from './scripts/animations'
import { MatchGrid } from "./scripts/MatchGrid";
import {
    MINUTE_IN_MILLISECONDS,
    DEFAULT_LEVEL_DIFFICULTY_KEY,
    levelConfigs,
    boardTheme
} from "./scripts/constants";

let selectedLevel = levelConfigs.easy

const levelDescriptionElement = document.getElementById('level_desc')
const levelFormElement = document.getElementById('level_form')
const menuElement = document.getElementById('menu')
const timerElement = document.getElementById('timer-wrapper')
const buttonsWrapperElement = document.getElementById('buttons')
const backBtnElement = document.getElementById('back-btn')
const restartBtnElement = document.getElementById('restart-btn')

bounceAnimation(levelDescriptionElement)

levelFormElement.addEventListener('change', formChange)
levelFormElement.addEventListener('submit', startGame)
backBtnElement.addEventListener('click', backToMenu)
restartBtnElement.addEventListener('click', restartGame)


levelDescriptionElement.innerHTML += getMenuHintLayout({
        level: DEFAULT_LEVEL_DIFFICULTY_KEY,
        ...levelConfigs.easy
    })

function startGame(event) {
    event.preventDefault()
    menuElement.style.display = 'none'
    timerElement.style.display = 'flex'
    buttonsWrapperElement.style.display = 'flex'

    const args = getGameConfig()

    new MatchGrid(args).render()
}

function formChange(event) {
    const selectedValue = event.target.value
    const levelData =  levelConfigs[selectedValue]
    selectedLevel = levelData

    levelDescriptionElement.innerHTML = ""

    levelDescriptionElement.innerHTML += getMenuHintLayout({
        level: selectedValue,
        ...levelData
    })
}

function backToMenu(_event) {
    window.location.reload()
}

function restartGame() {
    document.getElementById('board-container').innerHTML = ""

    const args = getGameConfig()

    new MatchGrid(args).render()
}

function getMenuHintLayout({level, rows, cols, time}) {
    return `<p class="level-desc__param">Level: 
        <span class="level-desc__param-value">${level}</span></p>
        <p class="level-desc__param">Size: 
        <span class="level-desc__param-value">${rows}x${cols}</span></p>
        <p class="level-desc__param">Time: 
        <span class="level-desc__param-value">${time / MINUTE_IN_MILLISECONDS} minutes</span></p>`
}

function getGameConfig() {

    return {
        container: document.getElementById('board-container'),
        width: selectedLevel.cols * 100,
        height: selectedLevel.rows * 100,
        rows: selectedLevel.rows,
        cols: selectedLevel.cols,
        theme: boardTheme,
        time: selectedLevel.time
    }
}