let currentPageNum = 1
let numPagesLoaded = 1;


function updateCurrentPageNum() {
    const pageNumElement = document.getElementById("currentPageNum");
    pageNumElement.textContent = currentPageNum;

    const videoFeed = document.getElementById("video-feed");
    let index = 1
    for (const page of videoFeed.children) {
        page.classList.add("hidden");
        if (index == currentPageNum) {
    	    page.classList.remove("hidden");
        }
	index ++;
    }

    hidePageArrowsIfNeeded();
}

function hidePageArrowsIfNeeded() {
    if (currentPageNum <= 1) {
	document.getElementById('previousPageButton').classList.add("no-show");
    } else {
	document.getElementById('previousPageButton').classList.remove("no-show");
    }

    if (currentPageNum < numPagesLoaded || (currentPageNum == numPagesLoaded && nextPageToken != null)) {
	document.getElementById('nextPageButton').classList.remove("no-show");
    } else {
	document.getElementById('nextPageButton').classList.add("no-show");
    }
}


function createVideoElement(videoData) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    // create thumbnail container and it's contents
    const thumbnailContainer = document.createElement('a');
    thumbnailContainer.className = 'thumbnail-container';
    thumbnailContainer.href = `/video/${videoData.video_id}`;

    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = videoData.thumbnail;
    thumbnailImg.loading = 'lazy';

    const durationOverlay = document.createElement('span');
    durationOverlay.textContent = videoData.duration;

    thumbnailContainer.appendChild(thumbnailImg);
    thumbnailContainer.appendChild(durationOverlay);


    // video info
    const viewCount = document.createElement('p');
    viewCount.textContent = videoData.views;

    const titleLink = document.createElement('a');
    titleLink.href = `/video/${videoData.video_id}`;

    const titleContents = document.createElement('h2');
    titleContents.textContent = videoData.title;
    titleLink.appendChild(titleContents);

    // append the contents to the video container element
    videoContainer.appendChild(thumbnailContainer);
    videoContainer.appendChild(viewCount);
    videoContainer.appendChild(titleLink);

    return videoContainer;
}

function createPageElement(pageData) {
    const page = document.createElement("div");
    page.className = "page";

    pageData.forEach(videoData => {
        const videoElement = createVideoElement(videoData);
        page.appendChild(videoElement);
    });

    const parentElement = document.getElementById('video-feed');
    parentElement.appendChild(page);
}


function fetchNextChannelPage(playlistId, nextPageToken) {
    return fetch('/data/get-channel-videos', {
        method: 'GET',
        headers: {
            'playlist-id': playlistId,
            'next-page-token': nextPageToken
        }
    })
    .then(response => response.json());
}


function moveToNextPage() {
    if (currentPageNum < numPagesLoaded) {
	currentPageNum ++;
	updateCurrentPageNum();
    }
    else if (currentPageNum == numPagesLoaded && nextPageToken != null) {
        fetchNextChannelPage(playlist_id, nextPageToken)
            .then(data => {
		nextPageToken = data['next-page-token'];
                createPageElement(data.page);

		numPagesLoaded ++;
		currentPageNum = numPagesLoaded;
		updateCurrentPageNum();
            });
    }
}

function moveToPreviousPage() {
    if (currentPageNum > 1) {
	currentPageNum --;
	    updateCurrentPageNum();
    }
}


hidePageArrowsIfNeeded();
document.getElementById('nextPageButton').addEventListener('click', moveToNextPage);
document.getElementById('previousPageButton').addEventListener('click', moveToPreviousPage);
