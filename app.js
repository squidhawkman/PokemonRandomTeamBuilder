//jokeTwo

//fetching the joke (refactored to also make this set the joke, originally this was two separate functions)
const getDadJoke = async () => {
    try {
        const config = {
            headers: {
                Accept: 'application/json'
            }
        };
        const response = await axios.get('https://icanhazdadjoke.com/', config);
        //setting the p element text with the joke
        document.querySelector('#theJoke').innerText = response.data.joke;
    } catch (e) {
        return e;
    }
}

//giving a click event to jokeTwo
const jokeTwo = document.querySelector('#jokeTwo');
jokeTwo.addEventListener('click', () => {
    getDadJoke();
});

//making the first joke
getDadJoke();





//some variables


const baseURL = 'ClassicSprites/';
const baseURLshiny = 'Shinies/';

//keeping track of what pokemon have been generated (so there are not repeats)
let generatedPokemon = [];

//for gen filtering
let possiblePokemon = [];

//for gen filtering + type filtering
let typePossiblePokemon = [];

//buttons
const saveTeamButton = document.querySelector('#saveTeam');
const newTeamButton = document.querySelector('#clearTeam');
const clearTeamsBtn = document.querySelector('#clearTeamsButton');
const shinyButton = document.querySelector('#shinyButton');
const allTypesOnButton = document.querySelector('#allTypesOn');
const allTypesOffButton = document.querySelector('#allTypesOff');
const typeButtons = document.querySelectorAll('.typeButton');

//containers
const generatedPokemonContainer = document.querySelector('#generatedPokemonContainer');
const newTeamContainer = document.querySelector('#newTeamContainer');
const savedTeamsContainer = document.querySelector('#savedTeamsContainer');

//headers
const newTeamHeader = document.querySelector('#newTeamHeader');
const savedTeamsHeader = document.querySelector('#savedTeamsHeader');

//slider
const chooseFromSlider = document.querySelector('#slider');
const sliderDisplayNum = document.querySelector('#sliderDisplayNum');




//the generations
const genChecker = {
    Gen1: {
        checkedStatus: document.querySelector('#Gen1checkbox').checked,
        firstPoke: 1,
        lastPoke: 151
    },
    Gen2: {
        checkedStatus: document.querySelector('#Gen2checkbox').checked,
        firstPoke: 152,
        lastPoke: 251
    },
    Gen3: {
        checkedStatus: document.querySelector('#Gen3checkbox').checked,
        firstPoke: 252,
        lastPoke: 386
    },
    Gen4: {
        checkedStatus: document.querySelector('#Gen4checkbox').checked,
        firstPoke: 387,
        lastPoke: 493
    },
    Gen5: {
        checkedStatus: document.querySelector('#Gen5checkbox').checked,
        firstPoke: 494,
        lastPoke: 649
    }
}


//applying click events for gen checkboxes
for (let i = 1; i <= 5; i++) {
    let checkbox = document.querySelector(`#Gen${i}checkbox`);
    checkbox.addEventListener('click', function () {
        genChecker[`Gen${i}`]['checkedStatus'] = checkbox.checked;
        resetButSaveTeams();
    })
}


//where user customize choices are stored
const customizer = {

    //just so that we don't run the type check when all types are being chosen from (the numbers mean nothing except that there are 18 types so I counted up to 18 to make that easy to see)
    defaultArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    types: {
        1: {
            type: 'normal',
            isSelected: document.querySelector('#normal').value
        },
        2: {
            type: 'fighting',
            isSelected: document.querySelector('#fighting').value
        },
        3: {
            type: 'flying',
            isSelected: document.querySelector('#flying').value
        },
        4: {
            type: 'poison',
            isSelected: document.querySelector('#poison').value
        },
        5: {
            type: 'ground',
            isSelected: document.querySelector('#ground').value
        },
        6: {
            type: 'rock',
            isSelected: document.querySelector('#rock').value
        },
        7: {
            type: 'bug',
            isSelected: document.querySelector('#bug').value
        },
        8: {
            type: 'ghost',
            isSelected: document.querySelector('#ghost').value
        },
        9: {
            type: 'steel',
            isSelected: document.querySelector('#steel').value
        },
        10: {
            type: 'fire',
            isSelected: document.querySelector('#fire').value
        },
        11: {
            type: 'water',
            isSelected: document.querySelector('#water').value
        },
        12: {
            type: 'grass',
            isSelected: document.querySelector('#grass').value
        },
        13: {
            type: 'electric',
            isSelected: document.querySelector('#electric').value
        },
        14: {
            type: 'psychic',
            isSelected: document.querySelector('#psychic').value
        },
        15: {
            type: 'ice',
            isSelected: document.querySelector('#ice').value
        },
        16: {
            type: 'dragon',
            isSelected: document.querySelector('#dragon').value
        },
        17: {
            type: 'dark',
            isSelected: document.querySelector('#dark').value
        },
        18: {
            type: 'fairy',
            isSelected: document.querySelector('#fairy').value
        }
    },
    Shiny: false
}




