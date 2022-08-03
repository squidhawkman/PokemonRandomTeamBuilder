//some variables
const generatedPokemonContainer = document.querySelector('#generatedPokemonContainer');
const baseURL = 'ClassicSprites/'
const baseURLshiny = 'Shinies/'


//Gen I 1-151
//Gen II 152-251
//Gen III 252-386
//Gen IV 387-493
// const genPokeNums = {
//     GenI: [1, 151],
//     GenII: [152, 251],
//     GenIII: [252, 386],
//     GenIV: [387, 493]
// }


//choosing the generations
const genIcheckbox = document.querySelector('#GenIcheckbox');
genIcheckbox.addEventListener('click', function () {
    genChecker['GenI']['checkedStatus'] = this.checked;
    resetButSaveTeams();
})
const genIIcheckbox = document.querySelector('#GenIIcheckbox');
genIIcheckbox.addEventListener('click', function () {
    genChecker['GenII']['checkedStatus'] = this.checked;
    resetButSaveTeams();
})
const genIIIcheckbox = document.querySelector('#GenIIIcheckbox');
genIIIcheckbox.addEventListener('click', function () {
    genChecker['GenIII']['checkedStatus'] = this.checked;
    resetButSaveTeams();
})
const genIVcheckbox = document.querySelector('#GenIVcheckbox');
genIVcheckbox.addEventListener('click', function () {
    genChecker['GenIV']['checkedStatus'] = this.checked;
    resetButSaveTeams();
})


const genChecker = {
    GenI: {
        checkedStatus: genIcheckbox.checked,
        firstPoke: 1,
        lastPoke: 151
    },
    GenII: {
        checkedStatus: genIIcheckbox.checked,
        firstPoke: 152,
        lastPoke: 251
    },
    GenIII: {
        checkedStatus: genIIIcheckbox.checked,
        firstPoke: 252,
        lastPoke: 386
    },
    GenIV: {
        checkedStatus: genIVcheckbox.checked,
        firstPoke: 387,
        lastPoke: 493
    }
};


//default is gens I-IV
function generateRandPokeNum() {
    let num = Math.floor(Math.random() * genChecker['GenIV']['lastPoke'] + genChecker['GenI']['firstPoke']);

    //checking to make sure the pokemon is within a selected generation (if not, generate new random number)
    for (gen of Object.values(genChecker)) {
        console.log(gen['checkedStatus']);
        console.log(num);
        if (!gen['checkedStatus']) {
            if (num >= gen['firstPoke'] && num <= gen['lastPoke']) {
                return generateRandPokeNum();
            }
        }
    }
    return num;
}


//keeping track of what pokemon have been generated (so there are not repeats)
let generatedPokemon = [];


//disabling save team button until team is full
const saveTeamButton = document.querySelector('#saveTeam');
saveTeamButton.disabled = true;


//having header hidden while empty
const newTeamHeader = document.querySelector('#newTeamHeader');
const savedTeamsHeader = document.querySelector('#savedTeamsHeader');
savedTeamsHeader.style.visibility = 'hidden';

//the slider 
const chooseFromSlider = document.querySelector('#slider');
const sliderDisplayNum = document.querySelector('#sliderDisplayNum');
let pokemansNumber = chooseFromSlider.value;
sliderDisplayNum.innerText = chooseFromSlider.value;
chooseFromSlider.addEventListener('input', function () {
    sliderDisplayNum.innerText = this.value;
    pokemansNumber = this.value;
})
chooseFromSlider.addEventListener('change', function () {
    resetButSaveTeams();
})


//object that allows user to customize team picker
//this should be something that does not change when the page refreshes/changes. Is this done with React components? Is this done with state?

const customizer = {
    Gens: ['GenI', 'GenII', 'GenIII', 'GenIV'],
    Types: ['water', 'fire', 'normal', 'grass', 'flying', 'fighting', 'poison', 'electric', 'ground', 'rock', 'psychic', 'ice', 'bug', 'ghost', 'steel', 'dragon', 'dark', 'fairy'],
    Shiny: false
}




//the Pokemon (I will get their data by fetching it from PokeAPI, James Q Quick has a guide on this that you favorited)


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
})

//making a ul for the first team
let newTeamList = document.createElement('ul');
const newTeamContainer = document.querySelector('#newTeamContainer');
newTeamContainer.append(newTeamList);

//random Pokemon generator
function generatePokemon() {
    //generating the Pokemon
    for (let i = 1; i <= pokemansNumber; i++) {
        let randPokeImg = document.createElement('img');
        //giving each sprite a click event that puts them on the new team list and clears the container of generated pokemon
        randPokeImg.addEventListener('click', function () {
            const chosenPoke = document.createElement('li');
            chosenPoke.append(randPokeImg);
            newTeamList.append(chosenPoke);
            generatedPokemonContainer.innerHTML = '';
            if (newTeamList.childElementCount === 6) {
                saveTeamButton.disabled = false;

                //attempting to remove click event - success!!
                for (const listItem of newTeamList.querySelectorAll('li')) {
                    listItem.querySelector('img').replaceWith(listItem.querySelector('img').cloneNode());
                }  
            }
            if (newTeamList.childElementCount < 6) {
                generatePokemon();
            };
            newTeamHeader.innerText = 'New Team';
        })
        let randPokeNum = generateRandPokeNum();


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
    generatePokemon();
}


//put this on a clear all teams button
function clearSavedTeams() {
    resetButSaveTeams();
    savedTeamsContainer.innerHTML = '';
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

//scrapping the team and making a new one
const newTeamButton = document.querySelector('#clearTeam');
newTeamButton.addEventListener('click', function () {
    resetButSaveTeams();
});



//generate first set
generatePokemon();








