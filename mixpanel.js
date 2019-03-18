
"use strict";

//load .env file unless in production mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
};

const sendmail = require('./ses_sendmail')
const MixpanelExport = require('mixpanel-data-export');
const moment = require('moment');
var numeral = require('numeral');

let baselineDate = moment().subtract(1, 'days').format('Y-MM-DD')
let comparisonDate = moment().subtract(8, 'days').format('Y-MM-DD')
let events = ['$custom_event:359330']
let results = {}

let panel = new MixpanelExport({
    api_key: process.env.MIXPANEL_API_KEY,
    api_secret: process.env.MIXPANEL_API_SECRET
  });
   
  panel.events({
      //custom event id for active  users 
      event: events,
      type: 'unique',
      unit: 'day',
    from_date: comparisonDate,
    to_date: baselineDate,
  }).then(function(data) {
    let mpResponse = data
    let mpResponseData = mpResponse.data.values

    events.forEach(function(event){
        let baselineCount = mpResponseData[event][baselineDate]
        let comparisonCount = mpResponseData[event][comparisonDate]
        results[event] = {
            'baselineCount': numeral(baselineCount).format('0,0'),
            'comparisonCount':  numeral(comparisonCount).format('0,0'),
            'difference': numeral((baselineCount-comparisonCount)/comparisonCount).format('0.00%')
        }
        console.log('Event: '+ event)
        console.log(baselineDate+ ': ' + numeral(baselineCount).format('0,0'))
        console.log(comparisonDate+ ': ' + numeral(comparisonCount).format('0,0'))
        console.log('Difference: '+ numeral((baselineCount-comparisonCount)/comparisonCount).format('0.00%'))
       
    })


sendmail('jfmcmanamey@gmail.com', 

"<html><p>Hey James, </p>\
 </p>These are your numbers for yesterday:</p> <br/>\
 <br/>\
 <table style = 'text-align: left; border: 1px solid black; padding: 5px' >\
 <tr><th >Event Name</th> <th>" + moment(baselineDate).format('ddd, MMM do') + "</th> <th>"+moment(comparisonDate).format('ddd, MMM do')+"</th> <th>Difference</th></tr>\
 <tr><td>" +events[0] + "</td>"+ results[events[0]][`baselineCount`] +"<td> "+ results[events[0]][`comparisonCount`] +" </td> <td> "+ results[events[0]][`difference`] +"</td></tr>\
 </table>\
 </html> ",
 
 'Hey James, these are your numbers for yesterday: ');
 




  });