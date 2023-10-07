// Player Names, Rolls, and Clicked Dice
var player1 = "Player 1";
var player2 = "Player 2";
var rollsLeft = 3;
var rollableDice = new Array(10).fill(false);
var compHand = new Array(5).fill(0);
var userHand = new Array(5).fill(0);

//Function to change the player name
function editName() {
    player1 = prompt("Change player 1 name");

    document.querySelector("p.Player1").innerHTML = player1;
}

function showInstructions() {
    alert("Poker Dice Instructions:\n" +
    "You and the computer will each roll five dice. They each have six values on them: 9, 10, " + 
    "Jack, Queen, King, and Ace. Each player has a total of three rolls and the ability to hold " +
    "dice in between rolls.\n\n" +
    "After the three rolls, the player with the best hand wins!\n\n" +
    "The hands are ranked as in card poker, though keep in mind that the dice have no suits and " +
    "as such a flush is not possible.");
}

function startGame() {
    console.log("Game started");
    rollsLeft = 3;
    document.querySelector("p.output").innerHTML = "Game started! Make your first roll";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("nameButton").style.display = "none";
    document.getElementById("rollButton").style.display = "inline-block";
}

//Function to stick a dice
function stickDice(diceNum, player) {
    if (player == 0) {
        rollableDice[diceNum] = !rollableDice[diceNum];
    } else {
        rollableDice[diceNum + 5] = true;
    }
    
    if (rollableDice[diceNum + (player * 5)]) {
        document.getElementById("dice" + player + diceNum).style.border = "thick solid #FFFFFF";
    } else {
        document.getElementById("dice" + player + diceNum).style.border = "none";
    }
    
    if (player == 0) {
        console.log("Changing dice[" + diceNum + "] to " + rollableDice[diceNum]);
    } else {
        console.log("COMPUTER: Changing dice[" + diceNum + "] to " + rollableDice[diceNum + 5]);
    }
}

// Function for computer to decide on stuck dice
function compStuckDice(computerHandRanking, computerHand) {
    console.log("Computer's turn\n");
    if (computerHandRanking.handScore == 6) //roll next highest dice for four of a kind (lone dice)
    {
        console.log("COMPUTER: four of a kind, stick all but one\n");
        for (var j = 0; j < 5; j++) {
            if (computerHandRanking.nextHighCard != computerHand[j])
            {
                stickDice(j, 1);
            }
        }
    }
    else if (computerHandRanking.handScore > 3) //do not roll anything with five of a kind, a full house, or a straight (four of a kind has already been filtered out)
    {
        console.log("COMPUTER: Not sticking anything bc handscore of " + computerHandRanking.handScore + "\n");
        return;
    }
    else if (computerHandRanking.handScore == 2) //for two pairs, roll what isn't in the pairs
    {
        console.log("COMPUTER: two pair, stick pairs\n");
        for (var j = 0; j < 5; j++) {
            if ((computerHandRanking.highCard == computerHand[j]) || (computerHandRanking.nextHighCard == computerHand[j])) //anything that isn't the value of high card or next highest card, roll.
            {
                stickDice(j, 1);
            }
        }
    }
    else if (computerHandRanking.handScore > 0) //for three of a kind and for one pair, roll whatever is not in the main group
    {
        console.log("COMPUTER: three of a kind/one pair, stick groups\n");
        for (var j = 0; j < 5; j++) {
            if (computerHandRanking.highCard == computerHand[j]) //anything that isn't the value of the high card, roll.
            {
                stickDice(j, 1);
            }
        }
    }
    return; //bust, roll all dice again
}

//Function to roll the dice
function rollTheDice() {
    rollsLeft--;
    for (var j = 0; j < 2; j++) {
        for (var i = 0; i < 5; i++) {
            if (rollableDice[i + (j * 5)]) {
                continue;
            }
            var randNum = Math.floor(Math.random() * 6) + 1;
            if (j == 0) {
                userHand[i] = randNum;
            }
            else { 
                compHand[i] = randNum;
            }
            document.querySelector(".img" + j + i).setAttribute("src", "images/dice" + randNum + ".png");
        }
    }
    console.log("Dice rolled");

    //output hands
    var user = "User Hand: ";
    for (var i = 0; i < 5; i++) {
        user += userHand[i] + ", ";
    }
    console.log(user);
    user = "Computer Hand: ";
    for (var i = 0; i < 5; i++) {
        user += compHand[i] + ", ";
    }
    console.log(user);
    // DEBUGGING

    if (rollsLeft == 2) {
        for (var i = 0; i < 5; i++) {
            document.getElementById("clickDice" + i).disabled = false;
        }
    }
    if (rollsLeft == 0) {
        endGame();
    } else {
        //have computer pick dice to stick
        var compHandValues = new handValues(compHand);
        compHandValues.getHandValues();
        compStuckDice(compHandValues, compHand);
        document.querySelector("p.output").innerHTML = "Select which dice to keep! " + rollsLeft + " rolls left.";
    }
}

