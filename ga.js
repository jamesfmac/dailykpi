"use strict";

//load .env file unless in production mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
const { google } = require('googleapis');

const key = require('./auth.json')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)
const view_id = '118699367'



jwt.authorize((err, response) => {
  google.analytics('v3').data.ga.get(
    {
      auth: jwt,
      ids: 'ga:' + view_id,
      'start-date': '30daysAgo',
      'end-date': 'today',
      metrics: 'ga:pageviews'
    },
    (err, result) => {
      console.log(err, result)
    }
  )
})


