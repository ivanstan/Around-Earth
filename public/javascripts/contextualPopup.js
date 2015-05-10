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
        }
    },

    show: function () {
        var popup = $('#contextual-popup');
        popup.slideDown(1000);
        App.modules.contextualPopup.selected = 'user';
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

    }

}