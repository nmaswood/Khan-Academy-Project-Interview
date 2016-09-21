/*

bfs

This is implementation of breadth first search that returns unique nodes visited.

Tree <Node> ->  Set <String>

*/

function bfs(tree){

	const values = new Set();
	const q = tree;

	while (q.length){

		let node = q.shift();
		values.add(node.type);
		let children = esprimaChildren(node)
		if (!children) continue;

		if (!isArray(children)){

			values.add(children.type);
			children = children.body;
		}

		enqueueChildren(q, children);
	}

	return values;
};
