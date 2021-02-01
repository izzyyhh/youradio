import consumer from "./consumer"

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}



// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  console.log(player)
  console.log(player.getDuration())
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}



document.addEventListener("turbolinks:load", ()=>{


  const element = document.getElementById('server-id');
  const server_id = element.getAttribute('data-server-id');

  consumer.subscriptions.subscriptions.forEach((subscription) => {
    consumer.subscriptions.remove(subscription)
  })
  
  consumer.subscriptions.create({ channel: "ServerChannel", server_id: server_id}, {
    connected() {
      console.log("connected to: " + server_id)
      // Called when the subscription is ready for use on the server
    },
  
    disconnected() {
      // Called when the subscription has been terminated by the server
    },
  
    received(data) {
      if(data.content_type != "tracks"){
        const messages = document.getElementById('server-messages')
        messages.innerHTML += data.html
        
      }else {
        console.log(data.tracks)
      }
      // Called when there's incoming data on the websocket for this channel
    }
  });  
})

/*
window.addEventListener("DOMContentLoaded", () => {
  youtubePlayerAPI()
})

const youtubePlayerAPI = () => {
  const tag = document.createElement("script")
  tag.src = "https://www.youtube.com/iframe_api"
  const firstScriptTag = document.getElementsByTagName("script")[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  window.onYoutubeIframeAPIReady = loadVideoPlayer
}

function loadVideoPlayer() {
  console.log("hey")
  const player = new window.YT.Player("player", {
    height: "390",
    width: "648"
  })
}*/


      // 2. This code loads the IFrame Player API code asynchronously.


