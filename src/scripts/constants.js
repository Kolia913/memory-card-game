export const SECONDS_IN_MS = 1000
export const SECONDS_IN_MIN = 60
export const MINUTE_IN_MILLISECONDS = 60 * 1000

export const levelConfigs = {
    easy: {
        time: 2 * MINUTE_IN_MILLISECONDS,
        rows: 4,
        cols: 4,
    },
    medium: {
        time: 1.5 * MINUTE_IN_MILLISECONDS,
        rows: 4,
        cols: 6,
    },
    hard: {
        time: MINUTE_IN_MILLISECONDS,
        rows: 6,
        cols: 6,
    }
}

export const DEFAULT_LEVEL_DIFFICULTY_KEY = 'easy'

export const boardTheme = {
    backgroundColor: '#FFC8DD',
    borderRadius: '10px',
    border: '1px solid #FFAFCC',
    fontSize: '38px',
    fontWeight: '600',
    padding: '10px',
    card: {
        backBackgroundColor: '#CDB4DB',
        frontBackgroundColor: '#FFFFFF',
        border: '1px solid #A2D2FF',
        borderRadius: '10px',
        padding: '5px'
    }
}