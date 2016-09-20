function isArray(x){
	return x.constructor === Array;
}

function esprimaChildren(node){

	return node.body || node.consequent;
}

function enqueueChildren(queue, children){
	var len = children.length;
	for (let i = 0; i < len;i++){
		queue.push(children[i])
	}
}

function bfs(tree){

	const values = new Set();

	const q = tree;
	console.log(q);

	while (q.length){

		let node = q.shift();
		values.add(node.type);
		let children = esprimaChildren(node)
		if (!children) continue;

		if (!isArray(children)){
			children = children.body;
		}

		enqueueChildren(q, children);
	}
	console.log(values);
};

var syntax = esprima.parse(`
	function hello (){
		let x = 10;
		while(true)
		{
			if(true){
				var x = [1,2,3];
				for (let i = 0; i < 3; i++){
					x++;
				}
			}
		}
		return;
	}

	`);

console.log (syntax)
bfs(syntax.body);
