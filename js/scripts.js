/* 
usage to add new pokemon---
pokeydata.add({name: "name", height: number , type: ["pokemontype"]}) 
usage to add new pokemon to list
pokeydata.addListItem({name: 'pokemon-name, height: number, type:['pokemontype']})
*/

/* Pokedex storage data */
var pokeydata = (function() {
    var pokedex = [];

    function add(pokeman) {

        /*Validation Check*/
        if (typeof pokeman.name === "string" && 
            typeof pokeman.height === "number" && 
            typeof pokeman.type[0] === "string" ) {
        /*Add pokemon data to array*/
            pokedex.push(pokeman);
        }
        /*Errors out when wrong data entered*/
        else {
        console.log('Incorrect usage//pokeydata.add({name: "name", height: number , type: ["pokemontype"]})')
        }
    }
        /*Returns pokemon data*/
    function getAll() {
        return pokedex
    }

    function addListItem(currentPoke) {

        /*Validation Check*/
        if (typeof currentPoke.name === "string" && 
            typeof currentPoke.height === "number" && 
            typeof currentPoke.type[0] === "string" ) {

        /*Add pokemon button to list*/        
        var $listItem = document.createElement('li');
        var $button = document.createElement('button');
        $button.innerText = (currentPoke.name);
        $listItem.appendChild($button);
        $pokemoncontainer.appendChild($listItem);
        addEventButton($button, currentPoke);
        
        }

        /*Errors out when wrong data entered*/
        else {
        console.log('Incorrect usage//pokeydata.addListItem({name: "name", height: number , type: ["pokemontype"]})')
        }
    } 
        /*adds click event listener to button*/  
        function addEventButton($button, currentPoke) {
            $button.addEventListener('click', function () {
                showDetails(currentPoke)
            })};

        /*Outputs details of pokemon to log*/   
        function showDetails(currentPoke)  {
            console.log(currentPoke.name + ' ' + currentPoke.height + " " + currentPoke.type);
        }

        /*Usable Commands*/
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails,
        addEventButton: addEventButton
    };

})()

/*Pokemon to add to list*/
pokeydata.add({name: 'Bulbasaur', height: 2.4, type: ['Grass', ' Poison']});
pokeydata.add({name: 'Squirtle', height: 2.8, type: ['Water']});
pokeydata.add({name: 'Charmander', height: 2.0, type: ['Fire']});

/*Pokemon List Container*/
var $pokemoncontainer = document.querySelector('.pokeman-list');

/*Publishes pokemon data to viewable list*/
pokeydata.getAll().forEach(function(currentPoke) {
    pokeydata.addListItem(currentPoke)
});

