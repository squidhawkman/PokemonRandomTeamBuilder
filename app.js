const generatedPokemonContainer = document.querySelector('#generatedPokemonContainer');
const baseURL = 'Sprites/'
const baseURLshiny = 'Shinies/'

//listing the pokemon in order
// for (let i = 1; i <= 200; i++) {
//     const newImg = document.createElement('img');
//     newImg.src = `${baseURL}${i}.png`;
//     generatedPokemonContainer.append(newImg);
// }


//default is gens I-IV
function generateRandPokeNum(fromPokeNum = 1, toPokeNum = 493, type) {
    return Math.floor(Math.random() * toPokeNum + fromPokeNum);
}


//Gen I 1-151
//Gen II 152-251
//Gen III 252-386
//Gen IV 387-493

//keeping track of what pokemon have been generated (so there are not repeats)
let generatedPokemon = [];

//disabling save team button until team is full
const saveTeamButton = document.querySelector('#saveTeam');
saveTeamButton.disabled = true;

//having headers hidden while empty
const newTeamHeader = document.querySelector('#newTeamHeader');
const savedTeamsHeader = document.querySelector('#savedTeamsHeader');
savedTeamsHeader.style.visibility = 'hidden';


//object that allows user to customize team picker
//this should be something that does not change when the page refreshes/changes. Is this done with React components? Is this done with state?

const customizer = {
    Gens: ['GenI', 'GenII', 'GenIII', 'GenIV'],
    //Types: ['water', 'fire'], (list all types as default)
    Shiny: false
}

//buttons for the customizer
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
    for (let i = 1; i <= 4; i++) {
        let randPokeImg = document.createElement('img');
        //giving each sprite a click event that puts them on the new team list and clears the container of generated pokemon
        randPokeImg.addEventListener('click', function () {
            const chosenPoke = document.createElement('li');
            chosenPoke.append(randPokeImg);
            newTeamList.append(chosenPoke);
            generatedPokemonContainer.innerHTML = '';
            console.log(newTeamList.childElementCount);
            if (newTeamList.childElementCount === 6) {
                saveTeamButton.disabled = false;
            }
            if (newTeamList.childElementCount < 6) {
                generatePokemon();
            };
            newTeamHeader.innerText = 'New Team';
        })
        let randPokeNum = generateRandPokeNum(1, 151);
        //Normal or shiny?
        if (!customizer.Shiny) {
            randPokeImg.src = `${baseURL}${randPokeNum}.png`;
            while (generatedPokemon.indexOf(randPokeNum) !== -1) {
                randPokeNum = generateRandPokeNum(1, 151);
                randPokeImg.src = `${baseURL}${randPokeNum}.png`;
            }
        } else {
            randPokeImg.src = `${baseURLshiny}${randPokeNum}.png`;
            while (generatedPokemon.indexOf(randPokeNum) !== -1) {
                randPokeNum = generateRandPokeNum(1, 151);
                randPokeImg.src = `${baseURLshiny}${randPokeNum}.png`;
            }
        }
        //adding the pokemon to the container to be chosen from
        generatedPokemon.push(randPokeNum);
        generatedPokemonContainer.append(randPokeImg);
    }
}

//generate first set
generatePokemon();

//saving the team
//could include option to name team
const savedTeamsContainer = document.querySelector('#savedTeamsContainer');
saveTeamButton.addEventListener('click', function() {
    const newSavedTeam = document.createElement('ul');
    for (const listItem of newTeamList.querySelectorAll('li')) {
        newSavedTeam.append(listItem.querySelector('img'));
    }
    savedTeamsContainer.append(newSavedTeam);
    newTeamList.innerHTML = '';
    generatedPokemon = [];
    savedTeamsHeader.style.visibility = 'visible';
    newTeamHeader.innerText = 'Build a team?';
    generatePokemon();
});

//scrapping the team and making a new one
const newTeamButton = document.querySelector('#clearTeam');
newTeamButton.addEventListener('click', function() {
    generatedPokemonContainer.innerHTML = '';
    newTeamList.innerHTML = '';
    generatedPokemon = [];
    newTeamHeader.innerText = 'Build a team?';
    generatePokemon();
});












