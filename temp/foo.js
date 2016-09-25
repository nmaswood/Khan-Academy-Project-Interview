'use strict';

/*
validNodeNames

Set <String>

A user can only input js tree elements from this node. I could add more
these are just some of the basics.
*/

var validNodeNames = new Set(['FunctionDeclaration', 'BlockStatement', 'VariableDeclaration', 'WhileStatement', 'ReturnStatement', 'IfStatement', 'ForStatement', 'ContinueStatement', 'ExpressionStatement', 'FunctionExpression', 'BreakStatement', 'ConditionalExpression', 'ObjectExpression', 'Literal', 'VariableDeclarator', 'CallExpression', 'VariableDeclarator', 'Identifier']);

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
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
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
    for (var key in dict) {
        div.setAttribute(key, dict[key]);
    }
}

/* 
createDiv

-> Div

Syntatic sugar
*/

function createDiv() {
    return document.createElement('div');
}

/* 
createSpan

-> Span

Syntatic sugar
*/

function createSpan() {
    return document.createElement('span');
}
/*

createCheckMark

String -> Span

*/

function createCheckMark(name) {
    var span = createSpan();

    span.setAttribute('class', 'checkmark');
    span.id = name + '-checkmark';
    var stem = createDiv();
    stem.setAttribute('class', 'checkmark_stem');
    var kick = document.createElement('div');
    kick.setAttribute('class', 'checkmark_kick');

    span.appendChild(stem);
    span.appendChild(kick);

    return span;
}

/*


createSvg

*/
function createSvg(path) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    attrDict(svg, {
        'class': 'svg-icon',
        'viewBox': '0 0 20 20'
    });

    attrDict(pathElement, {
        'fill': 'none',
        'd': path
    });
    svg.appendChild(pathElement);
    return svg;
}

/*

setToString

set -> String

converts a set to a string

*/

function setToString(set) {
    return Array.from(set).join(' ');
}

