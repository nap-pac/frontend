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

# write the schema for control.db with the above in mind.
# CREATE TABLE alerts (id INTEGER PRIMARY KEY, device_id TEXT, ssid_id TEXT, alert_time INTEGER, acknowledged INTEGER, cleared INTEGER);
# CREATE TABLE triggers (id INTEGER PRIMARY KEY, alert_id INTEGER, type INTEGER, value INTEGER);
# CREATE TABLE actions (id INTEGER PRIMARY KEY, alert_id INTEGER, type INTEGER, value TEXT);

