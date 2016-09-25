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

    // The node names in exclude correspond to literal values so we ignore them

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
        'test']);

    // Push all the children of the node onto a list

    const acc = [];

    for (let key in node){
        if (!exclude.has(key)){
            if(node[key] != null){
                acc.push(node[key]);
            }
        }
    }

    // Flatten all the children of the node

    return [].concat.apply([], acc);
}

/*

enqueueChildren 

Queue <Node (Not Null)> -> List <Node> -> Void

This takes a Queue<Node> and <List> Node and enqueues all children onto the queue

*/

function enqueueChildren(queue, children){
    var len = children.length;
    for (let i = 0; i < len;i++){
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

function blackList(tree, blackList){

    if (!blackList.length) return [true, null];

    const blackListSet = new Set(blackList);
    const q = tree.slice();

    // When the queue is empty we know that
    // we have succesfully traversed all nodes
    // without encountering a black listed value

    while (q.length){

        let node = q.shift();

        if (blackListSet.has(node.type)){
            return [false, node.type];
        }

        let children = getChildren(node);

        if (children){
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

function whiteList(tree, whiteList){

    if (!whiteList.length) return [true, null];

    const whiteListSet = new Set(whiteList);
    const q = tree.slice();

    // When every element has been removed from
    // whiteListSet we have seen every single
    // value we have wanted to and can return true

    while (q.length && whiteListSet.size){

        let node = q.shift();

        whiteListSet.delete(node.type);

        let children = getChildren(node);

        if (children){
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

function removeInOrder(l, value){

    if (!l) return;

    const first = l[0];
    if (value === first){
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

function generalStructure(tree, structures){

    function f(root, remaining){

        if (!remaining.length){
            return true;
        }

        if (!root){
            return false;
        }

        // Create a copy of the list to avoid
        // weird memory, pointer problems

        const remainingPrime = remaining.slice();

        if (root.type){
            removeInOrder(remainingPrime, root.type);
        }

        const children = getChildren(root);

        if (!children){
            return remaining.length === 0;
        }

        for (let i = 0; i < children.length; i ++){
            if(f(children[i], remainingPrime)){
                return true;
            }
        }
        return false;
    }

    return f(tree, structures);
}