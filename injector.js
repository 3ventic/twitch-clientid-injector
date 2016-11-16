var cid = '';
var acceptHeader = 'application/vnd.twitchtv.v3+json';
function getOptions() {
    chrome.storage.sync.get({
        cid: '',
		version: 3
    }, function (data) {
        cid = data.cid;
		acceptHeader = 'application/vnd.twitchtv.v' + data.version + '+json';
    });
}
getOptions();
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    getOptions();
	var replaced = false;
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === 'Accept') {
			details.requestHeaders[i].value = acceptHeader;
			replaced = true;
			break;
		}
	}
    details.requestHeaders.push({
        name: 'Client-ID',
        value: cid
    });
	if (!replaced) {
		details.requestHeaders.push({
			name: 'Accept',
			value: acceptHeader
		});
	}
    return { requestHeaders: details.requestHeaders };
}, {
    urls: [
        "https://api.twitch.tv/*",
        "https://tmi.twitch.tv/*"
    ],
    types: [ "main_frame" ]
}, [ 'requestHeaders', 'blocking' ]);
