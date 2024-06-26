let ketikan = document.getElementById("inputSoal");
let copyKetikan = "";

window.addEventListener("keypress", function (event) { //tekan enter untuk cek Kebenaran
	if (event.key === "Enter") {
		event.preventDefault();
		construct();
	}
});
function gantiSymbol(){
	copyKetikan = ketikan.value;
	for(let i = 0; i<copyKetikan.length;i++){
		if(copyKetikan.indexOf('→')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('→')),'i');
		}
		if(copyKetikan.indexOf('↔')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('↔')),'b');
		}
		if(copyKetikan.indexOf('v')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('v')),'o');
		}
		if(copyKetikan.indexOf('^')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('^')),'a');
		}
		if(copyKetikan.indexOf('¬')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('¬')),'n');
		}
	}
}
function masukkanKeInput(input) {
	if (input == "hapus") {
		ketikan.value = ketikan.value.slice(0, -1);
	}
	else if (input == "clear") {
		ketikan.value = "";
		document.getElementById("outputsTable").style.display = "none";
	}
	else {
		ketikan.value += input;
	}
	copyKetikan = ketikan.value;
	for(let i = 0; i<copyKetikan.length;i++){
		if(copyKetikan.indexOf('→')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('→')),'i');
		}
		if(copyKetikan.indexOf('↔')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('↔')),'b');
		}
		if(copyKetikan.indexOf('v')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('v')),'o');
		}
		if(copyKetikan.indexOf('^')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('^')),'a');
		}
		if(copyKetikan.indexOf('¬')>=0){
			copyKetikan = copyKetikan.replace(copyKetikan.charAt(copyKetikan.indexOf('¬')),'n');
		}
	}
	console.log(ketikan.value)
	console.log(copyKetikan)
};

function displayMode() {
	if (document.getElementById('display').value === 'false') {
		document.getElementById('display').value = 'true'
	} else { document.getElementById('display').value = 'false' }
	construct();
}
function trueMode() {
	if (document.getElementById('trues').value === 'tf') {
		document.getElementById('trues').value = 'oz'
	} else { document.getElementById('trues').value = 'tf' }
	construct();
}
/*************************************************************************************/

function htmlchar(c, tv, cs) {
	switch (c) {
		case true: // return char based on selected truth value style
			switch (tv) {
				case 'tb': return '&#8868;';
				case 'tf': return 'T';
				case 'oz': return '1';
			}
		case false: // return char based on selected truth value style
			switch (tv) {
				case 'tb': return '&perp;';
				case 'tf': return 'F';
				case 'oz': return '0';
			}
		case 'n':  // return connective chars based on selected cset
			switch (cs) {
				case 'cs1': return '&not;';
				default: return 'n';
			}
		case 'a':
			switch (cs) {
				case 'cs1': return '&and;';
				default: return '&amp;';
			}
		case 'o': return '&or;';
		case 'i':
		// case '→':
			switch (cs) {
				case 'cs3': return '&sup;';
				default: return '&rarr;';
			}
		case 'b':
			switch (cs) {
				case 'cs3': return '&equiv;';
				default: return '&harr;';
			}
		case '|': return '|';
		case '#': return '&perp;'
		default: return c;
	}
}


/*************************************************************************************/

