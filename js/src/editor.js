/*

initializeEditor

-> 

This function intializes the ace coder environment
with the dreamweaver/javascript theme.

*/

function initializeEditor(){
	const editor = ace.edit("editor");
	editor.setTheme("ace/theme/dreamweaver");
	editor.getSession().setMode("ace/mode/javascript");
};

initializeEditor();