//events and other functionality

allTypesOnButton.addEventListener('click', () => {
    for (let button of typeButtons) {
        button.value = 'true';
        button.style.backgroundColor = 'yellow';
        customizer.types[button.name].isSelected = button.value;
    }
    customizer.defaultArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    resetButSaveTeams();
})

allTypesOffButton.addEventListener('click', () => {
    for (let button of typeButtons) {
        button.value = 'false';
        button.style.backgroundColor = 'white';
        customizer.types[button.name].isSelected = button.value;
    }
    customizer.defaultArray = [];
    resetButSaveTeams();
})

//will flip the value on our type buttons
const buttonToggle = (button) => {
    button.value === 'false' ? button.value = 'true' : button.value = 'false';
    button.style.backgroundColor === 'yellow' ? button.style.backgroundColor = 'white' : button.style.backgroundColor = 'yellow';
    customizer.types[button.name].isSelected = button.value;
}

//click event for toggling buttons and altering the default array
for (let button of typeButtons) {
    button.addEventListener('click', function () {
        buttonToggle(button);
        button.value === 'true' ? customizer.defaultArray.push(1) : customizer.defaultArray.pop();
        littleReset();
    })
}

//disabling save team button until team is full
saveTeamButton.disabled = true;

//scrapping the team and making a new one, disabled until you have something to scrap
newTeamButton.addEventListener('click', () => {
    resetButSaveTeams();
});
newTeamButton.disabled = true;

//clear teams button
clearTeamsBtn.style.visibility = 'hidden';
clearTeamsBtn.addEventListener('click', () => {
    savedTeamsContainer.innerHTML = '';
    clearTeamsBtn.style.visibility = 'hidden';
    savedTeamsHeader.innerText = '';
})

//saving the team
saveTeamButton.addEventListener('click', function () {
    getDadJoke();
    const newSavedTeam = document.createElement('ul');
    newSavedTeam.classList.add('savedTeamsStyle');
    for (const listItem of newTeamList.querySelectorAll('li')) {
        newSavedTeam.append(listItem.querySelector('img'));
    }
    savedTeamsContainer.append(newSavedTeam);
    savedTeamsHeader.style.visibility = 'visible';
    clearTeamsBtn.style.visibility = 'visible';
    resetButSaveTeams();
});

//Activating shinies button
shinyButton.addEventListener('click', function () {
    this.innerText === 'Shinies?' ? this.innerText = 'Shinies!' : this.innerText = 'Shinies?';
    !!customizer.Shiny ? customizer.Shiny = false : customizer.Shiny = true;
})

//having header hidden while empty
savedTeamsHeader.style.visibility = 'hidden';


//the slider 
let sliderValue = chooseFromSlider.value;
sliderDisplayNum.innerText = chooseFromSlider.value;
chooseFromSlider.addEventListener('input', function () {
    sliderDisplayNum.innerText = this.value;
    sliderValue = this.value;
})
chooseFromSlider.addEventListener('change', function () {
    littleReset();
})



//generation

