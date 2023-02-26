class Marquee {
  constructor(urlBase) {
    this.urlBase = urlBase;
  }

  async get() {
    const url = this.urlBase + `stock/list`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.display(data);
    } catch (error) {
      console.log(error);
    }
  }

  display(data) {
    const marquee = document.querySelector('.marquee-container');
    const text = document.getElementById('scrollingText');
    for (let i = 0; i < 20; i++) {
      let symbol = document.createElement('span');
      let price = document.createElement('span');
      let div = document.createElement('div');
      let marqueeText = [
        `<span class="marqueeSymbol">${data[i].symbol}</span> <span class="marqueePrice">(${data[i].price}$)</span>`
      ];
      div.innerHTML = marqueeText;
      text.appendChild(div);
      marquee.appendChild(text);
    }
  }
}
const marquee = new Marquee(urlBase);
marquee.get();