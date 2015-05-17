/**
 * Created by Ivan on 5/17/2015.
 */
function isNight() {
    var hr = (new Date()).getHours();
    return !(hr > 5 && hr < 20);
}

function secondstotime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(0, 8);
    if (secs > 86399)
        s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}

function drawCircle(point, radius, dir) {
    var d2r = Math.PI / 180;   // degrees to radians
    var r2d = 180 / Math.PI;   // radians to degrees
    var earthsradius = 6371; // 3963 is the radius of the earth in kilometers

    var points = 32;

    // find the raidus in lat/lon
    var rlat = (radius / earthsradius) * r2d;
    var rlng = rlat / Math.cos(point.lat() * d2r);

    var extp = new Array();
    if (dir==1) {
        var start=0;
        var end=points+1; // one extra here makes sure we connect the path
    } else {
        var start=points+1;
        var end=0;
    }
    for (var i=start; (dir==1 ? i < end : i > end); i=i+dir)
    {
        var theta = Math.PI * (i / (points/2));
        ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
        ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
        extp.push(new google.maps.LatLng(ex, ey));
    }
    return extp;
}

function GetTimezoneShort(now) { //now is expected as a Date object
    if(now==null)
        return '';
    var str = now.toString();
// Split on the first ( character
    var s = str.split("(");
    if (s.length == 2)
    {
// remove the ending ')'
        var n = s[1].replace(")", "");
// split on words
        var parts = n.split(" ");
        var abbr = "";
        for(i = 0; i < parts.length; i++)
        {
// for each word - get the first letter
            abbr += parts[i].charAt(0).toUpperCase();
        }
        return abbr;
    }
}