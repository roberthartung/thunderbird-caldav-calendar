"use strict";
// Imports the Services module, that allows us to use Services.<service> to use
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/Log.jsm");
//Components.utils.import("chrome://boltning/content/ical.js");

let log = Log.repository.getLogger("boltning.boltning");
log.level = Log.Level.Debug;
log.addAppender(new Log.ConsoleAppender(new Log.BasicFormatter()));

var EXPORTED_SYMBOLS = ["boltning"];

function Boltning() {
  var interval;

  function setup() {
    log.debug('setup');
  }

  function waitForCore() {
    if(Services.core.initialized) {
      window.clearInterval(interval);
      setup();
    }
  }
  interval = window.setInterval(waitForCore.bind(this), 100);
}



var boltning = new Boltning();
