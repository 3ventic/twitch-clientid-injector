
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get({
        cid: '',
		version: 0,
        kraken_token: '',
        helix_token: ''
    }, function (items) {
        document.getElementById('cid').value = items.cid;
        document.getElementById('kraken-token').value = items.kraken_token;
        document.getElementById('helix-token').value = items.helix_token;
        document.getElementById('version').value = items.version;
    });
});
document.getElementById('save').addEventListener('click', function () {
    var version = document.getElementById('version').value;
    chrome.storage.sync.set({
        cid: document.getElementById('cid').value,
		version: version,
        kraken_token: document.getElementById('kraken-token').value,
        helix_token: document.getElementById('helix-token').value
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Saved';
        setTimeout(function () { status.textContent = '' }, 1000)
    });
    chrome.extension.getBackgroundPage().cid = document.getElementById('cid').value;
    if (version > 0) {
        chrome.extension.getBackgroundPage().acceptHeader = 'application/vnd.twitchtv.v' + version + '+json';
    } else {
        chrome.extension.getBackgroundPage().acceptHeader = 'application/json';
    }
    chrome.extension.getBackgroundPage().kraken_token = document.getElementById('kraken-token').value;
    chrome.extension.getBackgroundPage().helix_token = document.getElementById('helix-token').value;
});
