import consumer from "./consumer"

// 2. This code loads the IFrame Player API code asynchronously.
let server_id
let playlist
let player

document.addEventListener('DOMContentLoaded', ()=> {

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '360',
      width: '640',
      playerVars: {
        'autoplay': 1,
        'controls': 0,
        'mute': 1,
        'rel' : 0,
        'showinfo' : 0
      },
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
    server_id = document.getElementById('server-id').getAttribute('data-server-id');
    
    consumer.subscriptions.subscriptions.forEach((subscription) => {
      consumer.subscriptions.remove(subscription)
    })
    
    consumer.subscriptions.create({ channel: "ServerChannel", server_id: server_id}, {
      connected() {
        
        console.log("connected to: " + server_id)
        fetchPlaylistAndPlayVideo()          
        // Called when the subscription is ready for use on the server
        //bei neuem connect zum server holen wir uns die playlist        
      },
    
      disconnected() {
        // Called when the subscription has been terminated by the server
      },
    
      received(data) {
        // Called when there's incoming data on the websocket for this channel
        // hier bekommen wir die neu playlist->wenn ein neues lied hinzugefügt wurde
        if(data.content_type != "tracks"){
          const messages = document.getElementById('server-messages')
          messages.innerHTML += data.html
          
        }else {
          
          fetch(`/servers/${server_id}/playlist/`)
          .then((response) => response.json())
          .then((result) => {
            playlist = result
            
            let trackToPlay
            let trackTimePosition
            
            if(playlist.length != 0){
              
              for(let track of playlist){
                let duration = parseInt(track.duration)
                let trackStarttime = parseInt(track.starttime)
                let trackEndtime = trackStarttime + duration
                let currentTime = Math.floor(Date.now()/1000)
                let delta = trackEndtime - currentTime
      
                if(delta > 0 ){
                  //lied ist noch nicht vorbei
                  trackToPlay = track
                  trackTimePosition = duration - delta
                  break
                }
              }

            } else {
              console.log("kein lied vorhanden")
            }
            
            let curId
            if (trackToPlay) {
              curId=trackToPlay.uri
            }

            setTimeout(() => {
              if (player.getPlayerState() === -1) {
                player.loadVideoById({videoId: curId})
              }
            }, 100)
            
            setTimeout(()=> {
              if (player.getPlayerState() === 0) {
                player.seekTo(trackTimePosition, true)
              }
            }, 100)

          })   
        }
      }
  })
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    console.log("started video and runnning")
    //setTimeout(stopVideo, 6000);
    //done = true;
  } else if (event.data == YT.PlayerState.PAUSED) {
    event.target.playVideo()
  }
  else if (event.data == YT.PlayerState.ENDED){
    fetchPlaylistAndPlayVideo()
  }
}

function stopVideo() {
  //player.stopVideo();
}


function fetchPlaylistAndPlayVideo(){
  fetch(`/servers/${server_id}/playlist/`)
  .then((response) => response.json())
  .then((result) => {
    playlist = result
    
    let trackToPlay
    let trackTimePosition
    
    if(playlist.length != 0){
      
      for(let track of playlist){
        let duration = parseInt(track.duration)
        let trackStarttime = parseInt(track.starttime)
        let trackEndtime = trackStarttime + duration
        let currentTime = Math.floor(Date.now()/1000)
        let delta = trackEndtime - currentTime

        if(delta > 0 ){
          //lied ist noch nicht vorbei
          trackToPlay = track
          trackTimePosition = duration - delta
          break
        }
      }

    } else {
      console.log("kein lied vorhanden")
    }
    
    let curId
    if (trackToPlay) {
      curId=trackToPlay.uri
    }
    // 2. This code loads the IFrame Player API code asynchronously. But is no promise
    player.loadVideoById({videoId: curId})
    
    setTimeout(()=> {
      player.seekTo(trackTimePosition, true)
      console.log(player.getVideoData()['video_id'])         
    }, 300)

  })
}


