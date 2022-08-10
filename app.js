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
const baseURL = 'ClassicSprites/';
const baseURLshiny = 'Shinies/';


//handling the checkboxes (can I do this part with a loop?)
const gen1checkbox = document.querySelector('#Gen1checkbox');
const gen2checkbox = document.querySelector('#Gen2checkbox');
const gen3checkbox = document.querySelector('#Gen3checkbox');
const gen4checkbox = document.querySelector('#Gen4checkbox');
const gen5checkbox = document.querySelector('#Gen5checkbox');

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
}


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
    //just so that we don't run the type check when all types are being chosen from
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


//the type buttons
const allTypesOnButton = document.querySelector('#allTypesOn');
const allTypesOffButton = document.querySelector('#allTypesOff');
const typeButtons = document.querySelectorAll('.typeButton');

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

//toggling and maintaining the array that says whether to run the type check or not
for (let button of typeButtons) {
    button.addEventListener('click', function () {
        buttonToggle(button);
        button.value === 'true' ? customizer.defaultArray.push(1) : customizer.defaultArray.pop();
        resetButSaveTeams();
        console.log(customizer.defaultArray.length)
    })
}


//returns array of types of a pokemon 
const getPokemonTypes = async (pokeNum) => {
    try {
        const pokeData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeNum}`);
        const types = [];
        types.push(pokeData.data.types[0].type.name);
        if (pokeData.data.types[1]) {
            types.push(pokeData.data.types[1].type.name);
        };
        return types;
    } catch (e) {
        return e;
    }
}


//generating the array of possible Pokemon (to be shown as options)
const generateArrayOfPossiblePokemon = async () => {
    let possiblePokemon = [];
    for (gen of Object.values(genChecker)) {
        if (gen['checkedStatus']) {
            for (let i = gen['firstPoke']; i <= gen['lastPoke']; i++) {
                possiblePokemon.push(i);
            }
        }
    }
    
    //if anything but all types are selected, do a type 'filter' by building a new array of possible pokemon
    if (customizer.defaultArray.length !== 18) {
        const newPossiblePokemon = [];
        const baseTypeURL = 'https://pokeapi.co/api/v2/type/';

        for (let i = 1; i <= 18; i++) {
            if (customizer.types[i].isSelected === 'true') {
                const apiData = await axios.get(`${baseTypeURL}${i}`);
                console.log(apiData);
                for (let j = 0; j < apiData.data.pokemon.length; j++) {
                    const pokeURL = apiData.data.pokemon[j].pokemon.url;

                    const pokeURLnumber = Number(pokeURL.match(/[^v\/]\d+/g));

                    if (possiblePokemon.indexOf(pokeURLnumber) !== -1 && newPossiblePokemon.indexOf(pokeURLnumber[0] === -1)) {
                        newPossiblePokemon.push(pokeURLnumber);
                    }
                }
            }
        }
        console.log(newPossiblePokemon);
        return newPossiblePokemon;
    }

    return possiblePokemon;
}

//saving the array of possible Pokemon as a variable, just have to await the variable within an async function
let possiblePokemonArr = generateArrayOfPossiblePokemon();


//generating a random number for a pokemon
async function generateRandPokeNum() {
    const arr = await possiblePokemonArr;
    let num = Math.floor(Math.random() * arr.length);
    return arr[num];
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


//clear teams button
const clearTeamsBtn = document.querySelector('#clearTeamsButton');
clearTeamsBtn.style.visibility = 'hidden';
clearTeamsBtn.addEventListener('click', () => {
    savedTeamsContainer.innerHTML = '';
    clearTeamsBtn.style.visibility = 'hidden';
})


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
    this.innerText === 'Shinies?' ? this.innerText = 'Shinies!' : this.innerText = 'Shinies?';
    !!customizer.Shiny ? customizer.Shiny = false : customizer.Shiny = true;
})

//making a ul for the first team
let newTeamList = document.createElement('ul');
const newTeamContainer = document.querySelector('#newTeamContainer');
newTeamContainer.append(newTeamList);

//random Pokemon generator
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
            newTeamHeader.innerText = 'New Team';
            newTeamButton.disabled = false;
            if (newTeamList.childElementCount === 6) {
                saveTeamButton.disabled = false;
                newTeamHeader.innerText = 'Sexy!!!';
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

        //Normal or shiny?
        let spriteURL = baseURL;
        if (customizer.Shiny) {
            spriteURL = baseURLshiny;
        }

        //making a new pokemon if it has been generated before (avoiding duplicates)
        randPokeImg.src = `${spriteURL}${randPokeNum}.png`;
        while (generatedPokemon.indexOf(randPokeNum) !== -1) {
            randPokeNum = await generateRandPokeNum();
            randPokeImg.src = `${spriteURL}${randPokeNum}.png`;
        }

        //adding the pokemon to the container to be chosen from
        generatedPokemon.push(randPokeNum);
        generatedPokemonContainer.append(randPokeImg);
    }
}


//reset functions
async function resetButSaveTeams() {
    generatedPokemonContainer.innerHTML = '';
    newTeamList.innerHTML = '';
    generatedPokemon = [];
    newTeamHeader.innerText = 'Build a team?';
    saveTeamButton.disabled = true;
    newTeamButton.disabled = true;
    possiblePokemonArr = await generateArrayOfPossiblePokemon();
    await generatePokemon();
}


//saving the team - include option to name team?
const savedTeamsContainer = document.querySelector('#savedTeamsContainer');

saveTeamButton.addEventListener('click', function () {
    const newSavedTeam = document.createElement('ul');
    for (const listItem of newTeamList.querySelectorAll('li')) {
        newSavedTeam.append(listItem.querySelector('img'));
    }
    savedTeamsContainer.append(newSavedTeam);
    savedTeamsHeader.style.visibility = 'visible';
    clearTeamsBtn.style.visibility = 'visible';
    resetButSaveTeams();
});


//generating the first set!
generatePokemon();















