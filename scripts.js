// // $.getJSON('sluzba.json', function(data) {
// //   console.log(data)
// // });
//
//
//
// // let service = require(['sluzba.json']);
// //
// // $.getJSON('sluzba.json', function(data) {
// //     // console.log(data)
// // });
// // console.log(service);
// require(['sluzba.json'], function(data){
//   console.log(data);
// })

/*
JSON jeszcze do ogarnięcia
*/
'use strict'

const filterButtons = document.querySelectorAll('.filter-buttons button');
const titles = document.querySelectorAll('.table-header');
const tabela = document.querySelector('.table-content');
const thead = document.querySelector('.table-header ');
const searchInput = document.querySelector('.search');


const baza = 'https://api.myjson.com/bins/zothv';

let sluzba = [];
var ks = 1; //kolejność sortowania
var dateConvert = 0; //Zapobiega wielokrotnemu wykonywaniu się convertDate()

fetch(baza)
    .then(blob => blob.json())
    .then(data => sluzba.push(...data))
    .catch((err) => {
        console.log('failed to fetch', err);
    })


function convertDate() {
    if (dateConvert === 0) {
        sluzba.map((time) => {
            let czas = time.dateOfBirth;
            let newDate = new Date(time.dateOfBirth)
            let tablicaPoSplicie = czas.split(' ')

            let data = tablicaPoSplicie[0]; // 03.01.1986
            let godzina = tablicaPoSplicie[1]; //23:10
            let dataSplit = data.split('.');

            let dataSplitDzien = dataSplit[0]; //Zamieniam liczbe odp za dzien
            dataSplit[0] = dataSplit[1]; //na liczbe odp za miesiac
            dataSplit[1] = dataSplitDzien; //Poprawny format danych MM/DD/YYYY
            let validDate = dataSplit + ' ' + godzina; //validDate 03,29,1980 12:09
            let formattedDate = validDate.replace(/,/gi, '.').trim();
            // console.log(validDate)
            // console.log('po:', formattedDate)

            // Tutaj zamieniam datę na liczbę >> dla pozniejszego sortowania
            // let liczbaDate = new Date(formattedDate);
// test
let liczbaDate =formattedDate;
            //ponizej działa
            // liczbaDate.toUTCString('en-GB');s //liczba =>liczbaDate
            let zamiennik = liczbaDate.valueOf()
            var za = new Date(zamiennik);
            console.log('za',za,'zamiennik',zamiennik,'liczbDate',liczbaDate,'formattedDate',formattedDate)
            // alert(za.toString());
            time.dateOfBirth = za; //liczba =>liczbaDate
        })
        dateConvert = 1;
    }
}



function sortowanie() {
    innerThead();
    const sort = this.value;

    ks = -ks;
    if (sort === 'lastName') {
        const afterSort = sluzba.sort((a, b) => a.lastName > b.lastName ? -ks : ks)
        return afterSort;
    }

    if (sort === 'id') {
        const afterSort = sluzba.sort((a, b) => a.id > b.id ? -ks : ks)
        return afterSort;
    }
    if (sort === 'dateOfBirth') {
        let timeArray = [];
        var nowaSluzba = sluzba;
        const afterSort = sluzba.sort((a, b) =>
            a.dateOfBirth > b.dateOfBirth ? -ks : ks
        )
        return afterSort;
    }
    if (sort === 'function') {
        const afterSort = sluzba.sort((a, b) => a.function > b.function ? -ks : ks)
        return afterSort;
    }
    if (sort === 'experience') {
        const afterSort = sluzba.sort((a, b) => a.experience > b.experience ? -ks : ks)
        return afterSort;
    }
    const afterSort = sluzba.sort((a, b) => a.firstName > b.firstName ? -ks : ks)
    return afterSort;
}

function innerThead() {
    thead.innerHTML = `
<th>Imię</th>
<th>Nazwisko</th>
<th>ID</th>
<th>Data Urodzenia</th>
<th>Zawód</th>
<th>Doświadczenie</th>`
}

function showArray() {
  console.log('showArray - run',sluzba)

    const result = sluzba.map((person) => {
        let a = person.dateOfBirth; //data urodzenia sługi
        a = a.getDate() + '.' + (a.getMonth()+1) + '.' + a.getFullYear() + ' ' + a.getHours() + ':' + a.getMinutes();
        return `
    <tr>
      <td>${person.firstName}</td>
      <td>${person.lastName}</td>
      <td>${person.id}</td>
      <td>${a}</td>
      <td>${person.function}</td>
      <td>${person.experience}</td>
    </tr>
  `
    }).join('');
    tabela.innerHTML = result;
};

function findMatches(wordToMatch, sluzba) {
    return sluzba.filter(person => {
        const regex = new RegExp(wordToMatch, 'gi');
        console.log(regex)
        let dob = person.dateOfBirth;
dob = dob.getDate()+'.'+(dob.getMonth()+1)+'.'+dob.getFullYear()+' '+dob.getHours()+':'+dob.getMinutes();

        return person.firstName.match(regex) ||
            person.lastName.match(regex) ||
            person.id.toString().match(regex) ||
            dob.toString().match(regex) ||
            person.function.match(regex) ||
            person.experience.toString().match(regex);
    });
}

function displayMatches() {
    const matchArray = findMatches(this.value, sluzba);
    const array = matchArray.map(person => {
        const regex = new RegExp(this.value, 'gi');
        let dob = person.dateOfBirth; // data urodzenia
        // new Date(dob)
        dob = dob.getDate()+'.'+(dob.getMonth()+1)+'.'+dob.getFullYear()+' '+dob.getHours()+':'+dob.getMinutes();
        // console.log(dob)
        // dtb.getFullYear()
        //podswietlanie wordToMatch
        const firstName = person.firstName.replace(regex, `<span class="highlight">${this.value}</span>`)
        const lastName = person.lastName.replace(regex, `<span class="highlight">${this.value}</span>`)
        const id = person.id.toString().replace(regex, `<span class="highlight">${this.value}</span>`)

//DO ZROBIENIA  DTB
        const dateOfBirth = dob.toString().replace(regex, `<span class="highlight">${this.value}</span>`)
        const job = person.function.replace(regex, `<span class="highlight">${this.value}</span>`)
        const experience = person.experience.toString().replace(regex, `<span class="highlight">${this.value}</span>`)
        return `
      <tr>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${id}</td>
        <td>${dateOfBirth}</td>
        <td>${job}</td>
        <td>${experience}</td>
      </tr>
      `
    }).join('');
    tabela.innerHTML = array;
}


filterButtons.forEach((button) => button.addEventListener('click', sortowanie))
filterButtons.forEach((button) => button.addEventListener('click', convertDate)  )
filterButtons.forEach((button) => button.addEventListener('click', showArray))


searchInput.addEventListener('keyup', convertDate)
searchInput.addEventListener('keyup', displayMatches)



// document.addEventListener('DOMContentLoaded',showArray);
// console.log(show)
// window.onload = showArray();
$(document).ready(function() {
    console.log("Ready!");
    setTimeout(()=>{
      convertDate();
      showArray();
    }
    ,2000)
    // showArray();

});
