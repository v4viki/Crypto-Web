// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.getElementById('button').addEventListener('click',()=> {
    window.location.href = 'tracker.html';
});
// Fade-in animation on scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Slide-in animation on scroll
const sliders = document.querySelectorAll('.slide-in');

sliders.forEach(slider => {
    appearOnScroll.observe(slider);
});
const coins = ['bitcoin', 'ethereum', 'cardano', 'solana', 'dogecoin'];
const currencySelect = document.getElementById('currency');
let selectedCurrency = 'usd';

// Fetch prices
async function fetchPrices() {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=${selectedCurrency}`;
  const res = await fetch(url);
  const data = await res.json();

  coins.forEach(coin => {
    const element = document.getElementById(coin.split(' ')[0].substring(0, 4)); // e.g. btc, eth
    if (element) {
      element.querySelector('.price').textContent = data[coin][selectedCurrency];
    }
  });
}

// Chart setup
const ctx = document.getElementById('chart').getContext('2d');
let chart;

async function fetchChartData() {
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${selectedCurrency}&days=1&interval=hourly`;
  const res = await fetch(url);
  const data = await res.json();

  const labels = data.prices.map(p => {
    const date = new Date(p[0]);
    return `${date.getHours()}:${date.getMinutes()}`;
  });

  const prices = data.prices.map(p => p[1]);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `BTC Price in ${selectedCurrency.toUpperCase()}`,
        data: prices,
        borderColor: 'gold',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.2,
      }]
    },
    options: {
      responsive: true,
    }
  });
}

// Currency Change
currencySelect.addEventListener('change', (e) => {
  selectedCurrency = e.target.value;
  fetchPrices();
  fetchChartData();
});

// Initial calls
fetchPrices();
fetchChartData();
setInterval(fetchPrices, 5000);
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
