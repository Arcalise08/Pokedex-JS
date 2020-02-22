/* 
usage to add new pokemon---
pokeydata.add({name: "name", height: number , type: ["pokemontype"]}) 
*/

/* Pokedex Start */

var pokeydata = (function() {
    var pokedex = [];

    function add(pokeman) {
        if (typeof pokeman.name === "string" && 
            typeof pokeman.height === "number" && 
            typeof pokeman.type[0] === "string" ) {
        
            pokedex.push(pokeman);
        }

        else {
        console.log('Incorrect usage//pokeydata.add({name: "name", height: number , type: ["pokemontype"]})')
        }
    }

    function getAll() {
        return pokedex
    }

    return {
        add: add,
        getAll: getAll,
    };

})()

pokeydata.add({name: 'Bulbasaur', height: 2.4, type: ['Grass', ' Poison']});
pokeydata.add({name: 'Squirtle', height: 2.8, type: ['Water']});
pokeydata.add({name: 'Charmander', height: 2.0, type: ['Fire']});


pokeydata.getAll().forEach(function(currentName) {
    document.write('<p>'+'name: '+'<strong>'+currentName.name+'</strong>'+'</p>')
    document.write('<p>'+'height: '+ currentName.height+'</p>')
    document.write('<p>'+'type: ' + currentName.type+'</p>')
    
});


