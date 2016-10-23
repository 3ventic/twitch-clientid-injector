var cid = '';
function getCid() {
    chrome.storage.sync.get({
        cid: ''
    }, function (data) {
        cid = data.cid;
    });
}
getCid();
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    getCid();
    details.requestHeaders.push({
        name: 'Client-ID',
        value: cid
    });
    return { requestHeaders: details.requestHeaders };
}, { urls: [ "<all_urls>" ] }, [ 'requestHeaders', 'blocking' ]);