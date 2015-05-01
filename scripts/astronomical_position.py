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

print json.dumps(data)
