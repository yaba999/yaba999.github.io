document.getElementById('cobaltForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;

    const requestData = {
        url: url,
        vCodec: 'h264',
        vQuality: '1080',
        aFormat: 'mp3',
        filenamePattern: 'classic',
        isAudioOnly: false,
        isTTFullAudio: false,
        isAudioMuted: false,
        dubLang: false,
        disableMetadata: false,
        twitterGif: false,
        tiktokH265: false
    };

    fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
        download(data.url, "test.mp4", "video/mp4")
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('result').textContent = 'Error fetching data';
    });
});

function openLinkInNewTab(url) {
    window.open(url, "_blank");
}