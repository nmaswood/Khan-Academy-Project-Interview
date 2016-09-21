function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

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

testBlackList();

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

testwhiteList();

function testMatchTree(){

	// Test 1

	const simpleFunction = esprima.parse(`function hello (){}`);

	function simpleFunctionTree(){

		return new Tree(convertToEsprima('function'));
	}

	//assert(matchTree(simpleFunction.body, simpleFunctionTree()));

	// Test 2

	const simpleVar = esprima.parse(`var x = 10;`);

	function simpleVarTree(){

		return new Tree(convertToEsprima('var'));
	}

	//assert(matchTree(simpleVar.body, simpleVarTree()));

	const functionWhile = esprima.parse(`
			function hello (){
			while (true){
			}
		}`);


	function functionWhileTree() {

		const a = new Tree(convertToEsprima('function'));
		const b = new Tree(convertToEsprima('block'));
		const c = new Tree(convertToEsprima('while'));
		const d = new Tree(convertToEsprima('block'));

		c.children = [d]
		b.children = [c]
		a.children = [b]

		return a
	}

	//assert(matchTree(functionWhile.body, functionWhileTree()));

	// Test 4

	const functionIf = esprima.parse(`
			function hello (){
			if (true){
			}
		}`);

	function functionIfTree() {

		const a = new Tree(convertToEsprima('function'));
		const b = new Tree(convertToEsprima('block'));
		const c = new Tree(convertToEsprima('if'));
		const d = new Tree(convertToEsprima('block'));

		c.children = [d]
		b.children = [c]
		a.children = [b]

		return a
	}

	//assert(matchTree(functionIf.body, functionIfTree()));

	// Test 5

	const functionWhileIf = esprima.parse(`
			function hello (){
				while(true){
					if (true){
					}
				}
			}`);

	function functionWhileIfTree() {

		const a = new Tree(convertToEsprima('function'));
		const b = new Tree(convertToEsprima('block'));
		const c = new Tree(convertToEsprima('while'));
		const d = new Tree(convertToEsprima('block'));
		const e = new Tree(convertToEsprima('if'));
		const f = new Tree(convertToEsprima('block'));

		e.children = [f];
		d.children = [e];
		c.children = [d]
		b.children = [c]
		a.children = [b]

		return a
	}

	//assert(matchTree(functionWhileIf.body, functionWhileIfTree()));

	// Test 6

	const functionWhileVarIf = esprima.parse(`
			function hello (){
				while(true){
					const x = true;
					if (x){
						console.log ("hello world");
					}
				}
			}`);

	function functionWhileVarIfTree() {

		const a = new Tree(convertToEsprima('function'));
		const b = new Tree(convertToEsprima('block'));
		const c = new Tree(convertToEsprima('while'));
		const d = new Tree(convertToEsprima('block'));
		const e = new Tree(convertToEsprima('if'));
		const f = new Tree(convertToEsprima('block'));

		const g = new Tree(convertToEsprima('var'));

		e.children = [f];
		d.children = [e];
		c.children = [d, g]
		b.children = [c]
		a.children = [b]

		return a
	}

	//assert(matchTree(functionWhileVarIf.body, functionWhileVarIfTree()));
	
	// Test 7

	const whileIfBreakContinue = esprima.parse(`
			function hello (){
				while(true){
					if (true){
						break;
					} 
					continue;
				}
		}`);

	function whileIfBreakContinueTree() {

		const a = new Tree(convertToEsprima('function'));
		const b = new Tree(convertToEsprima('block'));
		const c = new Tree(convertToEsprima('while'));
		const d = new Tree(convertToEsprima('block'));
		const e = new Tree(convertToEsprima('if'));

		const f = new Tree(convertToEsprima('block'));
		const g = new Tree(convertToEsprima('continue'));


		e.children = [g,f];
		d.children = [e];
		c.children = [d]
		b.children = [c]
		a.children = [b]

		return a
	}

	//assert(matchTree(whileIfBreakContinue.body, whileIfBreakContinueTree()));

	// Test 8

	const varExpressive = esprima.parse(`var x = (function(){return 1;})();`);

	function varExpressiveTree() {

		const a = new Tree(convertToEsprima('var'));
		const b = new Tree(convertToEsprima('VariableDeclarator'));
		const c = new Tree(convertToEsprima('call'));
		const d = new Tree(convertToEsprima('expressive'));
		const e = new Tree(convertToEsprima('block'));
		const f = new Tree(convertToEsprima('return'));
		const g = new Tree(convertToEsprima('literal'));

		e.children = [f,g];
		d.children = [e];
		c.children = [d]
		b.children = [c]
		a.children = [b]

		return a
	}

	assert(matchTree(varExpressive.body, varExpressiveTree()));

	// Test 9

	const functionWhileIfIfWhileWhileIfVarReturn = esprima.parse(`
		function hello()  {
			while(true){
			}
			return x;
		}`);

	function functionWhileIfIfWhileWhileIfVarReturnTree() {

		const a = new Tree(convertToEsprima('function'));

		const b = new Tree(convertToEsprima('block'));

		const c = new Tree(convertToEsprima('while'));

		const d = new Tree(convertToEsprima('return'));

		const e = new Tree(convertToEsprima('block'));

		const f = new Tree(convertToEsprima('Identifier'));

		d.children = [e,f]
		b.children = [c,d]
		a.children = [b]




		return a
	}

	assert(matchTree(functionWhileIfIfWhileWhileIfVarReturn.body, functionWhileIfIfWhileWhileIfVarReturnTree()));

}

testMatchTree();