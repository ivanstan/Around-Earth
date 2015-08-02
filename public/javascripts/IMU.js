IMU = {
    data: null,

    init: function() {
        var connection = new WebSocket('ws://localhost:8765');

        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        connection.onmessage = function (e) {
            var stream = e.data;
            stream = stream.replace('\\n', '');
            stream = stream.replace('\'', '');
            stream = stream.replace('\'', '');
            console.log(stream);

            IMU.data = JSON.parse(stream);
            console.log(IMU.data);
        };
    }

};

$(document).ready(function(){
    IMU.init();
});