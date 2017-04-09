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
var timeToLoad = 1400; //Daje czas na załadowanie się danych >> setTimeout l.

fetch(baza)
    .then(blob => blob.json())
    .then(data => sluzba.push(...data))
    .catch((err) => {
        console.log('failed to fetch', err);
    })




// let test = [];
// test = fetch('sluzba.json').then(function(response){
//   return response.blob();
// })
// .then(function(myBlob){
//   var objectURL = URL.createObjectURL(myBlob);
//   myImage.src = objectURL;
// })
let test = [];
fetch('sluzba.json')
.then(blob=>blob.json())
.then(data=>test.push(...data))
.catch((err)=>{
  console.info('Cos poszlo nie tak')
})


console.log('test =',test);










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
            // Tutaj zamieniam datę na liczbę >> dla pozniejszego sortowania
            // let liczbaDate = new Date(formattedDate);
            // test
            let liczbaDate = formattedDate;
            //ponizej działa
            // liczbaDate.toUTCString('en-GB');s //liczba =>liczbaDate
            let zamiennik = liczbaDate.valueOf()
            var za = new Date(zamiennik);
            console.log('za', za, 'zamiennik', zamiennik, 'liczbDate', liczbaDate, 'formattedDate', formattedDate)
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
        // let timeArray = [];
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

 function innerThead(){
    thead.innerHTML = `
    <th>Imię</th>
    <th>Nazwisko</th>
    <th>ID</th>
    <th>Data Urodzenia <span>(DD.MM.YYYY)</span></th>
    <th>Zawód</th>
    <th>Doświadczenie <span>(Lata)</span></th>`
}

function showArray() {
    const result = sluzba.map((person) => {
        let a = person.dateOfBirth; //data urodzenia sługi
        a = a.getDate() + '.' + (a.getMonth() + 1) + '.' + a.getFullYear() + ' ' + a.getHours() + ':' + a.getMinutes();
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
        let d = person.dateOfBirth;
        d = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

        return person.firstName.match(regex) ||
            person.lastName.match(regex) ||
            person.id.toString().match(regex) ||
            d.toString().match(regex) ||
            person.function.match(regex) ||
            person.experience.toString().match(regex);
    });
}

function displayMatches() {
    const matchArray = findMatches(this.value, sluzba);
    const array = matchArray.map(person => {
        const regex = new RegExp(this.value, 'gi');
        let d = person.dateOfBirth; // data urodzenia
        d = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

        //podswietlanie wordToMatch
        const firstName = person.firstName.replace(regex, `<span class="highlight">${this.value}</span>`)
        const lastName = person.lastName.replace(regex, `<span class="highlight">${this.value}</span>`)
        const id = person.id.toString().replace(regex, `<span class="highlight">${this.value}</span>`)

        //DO ZROBIENIA  DTB
        const dateOfBirth = d.toString().replace(regex, `<span class="highlight">${this.value}</span>`)
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

//Event listeners
filterButtons.forEach((button) => button.addEventListener('click', sortowanie))
filterButtons.forEach((button) => button.addEventListener('click', convertDate))
filterButtons.forEach((button) => button.addEventListener('click', showArray))
filterButtons.forEach((button) => button.addEventListener('click', define))
searchInput.addEventListener('keyup', convertDate)
searchInput.addEventListener('keyup', displayMatches)
searchInput.addEventListener('keyup', define)


function dPicker() {
    $("#datepicker").datepicker({
        dateFormat: 'd.m.yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1930:2017',
        onSelect: function(dateText, inst) {
            $(".search").val(dateText);
        }
    });
};

// var tablica = Array.from(document.querySelectorAll('.table-content tr'))
// let table = [];
// table =  table.concat(tablica);
$(document).ready(function() {
    console.info("Ready!");
    setTimeout(() => {
        convertDate();
        showArray();
        dPicker();
        // pagination();
        define();
    }, timeToLoad)
});

var $table,$n,$rowCount,$firstRow,$hasHead,$tr,$i,$ii,$j,$th;
var $pageCount;

function define(){
  $table = document.querySelector(".table-content");
  $n = 5; //ilosc wysiwetlanych elementow
  $rowCount = $table.rows.length;
  $firstRow = $table.rows[0].firstElementChild.tagName;
  $hasHead = ($firstRow === "TH");
  $tr = [];
  $i,$ii,$j = ($hasHead)?1:0;
  $th = ($hasHead?$table.rows[(0)].outerHTML:"");
  $pageCount = Math.ceil($rowCount / $n);
  if ($pageCount > 1) {
  	for ($i = $j,$ii = 0; $i < $rowCount; $i++, $ii++)
  	$tr[$ii] = $table.rows[$i].outerHTML;
  	sort(1);
  }
}
function sort($p) {
	var $rows = $th,$s = (($n * $p)-$n);
	for ($i = $s; $i < ($s+$n) && $i <  $tr.length; $i++)
		$rows += $tr[$i];
	$table.innerHTML = $rows;
	document.querySelector("#buttons").innerHTML = pageButtons($pageCount,$p);
  document.querySelector("#id"+$p).setAttribute("class","active");
}
function pageButtons($pCount,$cur) {
	var	$prevDis = ($cur == 1)?"disabled":"",
		$nextDis = ($cur == $pCount)?"disabled":"",
		$buttons = "<input type='button' value='&lt;&lt; Prev' onclick='sort("+($cur - 1)+")' "+$prevDis+">";
	for ($i=1; $i<=$pCount;$i++)
		$buttons += "<input type='button' id='id"+$i+"'value='"+$i+"' onclick='sort("+$i+")'>";
	$buttons += "<input type='button' value='Next &gt;&gt;' onclick='sort("+($cur + 1)+")' "+$nextDis+">";
	return $buttons;
}
