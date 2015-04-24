#!/usr/bin/env python

import sys
import json
import ephem
from datetime import datetime

time = sys.argv[4]

moon = ephem.Moon(time)

observer      = ephem.Observer()
observer.date = ephem.Date(time)
observer.lon  = sys.argv[1]
observer.lat  = sys.argv[2]
observer.elev = float(sys.argv[3])

#For U.S. Naval Astronomical Almanac values
observer.pressure= 0
observer.horizon = '-0:34'

data = {}

sunrise = observer.previous_rising(ephem.Sun()) #Sunrise
noon    = observer.next_transit   (ephem.Sun()) #Solar noon
sunset  = observer.next_setting   (ephem.Sun()) #Sunset

data['sunrise'] = str(ephem.localtime(sunrise))
data['noon']    = str(ephem.localtime(noon))
data['sunset']  = str(ephem.localtime(sunset))

# observer.horizon = '-6' # civil twilight
# civilian_twilight_start = observer.previous_rising(ephem.Sun())
# civilian_twilight_end = observer.next_setting(ephem.Sun())

# observer.horizon = '-12' # nautical twilight
# nautical_twilight_start = observer.previous_rising(ephem.Sun())
# nautical_twilight_end = observer.next_setting(ephem.Sun())

# observer.horizon = '-18' # astronomical twilight
# astronomical_twilight_start = observer.previous_rising(ephem.Sun())
# astronomical_twilight_end = observer.next_setting(ephem.Sun())

data['moon'] = {}
data['moon']['radius'] = ephem.moon_radius
data['moon']['previous_new_moon'] = str(ephem.localtime(ephem.previous_new_moon(time)))
data['moon']['next_new_moon'] = str(ephem.localtime(ephem.next_new_moon(time)))
data['moon']['previous_first_quarter_moon'] = str(ephem.localtime(ephem.previous_first_quarter_moon(time)))
data['moon']['next_first_quarter_moon'] = str(ephem.localtime(ephem.next_first_quarter_moon(time)))
data['moon']['previous_full_moon'] = str(ephem.localtime(ephem.previous_full_moon(time)))
data['moon']['next_full_moon'] = str(ephem.localtime(ephem.next_full_moon(time)))
data['moon']['previous_last_quarter_moon'] = str(ephem.localtime(ephem.previous_last_quarter_moon(time)))
data['moon']['next_last_quarter_moon'] = str(ephem.localtime(ephem.next_last_quarter_moon(time)))

print json.dumps(data)
