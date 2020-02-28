


var masterPoke = (function() {
    pokedex = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    var $pokemoncontainer = document.querySelector('.pokeman-list');

    //handles loading 
    function loadingMessage() {
        var loading = document.querySelector('#loading');
        var searchbar = document.querySelector('#searchbutton')
        loading.classList.toggle('is-visible');
        searchbar.classList.toggle('is-visible');
    }

    //gets Pokemon name list from API
    function getApiList() {
        loadingMessage();
        fetch(apiUrl).then(function(response) {
            return response.json()
        }).then(function(json) {
            json.results.forEach(function(item) {
                var tempPoke = {
                    name: item.name,
                    detailsurl: item.url,
                };
                getPokeDetails(tempPoke)
            })
            })
            
        }




    //gets further small details for each pokemon.
    function getPokeDetails(pokemon) {
        var url = pokemon.detailsurl
        fetch(url).then(function(response){
        return response.json()
    }).then(function(details) {
        pokemon.id = details.id
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.speciesUrl = details.species.url;
        pokemon.stats = details.stats
        pokemon.power = details.stats[0].base_stat + details.stats[1].base_stat + details.stats[2].base_stat + details.stats[3].base_stat + details.stats[4].base_stat + details.stats[5].base_stat


        //for adding pokemon types(API shows types out of order)
        //I.E bulbasaur would be poison instead of grass first without this.
        if (details.types.length === 2) {
            pokemon.type0 = details.types[1].type.name;
            pokemon.type1 = details.types[0].type.name;
        }
        
        else{
            pokemon.type0 = details.types[0].type.name;
        };
        //Adds the '0.' for under 1m height and 'm' indicator at end.
        if (pokemon.height < 10) {
            pokemon.height = '0.' + pokemon.height + 'm';
        }
        else {
            pokemon.height = pokemon.height + 'm';
        }
        pokedex.push(pokemon);

    }).then(function(){
        sortPokedex();
    })
    }

    //Sorts pokedex var by pokemon number
    function sortPokedex() {
        //this keeps it from sorting till all are loaded
        if (pokedex.length === 150) {
        pokedex.sort(function(a, b) {
            return a.id - b.id;
        });
        createListItems(pokedex);
        buttonBarListener();
        }
    }
    
    //Creates name list and buttons for simple list
    function createListItems(mpokedex) {

        if (document.querySelector('#loading').className != 'is-visible') {
            loadingMessage();
            }
        
        mpokedex.forEach(function(pokemon) {
        var $listItem = document.createElement('li');
        var $button = document.createElement('button');
        $button.innerText = (pokemon.name);
        $button.className = 'listItem'
        $listItem.id = "pokeli"
        $listItem.classList = "is-visible"
        $listItem.appendChild($button);
        $pokemoncontainer.appendChild($listItem);
        styleButton(pokemon, $button);
        
    })
    

    if (document.querySelector('#loading').className === 'is-visible') {
    loadingMessage();
    }
}
    //styles buttons based on pokemans primary type
    function styleButton(pokemon, $button) {
    
            $button.className = pokemon.type0;
            
            addListener(pokemon, $button);
    }


    //adds listener on button & loads details on click
    function addListener(pokemon, $button) {
        $button.addEventListener('click', function () {
            loadMoreDetails(pokemon);
        })
    }

    //loads more data from specific pokemon URL from API.
    function loadMoreDetails(pokemon) {
        var url = pokemon.speciesUrl;
        var enBox = [];
        fetch(url).then(function(response) {
            return response.json()
        }).then(function(details){
        details.flavor_text_entries.forEach(function(details) {

                if (details.language.name === "en") {
                    var enDetails = {
                    text: details.flavor_text
                }
                    enBox.push(enDetails);
                }
            })
            }).then(function() { 
            //shows summary text 0(can be changed for different summary text.)
            pokemon.summary = enBox[0].text;
            createModalElements(pokemon);
            
        })
    }


    //creates modal elements
    function createModalElements(pokemon) {
        var elements = {
            leftSide: document.createElement('div'),
            rightSide: document.createElement('div'),
            imgContainer: document.createElement('div'),

            pokeName: document.createElement('h1'),
            pokeInfo: document.createElement('p'),
            pokeImg: document.createElement('img'),
            closeButton: document.createElement("button"),
            pokeHeight: document.createElement('p'),

            displayWrapper: document.querySelector('#wrapper'),
            modalNameCont: document.querySelector('#pokeTitle'),
            modalOverlay: document.querySelector('#detailsContainer'),
            modalInline: document.querySelector('#detailsList'),
            summaryContainer: document.querySelector('#pokeDetails'),

            //stat names
            attack: document.createElement('p'),
            defense: document.createElement('p'),
            specialatk: document.createElement('p'),
            specialdef: document.createElement('p'),
            speed: document.createElement('p'),
            health: document.createElement('p'),

        }

        var statElements = {
            pokeAtk: document.createElement('p'),
            pokeDef: document.createElement('p'),
            pokeSatk: document.createElement('p'),
            pokeSdef: document.createElement('p'),
            pokeSpd: document.createElement('p'),
            pokeHp: document.createElement('p'),
            }
        
        var stats = {
            attack: pokemon.stats[4].base_stat,
            defense: pokemon.stats[3].base_stat,
            specialatk: pokemon.stats[2].base_stat,
            specialdef: pokemon.stats[1].base_stat,
            speed: pokemon.stats[0].base_stat,
            health: pokemon.stats[5].base_stat,
        } 
        
        //Variable for clearing modal
        var clearAll = { title: elements.modalNameCont, 
            wrap: elements.displayWrapper, 
            details: elements.summaryContainer
        }

        
        buttonClickOut(elements.closeButton, elements.modalOverlay, clearAll);
        clickOutModal(elements.modalOverlay, clearAll);
        escapeOutModal(elements.modalOverlay, clearAll);
        

        createModalDetails(elements, pokemon, statElements, stats);
    }

    function createModalDetails(elements, pokemon, statElements, stats) {
        //broad details
        elements.pokeHeight.innerHTML = ('<h2>Height: </h2>' + pokemon.height);
        elements.closeButton.innerHTML = "X";
        elements.pokeImg.setAttribute("src", pokemon.imageUrl);
        elements.pokeName.innerHTML = (pokemon.name);
        elements.pokeName.style.fontSize = "300%";
        elements.pokeInfo.innerHTML = ('<h2>Summary</h2>' + pokemon.summary);


        //create stats
        statElements.pokeAtk.innerHTML = (stats.attack);
        statElements.pokeDef.innerHTML = (stats.defense);
        statElements.pokeSatk.innerHTML = (stats.specialatk);
        statElements.pokeSdef.innerHTML = (stats.specialdef);
        statElements.pokeSpd.innerHTML = (stats.speed);
        statElements.pokeHp.innerHTML = (stats.health);

        //display stats to names
        elements.attack.innerText = "Attack";
        elements.defense.innerText = "Defense";
        elements.specialatk.innerText = "Special Attack";
        elements.specialdef.innerText = "Special Defense";
        elements.speed.innerText = "Speed";
        elements.health.innerText = "Health";

        //add container ids
        elements.leftSide.id = 'leftSide';
        elements.rightSide.id = 'rightSide';
        elements.imgContainer.id = 'modalImg';
        elements.summaryContainer.id = 'pokeDetails';

        //add class names
        elements.pokeImg.classList.add ('pokeImg');
        elements.leftSide.classList.add('leftside')
        elements.rightSide.classList.add('rightside')
        elements.closeButton.classList.add('closeButton')
        elements.pokeName.classList.add('modal-title')


        appendDetailstoModal(elements, statElements)

    }

    function appendDetailstoModal(elements, statElements) {

        elements.modalNameCont.appendChild(elements.closeButton);
        elements.modalNameCont.appendChild(elements.pokeName);

        

        elements.summaryContainer.appendChild(elements.pokeInfo);
        elements.summaryContainer.appendChild(elements.pokeHeight)

        //modal stat & img display
        elements.displayWrapper.appendChild(elements.leftSide);
        elements.displayWrapper.appendChild(elements.rightSide);
        elements.leftSide.appendChild(elements.attack);
        elements.leftSide.appendChild(statElements.pokeAtk);
        elements.leftSide.appendChild(elements.specialatk);
        elements.leftSide.appendChild(statElements.pokeSatk);
        elements.leftSide.appendChild(elements.speed);
        elements.leftSide.appendChild(statElements.pokeSpd);


        elements.displayWrapper.insertBefore(elements.imgContainer, elements.rightSide);
        elements.imgContainer.appendChild(elements.pokeImg);

        elements.rightSide.appendChild(elements.defense);
        elements.rightSide.appendChild(statElements.pokeDef);
        elements.rightSide.appendChild(elements.specialdef);
        elements.rightSide.appendChild(statElements.pokeSdef);
        elements.rightSide.appendChild(elements.health);
        elements.rightSide.appendChild(statElements.pokeHp);
        
        //end of modal details and open modal

        elements.modalOverlay.classList.toggle("is-visible");
    }
    
    //closes modal on button close
    function buttonClickOut(button, container, clearAll) {
            button.addEventListener('click', function () {
                closeModal(container, clearAll);
            })
    }
    //closes modal on container click out
    function clickOutModal(container, clearAll) {
            container.addEventListener('click', (e) => {
            var target = e.target;
            if (target === container) {
                closeModal(container, clearAll)
            }
        });
        }
    //closes modal on escape button.
    function escapeOutModal(container, clearAll) {
        window.addEventListener('keydown',function(k) {
            if (k.key === 'Escape' && container.classList.contains('is-visible'))
            closeModal(container, clearAll);
        })
    }
    //does the actual closing
    function closeModal(container, clearAll) {
        container.classList.remove('is-visible');
        clearAll.title.innerHTML = " ";
        clearAll.wrap.innerHTML = " ";
        clearAll.details.innerHTML = " ";

        }

    function buttonBarListener() {
        var searchbutton = document.querySelector('#searchbutton');
        var filterbutton = document.querySelector('#filterbutton');
        var resetbutton = document.querySelector('#resetbutton');
        var searchbar = document.querySelector('#searchbar');
        var buttonList = document.querySelector('#buttonlist');
        var body = document.querySelector('.pokedex-start');
        var listPokeButtons = document.querySelectorAll('#pokeli');
        var pokeButtonsList = document.querySelector('.pokeman-list');
        

        searchbutton.addEventListener('click', function(e) {
            toggleSearch(e, searchbutton, searchbar, buttonList);
        })

        window.addEventListener('click', function(e) {
            toggleSearchClickOut(e, searchbutton, searchbar, buttonList);
        })

        window.addEventListener('keydown', function(e){
            escapeSearchOut(e, searchbutton, searchbar, buttonList)
        })


        toggleFilter(listPokeButtons, pokeButtonsList, filterbutton)


        searchbar.addEventListener('input', function () {
            searchPoke(searchbar.value, pokeButtonsList, listPokeButtons)
        });

        resetbutton.addEventListener('click', function (e) {
            resetFilters(pokeButtonsList, resetbutton, filterbutton)
        })
        
    }

    function escapeSearchOut(e, searchbutton, searchbar, buttonList) {

        if (e.key === 'Escape' && searchbar.className === "is-visible" ) {
            var listitem = document.querySelectorAll('li')
            buttonList.classList.toggle('is-visible');
            searchbar.classList.toggle("is-visible");
            searchbar.value = "";

            listitem.forEach(function(e, index) {
                listitem[index].classList.add('is-visible')
            })
        }
    }

    function toggleSearch(target, button, inputfield, buttonList) {

        if (target.target.id === button.id) {
            buttonList.classList.toggle('is-visible');
            inputfield.classList.toggle("is-visible");
            
        }

    }

    function toggleSearchClickOut(target,searchbutton, searchbar, buttonList) {
        var matches = target.target.id === searchbar.id

        if (!matches && searchbar.className === 'is-visible' && target.target.id != searchbutton.id) {
            var list = document.querySelector('.pokeman-list')
            var listitem = document.querySelectorAll('li')
            buttonList.classList.toggle('is-visible');
            searchbar.classList.toggle("is-visible");
            searchbar.value = ""

            
            listitem.forEach(function(e, index){
                listitem[index].classList.add('is-visible')
            })
        }
    }

var setA = 0

    function searchPoke(value, list, buttonList) {
        var list = document.querySelector('.pokeman-list')
        var buttonList = document.querySelectorAll('#pokeli')
        var v = value.length 
        var lowerCaseV = value.toLowerCase();
        
        buttonList.forEach(function(e){
            e.classList.remove('is-visible')
        })


        pokedex.filter(function(e, index) {
            if (e.name.slice(0, v) === lowerCaseV) {
                var search = list.getElementsByTagName('li')[index]

                    search.classList.add('is-visible')
                
            }
        })
    } 

    function resetFilters(list, button,filterbutton) {
        setA = 0
        filterbutton.innerText = "Filters";
        sortcompare("id", false);
        list.innerHTML = " ";
        createListItems(pokedex);
    }

    function toggleFilter(buttons, list, filterbutton) {
        filterbutton.addEventListener('click', function(e) {
            setA++;
            if (setA === 1) {
                filterbutton.innerText = "Name";
                sortcompare("name", false);
                list.innerHTML = " ";
                createListItems(pokedex);
            
            }
            if (setA === 2) {
                filterbutton.innerText = "Type";
                sortcompare("type0", false);
                list.innerHTML = " ";
                createListItems(pokedex);

                }
            if (setA === 3) {
                filterbutton.innerText = "Height";
                sortcompare("height", true);
                list.innerHTML = " ";
                createListItems(pokedex);

                }
            if (setA === 4) {
                filterbutton.innerText = "Power";
                sortcompare("power", true);
                list.innerHTML = " ";
                createListItems(pokedex);
                setA = 0
            }
            

        })
    }  


    function sortcompare(type, reverseBool) {
        pokedex.sort(function(a, b) {

            if (type === 'id' || type === 'power') {
                var pokeA = a[type];
                var pokeB = b[type];
            }
            else {
                var pokeA = a[type].toUpperCase();
                var pokeB = b[type].toUpperCase();

            }   

            let comparison = 0;

            if (reverseBool === false) {
                if (pokeA > pokeB) {
                    comparison = 1;
                } 
                
                else if (pokeA < pokeB) {
                    comparison = -1;
                }

                return comparison;
                }
            else {
                if (pokeA < pokeB) {
                    comparison = 1;
                } 
                
                else if (pokeA > pokeB) {
                    comparison = -1;
                }

                return comparison;
            }
        })
    }

    //returns all pokemon
    function getAll() {
        return pokedex
        }
    //available commands
    return {
    getApiList: getApiList,
    getAll: getAll,
    loadingMessage: loadingMessage,
    toggleSearch: toggleSearch,
    }
})();

masterPoke.getApiList();




