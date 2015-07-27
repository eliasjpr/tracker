(function (window) {
  "use strict";
  var visitId, visitorId, track;
  var pinchMeTrack = window.pinchMeTrack || {};

  var visitTtl     = 4 * 60; // 4 hours
  var visitorTtl   = 2 * 365 * 24 * 60; // 2 years
  var isReady      = false;
  var queue        = [];
  var canStringify = typeof(JSON) !== "undefined" && typeof(JSON.stringify) !== "undefined";
  var eventQueue   = [];
  var page         = pinchMeTrack.page || window.location.pathname;
  var visitsUrl    = pinchMeTrack.visitsUrl || "/page"
  var eventsUrl    = pinchMeTrack.eventsUrl || "/page"



  // cookies

  // http://www.quirksmode.org/js/cookies.html
  function setCookie(name, value, ttl) {
    var expires      = "";
    var cookieDomain = "";
    if (ttl) {
      var date = new Date();
      date.setTime(date.getTime() + (ttl * 60 * 1000));
      expires  = "; expires=" + date.toGMTString();
    }
    if (pinchMeTrack.domain) {
      cookieDomain = "; domain=" + pinchMeTrack.domain;
    }
    document.cookie = name + "=" + escape(value) + expires + cookieDomain + "; path=/";
  }

  function getCookie(name) {
    var i, c;
    var nameEQ = name + "=";
    var ca     = document.cookie.split(';');
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
    if (getCookie("pinchMeTrack_debug")) {
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function saveEventQueue() {
    // TODO add stringify method for IE 7 and under
    if (canStringify) {
      setCookie("pinchMeTrack_events", JSON.stringify(eventQueue), 1);
    }
  }

  function trackEvent(event) {
    ready(function () {
      // ensure JSON is defined
      if (canStringify) {

        if ("WebSocket" in window) {

          io.socket.post(eventsUrl, event, function (data, jwres) {
            deQueue(data)
            log("=== Event Saved! ===")
            log(data)
          });
        }
        else {
          $.ajax({
            type       : "POST",
            url        : eventsUrl,
            data       : event,
            contentType: "application/json; charset=utf-8",
            dataType   : "json",
            success    : function () {
              deQueue(event)
              log("=== Event Saved! ===")
              log(event)
            }
          });
        }

      }
    });
  }

  function deQueue(event) {
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
      tag    : $target.get(0).tagName.toLowerCase(),
      id     : $target.attr("id"),
      "class": $target.attr("class"),
      page   : page,
      section: $target.closest("*[data-section]").data("section")
    };
  }

  function appendData(){
    return {
      userId       : 0,
      campaign     : 0,
      title        : window.document.title,
      url          : window.document.URL,
      referrer     : window.document.referrer,
      domain       : window.document.domain,
      docType      : window.document.doctype,
      cookie       : window.document.cookie,
      screen       : {
        availHeight  : screen.availHeight,
        availWidth   : screen.availWidth,
        colorDepth   : screen.colorDepth,
        screen_height: screen.height,
        pixelDepth   : screen.pixelDepth,
        screen_width : screen.width
      },
      navigator    : {
        appCodeName  : window.navigator.appCodeName,
        appName      : window.navigator.appName,
        appVersion   : window.navigator.appVersion,
        cookieEnabled: window.navigator.cookieEnabled,
        language     : window.navigator.language,
        userLanguage : window.navigator.userLanguage,
        onLine       : window.navigator.onLine,
        platform     : window.navigator.platform,
        product      : window.navigator.product,
        userAgent    : window.navigator.userAgent
      }
    };
  }

  // main
  visitId   = getCookie("pinchMeTrack_visit");
  visitorId = getCookie("pinchMeTrack_visitor");
  track     = getCookie("pinchMeTrack_track");

  if (visitId && visitorId && !track) {
    // TODO keep visit alive?
    log("Active visit");
    setReady();
  }
  else {
    if (track) {
      destroyCookie("pinchMeTrack_track");
    }

    if (!visitId) {
      visitId = generateId();
      setCookie("pinchMeTrack_visit", visitId, visitTtl);
    }

    // make sure cookies are enabled
    if (getCookie("pinchMeTrack_visit")) {
      log("Visit started");

      if (!visitorId) {
        visitorId = generateId();
        setCookie("pinchMeTrack_visitor", visitorId, visitorTtl);
      }

      var event = {
        visit_token  : visitId,
        visitor_token: visitorId,
        landing_page : window.location.href
      };



      if("WebSocket" in window){
        io.socket.post(visitsUrl, event, function (data, jwres) {
          log("=== Visit Saved! ===")
          log(data)
        });
      }else{
        $.post(visitsUrl, event, setReady, "json");
      }
    }
    else {
      log("Cookies disabled");
      setReady();
    }
  }

  pinchMeTrack.getVisitId = pinchMeTrack.getVisitToken = function () {
    return visitId;
  };

  pinchMeTrack.getVisitorId = pinchMeTrack.getVisitorToken = function () {
    return visitorId;
  };

  pinchMeTrack.reset = function () {
    destroyCookie("pinchMeTrack_visit");
    destroyCookie("pinchMeTrack_visitor");
    destroyCookie("pinchMeTrack_events");
    destroyCookie("pinchMeTrack_track");
    return true;
  };

  pinchMeTrack.debug = function (enabled) {
    if (enabled === false) {
      destroyCookie("pinchMeTrack_debug");
    } else {
      setCookie("pinchMeTrack_debug", "t", 365 * 24 * 60); // 1 year
    }
    return true;
  };

  pinchMeTrack.track = function (name, properties) {
    // generate unique id
    var event = {
      name         : name,
      event        : properties,
      time         : (new Date()).getTime() / 1000.0,
      visit_token  : visitId,
      visitor_token: visitorId,
      landing_page : window.location.href,
      data: appendData()
    };

    eventQueue.push(event);
    saveEventQueue();

    // wait in case navigating to reduce duplicate events
    setTimeout(function () {
      trackEvent(event);
    }, 1000);
  };

  pinchMeTrack.trackView = function () {
    var properties = {
      url  : window.location.href,
      title: document.title,
      page : page
    };
    pinchMeTrack.track("$view", properties);
  };

  pinchMeTrack.trackClicks = function () {
    $(document).on("click", "a, button, input[type=submit]", function (e) {
      var $target     = $(e.currentTarget);
      var properties  = eventProperties(e);

      properties.text = properties.tag == "input" ? $target.val() : $.trim($target.text().replace(/[\s\r\n]+/g, " "));
      properties.href = $target.attr("href");
      pinchMeTrack.track("$click", properties);
    });
  };

  pinchMeTrack.trackSubmits = function () {
    $(document).on("submit", "form", function (e) {
      var properties = eventProperties(e);
      pinchMeTrack.track("$submit", properties);
    });
  };

  pinchMeTrack.trackChanges = function () {
    $(document).on("change", "input, textarea, select", function (e) {
      var properties = eventProperties(e);
      pinchMeTrack.track("$change", properties);
    });
  };

  pinchMeTrack.trackAll = function () {
    pinchMeTrack.trackView();
    pinchMeTrack.trackClicks();
    pinchMeTrack.trackSubmits();
    pinchMeTrack.trackChanges();
  };

  // push events from queue
  try {
    eventQueue = JSON.parse(getCookie("pinchMeTrack_events") || "[]");
  }
  catch (e) {
    // do nothing
  }

  for (var i = 0; i < eventQueue.length; i++) {
    trackEvent(eventQueue[i]);
  }

  // Attache tracker back to window object
  window.pinchMeTrack = pinchMeTrack;

  // Start Tracking
  $(window.document).ready(function(){
    window.pinchMeTrack.trackAll();
  });

}(window));
