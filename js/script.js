document.addEventListener("DOMContentLoaded", function() {
    const rootDir = "../e/";
    const foldersList = document.getElementById("folders-list");
    const mediaContainer = document.getElementById("media-container");

    function createMediaElement(folderName, mediaName) {
        const ext = mediaName.split('.').pop().toLowerCase();
        let mediaElement;

        if (['mp4', 'webm', 'ogg'].includes(ext)) {
            mediaElement = document.createElement("video");
            mediaElement.controls = true;

            const sourceElement = document.createElement("source");
            sourceElement.src = `${rootDir}${folderName}/${mediaName}`;

            mediaElement.appendChild(sourceElement);
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            mediaElement = document.createElement("img");
            mediaElement.src = `${rootDir}${folderName}/${mediaName}`;
            mediaElement.alt = mediaName;
        } else {
            mediaElement = document.createElement("span");
            mediaElement.textContent = `Unsupported file type: ${mediaName}`;
        }

        return mediaElement;
    }

    function fetchMedia(folderName, mediaList) {
        fetch(`${rootDir}${folderName}`)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, "text/html");
                const mediaLinks = Array.from(htmlDoc.querySelectorAll("a"))
                    .filter(link => !link.href.endsWith("/"));

                mediaLinks.forEach(link => {
                    const mediaName = link.textContent;
                    const listItem = document.createElement("li");
                    const mediaElement = createMediaElement(folderName, mediaName);

                    listItem.appendChild(mediaElement);
                    listItem.appendChild(document.createTextNode(mediaName));
                    mediaList.appendChild(listItem);
                })
            })
    }

    function loadMedia(folderName) {
        mediaContainer.innerHTML = `<h2>Media in ${folderName}</h2>
                                    <ul id="media-list"></ul>`;
        const mediaList = document.getElementById("media-list");

        fetchMedia(folderName, mediaList);
    }

    fetch(rootDir)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, "text/html");
            const folderLinks = Array.from(htmlDoc.querySelectorAll("a"))
                .filter(link => link.href.endsWith("/"));

            folderLinks.forEach(link => {
                const folderName = link.textContent;
                const listItem = document.createElement("li");
                listItem.className = "folder";

                const linkElement = document.createElement("a");
                linkElement.textContent = folderName;
                linkElement.href = `#${folderName}`;
                linkElement.onclick = () => loadMedia(folderName);
                listItem.appendChild(linkElement);
                foldersList.appendChild(listItem);
            });
        });
});
