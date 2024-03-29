
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

    loadScores();

    let leaderInitialsInput = $assign('#leader-input input')

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

function setScores(scoreSearchResults, domPath) {
    let scores = scoreSearchResults._embedded.scores;
    scores = lo.sortBy(scores, 'score)');

    for(let i = 0; i < 9; i++) {
        let score = scores[i]

        if (!score) {
            score = { score: 0, initials: '---' }
        }

        $(`${domPath} .s${i+1}`).text(score.score)
        $(`${domPath} .n${i+1}`).text(score.initials)
    }
}

async function submitScore(leaderInitialsInput) {
    if (leaderInitialsInput.val()) {

        await saneFetch('api/scores', {
            method: 'post',
            body: JSON.stringify({ score: game.getScore(), initials: leaderInitialsInput.val() }),
            headers: { 'Content-Type': 'application/json', }
        })

        $('#leader-input').css('visibility', 'hidden')
        leaderInitialsInput.val('')

        loadScores();
        game.reset();
    }
}

async function loadScores() {
    let lastWeek = new Date(Date.now()-1000*7*24*60*60).toLocaleDateString()

    let allTime = await saneFetch('/api/scores/search/getScoresByScoreGreaterThanOrderByScoreDesc?score=0');
    let weekly = await saneFetch(`/api/scores/search/getScoresByTimeAfterOrderByScoreDesc?score=120&time=${lastWeek}`);

    setScores(allTime, '#all-time')
    setScores(weekly, '#weekly')
}

init() // try to move this down

let colors = ['#0c0', '#333']

function changeColor (i) {

    if (i > 0) {
        d3.select(`#hudArt${i}`).style('fill', () => { return colors[0] })
        d3.select(`#hudArt${i-1}`).style('fill', () => { return colors[1] })
    } else {
        d3.select(`#hudArt${i}`).style('fill', () => { return colors[0] })
    }

}

function layer(i) {
    let f = 150

    if(i === 7) {
        setTimeout(() => {
            d3.select(`#hudArt6`).style('fill', () => { return colors[1] })
            layer(0)
        }, f*i)
    } else {
        setTimeout(() => { changeColor(i) }, f*i)
        layer(i+1)
    }


}

layer(0)
