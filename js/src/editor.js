// Classes and Constants

class Output{

	constructor(status, message, val){
		this.status = status;
		this.message = message;
		this.val = val
	}
}

// The enums refer to the different states of Output's Status

const ERROR = 0;
const FAILURE = 1;
const SUCCESS = 2;

/*

initializeEditor

-> 

This function intializes the ace coder environment
with the dreamweaver/javascript theme.

*/

function initializeEditor(){
	const editor = ace.edit("editor");
	editor.setTheme("ace/theme/dreamweaver");
	editor.getSession().setMode("ace/mode/javascript");
}

/*

parseInput

-> Output

This function grabs the code from the editor and parses it if possible.

*/ 

function parseInput(){

	try {
		return new Output(SUCCESS, 'The tree was correctly parsed', esprima.parse(editor.getValue()))
	} catch(err){
		return new Output(ERROR, err, null)
	}
}

/*

runFunction

String -> Function -> Output -> Output

Takes the name of the function and a parsed tree through input

*/

function runFunction(functionName,func,input){

	const status = input.status;

	if (status === ERROR) return input;

	const output = func(input.val, arg);

	if (name === 'structure'){

		if (output){
			return new Output(SUCCESS, 'Hooray! The structure is correct!', null)
		} else {
			return new Output(FAILURE, 'The structure was not correct :(', null)
		}
	}

	const bool = output[0];
	const value = output[1];

	if(bool){
		return new Output(SUCCESS, `Hooray! The ${name} test passed!`, null);
	}

	const str_acc = name === 'white'? ['White Test Failure. The following values were not found: '] :['Black test failure. The following values were found: '];

	for (let word in value){
		str_acc.push(value);
	}

	const str_final = str_acc.join(' ');

	return new Output(FAILURE, str_final, null);
}

/*
getInputFromWordList


Grabs words from word list div.
*/

function getInputFromWordList(name){

	const wordList = document.getElementById(`${name}-word-list)`);
	const children = wordList.children;

	if (!children) return [];

	return children.map(function(x) {return x.innerHTML;})

}

function run(name, output){

	const words = getInputFromWordList(name);

	if (!words) return '';

	whichFunction = {
		'white': whiteList, 
		'black': blackList,
		'structure': generalStructure
	}[name]

	return runFunction(name,whichFunction,output)
}

function getReturnMessage(name, output){
	const res = run(name,output);
	return res.message;
}

function runAllThree(){

	let names = ['white', 'black','structure'];
	let treeOutput =  parseInput();

	let results = names.map(function (x) {return getReturnMessage(x, treeOutput())});

	return results;
}

const globalState = {
	'black': true,
	'white': true,
	'structure': true
}

function toggleState(name){
	globalState[name] = !globalState[name];
}

