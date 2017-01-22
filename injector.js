var cid = '';
var acceptHeader = 'application/json';
var token = '';
function getOptions() {
    chrome.storage.sync.get({
        cid: '',
		version: 0,
        token: ''
    }, function (data) {
        cid = data.cid;
        if (data.version > 0) {
		    acceptHeader = 'application/vnd.twitchtv.v' + data.version + '+json';
        } else {
            acceptHeader = 'application/json';
        }
        token = data.token;
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
    if (cid.length > 0) {
        details.requestHeaders.push({
            name: 'Client-ID',
            value: cid
        });
    }
	if (!replaced) {
		details.requestHeaders.push({
			name: 'Accept',
			value: acceptHeader
		});
	}
    if (token.length > 0) {
        details.requestHeaders.push({
            name: 'Authorization',
            value: 'OAuth ' + token
        })
    }
    return { requestHeaders: details.requestHeaders };
}, {
    urls: [
        "https://api.twitch.tv/*",
        "https://tmi.twitch.tv/*"
    ],
    types: [ "main_frame" ]
}, [ 'requestHeaders', 'blocking' ]);
