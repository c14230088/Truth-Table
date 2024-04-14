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
        ketikan.value += input;
    }
};

function hitungBenar() { //JANGAN LUPA ADA BUTTON ENTER DI CALCULATOR, NANTI ARAH KESINI

};
