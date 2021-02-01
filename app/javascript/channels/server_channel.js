import consumer from "./consumer"

// 2. This code loads the IFrame Player API code asynchronously.
let playlist

var player;

document.addEventListener('DOMContentLoaded', ()=> {

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
})




// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();

    const element = document.getElementById('server-id');
    const server_id = element.getAttribute('data-server-id');
  
    consumer.subscriptions.subscriptions.forEach((subscription) => {
      consumer.subscriptions.remove(subscription)
    })
    
    consumer.subscriptions.create({ channel: "ServerChannel", server_id: server_id}, {
      connected() {
        
        console.log("connected to: " + server_id)

        console.log(`/servers/${server_id}/playlist/`)

        fetch(`/servers/${server_id}/playlist/`)
        .then((response) => response.json())
        .then((result) => {
          playlist = result
          let id=playlist[0].uri
          console.log(id)
        
          player.loadVideoById({videoId: id})

          setTimeout(()=> {
            //loadvideo is async but no promise sadly
            console.log(player.getVideoData()['video_id'])         
          }, 300)
        })
        
        // Called when the subscription is ready for use on the server
        //bei neuem connect zum server holen wir uns die playlist
        
        
      },
    
      disconnected() {
        // Called when the subscription has been terminated by the server
      },
    
      received(data) {
        // hier bekommen wir die neu playlist->wenn ein neues lied hinzugefügt wurde
        if(data.content_type != "tracks"){
          const messages = document.getElementById('server-messages')
          messages.innerHTML += data.html
          
        }else {
          playlist = data.tracks
          console.log(data.tracks)
  
          
        }
        // Called when there's incoming data on the websocket for this channel
      }
 
  })
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    
    //setTimeout(stopVideo, 6000);
    //done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}






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


