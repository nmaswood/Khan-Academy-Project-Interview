/* 

global State

Dict<Any, Any>

This object keeps track of all environment variables.

*/

const globalState = {
	'manual': false
}



function createDiv(){
	return document.createElement('div');
}

function createSpan(){
	return document.createElement('span');
}

 function createCheckMark(){
	const span = createSpan();

	span.setAttribute('class', 'checkmark');
	const stem = createDiv();
	stem.setAttribute('class', 'checkmark_stem');
	const kick = document.createElement('div');
	kick.setAttribute('class', 'checkmark_kick');

	span.appendChild(stem);
	span.appendChild(kick);

	return span;
}

function createXMark(){
	const span = createSpan();
	span.innerHTML = 'x';
	span.setAttribute('class', 'X');

	return span;
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

	const containerDiv = createDiv();

	attrDict(containerDiv,
		{
			'class': 'word-unit',
			'id': `${type}-unit`,
		});


	// Create Checkmark

	const checkMark = createCheckMark();

	// Initialize container for Span and Input
	const outerContainerSpan = createDiv();
	attrDict(outerContainerSpan,
		{
			'class': 'outer-container-span',
			'id': `${type}-outer-container-span`
		})

	// Initialize Inner Container Span

	const containerSpan = createSpan();
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

	const wordListContainer = createDiv();

	attrDict(wordListContainer,{
		'class':'word-list',
		'id':`${type}-word-list`
	});

	// Append divs in correct order to one another


	outerContainerSpan.appendChild(containerSpan);
	outerContainerSpan.appendChild(inputBar);


	let order = [checkMark, outerContainerSpan, wordListContainer];

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

	const outerForm = createDiv();
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


function reset(){

	function resetOne(name){
		const wordList = document.getElementById('${name}-word-list');
		while (wordList.firstChild) {
		    wordList.removeChild(myNode.firstChild);
		}	

		const unit = document.getElementById('${name}-unit');

		unit.children[0] = createCheckMark();
	};

	let names = ['white', 'black', 'structure'];

	for (let name in names){
		resetOne(name);
	}

}

function toggleManual(){
	globalState.manual = !globalState.manual;
};

function manualRun(){
	runAllThree();
};

function showFeedback(string){
	const feedback = document.getElementById('feedback');
	feedback.innerHTML = string;
}

function removeFeedback(){
	const feedback = document.getElementById('feedback');
	feedback.innerHTML = '';
}

var myEfficientFn = debounce(function() {
	console.log("fuck");
}, TIME_OUT);


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