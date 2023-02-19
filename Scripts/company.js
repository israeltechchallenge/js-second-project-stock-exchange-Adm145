let query = window.location.search;
query = query.replace("?symbol=", "");

const stockInfo = document.querySelector('.stockInfo')
const stockPrice = document.querySelector('.priceInfo')
const desc = document.querySelector('.stockDesc');
const loader = document.querySelector('.spinner-border');

async function getStockInfo() {
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${query}`;
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
  if (stock.changesPercentage >= 0) {
    change.innerText = `(+${stock.changesPercentage}%)`;
    change.style.color = 'green';
  } else {
    change.innerText = `(${stock.changesPercentage}%)`;
    change.style.color = 'red'
  }
}


async function getStockHistory() {
  loader.removeAttribute("style");
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${query}?serietype=line`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    displayStockHistory(data);
  } catch (error) {
    console.error(error);
  }
}

// todo FINISH THE CHART
function displayStockHistory(data) {
  loader.style.display = "none";
  const history = data.historical;

  const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [`${history[0].date}`,
      `${history[1].date}`,
      `${history[2].date}`,
      `${history[3].date}`,
      `${history[4].date}`,
      `${history[5].date}`,
      `${history[6].date}`,
      `${history[7].date}`,
      `${history[8].date}`,
      `${history[9].date}`],
      datasets: [{
        label: `the History of the ${data.symbol} Stock`,
        data: [history[0].close,
        history[1].close,
        history[2].close,
        history[3].close,
        history[4].close,
        history[5].close,
        history[6].close,
        history[7].close,
        history[8].close,
        history[9].close],
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