// main construction function
function construct() {
	var formulas = copyKetikan.replace(/ /g, '');// remove whitespace
	if (formulas == '') { 
		document.getElementById("outputsTable").style.display = "none";
		return alert("Ekspresi Logika Tidak Boleh Kosong"); };
	// if(formulas.length<30){return alert("Formula Kurang! Harus lebih dari 30 Characters");}
	var r = badchar(formulas);
	if (r >= 0) { return alert("Ups!, Input Character Tidak ditemukan: " + formulas[r]); };

	formulas = formulas.split(','); // create an array of formulas
	var trees = formulas.map(parse); // create an array of parse trees
	for (var i = 0; i < trees.length; i++) { // adds outermost parentheses if needed
		if (trees[i].length == 0) {
			formulas[i] = '(' + formulas[i] + ')';
			trees[i] = parse(formulas[i]);
		}
	}
	if (trees.filter(function (a) { return a.length == 0; }).length > 0) { // checks if any formulas are still malformed
		return alert("Syntax Error");
	}
	var tv = document.getElementById(`trues`).value //bisa ganti oz -> untuk nyatakan format 1/0 PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
	var cs = `cs1`;
	var displayAllorAnswer = document.getElementById('display').value;
	var checkDis = false;
	if (displayAllorAnswer === 'false') {
		checkDis = false;
	} else { checkDis = true; }

	var table = mkTable(formulas, trees);

	// var displayAllorAnswer, jika true tampil hasil saja, jika false tampil semua
	var htmltable = htmlTable(table, trees, checkDis, tv, cs);

	document.getElementById('tableHasil').innerHTML = htmltable;
	var mcCells = document.querySelectorAll('td.mc');
	
	if(document.getElementById('trues').value === 'tf'){
	var mcValues = Array.from(mcCells).map(cell => cell.textContent.trim() === 'T'); // Extract truth values from mc cells
	var allTrueAlt = mcValues.every(value => value); // Check if all values in mc cells are true
	var allFalseAlt = mcValues.every(value => !value); // Check if all values in mc cells are false
	}
	else{
	var mcValuesAngka = Array.from(mcCells).map(cell => cell.textContent.trim() === '1'); // Extract truth values from mc cells
	var allTrueAltAngka = mcValuesAngka.every(value => value); // Check if all values in mc cells are true
	var allFalseAltangka = mcValuesAngka.every(value => !value); // Check if all values in mc cells are false
	}
	// var mcValuesangka = Array.from(mcCells).map(cell => cell.textContent.trim() === '1'); // Extract truth values from mc cells
	// var allTrueAltangka = mcValuesangka.every(value => value); // Check if all values in mc cells are true
	// var allFalseAltangka = mcValuesangka.every(value => !value); // Check if all values in mc cells are false

	// Determine the result
	if (allTrueAlt || allTrueAltAngka) {
		document.getElementById("tessMessage").textContent = "Tautology";
		document.getElementById("outputSoal").value = "Tautology";
	} else if (allFalseAlt || allFalseAltangka) {
		document.getElementById("tessMessage").textContent = "Contradiction";
		document.getElementById("outputSoal").value = "Contradiction";
	} else {
		document.getElementById("tessMessage").textContent = "Contingency";
		document.getElementById("outputSoal").value = "Contingency";
	}

	document.getElementById("outputsTable").style.display = "flex";

}

// (Table,[Tree],Boolean) -> String
// Takes a table (as output by mkTable), the trees it's a table of, and a boolean and
// returns an HTML table. If the boolean is set to true, it only prints the column
// under the main connective.
function htmlTable(table, trees, flag, tv, cs) {
	var rownum = table[0].length;
	var mcs = []; // indices of the main connectives
	for (var i = 0; i < trees.length; i++) {
		mcs.push(mcindex(trees[i]))
	}
	var out = '<table class="truth">'; // start the html table
	out += mkTHrow(table); // make the top th row
	for (var i = 1; i < table[0].length; i++) { // make the td rows below
		out += mkTDrow(table, i);
	}
	return out + '</table>'; // return the html table

	function mkTHrow(tbl) {
		var rw = '<tr>';
		for (var i = 0; i < tbl.length; i++) { // i = table segment
			for (var j = 0; j < tbl[i][0].length; j++) { // row = 0, j = cell
				if (j == tbl[i][0].length - 1 && i != tbl.length - 1) {
					rw += '<th>' + htmlchar(tbl[i][0][j], tv, cs) + '</th>' + '<th class="dv"></th><th></th>';
				} else {
					rw += '<th>' + htmlchar(tbl[i][0][j], tv, cs) + '</th>';
				}
			}
		}
		return rw + '</tr>';
	}

	function mkTDrow(tbl, r) {
		var rw = '<tr>';
		for (var i = 0; i < tbl.length; i++) { // i = table segment
			for (var j = 0; j < tbl[i][r].length; j++) { // r = row, j = cell
				if (mcs[i - 1] == j) {
					rw += '<td class="mc">' + htmlchar(tbl[i][r][j], tv, cs) + '</td>'; //jawaban Akhir
				} else if (flag && i > 0) { //if checkDis === true kerja ini
					rw += '<td></td>' //buat td kosong dari yang displayMode
				} else {
					rw += '<td>' + htmlchar(tbl[i][r][j], tv, cs) + '</td>';
				}
				if (j == tbl[i][r].length - 1 && i != tbl.length - 1) {
					rw += '<td class="dv"></td><td></td>'
				}
			}
		}
		return rw + '</tr>';
	}
}


