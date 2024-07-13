const icon_width = 79, icon_height = 79, time_per_icon = 100,
    num_icons = 9, indexes = [0, 0, 0],
    icon_map = ["banana", "seven", "cherry", "plum", "orange", "bell",
        "bar", "lemon", "melon"],
        startButton = document.querySelector("#start-button"),
        balanceText = document.querySelector("#balance-text");
let userBalanceLeft = 100, userBalanceWon = 0, winCondition = false;

const roll = (reel, offset = 0) => {
    const fruitsPassed = (offset + 2) * num_icons + Math.round(Math.random() * num_icons); //# of icons passed during the roll
    const style = getComputedStyle(reel),
        backgroundPositionY = parseFloat(style["background-position-y"]),
        targetBackgroundPositionY = backgroundPositionY + fruitsPassed * icon_height,
        normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

    return new Promise((resolve, reject) => {
        reel.style.transition = `background-position-y ${8 + fruitsPassed * time_per_icon}ms`;
        reel.style.backgroundPositionY = `${backgroundPositionY + fruitsPassed * icon_height}px`

        setTimeout(() => {
            reel.style.transition = `none`;
            resolve(fruitsPassed % num_icons)
        }, 8 + fruitsPassed * time_per_icon);
    })
};

function rollAllWheels() {
    const reelsList = document.querySelectorAll('.slots > .reel');
    const slotsBackground = document.querySelector('.slots');
    slotsBackground.classList.remove('flashing');

    Promise
        .all( [...reelsList].map((reel, i) => roll(reel,i)) )
        .then((fruitsPassed) => {
            fruitsPassed.forEach((fruitsPassed,i) => indexes[i] = (indexes[i] + fruitsPassed) % num_icons);
            indexes.map((index) => {console.log(icon_map[index])});

            const matches = indexes.map(index => icon_map[index]);
            const winnings = calculateWinnings(matches);
            if(winnings > 0){
                winCondition = true;
            }
            userBalanceLeft = updateBalance(userBalanceLeft, winnings);

            balanceText.textContent = `Your current balance is $${userBalanceLeft}`;
            if(winCondition == true){
                slotsBackground.classList.add('flashing');
            }
        })
}

document.getElementById('start-button').addEventListener('click', () => {
    rollAllWheels();
});

function calculateWinnings(matches){
    let winnings = 0;

    if(matches[0] === matches[1]){
        switch(matches[0]) {
            case 'banana':
                winnings = 15;
                break;
            case 'seven':
                winnings = 30;
                break;
            case 'cherry':
                winnings = 45;
                break;
            case 'plum':
                winnings = 60;
                break;
            case 'orange':
                winnings = 75;
                break;
            case 'bell':
                winnings = 90;
                break;
            case 'bar':
                winnings = 150;
                break;
            case 'lemon':
                winnings = 130;
                break;
            case 'melon':
                winnings = 115;
                break;
        } 
    } else if (matches[0] === matches[1] === matches[2]){
        switch(matches[0]) {
            case 'banana':
                winnings = 150;
                break;
            case 'seven':
                winnings = 300;
                break;
            case 'cherry':
                winnings = 450;
                break;
            case 'plum':
                winnings = 600;
                break;
            case 'orange':
                winnings = 750;
                break;
            case 'bell':
                winnings = 900;
                break;
            case 'bar':
                winnings = 1500;
                break;
            case 'lemon':
                winnings = 1300;
                break;
            case 'melon':
                winnings = 1150;
                break;
        }
    } else {
        winnings = 0;
    } return winnings;
}

function updateBalance(currentBalance, winnings){
    if(winnings > 0){
        return currentBalance + winnings; 
    } else {
        return currentBalance - 10;
    }
}

//next step is to stop the user from pressing too many times

