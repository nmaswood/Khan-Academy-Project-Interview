function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

// Test Utility Functions

function testIsArray(){

	let a = [1,2,3];
	let b = [];
	let c = 'c';
	let d = {};
	let e = 1234123;

	// True
	assert(isArray(a));
	assert(isArray(b));

	// False
	assert(!isArray(c));
	assert(!isArray(d));
	assert(!isArray(e));
};


function testXor(){

	// True
	assert(xor(false,true));
	assert(xor(true,false));

	// False
	assert(!xor(true,true));
	assert(!xor(false,false));
};


testIsArray();
testXor();

// Test Core API

const strings = {

	'null': '',
	'dict': `var x = {};x[1]=1;`,
	'if': `if(true){console.log('true')}`,
	'expressive': `var x = (function(){return 1;})()`,
	'literal': '1',
	'expression': '1 + 1',
	'while': 'while(true){}',

	'whilefor': `
		while(true){
			for (let i = 0; i < y; i++){}
		}`,

	'variable': `
		let x = 10;
		const y = x;
		var z = x + y;
		`,

	'block': '{}',
	'function': `function hello(){
		console.log ('foo bar');
	}`,
	'break': 'while(true){break;}',
	'continue': 'while(true){continue;}',

	'fib': `
		function fib(x) {
			return x == 1 || x == 0? x : f(x - 1) + f(x -2);
		}`,

	'sum':`
	  	var N = 100;
	  	var acc = 0;
	  	for (let i = 0; i < N; i++){
	  		acc += i;
	  	}
	  	console.log(acc);`,

	'if':`
		if(true){
			console.log ("yea that was true");
		}`
};

const vals = {};

function init() {

	for (let key in strings){
		vals[key] = esprima.parse(strings[key]).body;
	}
};

init();

function testBlackList(){

	// No blacklist violations

	assert(blackList(vals.null,listToEsprima(['while','for'])));
	assert(blackList(vals.literal, listToEsprima(['var','while'])));


	assert(blackList(vals.dict, listToEsprima(['for','while'])));
	assert(blackList(vals.if, listToEsprima(['return','while'])));
	assert(blackList(vals.expressive, listToEsprima(['for','while'])));

	assert(blackList(vals.expression, listToEsprima(['var','for','if'])));
	assert(blackList(vals.while, listToEsprima(['return','for', 'expression'])));

	assert(blackList(vals.block, listToEsprima(['var'])));
	assert(blackList(vals.function, listToEsprima(['while','for'])));
	assert(blackList(vals.break, listToEsprima(['var','for'])));

	assert(blackList(vals.continue, listToEsprima(['return','for'])));
	assert(blackList(vals.fib, listToEsprima(['var','while'])));

	assert(blackList(vals.sum, listToEsprima(['while','continue'])));
	assert(!blackList(vals.literal, ['ExpressionStatement']));
	assert(!blackList(vals.expression, listToEsprima(['expression'])));
	assert(!blackList(vals.block, listToEsprima(['block'])));
	assert(!blackList(vals.function, listToEsprima(['function','for'])));

	assert(!blackList(vals.dict, listToEsprima(['for','dict'])));
	assert(!blackList(vals.if, listToEsprima(['if','while'])));
	assert(!blackList(vals.expressive, listToEsprima(['expressive','while'])));

	assert(!blackList(vals.break, listToEsprima(['var','break'])));
	assert(!blackList(vals.continue, listToEsprima(['continue','for'])));
	assert(!blackList(vals.fib, listToEsprima(['var','return','function'])));
	assert(!blackList(vals.sum, listToEsprima(['var','expression'])));
	
};

//testBlackList();

function testwhiteList(){

	// No whitelist violations

	assert(whiteList(vals.null,listToEsprima([])));
	assert(whiteList(vals.literal, listToEsprima(['expression'])));
	assert(whiteList(vals.while, listToEsprima(['while'])));
	assert(whiteList(vals.whilefor, listToEsprima(['while','for'])));

	assert(whiteList(vals.block, listToEsprima(['block'])));
	assert(whiteList(vals.function, listToEsprima(['function'])));
	assert(whiteList(vals.break, listToEsprima(['break'])));

	assert(whiteList(vals.continue, listToEsprima(['continue'])));

	assert(whiteList(vals.fib, listToEsprima(['return','cond'])));

	assert(whiteList(vals.sum, listToEsprima(['var','for'])));

	// whiteList Violations

	assert(!whiteList(vals.literal, ['expression', 'var']));
	assert(!whiteList(vals.expression, listToEsprima(['while'])));
	assert(!whiteList(vals.block, listToEsprima(['break'])));
	assert(!whiteList(vals.function, listToEsprima(['function','for', 'continue'])));

	assert(!whiteList(vals.break, listToEsprima(['var','while', 'break', 'for', 'if'])));
	assert(!whiteList(vals.continue, listToEsprima(['continue','for', 'var'])));
	assert(!whiteList(vals.fib, listToEsprima(['var','return', 'break'])));
	assert(!whiteList(vals.sum, listToEsprima(['var','expression', 'continue'])));
};

//testwhiteList();

const a = new Tree(convertToEsprima('function'));
const b = new Tree(convertToEsprima('block'));
const c = new Tree(convertToEsprima('while'));
const d = new Tree(convertToEsprima('block'));

c.body = d
b.body = [c]
a.body = b

const simple = esprima.parse(`
	function hello (){
		while (true){
		}
	}`);

res = matchTree(simple.body, [a])
console.log (res)