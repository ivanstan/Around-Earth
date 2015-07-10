import ephem

yh = ephem.readdb("C/2012 S1 (ISON),h,11/28.7747/2013,62.3990,295.6529,345.5644,1.000002,0.012444,2000,7.5,3.2")

date = '2013/10/31'

yh.compute(date)
print(yh.name)
print("%s %s" % (yh.ra, yh.dec))
print("%s %s" % (ephem.constellation(yh), yh.mag))

# define an observer
Rome = ephem.city('Rome')
rome_watcher = ephem.Observer()
rome_watcher.lat = Rome.lat
rome_watcher.lon = Rome.lon
rome_watcher.date = date

yh.compute(rome_watcher)

# print some useful data computed on the loaded body
print("Tracking object: %s on date: %s from: %s" % (yh.name, date, Rome.name))
print "%s is in constellation: %s with magnitude %s" % (yh.name, ephem.constellation(yh)[1], yh.mag)
print("Rome next rising: %s" % rome_watcher.next_rising(yh))
print("Rome next setting: %s" % rome_watcher.next_setting(yh))
print("Earth distance: %s AUs" % yh.earth_distance)
print("Sun distance: %s AUs" % yh.sun_distance)
print("Sun distance: %s AUs" % yh.sun_distance)
print yh.az
print yh.alt
