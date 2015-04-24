Telemetry = {
    subscribeSensors: [
        //'USLAB000035', // X axis velocity
        'USLAB000058', // Cabin air pressure
        'USLAB000059', // Cabin air temperature
        'NODE3000001', // Oxygen
        'NODE3000002', // Nitrogen
        'NODE3000003', // CO2
        'NODE3000008', // Waste water
        'NODE3000009', // Clean water
        'P4000001', // Solar array 2A voltage
        'P4000004', // Solar array 4A voltage
        'P6000001', // Solar array 4B voltage
        'P6000004', // Solar array 2B voltage
        'S4000001', // Solar array 1A voltage
        'S4000004', // Solar array 3A voltage
        'S6000001', // Solar array 3B voltage
        'S6000004', // Solar array 1B voltage
    ],
    voltageChart: null,
    CabinPressureGauge: null,
    voltageChartSeries: [
        {name: '2A', data: [0], color: '#111F74'},
        {name: '4A', data: [0], color: '#3646A7'},
        {name: '4B', data: [0], color: '#515FB6'},
        {name: '2B', data: [0], color: '#7985CF'},
        {name: '1A', data: [0], color: '#074C6A'},
        {name: '3A', data: [0], color: '#0F6388'},
        {name: '3B', data: [0], color: '#287799'},
        {name: '1B', data: [0], color: '#428AA9'}
    ],
    defaultPieOptions: {
        credits: {enabled: false},
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                size:'180%',
                allowPointSelect: true,
                dataLabels: false,
                showInLegend: true,
                colors: ['#3646A7', '#287799', '#5B32A6']
            }
        },
        chart: {
            backgroundColor: '#f9f9f9',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        }
    },
    defaultGaugeOptions: {
        chart: {
            type: 'solidgauge',
            backgroundColor: '#f9f9f9',
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '120%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        yAxis: {
            stops: [
                [0.1, '#3646A7'],
                [0.4, '#287799'],
                [0.7, '#5B32A6'],
                [0.9, '#F3DC36']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    },
    voltageChartDataAdd: function (name, value) {
        for (var i in Telemetry.voltageChartSeries) {
            if (name == Telemetry.voltageChartSeries[i].name) {
                Telemetry.voltageChartSeries[i].data = [parseFloat(parseFloat(value).toFixed(2))];
            }
        }
    },
    init: function () {
        var client = new Lightstreamer.LightstreamerClient('http://push.lightstreamer.com', 'ISSLIVE');
        client.connect();
        var subscription = new Lightstreamer.Subscription("MERGE", Telemetry.subscribeSensors, ['Value']);
        client.subscribe(subscription);
        subscription.addListener({
            onSubscription: null,
            onUnsubscription: null,
            onItemUpdate: (function (update) {
                var sensorName = update.getItemName();
                var value = update.getValue('Value');

                if (sensorName == 'P4000001') Telemetry.voltageChartDataAdd('2A', value);
                if (sensorName == 'P4000004') Telemetry.voltageChartDataAdd('4A', value);
                if (sensorName == 'P6000001') Telemetry.voltageChartDataAdd('4B', value);
                if (sensorName == 'P6000004') Telemetry.voltageChartDataAdd('2B', value);
                if (sensorName == 'S4000001') Telemetry.voltageChartDataAdd('1A', value);
                if (sensorName == 'S4000004') Telemetry.voltageChartDataAdd('3A', value);
                if (sensorName == 'S6000001') Telemetry.voltageChartDataAdd('3B', value);
                if (sensorName == 'S6000004') Telemetry.voltageChartDataAdd('1B', value);
                if (sensorName == 'USLAB000058') Telemetry.CabinPressureValue = value;
                if (sensorName == 'USLAB000059') Telemetry.CabinTemperatureValue = value;
                if (sensorName == 'NODE3000008') Telemetry.wasteWaterValue = value;
                if (sensorName == 'NODE3000009') Telemetry.cleanWaterValue = value;
                if (sensorName == 'NODE3000001') Telemetry.oxygenValue = value;
                if (sensorName == 'NODE3000002') Telemetry.nitrogenValue = value;
                if (sensorName == 'NODE3000003') Telemetry.co2Value = value;
            })
        });

        Telemetry.initVoltageChart();
        Telemetry.initCabinPressureChart();
        Telemetry.initCabinTemperatureChart();
        Telemetry.initWaterChart();
        Telemetry.initAirChart();
    },

    initVoltageChart: function () {
        Telemetry.voltageChart = jQuery('#voltage-chart').highcharts({
            chart: {
                type: 'column',
                backgroundColor: '#f9f9f9',
                events: {
                    load: function () {
                        var element = this;
                        var series = this.series;
                        setInterval(function () {
                            series[0].data[0].update(Telemetry.voltageChartSeries[0].data[0]);
                            series[1].data[0].update(Telemetry.voltageChartSeries[1].data[0]);
                            series[2].data[0].update(Telemetry.voltageChartSeries[2].data[0]);
                            series[3].data[0].update(Telemetry.voltageChartSeries[3].data[0]);
                            series[4].data[0].update(Telemetry.voltageChartSeries[4].data[0]);
                            series[5].data[0].update(Telemetry.voltageChartSeries[5].data[0]);
                            series[6].data[0].update(Telemetry.voltageChartSeries[6].data[0]);
                            series[7].data[0].update(Telemetry.voltageChartSeries[7].data[0]);
                            element.redraw();
                        }, 1000);
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Solar Arrays'
            },
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Voltage'
                }
            },
            legend: {
                align: 'center',
                x: 35,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: Telemetry.voltageChartSeries
        });
    },
    initCabinPressureChart: function () {
        Telemetry.cabinPressureGauge = $('#pressure-chart').highcharts(Highcharts.merge(Telemetry.defaultGaugeOptions, {
            yAxis: {
                min: 0,
                max: 1125,
                title: {
                    text: 'Cabin Pressure'
                }
            },
            chart: {
                events: {
                    load: function () {
                        var chart = $('#pressure-chart').highcharts();
                        setInterval(function () {
                            if (chart) {
                                var point = chart.series[0].points[0];
                                var value = parseFloat(Telemetry.CabinPressureValue).toFixed(2);
                                point.update(parseFloat(value));
                            }
                        }, 2000);
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Speed',
                data: [0],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:11px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">mmHg</span></div>'
                },
                tooltip: {
                    valueSuffix: ' mmHg'
                }
            }]

        }));
    },
    initCabinTemperatureChart: function () {
        Telemetry.cabinTemperatureGauge = $('#temperature-chart').highcharts(Highcharts.merge(Telemetry.defaultGaugeOptions, {
            chart: {
                events: {
                    load: function () {
                        var chart = $('#temperature-chart').highcharts();
                        setInterval(function () {
                            if (chart) {
                                var point = chart.series[0].points[0];
                                var value = parseFloat(Telemetry.CabinTemperatureValue).toFixed(2);
                                point.update(parseFloat(value));
                            }
                        }, 2000);
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 45,
                title: {
                    text: 'Cabin Temperature'
                }
            },

            credits: {
                enabled: false
            },

            series: [{
                name: 'Speed',
                data: [0],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:11px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">°C</span></div>'
                },
                tooltip: {
                    valueSuffix: ' °C'
                }
            }]

        }));
    },
    initWaterChart: function () {
        $('#water-chart').highcharts(Highcharts.merge(Telemetry.defaultPieOptions, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                events: {
                    load: function () {
                        var chart = $('#water-chart').highcharts();
                        setInterval(function () {
                            var data = [
                                ['Clean Water', parseFloat(Telemetry.cleanWaterValue)],
                                ['Waste Water', parseFloat(Telemetry.wasteWaterValue)],
                            ]
                            chart.series[0].setData(data, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Water'
            },
            series: [{
                type: 'pie',
                name: 'Water',
                data: [
                    ['Clean Water', 0],
                    ['Waste Water', 0],
                ]
            }]
        }));
    },
    initAirChart: function () {
        $('#air-chart').highcharts(Highcharts.merge(Telemetry.defaultPieOptions, {
            chart: {
                events: {
                    load: function () {
                        var chart = $('#air-chart').highcharts();
                        setInterval(function () {
                            var data = [
                                ['Oxygen', parseFloat(Telemetry.oxygenValue)],
                                ['Nitrogen', parseFloat(Telemetry.nitrogenValue)],
                                ['CO2', parseFloat(Telemetry.co2Value)],
                            ]
                            chart.series[0].setData(data, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Atmosphere'
            },
            series: [{
                type: 'pie',
                name: 'Atmosphere',
                data: [
                    ['Oxygen', 0],
                    ['Nitrogen', 0],
                    ['CO2', 0],
                ]
            }]
        }));
    }
}

$(document).ready(function () {
    Telemetry.init();
});