// Tree -> Int
// Finds the index of the main connective in the tree
function mcindex(t) {
	if (t.length == 2 || t.length == 1) {
		return 0;
	} else {
		return countleaves(t[1]) + 1;
	}
}

// Tree -> Int
// Takes a tree and returns the number of leaves (terminal nodes) in the tree
function countleaves(t) {
	var out = 0;
	for (var i = 0; i < t.length; i++) {
		if (t[i] instanceof Array) {
			out += countleaves(t[i]);
		} else { out += 1; }
	}
	return out;
}

// ([String],[Tree]) -> Table
// Takes an array of formulas and their parse trees and returns a truth table as a
// multidimensional array.  For n formulas, the array contains n+1 elements.  The first
// element is the lhs of the table, and the succeeding elements are the table segments
// for each passed formula.
function mkTable(fs, ts) {
	var lhs = mklhs(fs);
	var rhs = [];	
	var atomic=[];
	for (var i = 0; i < fs.length; i++) {
		atomic = atomic.concat(getatomic(fs[i]));
	}

	atomic = atomic.filter(function (e) { return e != '#'; }); // remove absurdity from atomic letters since it will be treated as logical constant
	
	if(atomic.includes('T')){
		for(let i = 0; i<lhs.length; i++){
		if(i == 0 ){
			lhs[i] = lhs[i].concat("T") //>>>>>>>>>>>>>>>>>>>>>>???????????????????????
		}
		if(i!=0){
			lhs[i] = lhs[i].concat(true);
		}
		}
	}
	else if(atomic.includes('F')){
		for(let i = 0; i<lhs.length; i++){
		if(i == 0 ){
			lhs[i] = lhs[i].concat("F") //>>>>>>>>>>>>>>>>>>>>>>???????????????????????
		}
		if(i!=0){
			lhs[i] = lhs[i].concat(false);
		}
		}
	}
	
	for (var i = 0; i < fs.length; i++) {
		rhs.push(mktseg(fs[i], ts[i], lhs)); //CCCCCCCEEEEEEEEEEEEKKKKKKKKKKKK
	}
	return [lhs].concat(rhs);
}

// [String] -> LHSTable
// Takes an array of strings and makes the left hand side of a table (i.e. the rows
// with all the tv assignments)
function mklhs(fs) {
	var atomic = [];
	var tvrows = [];
	for (var i = 0; i < fs.length; i++) {
		atomic = atomic.concat(getatomic(fs[i]));
	}
	atomic = rmDup(atomic); // remove duplicate atomic letters and sort alphabetically
	atomic = atomic.filter(function (e) { return e != '#'; }); // remove absurdity from atomic letters since it will be treated as logical constant
	if (atomic.includes('T')) {
		atomic.length-=1;
	}
	if(atomic.includes('F'))
	{
		atomic.length-=1;
	}
		tvrows = tvcomb(atomic.length);
		return [atomic].concat(tvrows);
}
// function tvcombFT(n){
// 	if (n == 0) { return [[]]; }
// 	var prev = tvcomb(n - 1);
// 	var mt = function (x) { return [true].concat(x); };
// 	var mf = function (x) { return [true].concat(x); };
// 	return prev.map(mf).concat(prev.map(mt));
// }

