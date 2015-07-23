(function (window) {
  "use strict";

  var pinchTrack = window.pinchTrack || {};
  var visitId, visitorId, track;
  var visitTtl  = 4 * 60; // 4 hours
  var visitorTtl= 2 * 365 * 24 * 60; // 2 years
  var isReady   = false;
  var queue     = [];
  var canStringify = typeof(JSON) !== "undefined" && typeof(JSON.stringify) !== "undefined";
  var eventQueue= [];
  var page      = pinchTrack.page || window.location.pathname;
  var visitsUrl = pinchTrack.visitsUrl || "/pinchTrack/visits"
  var eventsUrl = pinchTrack.eventsUrl || "/pinchTrack/events"

  // cookies

  // http://www.quirksmode.org/js/cookies.html
  function setCookie(name, value, ttl) {
    var expires = "";
    var cookieDomain = "";
    if (ttl) {
      var date = new Date();
      date.setTime(date.getTime() + (ttl * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    if (pinchTrack.domain) {
      cookieDomain = "; domain=" + pinchTrack.domain;
    }
    document.cookie = name + "=" + escape(value) + expires + cookieDomain + "; path=/";
  }

  function getCookie(name) {
    var i, c;
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return unescape(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  function destroyCookie(name) {
    setCookie(name, "", -1);
  }

  function log(message) {
    if (getCookie("pinchTrack_debug")) {
      window.console.log(message);
    }
  }

  function setReady() {
    var callback;
    while (callback = queue.shift()) {
      callback();
    }
    isReady = true;
  }

  function ready(callback) {
    if (isReady) {
      callback();
    } else {
      queue.push(callback);
    }
  }

  // http://stackoverflow.com/a/2117523/1177228
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function saveEventQueue() {
    // TODO add stringify method for IE 7 and under
    if (canStringify) {
      setCookie("pinchTrack_events", JSON.stringify(eventQueue), 1);
    }
  }

  function trackEvent(event) {
    ready( function () {
      // ensure JSON is defined
      if (canStringify) {
        var event = JSON.stringify(event)

        if ("WebSocket" in window)
        {
          io.socket.post('/page', event, function (data, jwres){
            deQueue(event)
          });
        }
        else{
          $.ajax({
            type: "POST",
            url: eventsUrl,
            data: event ,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() {
              deQueue(event)
            }
          });
        }

      }
    });
  }

  function deQueue(event){
    // remove from queue
    for (var i = 0; i < eventQueue.length; i++) {
      if (eventQueue[i].id == event.id) {
        eventQueue.splice(i, 1);
        break;
      }
    }
    saveEventQueue();
  }


  function eventProperties(e) {
    var $target = $(e.currentTarget);
    return {
      tag: $target.get(0).tagName.toLowerCase(),
      id: $target.attr("id"),
      "class": $target.attr("class"),
      page: page,
      section: $target.closest("*[data-section]").data("section")
    };
  }

  // main

  visitId = getCookie("pinchTrack_visit");
  visitorId = getCookie("pinchTrack_visitor");
  track = getCookie("pinchTrack_track");

  if (visitId && visitorId && !track) {
    // TODO keep visit alive?
    log("Active visit");
    setReady();
  }
  else {
    if(track) {
      destroyCookie("pinchTrack_track");
    }

    if (!visitId) {
      visitId = generateId();
      setCookie("pinchTrack_visit", visitId, visitTtl);
    }

    // make sure cookies are enabled
    if (getCookie("pinchTrack_visit")) {
      log("Visit started");

      if (!visitorId) {
        visitorId = generateId();
        setCookie("pinchTrack_visitor", visitorId, visitorTtl);
      }

      var data = {
        visit_token:    visitId,
        visitor_token:  visitorId,
        landing_page:   window.location.href,
        userId:         0,
        campaign:       0,
        title:          window.document.title,
        url:            window.document.URL,
        referrer:       window.document.referrer,
        domain:         window.document.domain,
        docType:        window.document.doctype,
        cookie:         window.document.cookie,
        screen: {
          availHeight:    screen.availHeight,
          availWidth:     screen.availWidth,
          colorDepth:     screen.colorDepth,
          screen_height:  screen.height,
          pixelDepth:     screen.pixelDepth,
          screen_width:   screen.width
        },
        navigator:{
          appCodeName: window.navigator.appCodeName,
          appName: window.navigator.appName,
          appVersion: window.navigator.appVersion,
          cookieEnabled: window.navigator.cookieEnabled,
          language: window.navigator.language,
          userLanguage: window.navigator.userLanguage,
          onLine: window.navigator.onLine,
          platform: window.navigator.platform,
          product: window.navigator.product,
          userAgent: window.navigator.userAgent
        }

      };


      $.post(visitsUrl, data, setReady, "json");

    } else {
      log("Cookies disabled");
      setReady();
    }
  }

  pinchTrack.getVisitId = pinchTrack.getVisitToken = function () {
    return visitId;
  };

  pinchTrack.getVisitorId = pinchTrack.getVisitorToken = function () {
    return visitorId;
  };

  pinchTrack.reset = function () {
    destroyCookie("pinchTrack_visit");
    destroyCookie("pinchTrack_visitor");
    destroyCookie("pinchTrack_events");
    destroyCookie("pinchTrack_track");
    return true;
  };

  pinchTrack.debug = function (enabled) {
    if (enabled === false) {
      destroyCookie("pinchTrack_debug");
    } else {
      setCookie("pinchTrack_debug", "t", 365 * 24 * 60); // 1 year
    }
    return true;
  };

  pinchTrack.track = function (name, properties) {
    // generate unique id
    var event = {
      id: generateId(),
      name: name,
      properties: properties,
      time: (new Date()).getTime() / 1000.0
    };
    log(event);

    eventQueue.push(event);
    saveEventQueue();

    // wait in case navigating to reduce duplicate events
    setTimeout( function () {
      trackEvent(event);
    }, 1000);
  };

  pinchTrack.trackView = function () {
    var properties = {
      url: window.location.href,
      title: document.title,
      page: page
    };
    pinchTrack.track("$view", properties);
  };

  pinchTrack.trackClicks = function () {
    $(document).on("click", "a, button, input[type=submit]", function (e) {
      var $target = $(e.currentTarget);
      var properties = eventProperties(e);
      properties.text = properties.tag == "input" ? $target.val() : $.trim($target.text().replace(/[\s\r\n]+/g, " "));
      properties.href = $target.attr("href");
      pinchTrack.track("$click", properties);
    });
  };

  pinchTrack.trackSubmits = function () {
    $(document).on("submit", "form", function (e) {
      var properties = eventProperties(e);
      pinchTrack.track("$submit", properties);
    });
  };

  pinchTrack.trackChanges = function () {
    $(document).on("change", "input, textarea, select", function (e) {
      var properties = eventProperties(e);
      pinchTrack.track("$change", properties);
    });
  };

  pinchTrack.trackAll = function() {
    pinchTrack.trackView();
    pinchTrack.trackClicks();
    pinchTrack.trackSubmits();
    pinchTrack.trackChanges();
  };

  // push events from queue
  try {
    eventQueue = JSON.parse(getCookie("pinchTrack_events") || "[]");
  } catch (e) {
    // do nothing
  }

  for (var i = 0; i < eventQueue.length; i++) {
    trackEvent(eventQueue[i]);
  }

  window.pinchTrack = pinchTrack;
}(window));
