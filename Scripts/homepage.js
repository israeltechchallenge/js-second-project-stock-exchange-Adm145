const searchBtn = document.getElementById('searchBtn');
const userInput = document.getElementById('userInput');
const searchList = document.querySelector('.dataList');
const loader = document.querySelector('.spinner-border');
const urlBase = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";

async function getData() {
  loader.removeAttribute("style");
  searchList.innerText = " ";
  const url = urlBase + `/search?query=${userInput.value}&exchange=NASDAQ`;
  try {
    const response = await fetch(url);
    const data = await response.json()
    displaySearchResults(data);
  }
  catch (error) {
    console.error(error);
  }
}

searchBtn.addEventListener('click', getData);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getData();
  }
});

function displaySearchResults(data) {
  loader.style.display = "none";
  let linkBase = "./Pages/company.html"

  for (let i = 0; i < 10; i++) {
    let div = document.createElement('div');
    let link = document.createElement('a');
    let listItem = document.createElement('li');
    let symbol = data[i].symbol;
    let name = data[i].name;
    let pageLink = linkBase + `?symbol=${symbol}`;
    link.href = pageLink.toString();
    link.target = '_blank';
    searchText = [`<span>${name}</span> - <span>[${symbol}]</span>`];
    div.innerHTML = searchText.join('')
    link.append(div);
    listItem.appendChild(link);
    searchList.appendChild(listItem);
    getAdditionalResults(symbol, pageLink);
  }
}

async function getAdditionalResults(symbol, pageLink) {
  const url = urlBase + `company/profile/${symbol}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayAdditionalResults(data, pageLink);
  }
  catch (error) {
    console.error(error);
  }
}

function displayAdditionalResults(data, pageLink) {
  const profile = data.profile;
  const img = document.createElement('img');
  const span = document.createElement('span');
  if (profile.changesPercentage < 0) {
    span.classList = 'percentNegative'
    span.textContent = `(${profile.changesPercentage}%)`
  } else if (profile.changesPercentage > 0) {
    span.classList = 'percentPositive'
    span.textContent = `(+${profile.changesPercentage}%)`
  } else {
    span.classList = 'percentNeutral'
    span.textContent = `-No recent price changes found-`
  }

  img.src = profile.image;
  img.alt = 'Company Logo';
  let listItem = document.querySelector(`a[href="${pageLink}"]`).parentNode;
  listItem.insertBefore(img, listItem.firstChild);
  listItem.appendChild(span);
}