/**
 * Created by Ivan on 4/29/2015.
 */
App.modules.altitudeChart = {

    chart: null,

    init: function (data) {
        var altitudes = [];
        var categories = [];
        for (var i in data.orbit) {
            altitudes.push(parseFloat(data.orbit[i].altitude.toFixed(2)));
            var date = new Date(data.orbit[i].timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();

            categories.push(date.toUTCString());
        }

        App.modules.altitudeChart.chart = $('#altitude-chart').highcharts({
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories,
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Altitude (km)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' km',
                crosshairs: [true,true],
                //backgroundColor: 'rgba(15, 99, 136, 0.5)'
            },
            series: [{
                name: data.satellite,
                color: '#AFB5DC',
                data: altitudes
            }]
        });
    },
    update: function (data) {
        var altitudes = [];
        var categories = [];
        for (var i in data.orbit) {
            altitudes.push(parseFloat(data.orbit[i].altitude.toFixed(2)));
            var date = new Date(data.orbit[i].timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();

            categories.push(date.toUTCString());
        }
        App.modules.altitudeChart.chart.series = altitudes;
        App.modules.altitudeChart.chart.xAxis = {
            categories: categories,
            labels: {
                enabled: false
            }
        }
    }

}