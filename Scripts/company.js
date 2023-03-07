let query = window.location.search;
query = query.replace("?symbol=", "");
const title = document.createElement('title');
title.innerHTML = `[${query}] Stock Details`;
document.body.appendChild(title);

const stockInfo = document.querySelector('.stockInfo')
const stockPrice = document.querySelector('.priceInfo')
const desc = document.querySelector('.stockDesc');
const loader = document.querySelector('.spinner-border');
const urlBase = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/"

async function getStockInfo() {
  const url = urlBase + `company/profile/${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    displayStockInfo(data);
  } catch (error) {
    console.error(error);
  }
}

function displayStockInfo(data) {
  const stock = data.profile;
  const price = document.getElementById('price');
  const change = document.getElementById('change');
  const img = document.createElement('img');
  const name = document.createElement('p');

  img.src = stock.image;
  img.alt = "Stock Logo"
  stockInfo.appendChild(img);
  name.innerText = stock.companyName;
  name.setAttribute('id', 'stockName');
  stockInfo.appendChild(name);
  desc.innerText = stock.description;

  price.innerText = `$${stock.price}`;
  if (stock.changesPercentage > 0) {
    change.innerText = `(+${stock.changesPercentage}%)`;
    change.style.color = 'green';
  } else if (stock.changesPercentage < 0) {
    change.innerText = `(${stock.changesPercentage}%)`;
    change.style.color = 'red'
  } else {
    change.innerText = '[No recent price changes found]';
    change.style.color = 'blue'
  }
}


async function getStockHistory() {
  loader.removeAttribute("style");
  const url = urlBase + `historical-price-full/${query}?serietype=line`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    displayStockHistory(data);
  } catch (error) {
    console.error(error);
  }
}

function displayStockHistory(data) {
  loader.style.display = "none";
  const history = data.historical;
  const labelsArr = [];
  const dataArr = [];
  for (let i = 0; i < 10; i++) {
    let lable = history[i].date;
    labelsArr.push(lable);
    let data = `${history[i].close}`;
    dataArr.push(data);
  }
  const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelsArr,
      datasets: [{
        label: `the History of the [${data.symbol}] Stock`,
        data: dataArr,
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
getStockInfo();
getStockHistory();