import sys
import ephem
import json
import calendar
from datetime import datetime, timedelta
from math import atan, atan2, degrees, floor, pi, radians, sin, sqrt
from skyfield.api import earth, JulianDate, now, sun, moon, utc

def earth_latlon(x, y, z, time):
    """
    For an object at the given XYZ coordinates relative to the center of
    the Earth at the given datetime, returns the latitude and longitude
    as it would appear on a world map.

    Units for XYZ don't matter.
    """
    julian_date = JulianDate(utc=time).tt
    # see https://en.wikipedia.org/wiki/Julian_date#Variants
    # libastro calls this "mjd", but the "Modified Julian Date" is
    # something entirely different
    dublin_julian_date = julian_date - 2415020

    # the following block closely mirrors libastro, so don't blame me
    # if you have no clue what the variables mean or what the magic
    # numbers are because I don't either
    sidereal_solar = 1.0027379093
    sid_day = floor(dublin_julian_date)
    t = (sid_day - 0.5) / 36525
    sid_reference = (6.6460656 + (2400.051262 * t) + (0.00002581 * (t**2))) / 24
    sid_reference -= floor(sid_reference)
    lon = 2 * pi * ((dublin_julian_date - sid_day) *
                    sidereal_solar + sid_reference) - atan2(y, x)
    lon = lon % (2 * pi)
    lon -= pi
    lat = atan(z / sqrt(x**2 + y**2))

    return degrees(lat), degrees(-lon)


time = datetime.utcnow()
time = time.replace(tzinfo=utc)

data = {}
data['moon'] = {}
data['sun'] = {}

x, y, z = earth(JulianDate(utc=time)).observe(moon).apparent().position.AU
lat, lng = earth_latlon(x, y, z, time)
data['moon']['latitude'] = lat
data['moon']['longitude'] = lng

x, y, z = earth(JulianDate(utc=time)).observe(sun).apparent().position.AU
lat, lng = earth_latlon(x, y, z, time)
data['sun']['latitude'] = lat
data['sun']['longitude'] = lng

observer      = ephem.Observer()
observer.date = ephem.Date(time)
observer.lon  = sys.argv[2]
observer.lat  = sys.argv[1]
observer.elev = float(sys.argv[3])

#For U.S. Naval Astronomical Almanac values
observer.pressure= 0
observer.horizon = '-0:34'

# SUN DATA
sunrise = observer.previous_rising(ephem.Sun())
sunnoon    = observer.next_transit   (ephem.Sun())
sunset  = observer.next_setting   (ephem.Sun())
data['sun']['rise'] = calendar.timegm(sunset.datetime().utctimetuple())
data['sun']['noon']    = calendar.timegm(sunnoon.datetime().utctimetuple())
data['sun']['set']  = calendar.timegm(sunset.datetime().utctimetuple())
data['sun']['radius'] = ephem.sun_radius

observer.horizon = '-6' # civil twilight
civilian_twilight_start = observer.previous_rising(ephem.Sun())
civilian_twilight_end = observer.next_setting(ephem.Sun())

observer.horizon = '-12' # nautical twilight
nautical_twilight_start = observer.previous_rising(ephem.Sun())
nautical_twilight_end = observer.next_setting(ephem.Sun())

observer.horizon = '-18' # astronomical twilight
astronomical_twilight_start = observer.previous_rising(ephem.Sun())
astronomical_twilight_end = observer.next_setting(ephem.Sun())

data['sun']['civilian_twilight_start'] = calendar.timegm(civilian_twilight_start.datetime().utctimetuple())
data['sun']['civilian_twilight_end'] = calendar.timegm(civilian_twilight_end.datetime().utctimetuple())

data['sun']['nautical_twilight_start'] = calendar.timegm(nautical_twilight_start.datetime().utctimetuple())
data['sun']['nautical_twilight_end'] = calendar.timegm(nautical_twilight_end.datetime().utctimetuple())

data['sun']['astronomical_twilight_start'] = calendar.timegm(astronomical_twilight_start.datetime().utctimetuple())
data['sun']['astronomical_twilight_end'] = calendar.timegm(astronomical_twilight_end.datetime().utctimetuple())

sun = ephem.Sun()
sun.compute(observer)

data['sun']['altitude'] = sun.alt
data['sun']['azimuth'] = sun.az

# MOON DATA
moonrise = observer.previous_rising(ephem.Moon())
moonnoon    = observer.next_transit   (ephem.Moon())
moonset  = observer.next_setting   (ephem.Moon())
data['moon']['rise'] = calendar.timegm(moonrise.datetime().utctimetuple())
data['moon']['noon']    = calendar.timegm(moonnoon.datetime().utctimetuple())
data['moon']['set']  = calendar.timegm(moonset.datetime().utctimetuple())
data['moon']['radius'] = ephem.moon_radius

previous_new_moon = ephem.previous_new_moon(time)
next_new_moon = ephem.next_new_moon(time)
previous_first_quarter_moon = ephem.previous_first_quarter_moon(time)
next_first_quarter_moon = ephem.next_first_quarter_moon(time)
previous_full_moon = ephem.previous_full_moon(time)
next_full_moon = ephem.next_full_moon(time)
previous_last_quarter_moon = ephem.previous_last_quarter_moon(time)
next_last_quarter_moon = ephem.next_last_quarter_moon(time)

data['moon']['previous_new_moon'] = calendar.timegm(previous_new_moon.datetime().utctimetuple())
data['moon']['next_new_moon'] = calendar.timegm(next_new_moon.datetime().utctimetuple())
data['moon']['previous_first_quarter_moon'] = calendar.timegm(previous_first_quarter_moon.datetime().utctimetuple())
data['moon']['next_first_quarter_moon'] = calendar.timegm(next_first_quarter_moon.datetime().utctimetuple())
data['moon']['previous_full_moon'] = calendar.timegm(previous_full_moon.datetime().utctimetuple())
data['moon']['next_full_moon'] = calendar.timegm(next_full_moon.datetime().utctimetuple())
data['moon']['previous_last_quarter_moon'] = calendar.timegm(previous_last_quarter_moon.datetime().utctimetuple())
data['moon']['next_last_quarter_moon'] = calendar.timegm(next_last_quarter_moon.datetime().utctimetuple())

moon = ephem.Moon()
moon.compute(observer)

data['moon']['phase'] = moon.moon_phase
data['moon']['altitude'] = moon.alt
data['moon']['azimuth'] = moon.az

print json.dumps(data)
