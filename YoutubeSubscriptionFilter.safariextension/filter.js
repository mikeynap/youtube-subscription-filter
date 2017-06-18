var conf = null

function getAnswer(theMessageEvent) {
  var confSet = conf != null
  conf = theMessageEvent.message
  if (!confSet) {
    document.addEventListener("DOMNodeInserted", throttle(funcFilter, 100) , false);
    funcFilter();
  }
}
safari.self.addEventListener("message", getAnswer, false);
safari.self.tab.dispatchMessage("getconfig",{});


var funcFilter = function() {
  if (window.location.pathname != "/feed/subscriptions") {
    return
  }
    var sh = false
    var titles = $(".yt-lockup-title a")
    for (var i = 0; i < titles.length; i++){
      var text = titles[i].text
      for (var f of conf){
        if (text.indexOf(f) !== -1 ){
          console.log("Hidding " + text)
          $(titles[i]).parents("li .yt-shelf-grid-item").remove()
        }
      }
    }
};

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
// Lovingly ripped off from lodash (_): https://lodash.com
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
