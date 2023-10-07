import EventEmitter from "events";

export class Timer extends EventEmitter {
    #fixValueMilliseconds
    #milliseconds
    #interval
    constructor(milliseconds) {
        super();
        this.#milliseconds = milliseconds
        this.#fixValueMilliseconds = milliseconds
        this.#interval = null
    }

    start() {
        if (!this.#interval && this.#milliseconds > 0) {
            this.#interval = setInterval(() => {
                this.#milliseconds -= 1000
                this.emit('tick', this.#milliseconds)

                if (this.#milliseconds <= 0) {
                    this.stop()
                    this.emit('end')
                }
            }, 1000)
            this.emit('start', this.#milliseconds)
        }
    }

    stop() {
        if (this.#interval) {
            clearInterval(this.#interval)
            this.#interval = null
            this.emit('stop', this.#milliseconds)
        }
    }

    resume() {
        if (!this.#interval) {
            this.start()
            this.emit('resume', this.#milliseconds)
        }
    }

    restart() {
        this.stop()
        this.#milliseconds = this.#fixValueMilliseconds
        this.emit('restart', this.#milliseconds)
    }
}