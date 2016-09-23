/* 

global State

Dict<Any, Any>

This object keeps track of all environment variables.

*/
function generateGlobalState() {
    return {
        'manual': false,
        'black': 'The black test seems to be passing.',
        'white': 'The white test seems to be passing',
        'structure': 'The structure test seems to be passing',
        'wrongInputTimeout': 2000,
        'debounceTimeout': 750,
        'wordLineLimit': 5
    }
}

let globalState = generateGlobalState();

function createCheckMacro(name) {
    const check = createSvg(svgDict.check);
    check.onmouseover = function() {
        showFeedback(globalState[name]);
    };
    check.onmouseout = removeFeedback;
    return check;
}

function createXMacro(name) {

    const x = createSvg(svgDict.x);

    x.onmouseover = function() {
        showFeedback(globalState[name]);
    };

    x.onmouseout = removeFeedback;
    return x;
}



/*

createForm

-> 

This creates the form that will allow users to dynamically add and remove words
words to black, white, structure list.

*/

function createForm() {

    // Create reference to doc

    let doc = document;

    // create Form that will contain everything

    const outerForm = doc.createElement('form');
    attrDict(outerForm, {
        'class': 'outer-form',
        'id': 'outer-form-id'
    });

    // create three word units

    const values = ['white', 'black', 'structure'];

    const units = values.map(createWordUnit);

    // append word units to form

    for (let i = 0; i < units.length; i++) {
        outerForm.appendChild(units[i]);
    }

    // append form to dom

    const wordsOuterContainer = doc.getElementById('words-outer-container');

    wordsOuterContainer.appendChild(outerForm);
}

/*

createWord Unit

String -> Dom Element

This creates the input/display corresponding to one unit. Where a unit is black, white or structure.

*/

function createWordUnit(type) {

    // create Reference to document

    const doc = document;

    // Initialize outer container div

    const containerDiv = createDiv();

    attrDict(containerDiv, {
        'class': 'word-unit',
        'id': `${type}-unit`,
    });


    // Create Checkmark

    const checkMark = createCheckMacro(type);

    // Initialize container for Span and Input
    const outerContainerSpan = createDiv();
    attrDict(outerContainerSpan, {
        'class': 'outer-container-span',
        'id': `${type}-outer-container-span`
    })

    // Initialize Inner Container Span

    const containerSpan = createSpan();
    attrDict(containerSpan, {
        'class': 'word-span',
        'id': `${type}-span`
    })

    containerSpan.innerHTML = type;

    // Initialize Input Bar

    const inputBar = doc.createElement('input');
    attrDict(inputBar, {
        'class': 'word-input-bar',
        'type': 'text',
        'id': `${type}-word-input-bar`,
    });

    let on = true;
    inputBar.onkeyup = function(e) {

        const which = e.which || e.keyCode;


        const len = getInputFromWordList(type).length;

        if (!(len < globalState.wordLineLimit)) {
            (function() {
                const style = inputBar.getAttribute('style');
                const stylePrime = 'color:#e74c3c';

                inputBar.setAttribute('style', stylePrime);
            })()
            return;
        } else {
            inputBar.setAttribute('style', '')
        }


        if (which === 13 && on) {
            if (addWordToList(type, inputBar.value)) {
                inputBar.value = '';
                main();

                return;
            } else {

                const style = inputBar.getAttribute('style');
                const stylePrime = 'color:red';

                inputBar.setAttribute('style', stylePrime);
                on = false;

                setTimeout(
                    function() {
                        on = true;
                        inputBar.setAttribute('style', style);
                    }, globalState.wrongInputTimeout);

            }
        }
    }


    // Initialize Word List Container

    const wordListContainer = createDiv();

    attrDict(wordListContainer, {
        'class': 'word-list',
        'id': `${type}-word-list`
    });

    // Append divs in correct order to one another

    outerContainerSpan.appendChild(containerSpan);
    outerContainerSpan.appendChild(inputBar);


    let order = [checkMark, outerContainerSpan, wordListContainer];

    for (let i = 0; i < order.length; i++) {
        containerDiv.appendChild(order[i]);
    }

    return containerDiv;
}

/*

createWord

String -> Div

Creates a word div element and returns it

*/

function createWord(word) {
    const span = createSpan();
    span.innerHTML = word;
    span.setAttribute('class', 'word');
    return span;
}

/*

addWordToList

String -> Word -> 

Takes a word adds it to whatever of the three lists you want.

*/

