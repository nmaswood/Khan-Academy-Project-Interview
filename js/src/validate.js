/*

This is a implemtnation of a tree data struct,
children is called body, simply because that is what esprima does.

*/

class Tree {

	constructor(type){
		this.type = type;
		this.body = [];
	}

}

/*

isArray

Any -> Boolean

Takes an object and returns true if it is an instance of an array.

*/ 

function isArray(x){
	return x.constructor === Array;
};

/*
xor 

Boolean -> Boolean -> Boolean

Does the following:

true -> true -> false
false -> true -> true
true -> false -> true
true -> true -> false
*/


function xor(x,y){

	return !x !== !y;
};

/*
esprimaChildren

Node (Not Null) -> List <Node>

Accesses the children of a node. 
*/

function esprimaChildren(node){

	let exclude = new Set([
		'expression',
		'generator',
		'type',
		'kind',
		'value',
		'name',
		'id',
		'raw',
		'label',
		'operator'])

	const acc = [];

	for (let val in node){
		if (!exclude.has(val)){
			if (node[val] != null){
				acc.push(node[val])
			}
		}
	}

	// This flattens the list 
	return [].concat.apply([], acc);
};

/*

enqueueChildren 

Queue <Node (Not Null) > -> List <Node> -> Void

This takes a Queue<Node> and <List> Node and enqueues all children onto the queue

*/

function enqueueChildren(queue, children){
	var len = children.length;
	for (let i = 0; i < len;i++){
		queue.push(children[i])
	}
};
/*

convertToEsprima

String -> String

Convert common words like var, block, expression to words Esprima is expecting

*/ 

function convertToEsprima(x){

	const d = {
		'function': 'FunctionDeclaration',
		'block': 'BlockStatement',
		'var': 'VariableDeclaration',
		'while':'WhileStatement',
		'return':'ReturnStatement',
		'if': 'IfStatement',
		'for':'ForStatement',
		'continue': 'ContinueStatement',
		'expression': 'ExpressionStatement',
		'expressive': 'FunctionExpression',
		'break': 'BreakStatement',
		'cond': 'ConditionalExpression',
		'dict': 'ObjectExpression'
	}

	if (x in d){
		return d[x]
	}

	throw `Key: ${x}not present`;
}

/*

listToEsprima

List <String> -> List <String>

Executes convert to Esprima on every element in list.

*/

function listToEsprima(x){
	return x.map(convertToEsprima)
}

/*

blackList

This takes a tree and list of node types, it returns false if any of
those node types appear in the tree.

Parsed Tree -> List <String> -> Boolean


*/

function blackList(tree, blackList){

	const blackListSet = new Set(blackList);
	const q = tree.slice();

	while (q.length){

		let node = q.shift();

		if (blackListSet.has(node.type)){
			return false;
		}

		let children = esprimaChildren(node)

		if (!children) continue;

		enqueueChildren(q, children);
	}

	return true;
};

/*

whiteList

This takes a tree and list of node types, it returns true if ALL
those node types appear in the tree, otherwise it returns false.

Parsed Tree -> List <String> -> Boolean

*/

function whiteList(tree, whiteList){

	console.log(tree);
	const whiteListSet = new Set(whiteList);
	const q = tree.slice();

	while (q.length && whiteListSet.size){

		let node = q.shift();

		whiteListSet.delete(node.type);

		let children = esprimaChildren(node)

		if (!children) continue;

		enqueueChildren(q, children);
	}

	return whiteListSet.size === 0;
};

/*

matchTree

Parsed Tree -> Manually Constrcuted Tree -> Boolean

This walks through two trees at the same time. If at any point these two trees
differ it returns false, if have exactly the same structure it returns true.

*/

function matchTree(tree, referenceTree){

	const queueOne = tree.slice();
	const queueTwo = referenceTree;

	while (queueOne.length && queueTwo.length){

		let [nodeOne,nodeTwo]  = [queueOne.shift(), queueTwo.shift()];

		if (nodeOne.type !== nodeTwo.type){
			return false;
		}

		let [childrenOne, childrenTwo] = [esprimaChildren(nodeOne), nodeTwo.body]

		if (!childrenOne && !childrenTwo){
			continue;
		}

		enqueueChildren(queueOne, childrenOne);
		enqueueChildren(queueTwo, childrenTwo);
	}
	return queueOne.length === 0 && queueTwo.length === 0;
};