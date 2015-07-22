/**
 * Created by Ivan on 5/1/2015.
 */
App.modules.rightPanel = {

    updateRightPanel: function () {
        var data = App.satellite.data;

        $('#label-latitude').html(parseFloat(data.position.latitude).toFixed(5));
        $('#label-longitude').html(parseFloat(data.position.longitude).toFixed(5));
        $('#label-altitude').html(parseFloat(data.position.altitude).toFixed(2) + ' km');
        $('#label-epoch').html(data.tle.epoch_year + data.tle.epoch_day);
        $('#label-raan').html(data.tle.right_ascension);
        $('#label-argp').html(data.tle.arg_perigee);
        $('#label-ecce').html(data.tle.eccentricity);
        $('#label-inclination').html(data.tle.inclination);
        $('#label-mean-motion').html(data.tle.mean_motion);
        $('#label-ma').html(data.tle.mean_anomaly);
        $('#label-drag').html(data.tle.bstar);
        $('#label-satellite').html($('#select-satellite').val());
        var periodMins = parseInt(data.tle.orbit_time / 60);
        $('#label-period').html('~' + periodMins + ' min');
        $('#label-orbit-number').html(data.tle.orbit);
        $('#label-velocity').html(parseFloat(data.tle.range_velocity).toFixed(2) + ' km/h');
        $('#passing-over-time').html(secondstotime(data.next_pass.until));

        if(App.bindEvents.passingOverCountdown == null) {
            App.bindEvents.passingOverCountdown = setInterval(function () {
                App.satellite.data.next_pass.until -= 1;
                $('#passing-over-time').html(secondstotime(App.satellite.data.next_pass.until));
            }, 1000);
        }

    },

    updateUserView: function(azimuth, elevation) {
        var compass_rotation = azimuth;
        var elevation = elevation * -1;

        $('#user-view-elevation #label-elvation').html(parseInt(elevation) + '°');
        $('#user-view-compass #label-azimuth').html(parseInt(compass_rotation) + '°');
        $('#user-view-compass #station').css('transform', 'rotate(' + compass_rotation + 'deg)');
        $('#user-view-elevation #elevation').attr('transform', 'rotate(' + elevation + ' 0 55)');
    },

    initPassingOver: function() {
        var nextPass = App.satellite.data.next_pass;

        var time = nextPass.rise_time;
        var deltaT = 5;


        var azimuths = [];
        var elevations = [];
        while(time < nextPass.set_time) {
            var orbitalTime = new Orb.Time((new Date(time * 1000)));
            var geo = App.satellite.propagator.position.geographic(orbitalTime);
            var observer = new Orb.Observer(App.user.position);
            var observation = new Orb.Observation({"observer": observer, "target": App.satellite.propagator});
            var userView = observation.horizontal(orbitalTime);

            var latitude = parseFloat(geo.latitude).toFixed(2);
            var longitude = parseFloat(geo.longitude).toFixed(2);
            var altitude = parseFloat(geo.altitude).toFixed(2);
            var elevation = parseFloat(userView.elevation * (180 / Math.PI)).toFixed(2) * 1;
            var azimuth = parseFloat(userView.azimuth).toFixed(2) * 1;

            var userLatLng = (new google.maps.LatLng(App.user.position.latitude, App.user.position.longitude));
            var satelliteLatLng = (new google.maps.LatLng(latitude, longitude));
            var distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, satelliteLatLng); //meters

            time += deltaT;

            azimuths.push(azimuth);
            elevations.push(elevation);
        }

        //App.modules.rightPanel.passingChart = $('#passing-over-chart').highcharts({
        //    title: {
        //        text: '',
        //        style: {
        //            display: 'none'
        //        }
        //    },
        //    credits: {
        //        enabled: false
        //    },
        //    xAxis: {
        //        categories: elevation,
        //        labels: {
        //            enabled: false
        //        }
        //    },
        //    yAxis: {
        //        title: {
        //            text: 'Altitude (km)'
        //        },
        //        plotLines: [{
        //            value: 0,
        //            width: 1,
        //            color: '#808080'
        //        }]
        //    },
        //    tooltip: {
        //        valueSuffix: ' km',
        //        crosshairs: [true,true],
        //        //backgroundColor: 'rgba(15, 99, 136, 0.5)'
        //    },
        //    series: [{
        //        name: 'asd',
        //        color: '#AFB5DC',
        //        data: azimuths
        //    }]
        //});











        var w = 250,
            h = 250;

        var colorscale = d3.scale.category10();

//Legend titles
        var LegendOptions = ['Smartphone'];

//Data
        var d = [
            //[
            //    {axis:"Email",value:0.59},
            //    {axis:"Social Networks",value:0.56},
            //    {axis:"Internet Banking",value:0.42},
            //    {axis:"News Sportsites",value:0.34},
            //    {axis:"Search Engine",value:0.48},
            //    {axis:"View Shopping sites",value:0.14},
            //    {axis:"Paying Online",value:0.11},
            //    {axis:"Buy Online",value:0.05},
            //    {axis:"Stream Music",value:0.07},
            //    {axis:"Online Gaming",value:0.12},
            //    {axis:"Navigation",value:0.27},
            //    {axis:"App connected to TV program",value:0.03},
            //    {axis:"Offline Gaming",value:0.12},
            //    {axis:"Photo Video",value:0.4},
            //    {axis:"Reading",value:0.03},
            //    {axis:"Listen Music",value:0.22},
            //    {axis:"Watch TV",value:0.03},
            //    {axis:"TV Movies Streaming",value:0.03},
            //    {axis:"Listen Radio",value:0.07},
            //    {axis:"Sending Money",value:0.18},
            //    {axis:"Other",value:0.07},
            //    {axis:"Use less Once week",value:0.08}
            //],
            //[
            //    {axis:"Email",value:0.48},
            //    {axis:"Social Networks",value:0.41},
            //    {axis:"Internet Banking",value:0.27},
            //    {axis:"News Sportsites",value:0.28},
            //    {axis:"Search Engine",value:0.46},
            //    {axis:"View Shopping sites",value:0.29},
            //    {axis:"Paying Online",value:0.11},
            //    {axis:"Buy Online",value:0.14},
            //    {axis:"Stream Music",value:0.05},
            //    {axis:"Online Gaming",value:0.19},
            //    {axis:"Navigation",value:0.14},
            //    {axis:"App connected to TV program",value:0.06},
            //    {axis:"Offline Gaming",value:0.24},
            //    {axis:"Photo Video",value:0.17},
            //    {axis:"Reading",value:0.15},
            //    {axis:"Listen Music",value:0.12},
            //    {axis:"Watch TV",value:0.1},
            //    {axis:"TV Movies Streaming",value:0.14},
            //    {axis:"Listen Radio",value:0.06},
            //    {axis:"Sending Money",value:0.16},
            //    {axis:"Other",value:0.07},
            //    {axis:"Use less Once week",value:0.17},
            //    {axis:"Use less Once week",value:0.17},
            //    {axis:"Use less Once week",value:0.17}
            //]
        ];


        //max_elevation
        //rise_azimuth
        //rise_time
        //set_azimuth
        //set_time
        //transit_time
        //until

        var deltaTime = nextPass.set_time - nextPass.rise_time;
        var timeIncrease = parseInt(deltaTime / 11);

        var nextPassData = [];
        var axis = 0;

        var time = nextPass.set_time;
        for(var i = 0; i <= 11; i++) {
            time += timeIncrease;

            var orbitalTime = new Orb.Time((new Date(time * 1000)));
            var geo = App.satellite.propagator.position.geographic(orbitalTime);
            var observation = new Orb.Observation({"observer": (new Orb.Observer(App.user.position)), "target": App.satellite.propagator});
            var userView = observation.horizontal(orbitalTime);
            var userPosition = (new google.maps.LatLng(App.user.position.latitude, App.user.position.longitude));

            nextPassData.push({
                'latitude': parseFloat(geo.latitude).toFixed(4) * 1,
                'longitude': parseFloat(geo.longitude).toFixed(4) * 1,
                'altitude': parseFloat(geo.altitude).toFixed(4) * 1,
                'elevation': parseFloat(userView.elevation * (180 / Math.PI)).toFixed(4) * 1,
                'azimuth': parseFloat(userView.azimuth).toFixed(4) * 1,
                'distance': google.maps.geometry.spherical.computeDistanceBetween(userPosition, (new google.maps.LatLng(parseFloat(geo.latitude).toFixed(4), parseFloat(geo.longitude).toFixed(4)))) / 1000 // kilometers
            });
        }


        var time = nextPass.set_time;
        var data = [];
        for(var i = 0; i <= 11; i++) {
            axis += 30;

            var distance = 0;
            for(var j in nextPassData) {
                if(axis > nextPassData[j].azimuth - 5 && axis < nextPassData[j].azimuth + 5) {
                    distance = nextPassData[j].distance;
                }
            }

            data.push({axis: axis + ' ', value: 14});

        }

        console.log(data);

        d.push(data);




//Options for the Radar chart, other than default
        var mycfg = {
            w: w,
            h: h,
            maxValue: 0.6,
            levels: 6,
            ExtraWidthX: 250,
            ExtraWidthY: 250
        };

//Call function to draw the R;adar chart
//Will expect that data is in %'s
//        RadarChart.draw("#polar-chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

        //var svg = d3.select('#polar-chart')
        //    .selectAll('svg')
        //    .append('svg')
        //    .attr("width", w+300)
        //    .attr("height", h)

//Create the title for the legend
//        var text = svg.append("text")
//            .attr("class", "title")
//            .attr('transform', 'translate(90,0)')
//            .attr("x", w - 70)
//            .attr("y", 10)
//            .attr("font-size", "12px")
//            .attr("fill", "#404040")
//            .text("What % of owners use a specific service in a week");

//Initiate Legend
//        var legend = svg.append("g")
//                .attr("class", "legend")
//                .attr("height", 100)
//                .attr("width", 200)
//                .attr('transform', 'translate(90,20)')
//            ;
        //Create colour squares
        //legend.selectAll('rect')
        //    .data(LegendOptions)
        //    .enter()
        //    .append("rect")
        //    .attr("x", w - 65)
        //    .attr("y", function(d, i){ return i * 20;})
        //    .attr("width", 10)
        //    .attr("height", 10)
        //    .style("fill", function(d, i){ return colorscale(i);})
        //;
        //Create text next to squares
        //legend.selectAll('text')
        //    .data(LegendOptions)
        //    .enter()
        //    .append("text")
        //    .attr("x", w - 52)
        //    .attr("y", function(d, i){ return i * 20 + 9;})
        //    .attr("font-size", "11px")
        //    .attr("fill", "#737373")
        //    .text(function(d) { return d; })
        //;











    },
    
    calculatePassingOver: function () {

    }
}