var svgDict = {
    'reset': 'M19.305,9.61c-0.235-0.235-0.615-0.235-0.85,0l-1.339,1.339c0.045-0.311,0.073-0.626,0.073-0.949\nc0-3.812-3.09-6.901-6.901-6.901c-2.213,0-4.177,1.045-5.44,2.664l0.897,0.719c1.053-1.356,2.693-2.232,4.543-2.232\nc3.176,0,5.751,2.574,5.751,5.751c0,0.342-0.037,0.675-0.095,1l-1.746-1.39c-0.234-0.235-0.614-0.235-0.849,0\nc-0.235,0.235-0.235,0.615,0,0.85l2.823,2.25c0.122,0.121,0.282,0.177,0.441,0.172c0.159,0.005,0.32-0.051,0.44-0.172l2.25-2.25\nC19.539,10.225,19.539,9.845,19.305,9.61z M10.288,15.752c-3.177,0-5.751-2.575-5.751-5.752c0-0.276,0.025-0.547,0.062-0.813\nl1.203,1.203c0.235,0.234,0.615,0.234,0.85,0c0.234-0.235,0.234-0.615,0-0.85l-2.25-2.25C4.281,7.169,4.121,7.114,3.961,7.118\nC3.802,7.114,3.642,7.169,3.52,7.291l-2.824,2.25c-0.234,0.235-0.234,0.615,0,0.85c0.235,0.234,0.615,0.234,0.85,0l1.957-1.559\nC3.435,9.212,3.386,9.6,3.386,10c0,3.812,3.09,6.901,6.902,6.901c2.083,0,3.946-0.927,5.212-2.387l-0.898-0.719\nC13.547,14.992,12.008,15.752,10.288,15.752z',
    'check': 'M9.917,0.875c-5.086,0-9.208,4.123-9.208,9.208c0,5.086,4.123,9.208,9.208,9.208s9.208-4.122,9.208-9.208\nC19.125,4.998,15.003,0.875,9.917,0.875z M9.917,18.141c-4.451,0-8.058-3.607-8.058-8.058s3.607-8.057,8.058-8.057\nc4.449,0,8.057,3.607,8.057,8.057S14.366,18.141,9.917,18.141z M13.851,6.794l-5.373,5.372L5.984,9.672\nc-0.219-0.219-0.575-0.219-0.795,0c-0.219,0.22-0.219,0.575,0,0.794l2.823,2.823c0.02,0.028,0.031,0.059,0.055,0.083\nc0.113,0.113,0.263,0.166,0.411,0.162c0.148,0.004,0.298-0.049,0.411-0.162c0.024-0.024,0.036-0.055,0.055-0.083l5.701-5.7\nc0.219-0.219,0.219-0.575,0-0.794C14.425,6.575,14.069,6.575,13.851,6.794z',
    'x': 'M13.864,6.136c-0.22-0.219-0.576-0.219-0.795,0L10,9.206l-3.07-3.07c-0.219-0.219-0.575-0.219-0.795,0\nc-0.219,0.22-0.219,0.576,0,0.795L9.205,10l-3.07,3.07c-0.219,0.219-0.219,0.574,0,0.794c0.22,0.22,0.576,0.22,0.795,0L10,10.795\nl3.069,3.069c0.219,0.22,0.575,0.22,0.795,0c0.219-0.22,0.219-0.575,0-0.794L10.794,10l3.07-3.07\nC14.083,6.711,14.083,6.355,13.864,6.136z M10,0.792c-5.086,0-9.208,4.123-9.208,9.208c0,5.085,4.123,9.208,9.208,9.208\ns9.208-4.122,9.208-9.208C19.208,4.915,15.086,0.792,10,0.792z M10,18.058c-4.451,0-8.057-3.607-8.057-8.057\nc0-4.451,3.606-8.057,8.057-8.057c4.449,0,8.058,3.606,8.058,8.057C18.058,14.45,14.449,18.058,10,18.058z',
    'manual': 'M4.68,13.716v-0.169H4.554C4.592,13.605,4.639,13.658,4.68,13.716z M11.931,6.465\nc-0.307-0.087-0.623,0.106-0.706,0.432l-1.389,5.484c-0.901,0.084-1.609,0.833-1.609,1.757c0,0.979,0.793,1.773,1.773,1.773\nc0.979,0,1.773-0.794,1.773-1.773c0-0.624-0.324-1.171-0.812-1.486l1.377-5.439C12.422,6.887,12.239,6.552,11.931,6.465z\nM10.591,14.729H9.408v-1.182h1.183V14.729z M15.32,13.716c0.04-0.058,0.087-0.11,0.126-0.169H15.32V13.716z M10,3.497\nc-3.592,0-6.503,2.911-6.503,6.503H4.68c0-2.938,2.382-5.32,5.32-5.32s5.32,2.382,5.32,5.32h1.182\nC16.502,6.408,13.591,3.497,10,3.497z M10,0.542c-5.224,0-9.458,4.234-9.458,9.458c0,5.224,4.234,9.458,9.458,9.458\nc5.224,0,9.458-4.234,9.458-9.458C19.458,4.776,15.224,0.542,10,0.542z M15.32,16.335v0.167h-0.212\nc-1.407,1.107-3.179,1.773-5.108,1.773c-1.93,0-3.701-0.666-5.108-1.773H4.68v-0.167C2.874,14.816,1.724,12.543,1.724,10\nc0-4.571,3.706-8.276,8.276-8.276c4.57,0,8.275,3.706,8.275,8.276C18.275,12.543,17.126,14.816,15.32,16.335z',
    'run': 'M16.76,7.51l-5.199-5.196c-0.234-0.239-0.633-0.066-0.633,0.261v2.534c-0.267-0.035-0.575-0.063-0.881-0.063c-3.813,0-6.915,3.042-6.915,6.783c0,2.516,1.394,4.729,3.729,5.924c0.367,0.189,0.71-0.266,0.451-0.572c-0.678-0.793-1.008-1.645-1.008-2.602c0-2.348,1.93-4.258,4.303-4.258c0.108,0,0.215,0.003,0.321,0.011v2.634c0,0.326,0.398,0.5,0.633,0.262l5.199-5.193C16.906,7.891,16.906,7.652,16.76,7.51 M11.672,12.068V9.995c0-0.185-0.137-0.341-0.318-0.367c-0.219-0.032-0.49-0.05-0.747-0.05c-2.78,0-5.046,2.241-5.046,5c0,0.557,0.099,1.092,0.292,1.602c-1.261-1.111-1.979-2.656-1.979-4.352c0-3.331,2.77-6.041,6.172-6.041c0.438,0,0.886,0.067,1.184,0.123c0.231,0.043,0.441-0.134,0.441-0.366V3.472l4.301,4.3L11.672,12.068z',
    'help': "M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"
};
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Classes and Constants
var editor = ace.edit("editor");

