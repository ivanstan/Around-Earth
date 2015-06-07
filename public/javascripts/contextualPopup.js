/**
 * Created by Ivan on 5/2/2015.
 */
App.modules.contextualPopup = {
    selected: null,

    init: function(context) {
        switch(context) {
            case 'user':
                App.modules.contextualPopup.userContextInit();
                App.modules.contextualPopup.show();
                break;
            case 'satellite':
                App.modules.contextualPopup.satelliteContextInit();
                App.modules.contextualPopup.show();
                break;
        }
    },

    show: function (text) {
        var popup = $('#contextual-popup');
        popup.html(text);
        popup.slideDown(300);
    },

    popupHide: function () {

    },

    userContextInit: function () {
        var template = Handlebars.compile($("#user-context").html());
        var html    = template({
            location: '',
            latitude: parseFloat(App.user.position.latitude).toFixed(2),
            longitude: parseFloat(App.user.position.longitude).toFixed(2),
            altitude: parseFloat(App.user.position.altitude).toFixed(2)
        });

        $('#contextual-popup').html(html);
    },

    userContextUpdate: function () {

    },

    satelliteContextInit: function() {
        var template = Handlebars.compile($("#satellite-context").html());
        var html    = template({
            location: '',
            latitude: parseFloat(App.user.position.latitude).toFixed(2),
            longitude: parseFloat(App.user.position.longitude).toFixed(2),
            altitude: parseFloat(App.user.position.altitude).toFixed(2)
        });

        $('#contextual-popup').html(html);
    },

    satelliteContextUpdate: function () {

    }

}