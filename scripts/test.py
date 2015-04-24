import ephem
from datetime import datetime

lowell = ephem.Observer()
lowell.lon = '0'
lowell.lat = '35:05.8'
lowell.elevation = 0
lowell.date = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

now = datetime.utcnow()

sun = ephem.Sun()
sun.compute(now)

sun.compute(lowell)

# print sun.ra - lowell.sidereal_time()


print ephem.earth_radius / 1000
