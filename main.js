'use strict'

let lo = _.noConflict();

function $assign(domPath) {
    return $(domPath)
}


let game = new EatTheHex({
    hexColor            : '#444',
    outlineColor        : '#090',
    outlineWeight       : '0.1rem',
    width               : Math.min(500, $(window).width() - $(window).width()*0.05),
    height              : Math.min(500, $(window).height() - $(window).height()*0.05),
    hiddenHexes         : ['x0y0', 'x0y4', 'x1y4', 'x3y4', 'x4y0', 'x4y4'],
    columns             : 5,
    rows                : 5,
    hudtileColor        : '#222',
    hudtileBorderColor  : '#0c0',
    hudtileBorderWeight : '0.2rem'

})

$('#selectionTile').height(game.hexHeight*4)
$('#selectionTile').width(game.hexRadius*4)
$('#scoreBoard').width(game.hexRadius*2)
$('#scoreBoard').css('margin-left', game.hexRadius)

async function init() {
    game.play()

    let leaderInitialsInput = $assign('#leader-input input')

    let weekly = await saneFetch('/leaders/weekly')
    let allTime = await saneFetch('/leaders/allTime')

    setScores(weekly, '#weekly')
    setScores(allTime, '#all-time')

    /* game event triggers  todo REFACTOR ALL THIS SHIT */

    leaderInitialsInput.on('input', () => {
        if (leaderInitialsInput.val().length > 3) {
            leaderInitialsInput.val(leaderInitialsInput.val().substring(0,3))
        }
    })

    // shows leader board
    game.onFinish(() => {
        $('#leader-input-message').text('HIGH SCORE !!!')
        $('#leader-input-score').text(game.getScore())
        $('#leader-input').css('visibility', 'visible')
    })

    $('#submit-score').on('click', () => submitScore(leaderInitialsInput))
    $('#leader-input').keypress((key) => {
        key.which === 13 ? submitScore(leaderInitialsInput).catch(e => console.error(e)) : ''
    })
}

async function saneFetch(url, opts) {
    let response = await fetch(url, opts)
    return response.json()
}

function setScores(scoreObjs, domPath) {
    let sortedScoreObjs = lo.reverse(lo.sortBy(scoreObjs, 'score'))

    for(let i = 0; i < 9; i++) {
        $(`${domPath} .s${i+1}`).text(sortedScoreObjs[i].score)
        $(`${domPath} .n${i+1}`).text(sortedScoreObjs[i].name)
    }
}

async function submitScore(leaderInitialsInput) {
    if (leaderInitialsInput.val()) {

        let newWeekly = await saneFetch('/leaders/weekly', {
            method: 'put',
            body: JSON.stringify({ score: game.getScore(), name: leaderInitialsInput.val() }),
            headers: { 'Content-Type': 'application/json', }
        })

        let newAllTime = await saneFetch('/leaders/allTime', {
            method: 'put',
            body: JSON.stringify({ score: game.getScore(), name: leaderInitialsInput.val() }),
            headers: { 'Content-Type': 'application/json', }
        })

        setScores(newAllTime, '#all-time')
        setScores(newWeekly, '#weekly')

        $('#leader-input').css('visibility', 'hidden')
        leaderInitialsInput.val('')

        game.reset();
    }
}

init()




