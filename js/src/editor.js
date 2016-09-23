// Classes and Constants

const editor = ace.edit("editor");

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

parseInput

-> Output

This function grabs the code from the editor and parses it if possible.

*/ 

function parseInput(){

	const text = editor.getValue();

	try {

		const parsed = esprima.parse(text);
		return new Output(SUCCESS, 'The tree was correctly parsed', parsed)
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

	const output = func(input.val.body, getInputFromWordList(functionName));

	if (functionName === 'structure'){

		if (output){
			return new Output(SUCCESS, 'Hooray! The structure is correct!', null)
		} else {
			return new Output(FAILURE, 'The structure was not correct :(', null)
		}
	}

	const bool = output[0];
	const value = output[1];

	if(bool) return new Output(SUCCESS, `Hooray! The ${functionName} test passed!`, null);

	let asString = (function(){
		if(functionName === 'white'){
			return setToString(value)
		} else {
			return value;
	}})();
	console.log ("asString", asString);

	return new Output(FAILURE, asString, null);
}


/*
getInputFromWordList


Grabs words from word list div.
*/

function getInputFromWordList(name){

	const wordList = document.getElementById(`${name}-word-list`);
	const children = [].slice.call(wordList.children);

	if (!children) return [];

	return children.map(function(x) {return x.innerHTML;})

}

/* 
run

String -> Output -> List <Output>

Runs an api call for specific function
*/
function run(name, output){

	const words = getInputFromWordList(name);

	if (!words) return '';

	whichFunction = {
		'white': whiteList, 
		'black': blackList,
		'structure': generalStructure
	}[name];

	return runFunction(name,whichFunction,output)
}
/*
runAllThree

Runs an api call for all three functions.
*/

function runAllThree(){

	let names = ['white', 'black','structure'];
	let treeOutput = parseInput();

	const x = names.map(function (x) {return run(x, treeOutput)});
	return x;

}