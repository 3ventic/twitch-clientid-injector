
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get({
        cid: ''
    }, function (items) {
        document.getElementById('cid').value = items.cid;
    });
});
document.getElementById('save').addEventListener('click', function () {
    chrome.storage.sync.set({
        cid: document.getElementById('cid').value
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Saved';
        setTimeout(function () { status.textContent = '' }, 1000);
    });
});