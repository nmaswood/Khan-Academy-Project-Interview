const validNodeNames = new Set([
	'FunctionDeclaration',
    'BlockStatement',
    'VariableDeclaration',
    'WhileStatement',
    'ReturnStatement',
    'IfStatement',
    'ForStatement',
    'ContinueStatement',
    'ExpressionStatement',
    'FunctionExpression',
    'BreakStatement',
    'ConditionalExpression',
    'ObjectExpression',
    'Literal',
    'VariableDeclarator',
    'CallExpression',
    'VariableDeclarator',
    'Identifier'
])


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
/*

attrDict

Dom Element -> Dict<String, String> -> Void

Takes a dom unit and dict and does unit.setAttribute for 
everything key value pair in dict

*/

function attrDict(div, dict) {
	for (let key in dict) {
		div.setAttribute(key, dict[key]);
	}
 }

/*
throttle

Function -> Float -> 

copied from https://jsfiddle.net/jonathansampson/m7G64/

*/

 function throttle (callback, limit) {
    var wait = false;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            callback.call();           // Execute users function
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
            }, limit);
        }
    }
}

/*

createForm

-> 

This creates the form that will allow users to dynamically add and remove words
words to black, white, structure list.

*/

function createForm(){

	// Create reference to doc

	let doc = document;

	// create Form that will contain everything

	const outerForm = doc.createElement('form');
	attrDict(outerForm,
		{
			'class': 'outer-form',
			'id': 'outer-form-id'
	});

	// create three word units

	const values = ['black', 'white', 'structure'];

	const units = values.map(createWordUnit);

	// append word units to form

	for (let i = 0; i < units.length; i++){
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

function createWordUnit(type){

	// create Reference to document

	const doc = document;

	// Initialize outer container div

	const containerDiv = doc.createElement('div');

	attrDict(containerDiv,
		{
			'class': 'word-unit',
			'id': `${type}-unit`,
		});


	// Initialize container for Span and Input
	const outerContainerSpan = doc.createElement('div');
	attrDict(outerContainerSpan,
		{
			'class': 'outer-container-span',
			'id': `${type}-outer-container-span`
		})

	// Initialize Inner Container Span

	const containerSpan = doc.createElement('span');
	attrDict(containerSpan,
		{
			'class': 'word-span',
			'id': `${type}-span`
		})

	containerSpan.innerHTML = type;

	// Initialize Input Bar

	const inputBar = doc.createElement('input');
	attrDict(inputBar,
		{
			'class': 'word-input-bar',
			'type':'text',
			'id': `${type}-word-input-bar`,
		});

	let on = true;
	inputBar.onkeyup = function(e){

		const which = e.which || e.keyCode;
		if (which === 13 && on){
			if(addWordToList(type, inputBar.value)){
				inputBar.value = '';

				return;
			} else {

				const style = inputBar.getAttribute('style');
				const stylePrime = 'color:red';

				inputBar.setAttribute('style', stylePrime);
				on = false;

				setTimeout(
					function(){
						on = true;
						inputBar.setAttribute('style', style);
					}, 2000);

			}
		}
	}


	// Initialize Word List Container

	const wordListContainer = doc.createElement('div');

	attrDict(wordListContainer,{
		'class':'word-list',
		'id':`${type}-word-list`
	});

	// Append divs in correct order to one another


	outerContainerSpan.appendChild(containerSpan);
	outerContainerSpan.appendChild(inputBar);


	let order = [outerContainerSpan, wordListContainer];

	for (let i = 0; i < order.length; i++){
		containerDiv.appendChild(order[i]);
	}

	return containerDiv;
}

/*

createWord

String -> Div

Creates a word div element and returns it

*/

function createWord(word){
	const span = document.createElement('span')
	span.innerHTML = word;
	span.setAttribute('class', 'word');
	return span;
}

/*

addWordToList

String -> Word -> 

Takes a word adds it to whatever of the three lists you want.

*/

function addWordToList(name,word){

	if (!(validNodeNames.has(word))){
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

function createButtons(){

	// Store reference to document

	const doc = document;

	// Initialize Form that will contain buttons

	const outerForm = doc.createElement('div');
	outerForm.setAttribute('id', 'buttons-container');

	// Initialize three buttons

	let values = ['reset', 'manual','run'];

	function makeButton(name){
		const button = doc.createElement('button');
		button.innerHTML = name;
		attrDict(button,{
			'class': 'selectionButton',
			'id': `${name}-button`
		})
		return button;
	}

	const buttons = values.map(makeButton);

	// Append buttons to Form

	for (let i = 0; i < buttons.length; i++){
		outerForm.appendChild(buttons[i])
	}

	// Append form to dom

	const container = doc.getElementById('buttons');
	container.appendChild(outerForm);
}


/*

initializeEditor

-> 

This function intializes the ace coder environment
with the dreamweaver/javascript theme.

*/

var myEfficientFn = debounce(function() {
	console.log("fuck");
}, 250);


function initializeEditor(){
	editor.setTheme("ace/theme/dreamweaver");
	editor.getSession().setMode("ace/mode/javascript");
	editor.getSession().on('change', function(){
		myEfficientFn();
	})

}

initializeEditor();
createForm();
createButtons();

f = runAllThree()
console.log(f);