var Output = function Output(status, message, val) {
    _classCallCheck(this, Output);

    this.status = status;
    this.message = message;
    this.val = val;
};

// The enums refer to the different states of Output's Status

var ERROR = 0;
var FAILURE = 1;
var SUCCESS = 2;

/*

parseInput

-> Output

This function grabs the code from the editor and parses it if possible.

*/

function parseInput() {

    var text = editor.getValue();

    try {

        var parsed = esprima.parse(text);
        return new Output(SUCCESS, 'The tree was correctly parsed', parsed);
    } catch (err) {
        return new Output(ERROR, err, null);
    }
}

/*

runFunction

String -> Function -> Output -> Output

Takes the name of the function and a parsed tree through input

*/

function runFunction(functionName, func, input) {

    var status = input.status;

    if (status === ERROR) return input;

    var output = func(input.val.body, getInputFromWordList(functionName));

    if (functionName === 'structure') {

        if (output) {
            return new Output(SUCCESS, 'Hooray! The structure is correct!', null);
        } else {
            return new Output(FAILURE, 'The structure was not correct :(', null);
        }
    }

    var bool = output[0];
    var value = output[1];

    if (bool) return new Output(SUCCESS, 'Hooray! The ' + functionName + ' test passed!', null);

    var asString = function () {
        if (functionName === 'white') {
            return setToString(value);
        } else {
            return value;
        }
    }();
    console.log("asString", asString);

    return new Output(FAILURE, asString, null);
}

/*
getInputFromWordList

Grabs words from word list div.
*/

function getInputFromWordList(name) {

    var wordList = document.getElementById(name + '-word-list');
    var children = [].slice.call(wordList.children);

    if (!children) return [];

    return children.map(function (x) {
        return x.innerHTML;
    });
}

/* 
run

String -> Output -> List <Output>

Runs an api call for specific function
*/
function run(name, output) {

    var words = getInputFromWordList(name);

    if (!words) return '';

    whichFunction = {
        'white': whiteList,
        'black': blackList,
        'structure': generalStructure
    }[name];

    return runFunction(name, whichFunction, output);
}
/*
runAllThree

Runs an api call for all three functions.
*/

function runAllThree() {

    var names = ['white', 'black', 'structure'];
    var treeOutput = parseInput();

    var x = names.map(function (x) {
        return run(x, treeOutput);
    });
    return x;
}
'use strict';

/*

getChildren

Node (Not Null) -> List <Node>

Accesses the children of a node.

We are only looking at the 'rough structure' of 
the program, so literal values are ignored. For example the program
will not know the difference between var x = 10 and var x = 20.
They both just look like variable declarations.

*/

function getChildren(node) {

    // The node names in exclude correspond to literal values so we ignore them

    var exclude = new Set(['expression', 'generator', 'type', 'kind', 'value', 'name', 'id', 'raw', 'label', 'operator', 'test']);

    // Push all the children of the node onto a list

    var acc = [];

    for (var key in node) {
        if (!exclude.has(key)) {
            if (node[key] != null) {
                acc.push(node[key]);
            }
        }
    }

    // Flatten all the children of the node

    return [].concat.apply([], acc);
}

/*

enqueueChildren 

Queue <Node (Not Null) > -> List <Node> -> Void

This takes a Queue<Node> and <List> Node and enqueues all children onto the queue

*/

function enqueueChildren(queue, children) {
    var len = children.length;
    for (var i = 0; i < len; i++) {
        queue.push(children[i]);
    }
}

