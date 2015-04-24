import sys
import json
import ephem
import math
from pyorbital import tlefile
from pyorbital.orbital import Orbital
from datetime import datetime, timedelta
import time
import calendar

SIDERAL_DAY_SEC = 86164.0905
MU = 398600 # Earth standard gravitational parameter

satellite = sys.argv[1]
userLat = float(sys.argv[2])
userLng = float(sys.argv[3])
userAlt = float(sys.argv[4])
line1 = sys.argv[5]
line2 = sys.argv[6]

tle = tlefile.read(satellite, None, line1, line2)

orb = Orbital(satellite, None, line1, line2)

now = datetime.utcnow()
# Get normalized position and velocity of the satellite:
pos, vel = orb.get_position(now)
# Get longitude, latitude and altitude of the satellite:
position = orb.get_lonlatalt(now)

data = {}

timestamp = calendar.timegm(now.utctimetuple())


az, el = orb.get_observer_look(now, userLng, userLat, userAlt);

data['user_view'] = {}
data['user_view']['azimuth'] = az
data['user_view']['elevation'] = el

data['timestamp'] = timestamp
data['satellite'] = satellite

data['tle'] = {};
data['tle']['arg_perigee'] = orb.tle.arg_perigee
data['tle']['bstar'] = orb.tle.bstar
data['tle']['classification'] = orb.tle.classification
data['tle']['element_number'] = orb.tle.element_number
data['tle']['ephemeris_type'] = orb.tle.ephemeris_type
data['tle']['epoch'] = (orb.tle.epoch - datetime(1970, 1, 1)).total_seconds()
data['tle']['epoch_day'] = orb.tle.epoch_day
data['tle']['epoch_year'] = orb.tle.epoch_year
data['tle']['eccentricity'] = orb.tle.excentricity
data['tle']['id_launch_number'] = orb.tle.id_launch_number
data['tle']['id_launch_piece'] = orb.tle.id_launch_piece
data['tle']['id_launch_year'] = orb.tle.id_launch_year
data['tle']['inclination'] = orb.tle.inclination
data['tle']['mean_anomaly'] = orb.tle.mean_anomaly
data['tle']['mean_motion'] = orb.tle.mean_motion
data['tle']['mean_motion_derivative'] = orb.tle.mean_motion_derivative
data['tle']['mean_motion_sec_derivative'] = orb.tle.mean_motion_sec_derivative
data['tle']['orbit'] = orb.tle.orbit
data['tle']['right_ascension'] = orb.tle.right_ascension
data['tle']['satnumber'] = orb.tle.satnumber

data['tle']['orbit_time']  =  SIDERAL_DAY_SEC / orb.tle.mean_motion

semi_major_axis = (MU/pow(orb.tle.mean_motion*2*math.pi/(24*3600), 2)) ** (1 / 3.0)
data['tle']['semi_major_axis'] = semi_major_axis
data['tle']['semi_minor_axis'] = semi_major_axis * math.sqrt(1 - pow(orb.tle.excentricity, 2))

data['position'] = {}
data['position']['longitude'] = position[0]
data['position']['latitude'] = position[1]
data['position']['altitude'] = position[2]
# data['position']['velocity'] = vel

earth_mass = 5.972E24
g_constant = 6.67384E-11
orbital_radius = ephem.earth_radius + position[2]
velocity = math.sqrt(g_constant * earth_mass / orbital_radius);
data['position']['velocity'] = velocity

# calculate orbit line
halforbit = data['tle']['orbit_time'] / 2

start = timestamp - halforbit
from_date = now - timedelta(seconds=halforbit)
to_date = now + timedelta(seconds=halforbit)

# data['1'] = from_date.strftime("%Y-%m-%d %H:%M:%S")
# data['2'] = to_date.strftime("%Y-%m-%d %H:%M:%S")

delta=timedelta(minutes=1)
lineArray = []
while from_date <= to_date:

    onePointPosition = orb.get_lonlatalt(from_date)
    onePoint = {}
    onePoint['timestamp'] = start
    onePoint['longitude'] = onePointPosition[0]
    onePoint['latitude'] = onePointPosition[1]
    onePoint['altitude'] = onePointPosition[2]
    lineArray.append(onePoint);

    from_date = from_date + delta

data['orbit'] = lineArray

json_data = json.dumps(data)

print json_data
