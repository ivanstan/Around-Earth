/**
 * Created by Ivan on 5/1/2015.
 */
App.modules.groundStations = {

    init: function () {
        $.ajax({
            url: App.settings.apiEndpoint + 'api/ground-stations',
            dataType: 'json',
            success: function (data) {
                for (var i in data) {
                    var latitude = parseFloat(data[i].latitude);
                    var longitude = parseFloat(data[i].longitude);
                    var range = parseFloat(data[i].range);

                    if(range > 0) {
                        switch (data[i].type) {
                            case 'nen':
                                var color = '#428AA9';
                                break;
                            case 'dsn':
                                var color = '#F3DC36';
                                //var color = '#F39A36';
                                break;
                            default:

                        };

                        var rangePath = new google.maps.Polygon({
                            paths: [drawCircle(new google.maps.LatLng(latitude , longitude), range, 1)],
                            strokeColor: color,
                            fillOpacity: 0,
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            geodesic: true
                        });
                        rangePath.setMap(App.map);
                    }

                    var circle ={
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: color,
                        fillOpacity: .4,
                        scale: 4.5,
                        strokeColor: color,
                        strokeWeight: 1
                    };

                    var popupText = data[i].name + '<br><br>';
                    popupText += 'Latitude: ' + latitude.toFixed(2);
                    popupText += '<br>';
                    popupText += 'Longitude: ' + longitude.toFixed(2);

                    if(data[i].description) {
                        popupText += '<br><br>';
                        popupText +=  data[i].description;
                    }

                    var marker = new google.maps.Marker({
                        position: (new google.maps.LatLng(latitude, longitude)),
                        icon: circle,
                        map: App.map,
                        context: popupText
                    });

                    google.maps.event.addListener(marker, 'click', function (event) {
                        App.modules.contextualPopup.show(this.context);
                    });

                    App.mapFeatures.groundStations.push(marker);
                }
            }
        });
    }

}