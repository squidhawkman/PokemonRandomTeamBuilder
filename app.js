//jokeTwo

//fetching the joke
const getDadJoke = async () => {
    try {
        const config = {
            headers: {
                Accept: 'application/json'
            }
        };
        const response = await axios.get('https://icanhazdadjoke.com/', config);
        return response.data.joke;
    } catch (e) {
        return e;
    }
}

//creating the joke and placing it in the paragraph element
const newJoke = async () => {
    try {
        const jokeText = await getDadJoke();
        const jokeElement = document.querySelector('#theJoke');
        jokeElement.innerText = jokeText;
    } catch (e) {
        return e;
    }
}

//giving a click event to jokeTwo
const jokeTwo = document.querySelector('#jokeTwo');
jokeTwo.addEventListener('click', () => {
    newJoke();
});


//making the first joke
newJoke();





//some variables
const generatedPokemonContainer = document.querySelector('#generatedPokemonContainer');
const baseURL = 'ClassicSprites/'
const baseURLshiny = 'Shinies/'
let possiblePokemon = [];





//choosing the generations



const gen1checkbox = document.querySelector('#Gen1checkbox');
// genIcheckbox.addEventListener('click', function () {
//     genChecker['GenI']['checkedStatus'] = this.checked;
//     resetButSaveTeams();
// })
const gen2checkbox = document.querySelector('#Gen2checkbox');
// genIIcheckbox.addEventListener('click', function () {
//     genChecker['GenII']['checkedStatus'] = this.checked;
//     resetButSaveTeams();
// })
const gen3checkbox = document.querySelector('#Gen3checkbox');
// genIIIcheckbox.addEventListener('click', function () {
//     genChecker['GenIII']['checkedStatus'] = this.checked;
//     resetButSaveTeams();
// })
const gen4checkbox = document.querySelector('#Gen4checkbox');
// genIVcheckbox.addEventListener('click', function () {
//     genChecker['GenIV']['checkedStatus'] = this.checked;
//     resetButSaveTeams();
// })
const gen5checkbox = document.querySelector('#Gen5checkbox');
// genVcheckbox.addEventListener('click', function () {
//     genChecker['GenV']['checkedStatus'] = this.checked;
//     resetButSaveTeams();
// })



const genChecker = {
    Gen1: {
        checkedStatus: gen1checkbox.checked,
        firstPoke: 1,
        lastPoke: 151
    },
    Gen2: {
        checkedStatus: gen2checkbox.checked,
        firstPoke: 152,
        lastPoke: 251
    },
    Gen3: {
        checkedStatus: gen3checkbox.checked,
        firstPoke: 252,
        lastPoke: 386
    },
    Gen4: {
        checkedStatus: gen4checkbox.checked,
        firstPoke: 387,
        lastPoke: 493
    },
    Gen5: {
        checkedStatus: gen5checkbox.checked,
        firstPoke: 494,
        lastPoke: 649
    }
};

const allGenCheckboxes = document.querySelectorAll('.GenCheckbox');


//trying to apply click events for checkboxes with a loop
const applyClickEventOnGenCheckboxes = () => {
for (let i = 1; i <= 5; i++) {
    let checkbox = document.querySelector(`#Gen${i}checkbox`);
    checkbox.addEventListener('click', function () {
        genChecker[`Gen${i}`]['checkedStatus'] = checkbox.checked;
        resetButSaveTeams();
    })
}
}
//I DID IT!!!
applyClickEventOnGenCheckboxes();


//where user customize choices are stored
const customizer = {
    FilterTypes: [],
    Shiny: false
}

//generating the array of possible Pokemon (to be shown as options)
const generateArrayOfPossiblePokemon = () => {
    possiblePokemon = [];
    for (gen of Object.values(genChecker)) {
        if (gen['checkedStatus']) {
            for (let i = gen['firstPoke']; i <= gen['lastPoke']; i++) {
                possiblePokemon.push(i);
            }
        } 
    }
    // if (customizer.FilterTypes.length > 0) {
        //this is where you will create the new array with matching types
}


//generating initial array of possible pokemon by gen and type
generateArrayOfPossiblePokemon();


//default is all checked gens
function generateRandPokeNum() {
    let num = Math.floor(Math.random() * possiblePokemon.length);
    return possiblePokemon[num];
    }


//keeping track of what pokemon have been generated (so there are not repeats)
let generatedPokemon = [];


//disabling save team button until team is full
const saveTeamButton = document.querySelector('#saveTeam');
saveTeamButton.disabled = true;