//generating the array of possible Pokemon (to be shown as options)
const generateArrayOfPossiblePokemon = async () => {
    possiblePokemon = [];
    for (gen of Object.values(genChecker)) {
        if (gen['checkedStatus']) {
            for (let i = gen['firstPoke']; i <= gen['lastPoke']; i++) {
                possiblePokemon.push(i);
            }
        }
    }

    //if anything but all types are selected, do a type 'filter' by building a new array of possible pokemon
    if (customizer.defaultArray.length !== 18) {
        typePossiblePokemon = [];
        const baseTypeURL = 'https://pokeapi.co/api/v2/type/';

        for (let i = 1; i <= 18; i++) {
            if (customizer.types[i].isSelected === 'true') {
                const typeData = await axios.get(`${baseTypeURL}${i}`);
                for (let j = 0; j < typeData.data.pokemon.length; j++) {
                    const pokeURL = typeData.data.pokemon[j].pokemon.url;

                    // "https://pokeapi.co/api/v2/pokemon/6/"
                    const pokeURLnumber = Number(pokeURL.match(/[^v\/]\d+/g));

                    if (possiblePokemon.indexOf(pokeURLnumber) !== -1 && typePossiblePokemon.indexOf(pokeURLnumber[0] === -1)) {
                        typePossiblePokemon.push(pokeURLnumber);
                    }
                }
            }
        }
        return typePossiblePokemon;
    }
    return possiblePokemon;
}

//saving the array of possible Pokemon as a variable, just have to await the variable within an async function. How is this different from possiblePokemon? It's not. But if I do it here, I will only run it once. I got it.
let currentPossiblePokemonArr = generateArrayOfPossiblePokemon();

//generating a random number for a pokemon
async function generateRandPokeNum() {
    const arr = await currentPossiblePokemonArr;
    let num = Math.floor(Math.random() * arr.length);
    return arr[num];
}

//making a ul for the first team
let newTeamList = document.createElement('ul');
newTeamList.classList.add('newTeamStyle');
newTeamContainer.append(newTeamList);

//random Pokemon (sprite in a list item) generator
async function generatePokemon() {
    //generating the Pokemon
    for (let i = 1; i <= sliderValue; i++) {
        let randPokeImg = document.createElement('img');

        //giving sprites a click event that puts them on the new team list and clears the container of generated pokemon
        randPokeImg.addEventListener('click', function () {
            const chosenPoke = document.createElement('li');
            chosenPoke.append(randPokeImg);
            newTeamList.append(chosenPoke);
            generatedPokemonContainer.innerHTML = '';
            newTeamHeader.innerText = '"Another one."';
            newTeamButton.disabled = false;
            if (newTeamList.childElementCount === 6) {
                saveTeamButton.disabled = false;
                newTeamHeader.innerText = 'Sexy!';
            }
            if (newTeamList.childElementCount < 6) {
                generatePokemon();
            };

            //remove click events from selected pokemon
            for (const listItem of newTeamList.querySelectorAll('li')) {
                listItem.querySelector('img').replaceWith(listItem.querySelector('img').cloneNode());
            }
        })

        //getting first pokemon
        let randPokeNum = await generateRandPokeNum();

        //if no gens are selected, we cannot get a number. (this saves us from an infinite loop)
        if (randPokeNum === undefined) {
            return console.log('Select a generation.');
        }

        //making a new pokemon if it has been generated before (avoiding duplicates)
        while (generatedPokemon.indexOf(randPokeNum) !== -1) {
            randPokeNum = await generateRandPokeNum();

            //this will reset the array of generatedPokemon if all possible Pokemon have been generated. This means we will generate duplicates. This happens if there are not enough Pokemon to generate without having duplicates.
            if (generatedPokemon.length > 1 && generatedPokemon.length === possiblePokemon.length || generatedPokemon.length === typePossiblePokemon.length ) {
                generatedPokemon = [];
            }
        }

        //Setting the image, normal or shiny?
        let spriteURL = baseURL;
        if (customizer.Shiny) {
            spriteURL = baseURLshiny;
        }
        randPokeImg.src = `${spriteURL}${randPokeNum}.png`;

        //adding the pokemon to the container to be chosen from
        generatedPokemon.push(randPokeNum);
        generatedPokemonContainer.append(randPokeImg);
    }
}



//resets

//this does not reset the team you're currently building
function littleReset() {
    generatedPokemonContainer.innerHTML = '';
    generatedPokemon = [];
    currentPossiblePokemonArr = generateArrayOfPossiblePokemon();
    generatePokemon();
}

//this will reset the team you're building but not the teams you've saved
function resetButSaveTeams() {
    generatedPokemonContainer.innerHTML = '';
    newTeamList.innerHTML = '';
    generatedPokemon = [];
    newTeamHeader.innerText = 'Build a sick team?';
    saveTeamButton.disabled = true;
    newTeamButton.disabled = true;
    currentPossiblePokemonArr = generateArrayOfPossiblePokemon();
    generatePokemon();
}





//generating the first set!
generatePokemon();