/*

blackList

Parsed Tree -> List <String> -> <Boolean, Null | String>

This takes a tree and list of node types, it returns false if any of
those node types appear in the tree.

This is bfs that terminates when a prohibited value has been encountered.

*/

function blackList(tree, blackList) {

    if (!blackList.length) return [true, null];

    var blackListSet = new Set(blackList);
    var q = tree.slice();

    // When the queue is empty we know that
    // we have succesfully traversed all nodes
    // without encountering a black listed value

    while (q.length) {

        var node = q.shift();

        if (blackListSet.has(node.type)) {
            return [false, node.type];
        }

        var children = getChildren(node);

        if (children) {
            enqueueChildren(q, children);
        }
    }

    return [true, null];
}

/*

whiteList

This takes a tree and list of node types, it returns true if ALL
those node types appear in the tree, otherwise it returns false.

Parsed Tree -> List <String> -> <Boolean, Set <String>>

This is bfs that terminates when all desired values have been encountered,

*/

function whiteList(tree, whiteList) {

    if (!whiteList.length) return [true, null];

    var whiteListSet = new Set(whiteList);
    var q = tree.slice();

    // When every element has been removed from
    // whiteListSet we have seen every single
    // value we have wanted to and can return true

    while (q.length && whiteListSet.size) {

        var node = q.shift();

        whiteListSet.delete(node.type);

        var children = getChildren(node);

        if (children) {
            enqueueChildren(q, children);
        }
    }

    return [whiteListSet.size === 0, whiteListSet];
}

/*

removeInOrder

List <Any> -> Any -> Void


Takes a list A and value B, if the head of list A is equal to B.
It mutates A by removing the head.

*/

function removeInOrder(l, value) {

    if (!l) return;

    var first = l[0];
    if (value === first) {
        l.shift();
    }
}

/*

generalStructure

Parsed Tree -> List String -> Boolean

Traverses entire tree looking for values in 'structures' parameters
each time a value is found it is shifted off the list. If the list is 
ever empty this means that all values have been seen and you can return.

*/

function generalStructure(tree, structures) {

    function f(root, remaining) {

        if (!remaining.length) {
            return true;
        }

        if (!root) {
            return false;
        }

        // Create a copy of the list to avoid
        // weird memory, pointer problems

        var remainingPrime = remaining.slice();

        if (root.type) {
            removeInOrder(remainingPrime, root.type);
        }

        var children = getChildren(root);

        if (!children) {
            return remaining.length === 0;
        }

        for (var i = 0; i < children.length; i++) {
            if (f(children[i], remainingPrime)) {
                return true;
            }
        }
        return false;
    }

    return f(tree, structures);
}
'use strict';

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
    };
}

var globalState = generateGlobalState();

function createCheckMacro(name) {
    var check = createSvg(svgDict.check);
    check.onmouseover = function () {
        showFeedback(globalState[name]);
    };
    check.onmouseout = removeFeedback;
    return check;
}

