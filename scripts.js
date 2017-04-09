'use strict'

const filterButtons = document.querySelectorAll('.filter-buttons button');
const titles = document.querySelectorAll('.table-header');
const tabela = document.querySelector('.table-content');
const thead = document.querySelector('.table-header ');
const searchInput = document.querySelector('.search');

var ks = 1; //kolejność sortowania
var dateConvert = 0; //Zapobiega wielokrotnemu wykonywaniu się convertDate()
var timeToLoad = 1400; //Daje czas na załadowanie się danych >> setTimeout l.

var $table, $n, $rowCount, $firstRow, $hasHead, $tr, $i, $ii, $j, $th; //zmienne zwiazane z paginacją;
var $pageCount; //ilość wyświetlanych pozycji

let sluzba = [];
fetch('sluzba.json')
    .then(blob => blob.json())
    .then(data => sluzba.push(...data))
    .catch((err) => {
        console.info('Nie udało się wczytać bazy');
    })


function convertDate() {
    if (dateConvert === 0) {
        sluzba.map((time) => {
            let czas = time.dateOfBirth;
            let newDate = new Date(time.dateOfBirth)
            let tablicaPoSplicie = czas.split(' ')
            let data = tablicaPoSplicie[0];
            let godzina = tablicaPoSplicie[1];
            let dataSplit = data.split('.');
            let dataSplitDzien = dataSplit[0];
            dataSplit[0] = dataSplit[1];
            dataSplit[1] = dataSplitDzien;
            let validDate = dataSplit + ' ' + godzina;
            12: 09
            let formattedDate = validDate.replace(/,/gi, '.').trim();
            let liczbaDate = formattedDate;
            let zamiennik = liczbaDate.valueOf()
            var za = new Date(zamiennik);
            time.dateOfBirth = za;
        })
        dateConvert = 1;
    }
}

function sortowanie() {
    innerThead();
    const sort = this.value;
    ks = -ks; //zmiana kolejnosci sortowania
    if (sort === 'lastName') {
        const afterSort = sluzba.sort((a, b) => a.lastName > b.lastName ? -ks : ks)
        return afterSort;
    }
    if (sort === 'id') {
        const afterSort = sluzba.sort((a, b) => a.id > b.id ? -ks : ks)
        return afterSort;
    }
    if (sort === 'dateOfBirth') {
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
        const firstName = person.firstName.replace(regex, `<span class="highlight">${this.value}</span>`)
        const lastName = person.lastName.replace(regex, `<span class="highlight">${this.value}</span>`)
        const id = person.id.toString().replace(regex, `<span class="highlight">${this.value}</span>`)
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

$(document).ready(function() {
    setTimeout(() => {
        convertDate();
        showArray();
        dPicker();
        pagination();
    }, timeToLoad)
});

function pagination() {
    $table = document.querySelector(".table-content");
    $n = 5; //ilosc wyswietlanych elementow
    $rowCount = $table.rows.length;
    $firstRow = $table.rows[0].firstElementChild.tagName;
    $hasHead = ($firstRow === "TH");
    $tr = [];
    $i, $ii, $j = ($hasHead) ? 1 : 0;
    $th = ($hasHead ? $table.rows[(0)].outerHTML : "");
    $pageCount = Math.ceil($rowCount / $n);
    if ($pageCount > 1) {
        for ($i = $j, $ii = 0; $i < $rowCount; $i++, $ii++)
            $tr[$ii] = $table.rows[$i].outerHTML;
        sort(1);
    }
}

function sort($p) {
    var $rows = $th,
        $s = (($n * $p) - $n);
    for ($i = $s; $i < ($s + $n) && $i < $tr.length; $i++)
        $rows += $tr[$i];
    $table.innerHTML = $rows;
    document.querySelector("#buttons").innerHTML = pageButtons($pageCount, $p);
    document.querySelector("#id" + $p).setAttribute("class", "active");
}

function pageButtons($pCount, $cur) {
    var $prevDis = ($cur == 1) ? "disabled" : "",
        $nextDis = ($cur == $pCount) ? "disabled" : "",
        $buttons = "<input type='button' value='&lt;&lt; Prev' onclick='sort(" + ($cur - 1) + ")' " + $prevDis + ">";
    for ($i = 1; $i <= $pCount; $i++)
        $buttons += "<input type='button' id='id" + $i + "'value='" + $i + "' onclick='sort(" + $i + ")'>";
    $buttons += "<input type='button' value='Next &gt;&gt;' onclick='sort(" + ($cur + 1) + ")' " + $nextDis + ">";
    return $buttons;
}
//Event listeners
filterButtons.forEach((button) => button.addEventListener('click', sortowanie))
filterButtons.forEach((button) => button.addEventListener('click', convertDate))
filterButtons.forEach((button) => button.addEventListener('click', showArray))
filterButtons.forEach((button) => button.addEventListener('click', pagination))
searchInput.addEventListener('keyup', convertDate)
searchInput.addEventListener('keyup', displayMatches)
searchInput.addEventListener('keyup', pagination)
