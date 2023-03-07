class Results {
  constructor(userInput, urlBase, loader, searchList) {
    this.userInput = userInput;
    this.urlBase = urlBase;
    this.loader = loader;
    this.searchList = searchList;
  }

  async getResults() {
    loader.removeAttribute("style");
    searchList.innerText = " ";
    const url = this.urlBase + `/search?query=${this.userInput.value}&exchange=NASDAQ`;
    try {
      const response = await fetch(url);
      const data = await response.json()
      this.displayResults(data);
    }
    catch (error) {
      console.error(error);
    }
  }

  displayResults(data) {
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
      let searchText = `<span>${name}</span> - <span>[${symbol}]</span>`;
      div.innerHTML = searchText
      link.append(div);
      listItem.appendChild(link);
      searchList.appendChild(listItem);
      this.getAdditionalResults(symbol, pageLink);
    }
  }

  async getAdditionalResults(symbol, pageLink) {
    const url = urlBase + `company/profile/${symbol}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.displayAdditionalResults(data, pageLink);
    }
    catch (error) {
      console.error(error);
    }
  }

  displayAdditionalResults(data, pageLink) {
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
    img.onerror = function () {
      this.src = "https://cdn-icons-png.flaticon.com/512/5044/5044835.png"
    };

    // todo change the company image and percentage if the 'profile' endpoint is empty

    let listItem = document.querySelector(`a[href="${pageLink}"]`).parentNode;
    listItem.insertBefore(img, listItem.firstChild);
    listItem.appendChild(span);
  }
}

const results = new Results(userInput, urlBase);

searchBtn.addEventListener('click', () => {
  results.getResults()
});


document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    results.getResults();
  }
});