function createXMacro(name) {

    var x = createSvg(svgDict.x);

    x.onmouseover = function () {
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

    var doc = document;

    // create Form that will contain everything

    var outerForm = doc.createElement('form');
    attrDict(outerForm, {
        'class': 'outer-form',
        'id': 'outer-form-id'
    });

    // create three word units

    var values = ['white', 'black', 'structure'];

    var units = values.map(createWordUnit);

    // append word units to form

    for (var i = 0; i < units.length; i++) {
        outerForm.appendChild(units[i]);
    }

    // append form to dom

    var wordsOuterContainer = doc.getElementById('words-outer-container');
    wordsOuterContainer.appendChild(outerForm);
}

/*

createWord Unit

String -> Dom Element

This creates the input/display corresponding to one unit. Where a unit is black, white or structure.

*/

function createWordUnit(type) {

    // create Reference to document

    var doc = document;

    // Initialize outer container div

    var containerDiv = createDiv();

    attrDict(containerDiv, {
        'class': 'word-unit',
        'id': type + '-unit'
    });

    // Create Checkmark

    var checkMark = createCheckMacro(type);

    // Initialize container for Span and Input
    var outerContainerSpan = createDiv();
    attrDict(outerContainerSpan, {
        'class': 'outer-container-span',
        'id': type + '-outer-container-span'
    });

    // Initialize Inner Container Span

    var containerSpan = createSpan();
    attrDict(containerSpan, {
        'class': 'word-span',
        'id': type + '-span'
    });

    containerSpan.innerHTML = type;

    // Initialize Input Bar

    var inputBar = doc.createElement('input');
    attrDict(inputBar, {
        'class': 'word-input-bar',
        'type': 'text',
        'id': type + '-word-input-bar'
    });

    var on = true;
    inputBar.onkeyup = function (e) {

        var which = e.which || e.keyCode;

        var len = getInputFromWordList(type).length;

        if (!(len < globalState.wordLineLimit)) {
            (function () {
                var style = inputBar.getAttribute('style');
                var stylePrime = 'color:#e74c3c';

                inputBar.setAttribute('style', stylePrime);
            })();
            return;
        } else {
            inputBar.setAttribute('style', '');
        }

        if (which === 13 && on) {
            if (addWordToList(type, inputBar.value)) {
                inputBar.value = '';
                main();

                return;
            } else {
                (function () {

                    var style = inputBar.getAttribute('style');
                    var stylePrime = 'color:red';

                    inputBar.setAttribute('style', stylePrime);
                    on = false;

                    setTimeout(function () {
                        on = true;
                        inputBar.setAttribute('style', style);
                    }, globalState.wrongInputTimeout);
                })();
            }
        }
    };

    // Initialize Word List Container

    var wordListContainer = createDiv();

    attrDict(wordListContainer, {
        'class': 'word-list',
        'id': type + '-word-list'
    });

    // Append divs in correct order to one another

    outerContainerSpan.appendChild(containerSpan);
    outerContainerSpan.appendChild(inputBar);

    var order = [checkMark, outerContainerSpan, wordListContainer];

    for (var i = 0; i < order.length; i++) {
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
    var span = createSpan();
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

    if (!validNodeNames.has(word)) {
        return false;
    }

    var list = document.getElementById(name + '-word-list');

    if (list.children.length > 5) {
        var first = list.children[0];
        list.removeChild(first);
    }
    var wordDiv = createWord(word);
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

    var doc = document;

    // Initialize Form that will contain buttons

    var outerForm = createDiv();
    outerForm.setAttribute('id', 'buttons-container');

    // Initialize three buttons

    var values = ['reset', 'manual', 'run'];

    function makeButton(name) {

        console.log(name);
        var svg = createSvg(svgDict[name]);
        svg.setAttribute('id', name + '-button');

        var feedbackString = {
            'reset': 'Click to clear all words and start over.',
            'run': 'Click to manually run all tests.',
            'manual': 'Turn off automatic tests. This might be a good idea if things are slow.'
        }[name];

        svg.onmouseover = function () {

            showFeedback(feedbackString);
        };

        svg.onmouseout = removeFeedback;

        svg.onclick = {
            'reset': reset,
            'run': main,
            'manual': toggleManual
        }[name];

        return svg;
    }

    var buttons = values.map(makeButton);

    // Append buttons to Form

    for (var i = 0; i < buttons.length; i++) {
        outerForm.appendChild(buttons[i]);
    }

    // Append form to dom

    var container = doc.getElementById('buttons');
    container.appendChild(outerForm);
}

/*

reset

Removes all words from word list.

*/

function reset() {

    globalState = generateGlobalState();

    function resetOne(name) {
        var wordList = document.getElementById(name + '-word-list');
        var input = document.getElementById(name + '-word-input-bar');

        input.setAttribute('style', '');

        while (wordList.firstChild) {
            wordList.removeChild(wordList.firstChild);
        }

        var mark = createCheckMacro(name);

        replaceNodeWith(name, mark);
    };

    var names = ['white', 'black', 'structure'];

    for (var i = 0; i < names.length; i++) {
        resetOne(names[i]);
    }
}

/*
showFeedback

String-> 

Sets the feedback div equal to the string
*/

function showFeedback(string) {
    var feedback = document.getElementById('feedback');
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
    var div = document.getElementById(name + '-unit');
    div.replaceChild(newNode, div.children[0]);
}

/* 
toggleManual

Changes manual color from green to black and vice versa

*/

function toggleManual() {

    var manual = globalState['manual'];

    var button = document.getElementById('manual-button');
    var newStyle = manual ? '' : 'background:black;';

    button.setAttribute('style', newStyle);

    globalState['manual'] = !manual;
}

/*

main

This function runs three api calls on text area input. Then 
changes state to reflect whether those api calls where succesful.

*/

function main() {

    var values = runAllThree();
    var names = ['white', 'black', 'structure'];

    for (var i = 0; i < values.length; i++) {

        var value = values[i];
        var name = names[i];

        var status = value.status;
        var message = value.message;

        globalState[name] = message;

        var mark = status == ERROR || status == FAILURE ? createXMacro(name) : createCheckMacro(name);

        replaceNodeWith(name, mark);
    }
}

/*
debounced

debounced main function that is run on change in type or when a new input is added.
This function times how long it takes to run and adjusts the debounce time accordiningly.
If manual is set to true this functionality is turned off.

*/

var debounced = debounce(function () {

    var start = performance.now();

    if (!globalState.manual) {
        main();
    }

    var end = performance.now();

    var difference = end - start;

    if (difference > 10) {
        globalState.debounceTimeout = 1000;
    } else if (difference > 20) {
        globalState.debounceTimeout = 1500;
    } else if (difference > 50) {
        if (!globalState.manual) {
            toggleManual();
            alert("You have a lot of code which is slowing down validation. The system is turning off auto for better performance.");
        }
    }
}, globalState.debounceTimeout);

function showInstructions() {
    var div = document.getElementById('instructions');
    div.setAttribute('style', '');
}

function hideInstructions() {
    var div = document.getElementById('instructions');
    div.setAttribute('style', 'display:none');
}

function help() {

    var container = document.getElementById('help');
    var svg = createSvg(svgDict.help);
    svg.onmouseover = showInstructions;
    svg.onmouseout = hideInstructions;

    container.appendChild(svg);
}

function createQuestion(q, a) {

    var outerContainer = createDiv();
    outerContainer.setAttribute('class', 'question-container');

    var question = createDiv();
    question.setAttribute('class', 'question');
    question.innerHTML = q;

    var answer = createDiv();
    answer.setAttribute('class', 'answer');
    answer.innerHTML = a;

    outerContainer.appendChild(question);
    outerContainer.appendChild(answer);

    return outerContainer;
}

var questions = [['What does this do?', 'This code editor can help determine if your code conforms to certain expectations.'], ['What are these expectations?', 'A program is a series of instructions. These instructions can be structured in many different ways. We want to you structure your code based on certain constraints.'], ['What does \'white list\' do?', 'For white list you must have all the structures listed some where in your code. E.g. IfStatement -> if(true){} PASSES'], ['What does \'black list\' do?', 'For \'black list\' you may not have any of the structures listed any where in your code. IfStatement -> while(true){} PASSES'], ['What does \'structure\' do?', 'For the structure you must have the structures listed in nested order. E.g. IfStatement WhileStatement -> if(true){while(true){}} PASSES'], ['How do I run tests?', 'Type a valid Javascript node name into any of the input bars and hit enter. When you are typing the tests will automatically be run'], ['What are Javascript node names?', 'These node names come from a defined standard. For starters try ForStatement, IfStatement, WhileStatement or VariableDeclaration. (Case sensitive)'], ['The code editor is running super slow what do I do?', 'The editor will try and adjust to account for slow speeds, but you still think it is slow. Put it into manual mode and run the tests by hand.']];

function createQuestions() {

    var qs = questions.map(function (x) {
        return createQuestion(x[0], x[1]);
    });

    var div = document.getElementById('faq');

    for (var i = 0; i < qs.length; i++) {
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
    editor.getSession().on('change', function () {
        debounced();
    });
}

function init() {
    initializeEditor();
    createForm();
    createButtons();
    help();
    console.log("Note you might be seeing some error about javascript-worker missing. This is due to minification and is harmless. Please ignore.");
}

init();