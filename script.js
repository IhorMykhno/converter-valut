const rates = {};
const currency = {};

const input = document.querySelector('#input')
const result = document.querySelector('#result')
const selectInput = document.querySelector('#select-input')
const select  = document.querySelector('#select-result')
const todayDay = document.querySelector('[currency="today"]')

getCurrencies();

async function getCurrencies(){
    const responce = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    const data = await responce.json()
    const currency = await data;
    currency.forEach(r => {
        rates[r.cc] = {title: r.txt, rate: r.rate};
    });
    
    addTodayDate();
    printTotalCurrency(rates);
    addCurrencyToSelect(currency);
    converValue(currency)
} 

function addTodayDate(){
    let date = new Date();
    todayDay.append(date.toLocaleDateString("ru-RU"))
}
async function printTotalCurrency(rates){
    const valutes = {};
    const responce = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const res = await responce.json();

    valutes.USD = res.Valute.USD;
    valutes.EUR = res.Valute.EUR;
    valutes.GBP = res.Valute.GBP;

    const elementUSD = document.querySelector('[data-value="USD"]')
    const elementEUR = document.querySelector('[data-value="EUR"]')
    const elementGBP = document.querySelector('[data-value="GBP"]')
    
    elementUSD.textContent = valutes.USD.Value.toFixed(2);
    elementUSD.appendChild(isUp(valutes.USD));
    
    elementEUR.textContent = valutes.EUR.Value.toFixed(2);
    elementEUR.appendChild(isUp(valutes.EUR));

    elementGBP.textContent = valutes.GBP.Value.toFixed(2);
    elementGBP.appendChild(isUp(valutes.GBP));
}
function isUp(valute){
    let span;
    if(valute.Value < valute.Previous){
        span = document.createElement('span');
        span.textContent = '▼';    
        span.className =  'down';
    }
    else {
        span = document.createElement('span');
        span.textContent = '▲';    
        span.className =  'up';
    }
    return span;
}
function addCurrencyToSelect(currency){
    currency.forEach(c => {
        let option = document.createElement('option');
        option.value = c.cc
        option.innerHTML = `${c.cc} - ${c.txt}`;
        select.appendChild(option);
    })   
    currency.forEach(c => {
        let option = document.createElement('option');
        option.value = c.cc
        option.innerHTML = `${c.cc} - ${c.txt}`;
        selectInput.appendChild(option);
    })   
}
input.oninput = converValue;
select.oninput = converValue;
selectInput.oninput = converValue;

function converValue(){  
    if(selectInput.value !== 'UAH'){
        if(select.value === 'UAH'){
            result.value = (parseFloat(input.value) * rates[selectInput.value].rate).toFixed(2)
        }
        else{
            let toUAH = (parseFloat(input.value) * rates[selectInput.value].rate);
            result.value = (toUAH / rates[select.value].rate).toFixed(2)
        }
    }
    else {
        if(select.value === selectInput.value)
            result.value = input.value
        else        
            result.value = (parseFloat(input.value) / rates[select.value].rate).toFixed(2)
    }
}
