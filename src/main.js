let CLIENT_ID;
let API_KEY;
let PLAYLIST_ID;
var videoList = [];
let key;
fetch('./config/key.json')
    .then((response) => response.json())
    .then((json) => { 
        key = json;
        CLIENT_ID = key.clientId;
        API_KEY = key.apiKey;
        PLAYLIST_ID = key.playlistId;

        gapi.load("client:auth2", function() {
            gapi.auth2.init({client_id: CLIENT_ID});
        });
    }).catch(() => console.error('Set config/key.json first (refer config/key.json.sample)'))
;

/**
* Sample JavaScript code for youtube.playlistItems.list
* See instructions for running APIs Explorer code samples locally:
* https://developers.google.com/explorer-help/code-samples#javascript
*/

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => { 
            console.log("GAPI client loaded for API");
            $('#btnSearch').prop('disabled', false);
        },
        function(err) { console.error("Error loading GAPI client for API", err); });
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function search() {
    videoList = [];
    $('#result-table-row').html('');

    let playlistId = getPlaylistId();
    getVideoList(playlistId);
}


function getVideoList(playlistId, pageToken) {
    var requestOptions = {
        playlistId: playlistId,
        part: ['snippet,contentDetails'],
        maxResults: 50
    };
    if (pageToken) {
        requestOptions.pageToken = pageToken;
    }

    gapi.client.youtube.playlistItems.list(requestOptions).then((response) => {
        var playlistItems = response.result.items;
        if (playlistItems) {
            $.each(playlistItems, function(index, item) {
                displayResult(item);
            });
        }

        nextPageToken = response.result.nextPageToken;
        if (nextPageToken) {
            getVideoList(playlistId, nextPageToken);
        }
    });
}

// Create a listing for a video.
function displayResult(item) {
    var thumbnail = item.snippet.thumbnails.default;
    var position = item.snippet.position;
    var title = item.snippet.title;
    var videoId = item.snippet.resourceId.videoId;
    var playlistItemId = item.id;
    var uploadDate = item.contentDetails?.videoPublishedAt;

    var line = 
`
    <tr>
        <td><img src="${thumbnail?.url}"></td>
        <td>${position}</td>
        <td>${title}</td>
        <td><a href="http://youtu.be/${videoId}" target="_blank">${videoId}</a><br /><button onclick="copyToClipboard('${videoId}')">copy</button></td>
        <td>${playlistItemId}<br /><button onclick="copyToClipboard('${playlistItemId}')">copy</button></td>
        <td>${uploadDate}</td>
        <td><input type="number" id="position_${videoId}" name="position" style="width: 50px" /></td>
        <td><button onclick="copyJsonRequestToClipboard('${videoId}', '${playlistItemId}')">copy request</button></td>
    </tr>
`;
    $('#result-table-row').append(line);
    videoList.push({
        videoId: videoId,
        title: title
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function copyJsonRequestToClipboard(videoId, playlistItemId) {
    let playlistId = getPlaylistId();
    let position = $(`#position_${videoId}`).val();
    let request = 
`{
    "id": "${playlistItemId}",
    "snippet": {
        "playlistId": "${playlistId}",
        "position": ${position},
        "resourceId": {
            "kind": "youtube#video",
            "videoId": "${videoId}"
        }
    }
}`;
    copyToClipboard(request);
}

function setAllPosition(val) {
    let position = $('#allPosition').val();
    $('input[name=position]').val(position);
}

function getPlaylistId() {
    return $('#playlistId').val() || PLAYLIST_ID;
}