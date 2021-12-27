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
    getTotalCurrency(rates);
    addCurrencyToSelect(currency);
    converValue(currency)
} 
function addTodayDate(){
    let date = new Date();
    todayDay.append(date.toLocaleDateString("ru-RU"))
}
async function getTotalCurrency() {
    
    Promise 
    .all([
        fetch('https://api.privatbank.ua/p24api/exchange_rates?json&date=27.12.2021').then(response => response.json()),
        fetch('https://api.privatbank.ua/p24api/exchange_rates?json&date=26.12.2021').then(response => response.json()),
    ])
    .then((value) => printTotalCurrency(value))
}    
async function printTotalCurrency(rates){
    let todayRate = {};
    let yesterdayRate = {}; 
    
    todayRate.USD = await rates[0].exchangeRate.filter(rate => rate.currency == "USD");
    todayRate.EUR = await rates[0].exchangeRate.filter(rate => rate.currency == "EUR");
    todayRate.GBP = await rates[0].exchangeRate.filter(rate => rate.currency == "GBP");
    yesterdayRate.USD = await rates[1].exchangeRate.filter(rate => rate.currency == "USD");
    yesterdayRate.EUR = await rates[1].exchangeRate.filter(rate => rate.currency == "EUR");
    yesterdayRate.GBP = await rates[1].exchangeRate.filter(rate => rate.currency == "GBP");

    const elementUSD = document.querySelector('[data-value="USD"]')
    const elementEUR = document.querySelector('[data-value="EUR"]')
    const elementGBP = document.querySelector('[data-value="GBP"]')

    elementUSD.textContent = todayRate.USD[0].saleRate.toFixed(2);
    elementUSD.appendChild(isUp(yesterdayRate.USD[0].saleRate, todayRate.USD[0].saleRate));
    elementEUR.textContent = todayRate.EUR[0].saleRate.toFixed(2);
    elementEUR.appendChild(isUp(yesterdayRate.EUR[0].saleRate, todayRate.EUR[0].saleRate));
    elementGBP.textContent = todayRate.GBP[0].saleRate.toFixed(2);
    elementGBP.appendChild(isUp(yesterdayRate.GBP[0].saleRate, todayRate.GBP[0].saleRate));
}
function isUp(previous, current){
    let span;
    if(current < previous){
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
    currency.sort((a, b) => a.cc > b.cc ? 1 : -1);
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

function changeValue(){
    console.log(selectInput);
    console.log(select);
}