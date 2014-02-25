function onUberDashboard(tab_url) {
  var flag = false;

  if (tab_url === "https://clients.uber.com/#!/dashboard"){
    flag = true
  }

  return flag;
}

function isHttp(url) {
  var protocol = url.split(":")[0];

  if (protocol == "http" || protocol == "https") {
    return true;
  } else {
    return false;
  }
}

function loadContentScript(tab) {
  if (isHttp(tab.url)) {
    chrome.tabs.executeScript(
      tab.tabId,
      {file: "content_script.js"},
      function(result) {}
    );
  }
}

// Listeners
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tabObj) {
    loadContentScript(tabObj);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (isHttp(tab.url)) {
    chrome.tabs.executeScript(
      tabId,
      {file: "content_script.js"},
      function(result) {}
    );
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (onUberDashboard(request.tabs_host) === true) {
      sendResponse(true);
    } else {
      icon_path = request.default_icon_path;
      sendResponse(false)
    }
  }
);