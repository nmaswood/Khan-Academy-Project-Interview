/*

getChildren

Node (Not Null) -> List <Node>

Accesses the children of a node.


We are only looking at the 'rough structure' of 
the program, so literal values are ignored. For example the program
will not know the difference between var x = 10 and var x = 20.
They both just look like variable declarations.

*/

function getChildren(node){

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

	for (let key in node){
		if (!exclude.has(key)){
			if(node[key] != null){
				acc.push(node[key])
			}
		}
	}

	// Acc is an array of arrays htis 
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

commonNameToFormalName

String -> String

Convert common words like var, block, expression to words the parser is expecting

*/ 

function commonNameToFormalName(x){

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

listCommonNameToFormalName

List <String> -> List <String>

Executes convert to Esprima on every element in list.

*/

function listCommonNameToFormalName(x){
	return x.map(commonNameToFormalName)
}

/*

blackList

Parsed Tree -> List <String> -> Boolean

This takes a tree and list of node types, it returns false if any of
those node types appear in the tree.

This is bfs that terminates when a prohibited value has been encountered.

*/

function blackList(tree, blackList){

	const blackListSet = new Set(blackList);
	const q = tree.slice();

	while (q.length){

		let node = q.shift();

		if (blackListSet.has(node.type)){
			return false;
		}

		let children = getChildren(node)

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

This is bfs that terminates when all desired values have been encountered,

*/

function whiteList(tree, whiteList){

	const whiteListSet = new Set(whiteList);
	const q = tree.slice();

	while (q.length && whiteListSet.size){

		let node = q.shift();

		whiteListSet.delete(node.type);

		let children = getChildren(node)

		if (children){
			enqueueChildren(q, children);
		}
	}

	return whiteListSet.size === 0;
};




/*

removeInOrder

List <Any> -> Any -> Void


Takes a list A and value B, if the head of list A is equal to B.
It mutates A by removing the head.

*/

function removeInOrder(l, value){

	if (!l) return

	const first = l[0];
	if (value === first){
		l.shift()
	}
}

/*

generalStructure

Parsed Tree -> List String -> Boolean

Traverses entire tree looking for values in 'structures' parameters
each time a value is found it is shifted off the list. If the list is 
ever empty this means that all values have been seen and you can return.

*/

function generalStructure(treeOne, structures){

	function f(root, remaining){

		if (!remaining.length){
			return true;
		}

		if (!root){
			return false;
		}

		const remainingPrime = remaining.slice()

		if (root.type){
			removeInOrder(remainingPrime, root.type)
		}

		const children = getChildren(root);

		if (!children){
			return false;
		}

		for (let i = 0; i < children.length; i ++){
			if(f(children[i], remainingPrime)){
				return true;
			}
		}
		return false;
	};

	return f(treeOne, structures);
};

/*

matchTree

Parsed Tree -> Parsed Tree -> Boolean

This walks through two trees at the same time. If at any point these two trees
differ it returns false, if have exactly the same structure it returns true.

*/

function matchTree(treeOne, treeTwo){

	const queueOne = treeOne.slice();
	const queueTwo = treeTwo.slice();

	while (queueOne.length && queueTwo.length){

		let nodeOne = queueOne.shift()
		let nodeTwo = queueTwo.shift()

		if (nodeOne.type !== nodeTwo.type){
			return false;
		}

		let childrenOne = getChildren(nodeOne);
		let childrenTwo = getChildren(nodeTwo);

		if (childrenOne){
			enqueueChildren(queueOne, childrenOne);
		}

		if (childrenTwo){
			enqueueChildren(queueTwo, childrenTwo);
		}
	}

	return queueOne.length === 0 && queueTwo.length === 0;
};