function compareHandValues(computerHandRanking, userHandRanking) {
    if (userHandRanking.handScore > computerHandRanking.handScore) //User Wins
	{
		return "Congratulations! You have won with " + userHandRanking.outputHandType() + 
        " since the computer had " + computerHandRanking.outputHandType() + "\n";
	}
	else if (userHandRanking.handScore < computerHandRanking.handScore) //Computer Wins
	{
		return "Unfortunately, you have lost with " + userHandRanking.outputHandType() + 
        " since the computer had " + computerHandRanking.outputHandType() + "\n";
	}
	else //Hands are tied in rank -- highest card must be used
	{
		if (userHandRanking.handScore == 0) //both players have a bust, will be using reverse high card from the checkForBestHand function specifically for busts
		{
			if (userHandRanking.highCard < computerHandRanking.highCard) //User Wins
			{
				return "Congratulations! Your high card beat the computer as you both had a bust / high card.";
			}
			else if (userHandRanking.highCard > computerHandRanking.highCard) //Computer Wins
			{
				return "Unfortunately, the computer beat your high card though you both had a bust / high card.";
			}
			else //User and Computer tie with Busts
			{
				return "The computer and you tied! You both had a bust / high card as well as the same high card.";
			}
		}
		else //High cards are compared
		{
			if (userHandRanking.highCard > computerHandRanking.highCard) //User Wins
			{
				return "Congratulations! Your high card beat the computer as you both had " + userHandRanking.outputHandType();
			}
			else if (userHandRanking.highCard < computerHandRanking.highCard)//Computer Wins
			{
				return "Unfortunately, the computer beat your high card though you both had " + userHandRanking.outputHandType();
			}
			else //High cards are tied, move on to next highest cards
			{
				if (userHandRanking.nextHighCard == computerHandRanking.nextHighCard)//User and Computer Tie
				{
					return "The computer and you tied! You both had " + userHandRanking.outputHandType() +
                    " as well as the same high card.";
				}
				else if (userHandRanking.nextHighCard > computerHandRanking.nextHighCard) //User Wins
				{
					return "Congratulations! Your high card beat the computer as you both had " + userHandRanking.outputHandType();
				}
				else //Computer Wins
				{
					return "Unfortunately, the computer beat your high card though you both had " + userHandRanking.outputHandType();
				}
			}
		}
    }
}

function endGame() {
    document.getElementById("rollButton").style.display = "none";
    for (var i = 0; i < 5; i++) {
        document.getElementById("clickDice" + i).disabled = true;
    }
    var userHandValues = new handValues(userHand);
    userHandValues.getHandValues();
    var compHandValues = new handValues(compHand);
    compHandValues.getHandValues();

    //output hands
    console.log("Endgame hands: ");
    var user = "User Hand: ";
    for (var i = 0; i < 5; i++) {
        user += userHand[i] + ", ";
    }
    console.log(user);
    user = "Computer Hand: ";
    for (var i = 0; i < 5; i++) {
        user += compHand[i] + ", ";
    }
    console.log(user);
    // DEBUGGING

    var result = "Game is over! " + compareHandValues(compHandValues, userHandValues) + "\n";
    console.log("Game is over!\n");
    console.log(compareHandValues(compHandValues, userHandValues) + "\n");
    document.querySelector("p.output").innerHTML = result;
}

//Possible values of a hand
class handValues {
    playerHand;
    handScore;
    highCard;
    secondHighCard;
    
    constructor(playerHand) {
        this.playerHand = new Array(5).fill(0);
        for (var i = 0; i < 5; i++) {
            this.playerHand[i] = playerHand[i];
        }
        this.handScore = 0;
        this.highCard = 0;
        this.secondHighCard = 0;
        console.log("Creating handValues object\n");
    }

