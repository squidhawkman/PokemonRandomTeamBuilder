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
    FilterTypes: ['water', 'grass', 'fire'],
    Shiny: false
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
    const newPossiblePokemon = [];
    if (customizer.FilterTypes.length > 0) { 
        for (let i = 0; i <= 8; i++) {
            const pokemon = possiblePokemon[i];
            const pokemonTypes = await getPokemonTypes(pokemon);
            const selectedTypes = customizer.FilterTypes;

            if (selectedTypes.indexOf(pokemonTypes[0]) !== -1 || selectedTypes.indexOf(pokemonTypes[1]) !== -1) {
                newPossiblePokemon.push(pokemon);
            }
        }
    }
    console.log(newPossiblePokemon.length)
    if (newPossiblePokemon.length > 0) {
        possiblePokemon = newPossiblePokemon;
        return newPossiblePokemon;
    }
    return possiblePokemon;
}

//saving that array of possible Pokemon as a variable?
let possiblePokemonArr = generateArrayOfPossiblePokemon();

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
        let randPokeNum = await generateRandPokeNum();

        //if no gens are selected (this saves us from an infinite loop)
        if (randPokeNum === undefined) {
            return console.log('Select a generation.');
        }


        //Normal or shiny?
        let spriteURL = baseURL;
        if (customizer.Shiny) {
            spriteURL = baseURLshiny;
        }
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
    await generatePokemon();
}


//put this on a clear all teams button
async function clearSavedTeams() {
   await resetButSaveTeams();
    savedTeamsContainer.innerHTML = '';
   await generatePokemon();
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















