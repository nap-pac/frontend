from django_cron import CronJobBase, Schedule
import time

def my_scheduled_job():
    print("Hello World " + str(time.time()))

class MyCronJob(CronJobBase):
    RUN_EVERY_MINS = 1
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'api.my_cron_job'    # a unique code

    def do(self):
        my_scheduled_job()

# Alerts logic
# control.db will store alerts that have been generated.
# control.db will also store triggers for alerts (the conditions that must be met for an alert to be generated).
# control.db will also store the actions to be taken when an alert is generated.
# control.db will also store the actions to be taken when an alert is acknowledged.
# control.db will also store the actions to be taken when an alert is cleared.
# the front end will display alerts that have been generated.
# the front end will display triggers and actions for alerts and is configurable.
# on a cron job, the system will check all triggers and generate alerts as needed.

# the possible triggers are:
# - a device has been seen on a flagged list
# - a device has been seen more than X times in Y minutes
# - a device has been seen in a location that is not on the whitelist X times in Y minutes

# the possible actions are:
# - send an email (future)
# - send a text (future)
# - send a push notification (future)
# - send a webhook (future)
# - add alert to the front end
# - add alert to the database (automatic)

# CREATE TABLE alerts (id INTEGER PRIMARY KEY, device_id TEXT, ssid_id TEXT, alert_time INTEGER, acknowledged INTEGER, cleared INTEGER);
# CREATE TABLE triggers (id INTEGER PRIMARY KEY, alert_id INTEGER, type INTEGER, value INTEGER);
# CREATE TABLE actions (id INTEGER PRIMARY KEY, alert_id INTEGER, type INTEGER, value TEXT);


# TRIGGERS
# Device seen 10 times in 1 hour
# Device seen in 'Shopping' locations 10 times in 1 hour
# Device seen with 'Google' manufacturer 50 times in 2 hours
# Device seen with 'My Tag' tag 20 times in 30 minutes
# Device seen with 'My Tag' tag and 'Google' manufacturer 50 times in 2 hours
# Job every 24 hours

# ACTIONS
# Get all locations in last 2 hours
# Send notification to 'My Phone'
# Create alert with Critical level
# Create alert with Warning level
# Create alert with Info level
# Send email to 2 contacts
# Get top 25 most frequently seen devices in past 2 hours
# Get all devices with flagged status in past 2 hours
# Get current location

# design a schema based on these actions and triggers

# EXAMPLE RECORD COULD BE:
# TIMEFRAME = 2 HOURS; TAG = MY TAG; COUNT = 20; MANUFACTURER = GOOGLE; LOCATION = SHOPPING;
# which is translated to:

# CREATE TABLE triggers (id INTEGER PRIMARY KEY, alert_id INTEGER, count INTEGER, timeframe INTEGER, tag TEXT, manufacturer TEXT, location TEXT);

