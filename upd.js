function updatePrice() {
	if (window.ct) {
		var el = document.querySelector("#now");
		aht = new XMLHttpRequest();
		aht.responseType = "json";
		aht.open("GET", `https://trade.ton-rocket.com/rates/crypto/${window.ct}/TONCOIN`, true);
		aht.send();
		aht.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (aht.response.success) {
					el.innerText = `1 ${window.ct} = ${aht.response.data.rate} TON`;
				}
			}
		}
	}
}

function initUpd() {
	if (!window.ct) {
		return setTimeout(initUpd, 500);
	}
	window.updatePrice = updatePrice;
	updatePrice();
	setInterval(updatePrice, 6 * 1000);
}

initUpd();
