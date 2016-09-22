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
			'id': `${type}-word-input-bar`
		})

	// Initialize Word List Container

	const wordListContainer = doc.createElement('div');

	attrDict(wordListContainer,{
		'class':'word-list',
		'id':`${type}-word-list`
	});

	// Append divs in correct order to one another

	let order = [containerSpan, inputBar, wordListContainer];

	for (let i = 0; i < order.length; i++){
		containerDiv.appendChild(order[i]);
	}

	return containerDiv;
}

function createButtons(){

	// Store reference to document

	const doc = document;

	// Initialize Form that will contain buttons

	const outerForm = doc.createElement('form');
	outerForm.setAttribute('id', 'buttons-container');


	// Initialize three buttons

	let values = ['reset', 'manual','run'];

	function makeButton(name){
		const button = doc.createElement('button');
		button.innerHTML = name;
		attrDict({
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

createForm();
createButtons();