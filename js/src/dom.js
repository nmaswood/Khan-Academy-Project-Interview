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
            'reset': 'Click to clear all words and start over.',
            'run': 'Click to manually run all tests.',
            'manual': 'Turn off automatic tests. This might be a good idea if things are slow.'
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
    document.getElementById('feedback').innerHTML = '';
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

        let value = values[i];
        let name = names[i];

        let status = value.status;
        let message = value.message;

        globalState[name] = message;

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
    	if(!globalState.manual){
	    	toggleManual();
	        alert("You have a lot of code which is slowing down validation. The system is turning off auto for better performance.");
	    }
    }

}, globalState.debounceTimeout);



function showInstructions(){
	const div = document.getElementById('instructions');
	div.setAttribute('style', '');
}

function hideInstructions(){
	const div = document.getElementById('instructions');
	div.setAttribute('style', 'display:none');
}


function help(){

	const container = document.getElementById('help');
	const svg = createSvg(svgDict.help);
	svg.onmouseover = showInstructions;
	svg.onmouseout = hideInstructions;

	container.appendChild(svg);
}

function createQuestion(q, a){

	const outerContainer = createDiv();
	outerContainer.setAttribute('class', 'question-container');

	const question = createDiv();
	question.setAttribute('class', 'question');
	question.innerHTML = q;

	const answer = createDiv();
	answer.setAttribute('class', 'answer');
	answer.innerHTML = a;

	outerContainer.appendChild(question);
	outerContainer.appendChild(answer);

	return outerContainer;
}

const questions = [
	
	['What does this do?',
	 'This code editor can help determine if your code conforms to certain expectations.'
	],
	[
		'What are these expectations?',
		`A program is a series of instructions. These instructions can be structured in many different ways. We want to you structure your code based on certain constraints.`
	],
	[
	`What does 'white list' do?`,
	`For white list you must have all the structures listed some where in your code. E.g. IfStatement -> if(true){} PASSES` 
	],
	[
	`What does 'black list' do?`,
	`For 'black list' you may not have any of the structures listed any where in your code. IfStatement -> while(true){} PASSES`
	],
	[
	`What does 'structure' do?`,
	'For the structure you must have the structures listed in nested order. E.g. IfStatement WhileStatement -> if(true){while(true){}} PASSES'
	],
	[
	'How do I run tests?',
	'Type a valid Javascript node name into any of the input bars and hit enter. When you are typing the tests will automatically be run'
	],
	[
	`What are Javascript node names?`,
	`These node names come from a defined standard. For starters try ForStatement, IfStatement, WhileStatement or VariableDeclaration. (Case sensitive)`
	],
	[
	'The code editor is running super slow what do I do?',
	'The editor will try and adjust to account for slow speeds, but you still think it is slow. Put it into manual mode and run the tests by hand.'
	]
]

function createQuestions(){

	const qs = questions.map(function(x){return createQuestion(x[0], x[1])});

	const div = document.getElementById('faq');

	for (let i = 0; i < qs.length;i++){
		div.appendChild(qs[i]);
	}
}

createQuestions();



/*

initializeEditor

-> 

This function intializes the ace coder environment
with the dreamweaver/javascript theme.

*/

function initializeEditor() {
    editor.setTheme("ace/theme/dreamweaver");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().on('change', function() {
        debounced();
    });
}

function init() {
    initializeEditor();
    createForm();
    createButtons();
    help();
    console.log ("Note you might be seeing some error about javascript-worker missing. This is due to minification and is harmless. Please ignore.")
}

init();