// Int -> [[Bool]]
// Takes an int n and returns 2^n truth value assignments (each an array)
function tvcomb(n) {
	if (n == 0) { return [[]]; }
	var prev = tvcomb(n - 1);
	var mt = function (x) { return [true].concat(x); };
	var mf = function (x) { return [false].concat(x); };
	return prev.map(mt).concat(prev.map(mf));
}

// (String, Tree, LHSTable) -> TableSegment
// Takes a tree, the formula it's a tree of, and a LHSTable, and returns a TableSegment
// for the formula
function mktseg(f, t, lhs) {
	var tbrows = [];
	for (var i = 1; i < lhs.length; i++) {
		var a = mkAss(lhs[0], lhs[i]);
		var row = evlTree(t, a);
		row = flatten(row);
		tbrows.push(row);
	}
	var wff = flatten(t); // removes outermost parentheses on wffs
	if (wff[0] == '(') {
		wff[0] = '';
		wff[wff.length - 1] = '';
	}
	tbrows = [wff].concat(tbrows);
	return tbrows;
}

// String -> [Char]
// Takes a wff and returns an array with all the atomic sentences in the wff.  The
// array has duplicates removed and is sorted in alphabetical order.
function getatomic(s) {
	var out = [];
	for (var i = 0; i < s.length; i++) {
		if (isA(s[i])) { out.push(s[i]); }
	}
	return out;
}



// ([Char], [Bool]) -> Assignment
// Takes an array of n Chars and an array of n Bools and returns an assignment that
// assigns the nth Bool to the nth Char.
function mkAss(s, b) {
	var a = new Object();
	for (var i = 0; i < s.length; i++) {
		if (s[i] === 'T' || s[i] === 't') {
			a[s[i]] = true; // Assign 'T' to true
			console.log(`IF ${a[s[i]]}`)
		} else if (s[i] === 'F' || s[i] === 'f') {
			a[s[i]] = false; // Assign 'F' to false
			console.log(`else IF ${a[s[i]]}`)
		} else {
			a[s[i]] = b[i];
			console.log(`else ${a[s[i]]}`)
		}
	}
	return a;
}

// Tree -> Array
// Takes an evaluated tree and turns it into a one dimensional array
function flatten(t) {
	if (t.length == 5) {
		return [].concat(t[0]).concat(flatten(t[1])).concat(t[2]).concat(flatten(t[3])).concat(t[4]);
	} else if (t.length == 2) {
		return [].concat(t[0]).concat(flatten(t[1]));
	} else if (t.length == 1) {
		return [].concat(t[0]);
	}
}

// (Tree,Assignment) -> Tree
// Takes a tree and an assignment of booleans to atomic sentences and returns an
// evaluated tree (i.e. with all atomic sentences and connectives replaced by booleans).
function evlTree(t, a) {
	if (t.length == 5) {
		var t1 = evlTree(t[1], a);
		var t3 = evlTree(t[3], a);

		return ['', t1, gtTv([t[2], t1, t3]), t3, '']
	} else if (t.length == 2) {
		var t1 = evlTree(t[1], a);
		return [gtTv([t[0], t1]), t1];
	} else if (t.length == 1) {
		return t[0] == '#' ? [false] : [a[t[0]]];
	}
}

