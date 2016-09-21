/*

This is a implemtnation of a tree data struct,
children is called body, simply because that is what esprima does.

*/

class Tree {

	constructor(root){
		this.root = root;
		this.children = null;
	}
}

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
		'operator',
		'test'])

	const acc = [];

	// Should I sort them so that everything is more predicatable?

	let sorted_keys = Object.keys(node).sort();

	for (let i = 0; i < sorted_keys.length; i++ ){

		let key = sorted_keys[i];

		if (!exclude.has(key)){
			if(node[key] != null){
				acc.push(node[key])
			}
		}

	}

	/*
	for (let val in node){
		if (!exclude.has(val)){
			if (node[val] != null){
				acc.push(node[val])
			}
		}
	}
	*/

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
		'dict': 'ObjectExpression',
		'literal': 'Literal',
		'VariableDeclarator': 'VariableDeclarator',
		'call': 'CallExpression',
		'VariableDeclarator': 'VariableDeclarator',
		'Identifier': 'Identifier'
	}

	if (x in d){
		return d[x]
	}

	throw `Key: ${x} not present`;
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

		if (children){
			enqueueChildren(q, children);
		}
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

	const whiteListSet = new Set(whiteList);
	const q = tree.slice();

	while (q.length && whiteListSet.size){

		let node = q.shift();

		whiteListSet.delete(node.type);

		let children = esprimaChildren(node)

		if (children){
			enqueueChildren(q, children);
		}
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
	const queueTwo = [referenceTree]

	while (queueOne.length && queueTwo.length){

		let nodeOne = queueOne.shift()
		let nodeTwo = queueTwo.shift()

		/*
			console.log(nodeOne);
			console.log(nodeTwo);
			console.log('-----')
		*/

		if (nodeOne.type !== nodeTwo.root){
			return false;
		}

		let childrenOne = esprimaChildren(nodeOne);
		let childrenTwo = nodeTwo.children;

		if (childrenOne){
			enqueueChildren(queueOne, childrenOne);
		}

		if (childrenTwo){
			enqueueChildren(queueTwo, childrenTwo);
		}
	}

	/*
	console.log(queueOne);
	console.log(queueTwo);
	*/

	return queueOne.length === 0 && queueTwo.length === 0;
};