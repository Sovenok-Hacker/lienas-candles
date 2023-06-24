var pr = new XMLHttpRequest();
pr.responseType = "json";
var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";
var c = false;
var cpicked;

pr.open("GET", "https://trade.ton-rocket.com/pairs", true);
pr.send();
pr.onreadystatechange = function() {
	if (!(this.readyState == 4)) {
			return;
	}
	var pairs = pr.response.data;
	var select = document.getElementById('coin');
	for (var j = 0; j < pairs.length; j++) {
		var coin = pairs[j].name.split("-")[0];
		if (j == 0) {
			getData(coin);
		}
		if (coin == 'TONCOIN') {
			continue;
		}
		var opt = document.createElement('option');
		opt.value = coin;
		opt.innerText = coin;
		select.appendChild(opt);
	}
}

var start = new Date();
start.setDate(start.getMonth() - 1);
var end = new Date();

function getData(coin) {
	cpicked = coin;
	window.ct = coin;
	window.updatePrice();
	xhttp.open("GET", `https://trade.ton-rocket.com/time-series/${coin}-TONCOIN?startDate=${start.toISOString()}&endDate=${end.toISOString()}&period=PERIOD_12_HOURS`, true);
	xhttp.send();
}

xhttp.onreadystatechange = function() {
	if (!(this.readyState == 4)) {
		return;
	}
	var jd = xhttp.response;
	if (!jd.success) {
		alert("Ошибка TON Rocket Trade API");
		return;
	}
	var data = jd.data.timeSeries;
	var cd = [];

	for (var j = 0; j < data.length; j++) {
		var z = data[j];
		cd.push({
			x: new Date(z.openTime),
			y: [z.openRate, z.maxRate, z.minRate, z.closeRate]
		})
	}

	var options = {
		series: [{
			data: cd
		}],
		chart: {
			type: 'candlestick',
			height: 350
		},
		title: {
			text: `${cpicked}-TON`,
			align: 'left'
		},
		xaxis: {
			type: 'datetime'
		},
		yaxis: {
			tooltip: {
				enabled: true
			}
		}
	};
	if (c) {
		c.destroy();
	}
	c = new ApexCharts(document.querySelector("#chart"), options);
	c.render();
}