function addWordToList(name, word) {

    if (!(validNodeNames.has(word))) {
        return false;
    }

    const list = document.getElementById(`${name}-word-list`);

    if (list.children.length > 5) {
        const first = list.children[0];
        list.removeChild(first);
    }
    const wordDiv = createWord(word);
    list.appendChild(wordDiv);
    return true;
}

/*
createButtons

creates  run, manual and reset buttons and attaches
functions to them
*/

function createButtons() {

    // Store reference to document

    const doc = document;

    // Initialize Form that will contain buttons

    const outerForm = createDiv();
    outerForm.setAttribute('id', 'buttons-container');

    // Initialize three buttons

    let values = ['reset', 'manual', 'run'];

    function makeButton(name) {

        console.log(name);
        const svg = createSvg(svgDict[name])
        svg.setAttribute('id', `${name}-button`)

        const feedbackString = {
            'reset': 'Click on this button to clear all words and start over.',
            'run': 'Click this button the manually run all tests.',
            'manual': 'Click this button to turn off automatic tests. This might be a good idea if things are slow.'
        }[name]

        svg.onmouseover = function() {

            showFeedback(feedbackString);
        }

        svg.onmouseout = removeFeedback;

        svg.onclick = {
            'reset': reset,
            'run': main,
            'manual': toggleManual
        }[name];

        return svg;

        //return button;
    }

    const buttons = values.map(makeButton);

    // Append buttons to Form

    for (let i = 0; i < buttons.length; i++) {
        outerForm.appendChild(buttons[i])
    }

    // Append form to dom

    const container = doc.getElementById('buttons');
    container.appendChild(outerForm);
}

/*

reset

Removes all words from word list.

*/
function reset() {

    globalState = generateGlobalState();

    function resetOne(name) {
        const wordList = document.getElementById(`${name}-word-list`);
        const input = document.getElementById(`${name}-word-input-bar`);

        input.setAttribute('style', '');


        while (wordList.firstChild) {
            wordList.removeChild(wordList.firstChild);
        }

        const mark = createCheckMacro(name);

        replaceNodeWith(name, mark);
    };

    let names = ['white', 'black', 'structure'];

    for (let i = 0; i < names.length; i++) {
        resetOne(names[i]);
    }
}

/*
showFeedback

String-> 

Sets the feedback div equal to the string
*/

function showFeedback(string) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = string;
}

/*
removeFeedback

Clears the feedback div
*/

function removeFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = '';
}

/*
replaceNodeWith

Locates first node in unit and swaps it other with another.
*/

function replaceNodeWith(name, newNode) {
    const div = document.getElementById(`${name}-unit`);
    div.replaceChild(newNode, div.children[0]);
}

/* 
toggleManual

Changes manual color from green to black and vice versa

*/

function toggleManual() {

    const manual = globalState['manual'];

    const button = document.getElementById('manual-button');
    const newStyle = manual ? '' : 'background:black;';

    button.setAttribute('style', newStyle);

    globalState['manual'] = !manual;
}



/*

main

This function runs three api calls on text area input. Then 
changes state to reflect whether those api calls where succesful.

*/

function main() {

    const values = runAllThree();
    const names = ['white', 'black', 'structure'];

    for (let i = 0; i < values.length; i++) {

        console.log("just ran main");
        let value = values[i];
        let name = names[i];

        let status = value.status;
        let message = value.message;
        console.log(message);

        globalState[name] = message;
        console.log(message);

        let mark = status == ERROR || status == FAILURE ? createXMacro(name) : createCheckMacro(name);

        replaceNodeWith(name, mark);
    }
}

/*
debounced

debounced main function that is run on change in type or when a new input is added.
This function times how long it takes to run and adjusts the debounce time accordiningly.
If manual is set to true this functionality is turned off.

*/

var debounced = debounce(function() {

    const start = performance.now()

    if (!globalState.manual) {
        main();
    }

    const end = performance.now()

    const difference = end - start;


    if (difference > 10) {
        globalState.debounceTimeout = 1000;
    } else if (difference > 20) {
        globalState.debounceTimeout = 1500;
    } else if (difference > 50) {
        alert("You have a lot of code which is slowing down validation. The system is turning off auto for better performance.");
        globalState.manual = true;
    }

    console.log(difference);

}, globalState.debounceTimeout);

/*

initializeEditor

-> 

This function intializes the ace coder environment
with the dreamweaver/javascript theme.

*/

function initializeEditor() {
    //mono_industrial
    //merbivore_soft
    editor.setTheme("ace/theme/dreamweaver");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().on('change', function() {
        debounced();
    })

}

function init() {
    initializeEditor();
    createForm();
    createButtons();
}

init();