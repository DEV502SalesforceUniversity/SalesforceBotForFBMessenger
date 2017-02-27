'use strict';

const
config = require('config'),
https = require('https'),
http = require('http'),
url = require('url'),
pg = require('pg'),
querystring = require('querystring');

pg.defaults.ssl = true;

function SFTokens() {
  this.access_token;
  this.refresh_token;
  this.instance_url;
  this.id;
}

function sforce(senderID, sfTokens, callback){
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    console.log('In bot... Connected to postgres! Retriveing access_token');

    client.query("SELECT body FROM tokens WHERE id = $1;", [senderID], function(err, result) {
      if (err){
        console.log('Error message is: ' + err);
        console.log('err.message is: ' + err.message);
        throw err;
      }
      console.log('Result.rows[0] is: ' + Object.keys(result.rows[0]));
      var temp = result.rows[0]['body'];
      console.log('temp is: ' + temp);

      Object.keys(temp).forEach(function (key) {
        switch (key) {
          case 'access_token':
          sfTokens.access_token = temp[key];
          break;

          case 'refresh_token':
          sfTokens.refresh_token = temp[key];
          break;

          case 'instance_url':
          sfTokens.instance_url = temp[key];
          break;

          case 'id':
          sfTokens.id = temp[key];
          break;
        }
      });
      callback();
      client.end(function (err) {
        if (err) throw err;
      });
    });
  });
}

function doQuery(senderID, sobjectName, sobjectValue, callback) {
  console.log('doQuery ');
  var sfTokens = new SFTokens();
  var soqlQuery = makeQuery(sobjectName, sobjectValue);
  console.log(soqlQuery);

  sforce(senderID, sfTokens, function() {
    console.log('sforce access_token in callback: ' + sfTokens.access_token);
    var options = {
      host: url.parse(sfTokens.instance_url).hostname,
      path: '/services/data/v37.0/query?q='+encodeURI(soqlQuery),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": "Bearer "+ sfTokens.access_token
      }
    };
    var get_req = https.request(options, function(response) {
      var resp = '';
      console.log('headers: ' + JSON.stringify(response.getHeaders));
      console.log('statusCode: ' + JSON.stringify(response.statusCode));
      response.on('data', function (chunk) {
        console.log('Response: ' + chunk);
        resp += chunk;
      });
      response.on('end', function(chunk){
        console.log('No more data');
        var jsonObject = JSON.parse(resp);
        console.log('totalSize is: ' + jsonObject.totalSize);
        var respText;
        if (sobjectName=='Account') {
          respText = 'Id: ' + jsonObject.records[0].Id + '\nName: ' + jsonObject.records[0].Name + '\nType: ' + jsonObject.records[0].Type + '\nPhone: ' + jsonObject.records[0].Phone;
        } else {
          respText = 'Id: ' + jsonObject.records[0].Id + '\nContractId: ' + jsonObject.records[0].ContractId + '\nAccountId: ' + jsonObject.records[0].AccountId + '\nStatus: ' + jsonObject.records[0].Status + '\nType: ' + jsonObject.records[0].Type + '\nTotalAmount: ' + jsonObject.records[0].TotalAmount;
        }
        callback(respText);
      });
    });
    get_req.on('error', function(e){
      console.log('Error is: ' + e.message);
    });
    get_req.on('uncaughtException', function (err) {
      console.log(err);
    });
    get_req.end();
  });
}

function makeQuery(sobjectName, sobjectValue) {
  switch (sobjectName) {
    case 'Account':
    return 'SELECT Id, Name, Type, Phone FROM Account WHERE Name=\''+sobjectValue + '\'';
    break;

    case 'Order':
    return 'SELECT Id, ContractId, AccountId, Status, Type, TotalAmount FROM Order WHERE OrderNumber=\''+sobjectValue + '\'';
    break;
  }
}

exports.doQuery = doQuery;
