import fetch from 'node-fetch';

export default async function handler(req, res) {
  const coingeckoURL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=usd&include_24hr_change=true';
  const finnhubAPI = process.env.FINNHUB_API_KEY;

  try {
    // Fetch BTC & PAXG frá CoinGecko
    const cgRes = await fetch(coingeckoURL);
    const cgData = await cgRes.json();

    // Fetch Brent Oil frá Finnhub
    const oilRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=OANDA:BCO_USD&token=${finnhubAPI}`);
    const oilData = await oilRes.json();

    // Fetch S&P 500 frá Finnhub
    const spRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${finnhubAPI}`);
    const spData = await spRes.json();

    res.status(200).json({
      bitcoin: {
        price: cgData.bitcoin.usd,
        change: cgData.bitcoin.usd_24h_change
      },
      paxg: {
        price: cgData["pax-gold"].usd,
        change: cgData["pax-gold"].usd_24h_change
      },
      oil: {
        price: oilData.c,
        change: ((oilData.c - oilData.pc) / oilData.pc) * 100
      },
      sp500: {
        price: spData.c,
        change: ((spData.c - spData.pc) / spData.pc) * 100
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
}