// Define some variables used to remember state.
var channelId, nextPageToken;
var playlistList = [];
var listIndex = 1;

// After the API loads, call a function to get the uploads playlist ID.
function handleAPILoaded() {
    requestUserPlaylistId();
}

// Call the Data API to retrieve the playlist ID that uniquely identifies the
// list of videos uploaded to the currently authenticated user's channel.
function requestUserPlaylistId() {
    // See https://developers.google.com/youtube/v3/docs/channels/list
    var request = gapi.client.youtube.channels.list({
        mine: true,
        part: 'contentDetails'
    });
    request.execute(function(response) {

        channelId = response.result.items[0].id;
        requestPlaylist(channelId);
    });
}

// Retrieve the list of videos in the specified playlist.
function requestPlaylist(channelId, pageToken) {
    //$('#video-container').html('');
    var requestOptions = {
        channelId: channelId,
        part: 'snippet',
        maxResults: 50
    };
    if (pageToken) {
        requestOptions.pageToken = pageToken;
    }
    var request = gapi.client.youtube.playlists.list(requestOptions);
    request.execute(function(response) {
        // Only show pagination buttons if there is a pagination token for the
        // next or previous page of results.
        nextPageToken = response.result.nextPageToken;

        if (nextPageToken) {
            requestPlaylist(channelId, nextPageToken);
        }

        var playlists = response.result.items;
        if (playlists) {
            $.each(playlists, function(index, item) {
                displayResult(item);
            });
        } else {
            $('#list-container').html('Sorry you have no playlists');
        }
    });
}

// Create a listing for a video.
function displayResult(item) {
    var id = item.id;
    var title = item.snippet.title;
    var line = '<p>'
             + listIndex++ + ' : '
             + '<a href="https://www.youtube.com/playlist?list=' + id + '" target="_blank">' + id + '</a>' + ' : '
             + title + '</p>';

    $('#list-container').append(line);
    playlistList.push({
        id: id,
        title: title
    });
}

// // Retrieve the next page of videos in the playlist.
// function nextPage() {
//     requestVideoPlaylist(playlistId, nextPageToken);
// }

// // Retrieve the previous page of videos in the playlist.
// function previousPage() {
//     requestVideoPlaylist(playlistId, prevPageToken);
// }