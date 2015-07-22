/**
 * Created by Ivan on 7/15/2015.
 */
Framework = {

    init: function() {
        /* INITIALIZE BOOTSTRAP CONTROLS */

        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();



        /* HOOK INTO AJAX REQUESTS */

        // Register a handler to be called when the first Ajax request begins.
        $(document).ajaxStart(function() {

        });

        // Register a handler to be called when all Ajax requests have completed.
        $(document).ajaxStop(function() {

        });

        // Register a handler to be called when Ajax requests complete.
        $(document).ajaxComplete(function(event, xhr, settings) {

        });

        // Register a handler to be called when Ajax requests complete with an error.
        $(document).ajaxError(function(event, jqxhr, settings, thrownError) {

        });

        // Attach a function to be executed whenever an Ajax request completes successfully.
        $(document).ajaxSuccess(function(event, xhr, settings) {

        });

        // Attach a function to be executed before an Ajax request is sent.
        $(document).ajaxSend(function(event, jqxhr, settings) {

        });
    }

};

window.alert = function(text) {
    $('#alert-modal .modal-body p').html(text);
    $('#alert-modal').modal({});
};

window.prompt = function(text,defaultText) {

};

window.confirm = function(message) {

};

jQuery(document).ready(function(){
    Framework.init();

    var connection = new WebSocket('ws://localhost:8765');
    connection.onopen = function () {
        connection.send('Ivan'); // Send the message 'Ping' to the server
    };

    // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        console.log(e.data);
    };

    //alert('test');
});

