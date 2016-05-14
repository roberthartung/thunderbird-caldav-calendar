"use strict";

/// imports Account classes
importScripts('resource://boltningmodules/account.js');

/// Global instance of this account
var account;

onmessage = function(e) {
  let data = e.data;
  switch(data.type) {
    case 'init' :
      if(account != undefined) {
        throw "Already initialized";
      }

      /// Create account object and wait for it to be loaded
      /// (princible path and calendar list)
      account = new Account(data.login);
      /// Wait until list of calendars is loaded.
      account.ready.then(function() {
        var promises = [];
        account.calendars.forEach(function(calendar, path) {
          promises.push(calendar.ready);
        });
        return Promise.all(promises);
      }).then(() => {
        postMessage('All calendars loaded...');
        var calendars = {};
        account.calendars.forEach((calendar) => {
          calendars[calendar.href] = {displayname: calendar.displayname, color: calendar.color};
        });
        postMessage({type: 'init.done', calendars: calendars});
      });

      /// Create Account, query calendars
    break;
    case 'synchronize' :
      var promises = [];
      account.calendars.forEach((calendar) => {
        promises.push(calendar.synchronize());
      });

      Promise.all(promises).then(() => {
        postMessage({type: 'synchronize.done'});
      });
    break;
    case 'query' :
      /// Collect data from all calendars here!
      var promises = [];
      account.calendars.forEach((calendar) => {
        /// Forward message directly
        promises.push(calendar.query(data));
      });
      Promise.all(promises).then(values => {
        postMessage('Query: DONE FOR ALL...');
        postMessage({type: 'query.done', result: values});
      });
    break;
  }
}
