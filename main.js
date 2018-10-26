'use strict'

let lo = _.noConflict();

function $assign(domPath) {
    return $(domPath)
}

let leaderInitialsInput = $assign('#leader-input input')

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


game.play()


//set high scores
// TODO pull from DB
let allTime = [
    { name: 'ETH', score: 200 },
    { name: 'ETH', score: 190 },
    { name: 'ETH', score: 180 },
    { name: 'ETH', score: 170 },
    { name: 'ETH', score: 160 },
    { name: 'ETH', score: 150 },
    { name: 'ETH', score: 140 },
    { name: 'ETH', score: 130 },
    { name: 'ABC', score: 120 }
]

let weekly = [
    { name: 'ETH', score: 200 },
    { name: 'ETH', score: 190 },
    { name: 'ETH', score: 180 },
    { name: 'ETH', score: 170 },
    { name: 'ABC', score: 160 },
    { name: 'ETH', score: 150 },
    { name: 'ETH', score: 140 },
    { name: 'ETH', score: 130 },
    { name: 'ETH', score: 120 }
]

function setScores(scoreObjs, domPath) {
    let sortedScoreObjs = lo.reverse(lo.sortBy(scoreObjs, 'score'))

    for(let i = 0; i < 9; i++) {
        $(`${domPath} .s${i+1}`).text(sortedScoreObjs[i].score)
        $(`${domPath} .n${i+1}`).text(sortedScoreObjs[i].name)
    }

}

setScores(allTime, '#all-time')
setScores(weekly, '#weekly')

game.onFinish(() => {

    // if high score show sweet message
    $('#leader-input-message').text('HIGH SCORE !!!')
    $('#leader-input-score').text(game.getScore())

    $('#leader-input').css('visibility', 'visible')

    // todo post this value to server


})

leaderInitialsInput.on('input', () => {
    if (leaderInitialsInput.val().length > 3) {
        leaderInitialsInput.val(leaderInitialsInput.val().substring(0,3))
    }
})

$('#submit-score').on('click', () => {
    if (leaderInitialsInput.val()) {

        weekly.push({ score: game.getScore(), name: leaderInitialsInput.val() })
        allTime.push({ score: game.getScore(), name: leaderInitialsInput.val() })

        setScores(allTime, '#all-time')
        setScores(weekly, '#weekly')

        $('#leader-input').css('visibility', 'hidden')
        leaderInitialsInput.val('')

    }
})

