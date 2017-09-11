var cid = '';
var acceptHeader = 'application/json';
var kraken_token = '';
var helix_token = '';
function getOptions() {
    chrome.storage.sync.get({
        cid: '',
		version: 0,
        kraken_token: '',
        helix_token: ''
    }, function (data) {
        cid = data.cid;
        if (data.version > 0) {
		    acceptHeader = 'application/vnd.twitchtv.v' + data.version + '+json';
        } else {
            acceptHeader = 'application/json';
        }
        kraken_token = data.kraken_token;
        helix_token = data.helix_token;
    });
}
getOptions();

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    getOptions();
    var replaced = false;
    var isHelix = details.url.indexOf('https://api.twitch.tv/helix/') === 0;
    var acceptHeaderReal = isHelix ? "application/json" : acceptHeader;
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === 'Accept') {
			details.requestHeaders[i].value = acceptHeaderReal;
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
			value: acceptHeaderReal
		});
	}
    if (kraken_token.length > 0) {
        details.requestHeaders.push({
            name: 'Authorization',
            value: isHelix ? 'Bearer ' + helix_token : 'OAuth ' + kraken_token
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
