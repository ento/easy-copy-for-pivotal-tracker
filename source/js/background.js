chrome.extension.onMessage.addListener(function (request, sender, callback) {
  if (request.action == "pageStart") {
    chrome.pageAction.show(sender.tab.id);
  }
});
