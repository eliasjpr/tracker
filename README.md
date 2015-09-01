# Liana (Live Integrated ANAlitycs)

Liana is a real time integrated web analytics platform used at PinchMe to tracks user actions that generates PinchMe
campaign effectiveness and insights.

## Features

- Identify & tag visitors. Invaluable for email campaigns or tracking leads.
- See who your visitors are & how they use your site.
- PinchMe ROI & Conversion analytics.
- Real-time minute-to-minute session tracking, reporting and analysis.
- From a button clicked to a video played, anything you want to track.
- Track IP Address and GEO-Location.
- Track effectiveness of PinchMe campaigns
- Referral analytics summary of all acquisition sources and campaigns



## Sample Queries to Visualize

SELECT COUNT(*), date(created_at) as created_on
FROM  users
WHERE deleted_at IS NULL
GROUP BY created_on;

SELECT DISTINCT count(*)
FROM users
WHERE id IN (
  SELECT distinct user_id
  FROM orders
 WHERE ordered_at BETWEEN '2015-07-14 00:00:00' AND '2015-07-15 00:00:00')
  AND created_at BETWEEN '2015-07-14 00:00:00' AND '2015-07-15 00:00:00'
  AND advanced_profile_completed_at BETWEEN '2015-07-14 00:00:00' AND '2015-07-15 00:00:00';

