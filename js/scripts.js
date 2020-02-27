


var masterPoke = (function() {
    pokedex = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    var $pokemoncontainer = document.querySelector('.pokeman-list');

    //handles loading 
    function loadingMessage() {
        var loading = document.querySelector('#loading');
        loading.classList.toggle('is-visible');
        console.log(loading);
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
            createListItems();
            }
        }
        
        //Creates name list and buttons for simple list
        function createListItems() {

            pokedex.forEach(function(pokemon) {
            var $listItem = document.createElement('li');
            var $button = document.createElement('button');
            $button.innerText = (pokemon.name);
            $button.className = 'listItem'
            $listItem.appendChild($button);
            $pokemoncontainer.appendChild($listItem);
            styleButton(pokemon, $button);
            
        })
        loadingMessage();
        
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
        //returns all pokemon
        function getAll() {
            return pokedex
        }
    //available commands
    return {
    getApiList: getApiList,
    getAll: getAll,
    loadingMessage: loadingMessage,
    }
})();

masterPoke.getApiList();