// Array -> Boolean
// Takes an array, the first element of which is a connective, and the rest of which
// are evaluated trees of the formulas it connects, and returns the truth value
// associated with the connective
function gtTv(arr) {
	switch (arr[0]) {
		case 'n': return !tv(arr[1]);
		case 'a': return tv(arr[1]) && tv(arr[2]);
		case 'o': return tv(arr[1]) || tv(arr[2]);
		case 'i': return (!tv(arr[1]) || tv(arr[2]));
		case 'b': return (tv(arr[1]) == tv(arr[2]));
		case '|': return (!(tv(arr[1]) && tv(arr[2])));
		case '!': return (!(tv(arr[1]) || tv(arr[2])));
	}
	function tv(x) {
		switch (x.length) {
			case 5: return x[2];
			case 2: return x[0];
			case 1: return x[0];
		}
	}
}

// Remove duplicates from an array
function rmDup(a) {
	return a.filter(function (el, pos) { return a.indexOf(el) == pos; });
}

// [Char] -> [Char]
// Takes an array of chars and returns the array sorted from smallest to largest
function sorted(a) {
	var b = a.map(function (x) { return x.charCodeAt(0); });
	b = b.sort(function (b, c) { return b - c; });
	return b.map(function (x) { return String.fromCharCode(x); });
}


// FORMULA PARSING CODE
//====================

/* THE GRAMMAR
S ::= U S | '(' S B S ')' | A
U ::= '~'
B ::= '&' | 'v' | '>' | '<>' | '|' | '!'
A ::= '#' | 'A' | 'B' | 'C' | 'D' | ...
*/

// String -> Tree
// Takes a string and if it's a wff, returns a parse tree of the string, otherwise
// returns an empty array.
function parse(s) {
	if (s.length == 0) { return []; }
	var s1 = [];
	var s2 = [];
	if (isU(s[0])) {
		s1 = parse(s.substring(1));
		return s1.length ? [s[0], s1] : [];
	}
	if (s[0] == '(' && s[s.length - 1] == ')') {
		var a = gSub(s);
		if (a.indexOf(undefined) >= 0 || a.indexOf('') >= 0) {
			return [];
		} else {
			s1 = parse(a[0]);
			s2 = parse(a[2]);
			if (s1.length && s2.length) {
				return ['(', s1, a[1], s2, ')'];
			} else { return []; }
		}
	}
	else { return isA(s) ? [s] : [] }
}

// String -> Bool
// Determines if s is an atomic wff
function isA(s) {
	if (s.length != 1) { return false; }
	var pr = 'PQpqTftF';
	return pr.indexOf(s) >= 0;
}


// String -> Bool
// Determines if s begins with a unary connective
function isU(s) {
	return s.indexOf('n') == 0;
}

// String -> [String]
// takes a string beginning with '(' and ending with ')', and determines if there is a
// binary connective enclosed only by the outermost parentheses.  If so, returns an array
// with the string to the left and the string to the right of the binary connective;
// otherwise returns an array of three undefined's.
function gSub(s) {
	var stk = [];
	var l = 0;
	for (var i = 0; i < s.length; i++) {
		if (s[i] == '(') {
			stk.push('(');
		} else if (s[i] == ')' && stk.length > 0) {
			stk.pop();
		} else if (stk.length == 1 && (l = isB(s.substring(i))) > 0) {
			return [s.substring(1, i), s.substring(i, i + l), s.substring(i + l, s.length - 1)];
		}
	}
	return [undefined, undefined, undefined];
}

// String -> Int
// takes a string and determines if it begins with a binary connective.  If so, returns
// the length of the connective, otherwise returns 0.
function isB(s) {
	var bc = ['a', 'o', 'i', 'b', '|', '!'	]; // | tuk NAND, ! tuk NOR
	for (var i = 0; i < bc.length; i++) {
		if (s.indexOf(bc[i]) == 0) {
			return bc[i].length;
		}
	}
	return 0;
}

// String -> Int
// Checks if the string contains any inadmissible characters
function badchar(s) {
	var x = ' ,()|!#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz';
	for (var i = 0; i < s.length; i++) {
		if (x.indexOf(s[i]) < 0) {
			return i;
		}
	}
	return -1;
}
