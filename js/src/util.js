/*
validNodeNames

Set <String>

A user can only input js tree elements from this node. I could add more
these are just some of the basics.
*/

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

/*

TIME_OUT

Int

This timeout correponds to how the debouncer waits
before calling the three api functions again when the user
is typing.

*/

/*

debounce

function -> int -> void

*/

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
createDiv

-> Div

Syntatic sugar
*/

function createDiv(){
    return document.createElement('div');
}

/* 
createSpan

-> Span

Syntatic sugar
*/

function createSpan(){
    return document.createElement('span');
}
/*

createCheckMark

String -> Span

*/

function createCheckMark(name){
    const span = createSpan();

    span.setAttribute('class', 'checkmark');
    span.id = `${name}-checkmark`;
    const stem = createDiv();
    stem.setAttribute('class', 'checkmark_stem');
    const kick = document.createElement('div');
    kick.setAttribute('class', 'checkmark_kick');

    span.appendChild(stem);
    span.appendChild(kick);

    return span;
}

/*
createXMark

String -> Span

*/

function createXMark(name){
    const span = createSpan();
    span.id = `${name}-x`;
    span.innerHTML = 'x';
    span.setAttribute('class', 'X');

    return span;
}

/*

setToString

set -> String

converts a set to a string

*/

function setToString(set){
    console.log('set',set);
    if (set.size == 1){
        for (let x in set){
            return x;
        }
    }
    const asList = Array.from(set);
    return asList.join(' ');
}