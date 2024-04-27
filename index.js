let ketikan = document.getElementById("inputSoal");

window.addEventListener("keypress", function (event) { //tekan enter untuk cek Kebenaran
    if (event.key === "Enter") {
        event.preventDefault();
        hitungBenar();
    }
});

function masukkanKeInput(input) {
    if (input == "hapus") {
        ketikan.value = ketikan.value.slice(0, -1);
    }
    else if (input == "clear") {
        ketikan.value = "";
    }
    else {
        if(ketikan.value.length<20){
        ketikan.value += input;
        }
    }
};

function hitungBenar() { //JANGAN LUPA ADA BUTTON ENTER DI CALCULATOR, NANTI ARAH KESINI
    if(ketikan.value=='') {return alert("You have to enter a formula.");};
    
    ketikan.value = ketikan.value.replaceAll("p", 'P');
    ketikan.value = ketikan.value.replaceAll("q", 'Q');
    ketikan.value = ketikan.value.trim().replace(/\s+/g, '');

    var formulas = ketikan.value;

    formulas = formulas.split(','); // create an array of formulas
	var trees = formulas.map(parse); // create an array of parse trees
	for(var i=0;i<trees.length;i++) { // adds outermost parentheses if needed
		if(trees[i].length==0) {
			formulas[i] = '('+formulas[i]+')';
			trees[i] = parse(formulas[i]);
		}
	}
    if(trees.filter(function(a) {return a.length==0;}).length>0) { // checks if any formulas are still malformed
		return alert("One of the formulas you entered is not well formed");
	}

    let adaP = 0;
    let adaQ = 0;
    let adaN = 0;
    let adaA = 0;
    let adaO = 0;
    let adaI = 0;
    let adaB = 0;
    let adaBuka = 0;
    let adaTutup = 0;

    for (let i = 0; i < ketikan.value.length; i++) {
        if (ketikan.value.charAt(i) == 'P') {
            adaP = 1;
        }
        else if (ketikan.value.charAt(i) == 'Q') {
            adaQ = 1;
        }
        //YANG LAIN : += KARENA BISA BANYAK OPERATOR misal n(nP) ada 3 column. Untuk P, untuk (nP), untuk n(nP)

        else if (ketikan.value.charAt(i) == 'n') {
            adaN += 1;
        }
        else if (ketikan.value.charAt(i) == 'a') {
            adaA += 1;
        }
        else if (ketikan.value.charAt(i) == 'o') {
            adaO += 1;
        }
        else if (ketikan.value.charAt(i) == 'i') {
            adaI += 1;
        }
        else if (ketikan.value.charAt(i) == 'b') {
            adaB += 1;
        }
        else if (ketikan.value.charAt(i) == '(') {
            adaBuka += 1;
        }
        else if (ketikan.value.charAt(i) == ')') {
            adaTutup += 1;
        }
    }
    let jmlhvar = adaP + adaQ;
    // NANti gunakan tvcomb 
    let banyakRow = 2 ** (adaP + adaQ) //Ada 2 kemungkinan dari (jumlah) variabel

    // let banyakColumn = adaP + adaQ + adaN + adaA + adaO + adaI + adaB + adaBuka + adaTutup;

    let urutanColumn = [];
    if (adaP === 1) {
        urutanColumn.push('P');
    }
    if (adaQ === 1) {
        urutanColumn.push('Q');
    }
    let tempKalimat;
    let terbuka = false;
    let done = false;

    let simpanKetikan = ketikan.value;
    let tempArrayHEAD = [];

    let tabel = document.getElementById("tableHasil");

//HEADER
        let counterHeadRow = 1;
        if(adaP === 1 ){
            tempArrayHEAD.push(`<th id="headColm${counterHeadRow}">P</th>`)
            counterHeadRow++;
        }
        if(adaQ === 1 ){
            tempArrayHEAD.push(`<th id="headColm${counterHeadRow}">Q</th>`)
            counterHeadRow++;
        }
        if(adaN > 0){
            for(let i =0; i< ketikan.value.length;i++){
                if(ketikan.value.charAt(i) === 'n' && ketikan.value.charAt(i+1) === 'P'){
                    tempArrayHEAD.push(`<th id="headColm${counterHeadRow}">-P</th>`)
                    counterHeadRow++;
                }
                else if(ketikan.value.charAt(i) === 'n' && ketikan.value.charAt(i+1) === 'Q'){
                    tempArrayHEAD.push(`<th id="headColm${counterHeadRow}">-Q</th>`)
                    counterHeadRow++;
                }
            }
        }
    tempArrayHEAD.push(`<th id="headColm${counterHeadRow}">${ketikan.value}</th>`)
    tabel.innerHTML = `<tr id="tableHasil">${tempArrayHEAD}</tr>`
    
};
// HANYA ADA P dan Q atomic, atomic = adaP + adaQ.

// [String] -> LHSTable
// Takes an array of strings and makes the left hand side of a table (i.e. the rows
// with all the tv assignments)
function mklhs(fs, adaP, adaQ) {
	var atomic = [];
	var tvrows = [];
	// for(var i=0;i<fs.length;i++) {
	// 	atomic = atomic.concat(getatomic(fs[i]));
	// }
    if(adaP===1){
        atomic.push(`P`)
    }
    if(adaQ===1){
        atomic.push(`Q`)
    }

	/* ?? mek PQ */atomic = atomic.filter(function (e) {return e!='#';}); // remove absurdity from atomic letters since it will be treated as logical constant
	tvrows = tvcomb(adaP+adaQ);
	return [atomic].concat(tvrows);
}

function mcindex(t) {
	if(t.length == 2 || t.length==1) {
		return 0;
	} else {
		return countleaves(t[1])+1;
	}
}


// Hitung rows, n = ( adaP + adaQ ) nanti di **2
function tvcomb(n) {
	if(n==0) {return [[]];}
	var prev = tvcomb(n-1);
	var mt = function(x) {return [true].concat(x);};
	var mf = function(x) {return [false].concat(x);};
	return prev.map(mt).concat(prev.map(mf));
}

// String -> Bool
// Determines if s begins with a unary connective (negasi awal)
function isU(s) {
	return s.indexOf('n')==0;
}
