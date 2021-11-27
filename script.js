const rates = {};
const elementUSD = document.querySelector('[data-value="USD"]')
const elementEUR = document.querySelector('[data-value="EUR"]')
const elementRUB = document.querySelector('[data-value="RUB"]')

const input = document.querySelector('#input')
const result = document.querySelector('#result')
const select  = document.querySelector('#select')
getCurrencies();

async function getCurrencies(){
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    const data = await response.json()
    const result = await data;

    rates.USD = result.find(r => r.cc == "USD");
    rates.EUR = result.find(r => r.cc == "EUR");
    rates.RUB = result.find(r => r.cc == "RUB");
    
    elementUSD.textContent = rates.USD.rate.toFixed(2);
    elementEUR.textContent = rates.EUR.rate.toFixed(2);
    elementRUB.textContent = rates.RUB.rate.toFixed(2);
} 
input.oninput = converValue;
select.oninput = converValue;

function converValue(){
    result.value = (parseFloat(input.value) / rates[select.value].rate).toFixed(2)     
}