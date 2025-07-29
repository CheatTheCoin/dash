async function fetchData() {
  try {
    const res = await fetch("/api/prices");
    const data = await res.json();

    updateElement("btc", data.bitcoin);
    updateElement("paxg", data.paxg);
    updateElement("oil", data.oil);
    updateElement("sp500", data.sp500);
  } catch (err) {
    console.error("Villa við fetchData:", err);
  }
}

function updateElement(id, value) {
  const el = document.getElementById(id);
  if (!value || value.price === undefined) {
    el.querySelector(".price").textContent = "N/A";
    el.querySelector(".change").textContent = "";
    return;
  }

  el.querySelector(".price").textContent = `$${value.price.toLocaleString()}`;
  el.querySelector(".change").textContent = `${value.change.toFixed(2)}%`;
  el.querySelector(".change").style.color = value.change >= 0 ? "#4caf50" : "#f44336";
}

fetchData();
setInterval(fetchData, 300000);