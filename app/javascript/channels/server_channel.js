import consumer from "./consumer"

// 2. This code loads the IFrame Player API code asynchronously.
let server_id
let playlist

var player;

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
  //event.target.playVideo();

    const element = document.getElementById('server-id');
    server_id = element.getAttribute('data-server-id');
  
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
          
          console.log("playlist")
          console.log(playlist)
          let trackToPlay
          let trackTimePosition
          
          if(playlist.length != 0){
            

            for(let track of playlist){
              let duration = parseInt(track.duration)
              let trackStarttime = parseInt(track.starttime)
              let trackEndtime = trackStarttime + duration
              let currentTime = Math.floor(Date.now()/1000)
              console.log(currentTime)
              console.log(trackEndtime)

              let delta = trackEndtime - currentTime
              console.log(delta)
              console.log(duration - delta)

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
          
          console.log("dahin")
          console.log(trackToPlay)

          //let id=playlist[0].uri
          //console.log(id)
          let curId
          if (trackToPlay) {
            curId=trackToPlay.uri
          }
          console.log(trackTimePosition)
          player.loadVideoById({videoId: curId})
          

          setTimeout(()=> {
            player.seekTo(trackTimePosition, true)
            
            console.log(player.getVideoData()['video_id'])         
          }, 300)


        })
          
          
          
          // let i = 0;
          // let trackIndex

          // if (playlist.length != null) {
          //   for (let track in playlist) {
          //     console.log(track)
          //     let trackTime = track.starttime
          //     console.log(trackTime)
          //     if (trackTime < currentTime) {
          //       i++
          //     } else {
          //       trackIndex = i-1
          //       break;
          //     }

          //   }
          // }
        
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
          //playlist = data.tracks
          //console.log(data.tracks)
          
          fetch(`/servers/${server_id}/playlist/`)
          .then((response) => response.json())
          .then((result) => {
            playlist = result
            
            console.log("playlist")
            console.log(playlist)
            let trackToPlay
            let trackTimePosition
            
            if(playlist.length != 0){
              
      
              for(let track of playlist){
                let duration = parseInt(track.duration)
                let trackStarttime = parseInt(track.starttime)
                let trackEndtime = trackStarttime + duration
                let currentTime = Math.floor(Date.now()/1000)
                console.log(currentTime)
                console.log(trackEndtime)
      
                let delta = trackEndtime - currentTime
                console.log(delta)
                console.log(duration - delta)
      
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
            
            console.log("dahin")
            console.log(trackToPlay)
      
            //let id=playlist[0].uri
            //console.log(id)
            let curId
            if (trackToPlay) {
              curId=trackToPlay.uri
            }
            console.log(trackTimePosition)
            setTimeout(() => {
              if (player.getPlayerState() === -1) {
                player.loadVideoById({videoId: curId})
              }
            }, 100)
            
            
            console.log("tetetet"+player.getPlayerState())
            console.log(player.getPlayerState())

            setTimeout(()=> {

              if (player.getPlayerState() === 0) {
              player.seekTo(trackTimePosition, true)
              }
              console.log(player.getVideoData()['video_id'])
              console.log("adsasd" + player.getPlayerState())         
            }, 100)
      
          })   

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
    console.log("started video and runnning")
    //setTimeout(stopVideo, 6000);
    //done = true;
  } else if (event.data == YT.PlayerState.PAUSED) {
    event.target.playVideo()
  }
  else if (event.data == YT.PlayerState.ENDED){

    fetch(`/servers/${server_id}/playlist/`)
    .then((response) => response.json())
    .then((result) => {
      playlist = result
      
      console.log("playlist")
      console.log(playlist)
      let trackToPlay
      let trackTimePosition
      
      if(playlist.length != 0){
        

        for(let track of playlist){
          let duration = parseInt(track.duration)
          let trackStarttime = parseInt(track.starttime)
          let trackEndtime = trackStarttime + duration
          let currentTime = Math.floor(Date.now()/1000)
          console.log(currentTime)
          console.log(trackEndtime)

          let delta = trackEndtime - currentTime
          console.log(delta)
          console.log(duration - delta)

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
      
      console.log("dahin")
      console.log(trackToPlay)

      //let id=playlist[0].uri
      //console.log(id)
      let curId
      if (trackToPlay) {
        curId=trackToPlay.uri
      }
      console.log(trackTimePosition)
      player.loadVideoById({videoId: curId})
      

      setTimeout(()=> {
        player.seekTo(trackTimePosition, true)
        console.log(player.getVideoData()['video_id'])         
      }, 300)

    })
  }
}

function stopVideo() {
  //player.stopVideo();
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