    getHandValues() {
        this.handScore = 0;
        var numOfInstances = new Array(6).fill(0);

        for (var i = 0; i < 6; i++) {
            numOfInstances[this.playerHand[i]]++;
        }

        //output numOfInstances
        var output = "NumOfInstances: ";
        for (var i = 0; i < 6; i++) {
            output += i + ": " + numOfInstances[i] + ", ";
        }
        console.log(output);
        // DEBUGGING

        this.secondHighCard = 0;
        for (var i = 5; i >= 0; i--) {
            if ((numOfInstances[i] == 1) && (i > this.secondHighCard))
            {
                this.secondHighCard = i;
            }
        }
        
        //Figures out what ranking of hand the player has
        for (var i = 0; i < 6; i++) {
            if (numOfInstances[i] == 0)
            {
                continue;
            }
            else if (numOfInstances[i] == 5)
            {
                this.handScore = 7; //Five of a kind
                this.highCard = i; //Changes the high card to whatever is used to make the five of a kind
                console.log("Five of a kind\n");
                return;
            }
            else if (numOfInstances[i] == 4)
            {
                this.handScore = 6; //Four of a kind
                this.highCard = i; //Changes the high card to whatever is used to make the four of a kind
                console.log("Four of a kind\n");
                return;
            }
            else if (numOfInstances[i] == 3)
            {
                this.handScore = 3; //Three of a kind
                this.highCard = i; //Sets the high card to whatever is used to make the three of a kind
                for (var j = 0; j < 6; j++) {//Checks for a full house
                    if (numOfInstances[j] == 2)
                    {
                        this.handScore = 5; //Full house
                        this.secondHighCard = j; //Sets the next highest card to the pair of two
                        console.log("Full House\n");
                        return;
                    }
                }
                console.log("Three of a kind\n");
                return;
            }
            else if (numOfInstances[i] == 2)
            {
                this.highCard = i;
                for (var j = 0; j < 6; j++) {
                    if ((j == i) || (numOfInstances[j] == 1)) //Ensures the same pair is not counted again
                    {
                        this.handScore = 1; //One pair	//Continues the loop in case there are two pairs or a full house
                        continue;
                    }
                    else if (numOfInstances[j] == 2)
                    {
                        this.handScore = 2; //Two pair
                        this.secondHighCard = i; //Because it counts up the array, this ensures that the highest pair is set as the high card, and the other pair is set as the next highest card
                        this.highCard = j;
                        console.log("Two pair\n");
                        return;
                    }
                    else if (numOfInstances[j] == 3)
                    {
                        this.handScore = 5; //Full House
                        this.highCard = j; //Sets the set of three as the high card
                        this.secondHighCard = i; //Sets the pair to the next highest card
                        console.log("Full House\n");
                        return;
                    }
                }
                console.log("One pair\n");
                return;
            }
        }
        //If no pairs are found, check for straight, and otherwise bust (high card)
        if ((numOfInstances[0] == 0) || (numOfInstances[5] == 0)) //either an Ace or 9 is missing
        {
            this.handScore = 4; //Straight	//Cannot form a straight if there is both an Ace and a 9, so if one is equal to zero (and all the other cards have 1 instance) then it is a straight
            this.highCard = 5; //Sets high card by default to an ace, as all busts have it as a high card and so does one of the straights
            console.log("Straight\n");
            if (numOfInstances[5] == 0) //If there is no ace, the high card is a king
            {
                this.highCard--;
            }
        }
        else //Since a bust hand is only missing one card and will definitely have an ace as its highest card, I set this.highCard to the missing value, and whichever player has a higher value will lose
        {
            console.log("Bust\n");
            for (var i = 1; i < 5; i++) //Only check 10-King as both Ace and 9 have to be there
            {
                if (numOfInstances[i] == 0)
                {
                    this.highCard = i;
                }
            }
        }
        return;
    }

    outputHandType() { //Translates handScore number into a string and outputs it
        switch (this.handScore)
        {
        case 0:
            return "a bust / high card";
        case 1:
            return "one pair";
        case 2:
            return "two pairs";
        case 3:
            return "three of a kind";
        case 4:
            return "a straight";
        case 5:
            return "a full house";
        case 6:
            return "four of a kind";
        case 7:
            return "five of a kind";
        }
    }
}