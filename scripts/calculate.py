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
EARTH_MASS = 5.972E24
C_GRAVITATIONAL = 6.67384E-11

satellite = sys.argv[1]
userLat = float(sys.argv[2])
userLng = float(sys.argv[3])
userAlt = float(sys.argv[4])
line1 = sys.argv[5]
line2 = sys.argv[6]
orbits = int(sys.argv[7])

tle = tlefile.read(satellite, None, line1, line2)
orb = Orbital(satellite, None, line1, line2)

now = datetime.utcnow()
timestamp = calendar.timegm(now.utctimetuple())
ephemNow = ephem.now()
# Get normalized position and velocity of the satellite:
pos, vel = orb.get_position(now)
# Get longitude, latitude and altitude of the satellite:
position = orb.get_lonlatalt(now)

eph = ephem.readtle("Unknown", line1, line2);
ephObserver = ephem.Observer()
ephObserver.date = now
ephObserver.lat = userLat
ephObserver.lon = userLng
ephObserver.elevation = userAlt
rt, razi, tt, televation, st, sazi = ephObserver.next_pass(eph)

eph.compute(ephObserver)

data = {}
data['next_pass'] = {}
data['next_pass']['until'] = "%d" % round((rt - ephemNow) * 3600 * 24)
data['next_pass']['rise_time'] = calendar.timegm(rt.datetime().utctimetuple())
data['next_pass']['transit_time'] = calendar.timegm(tt.datetime().utctimetuple())
data['next_pass']['set_time'] = calendar.timegm(st.datetime().utctimetuple())
data['next_pass']['rise_azimuth'] = "%5.1f" % math.degrees(razi)
data['next_pass']['max_elevation'] = "%5.1f" % math.degrees(televation)
data['next_pass']['set_azimuth'] = "%5.1f" % math.degrees(sazi)

# azimuth = eph.az
# elevation = eph.alt
azimuth, elevation = orb.get_observer_look(now, userLng, userLat, userAlt);

data['user_view'] = {}
data['user_view']['azimuth'] = azimuth
data['user_view']['elevation'] = elevation

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
data['tle']['magintude'] = eph.mag

semi_major_axis = (MU/pow(orb.tle.mean_motion*2*math.pi/(24*3600), 2)) ** (1 / 3.0)
data['tle']['semi_major_axis'] = semi_major_axis
data['tle']['semi_minor_axis'] = semi_major_axis * math.sqrt(1 - pow(orb.tle.excentricity, 2))
data['tle']['elevation'] = eph.elevation
data['tle']['range'] = eph.range
data['tle']['range_velocity'] = eph.range_velocity
data['tle']['eclipsed'] = eph.eclipsed

data['position'] = {}
data['position']['longitude'] = position[0]
data['position']['latitude'] = position[1]
data['position']['altitude'] = position[2]

orbital_radius = ephem.earth_radius + position[2]
velocity = math.sqrt(C_GRAVITATIONAL * EARTH_MASS / orbital_radius);
data['position']['velocity'] = velocity

# calculate orbit line
halforbit = data['tle']['orbit_time'] / 2
halforbit = halforbit * orbits

start = timestamp - halforbit
from_date = now - timedelta(seconds=halforbit)
to_date = now + timedelta(seconds=halforbit)

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