//scrapping the team and making a new one
const newTeamButton = document.querySelector('#clearTeam');
newTeamButton.addEventListener('click', function () {
    resetButSaveTeams();
});
newTeamButton.disabled = true;


//having header hidden while empty
const newTeamHeader = document.querySelector('#newTeamHeader');
const savedTeamsHeader = document.querySelector('#savedTeamsHeader');
savedTeamsHeader.style.visibility = 'hidden';


//the slider 
const chooseFromSlider = document.querySelector('#slider');
const sliderDisplayNum = document.querySelector('#sliderDisplayNum');
let sliderValue = chooseFromSlider.value;
sliderDisplayNum.innerText = chooseFromSlider.value;
chooseFromSlider.addEventListener('input', function () {
    sliderDisplayNum.innerText = this.value;
    sliderValue = this.value;
})
chooseFromSlider.addEventListener('change', function () {
    resetButSaveTeams();
})




//Activating shinies button
const shinyButton = document.querySelector('#shinyButton');
shinyButton.addEventListener('click', function () {
    if (this.innerText === 'Shinies?') {
        this.innerText = 'Shinies!';
    } else {
        this.innerText = 'Shinies?';
    }
    if (customizer.Shiny) {
        customizer.Shiny = false;
    } else {
        customizer.Shiny = true;
    }
    resetButSaveTeams();
})

//making a ul for the first team
let newTeamList = document.createElement('ul');
const newTeamContainer = document.querySelector('#newTeamContainer');
newTeamContainer.append(newTeamList);

//random Pokemon generator
function generatePokemon() {
    //generating the Pokemon
    for (let i = 1; i <= sliderValue; i++) {
        let randPokeImg = document.createElement('img');
        //giving each sprite a click event that puts them on the new team list and clears the container of generated pokemon
        randPokeImg.addEventListener('click', function () {
            const chosenPoke = document.createElement('li');
            chosenPoke.append(randPokeImg);
            newTeamList.append(chosenPoke);
            generatedPokemonContainer.innerHTML = '';
            newTeamHeader.innerText = 'New Team';
            newTeamButton.disabled = false;
            if (newTeamList.childElementCount === 6) {
                saveTeamButton.disabled = false;
                newTeamHeader.innerText = 'Sexy!!!';
                //attempting to remove click event - success!!
                for (const listItem of newTeamList.querySelectorAll('li')) {
                    listItem.querySelector('img').replaceWith(listItem.querySelector('img').cloneNode());
                }
            }
            if (newTeamList.childElementCount < 6) {
                generatePokemon();
            };
        })
        let randPokeNum = generateRandPokeNum();
        if (randPokeNum === undefined) {
            return console.log('Select a generation.');
        } 


        //Normal or shiny?
        if (!customizer.Shiny) {
            randPokeImg.src = `${baseURL}${randPokeNum}.png`;
            while (generatedPokemon.indexOf(randPokeNum) !== -1) {
                randPokeNum = generateRandPokeNum();
                randPokeImg.src = `${baseURL}${randPokeNum}.png`;
            }
        } else {
            randPokeImg.src = `${baseURLshiny}${randPokeNum}.png`;
            while (generatedPokemon.indexOf(randPokeNum) !== -1) {
                randPokeNum = generateRandPokeNum();
                randPokeImg.src = `${baseURLshiny}${randPokeNum}.png`;
            }
        }
        //adding the pokemon to the container to be chosen from
        generatedPokemon.push(randPokeNum);
        generatedPokemonContainer.append(randPokeImg);
    }
}



//reset functions
function resetButSaveTeams() {
    generatedPokemonContainer.innerHTML = '';
    newTeamList.innerHTML = '';
    generatedPokemon = [];
    newTeamHeader.innerText = 'Build a team?';
    saveTeamButton.disabled = true;
    newTeamButton.disabled = true;   
    generateArrayOfPossiblePokemon();
    generatePokemon();
}


//put this on a clear all teams button
function clearSavedTeams() {
    resetButSaveTeams();
    savedTeamsContainer.innerHTML = '';
        generateArrayOfPossiblePokemon();        
        generatePokemon();
}

//saving the team
//could include option to name team
const savedTeamsContainer = document.querySelector('#savedTeamsContainer');
saveTeamButton.addEventListener('click', function () {
    const newSavedTeam = document.createElement('ul');
    for (const listItem of newTeamList.querySelectorAll('li')) {


        newSavedTeam.append(listItem.querySelector('img'));
    }
    savedTeamsContainer.append(newSavedTeam);
    savedTeamsHeader.style.visibility = 'visible';
    resetButSaveTeams();
});



//generate first set
generatePokemon();















