import consumer from "./consumer";

let server_id;
let playlist;
let player;
let playlistElement;
let trackTitleNowElement;
let trackTitleNextElement;
let marquee;
let serverMessagesElement;
let musicBarTitleCoverBlock;
let runtime;
let endtime;
let hider;

document.addEventListener("DOMContentLoaded", () => {
  playlistElement = document.querySelector(".playlist__tracklist");
  trackTitleNowElement = document.querySelector(".musicbar__titel-now");
  trackTitleNextElement = document.querySelector(".musicbar__titel-next");
  marquee = document.getElementById("marquee");
  serverMessagesElement = document.getElementById("server-messages");
  musicBarTitleCoverBlock = document.querySelector(".musicbar__title-cover");
  runtime = document.querySelector(".musicbar__runtime");
  endtime = document.querySelector(".musicbar__endtime");
  hider = document.getElementById("player__hider");

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1,
        rel: 0,
        showinfo: 0,
      },
      videoId: "",
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  addSoundSettings();
});

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  server_id = document
    .getElementById("server-id")
    .getAttribute("data-server-id");

  consumer.subscriptions.subscriptions.forEach((subscription) => {
    consumer.subscriptions.remove(subscription);
  });

  consumer.subscriptions.create(
    { channel: "ServerChannel", server_id: server_id },
    {
      connected() {
        console.log("connected to: " + server_id);
        fetchPlaylistAndPlayVideo();
        serverMessagesElement.scrollTop = serverMessagesElement.scrollHeight;

        // Called when the subscription is ready for use on the server
        //bei neuem connect zum server holen wir uns die playlist
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        // hier bekommen wir die neu playlist->wenn ein neues lied hinzugefügt wurde
        if (data.content_type != "tracks") {
          const messages = document.getElementById("server-messages");
          messages.innerHTML += data.html;
          serverMessagesElement.scrollTop = serverMessagesElement.scrollHeight;
        } else {
          fetch(`/servers/${server_id}/playlist/`)
            .then((response) => response.json())
            .then((result) => {
              playlist = result;

              let trackToPlay;
              let trackTimePosition;

              if (playlist.length != 0) {
                for (let track of playlist) {
                  let duration = parseInt(track.duration);
                  let trackStarttime = parseInt(track.starttime);
                  let trackEndtime = trackStarttime + duration;
                  let currentTime = Math.floor(Date.now() / 1000);
                  let delta = trackEndtime - currentTime;

                  if (delta > 0) {
                    //lied ist noch nicht vorbei
                    trackToPlay = track;
                    showTitlesInMusicBar(trackToPlay);
                    trackTimePosition = duration - delta;
                    break;
                  }
                }
              } else {
                console.log("kein lied vorhanden");
              }

              let curId;
              if (trackToPlay) {
                curId = trackToPlay.uri;

                player.playVideo();

                setTimeout(() => {
                  // || player.getPlayerState() === 3
                  if (player.getPlayerState() === -1) {
                    player.loadVideoById({
                      videoId: curId,
                      startSeconds: trackTimePosition,
                    });
                  }
                }, 300);

                //   setTimeout(()=> {
                //     if (player.getPlayerState() === 0) {
                //       //player.seekTo(trackTimePosition, true)
                //     }
                //   }, 400)
              }

              showList(trackToPlay, playlist, "append");
            });
        }
      },
    }
  );
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    hider.style.display = "none";
    console.log("started video and runnning");
  } else if (event.data == YT.PlayerState.PAUSED) {
    event.target.playVideo();
  } else if (event.data == YT.PlayerState.ENDED) {
    hider.style.display = "flex";
    event.target.loadVideoById({ videoId: "" });
    fetchPlaylistAndPlayVideo();

    fetch("http://localhost:3000/reactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector("[name=csrf-token]").content,
      },
      body: JSON.stringify({ reactionType: "RESET", server_id }),
    });
  } else if (event.data == YT.PlayerState.CUED) {
  } else if (event.data == YT.PlayerState.BUFFERING) {
  }
}

function stopVideo() {
  //player.stopVideo();
}

function fetchPlaylistAndPlayVideo() {
  fetch(`/servers/${server_id}/playlist/`)
    .then((response) => response.json())
    .then((result) => {
      playlist = result;

      let trackToPlay;
      let trackTimePosition;

      if (playlist.length != 0) {
        for (let track of playlist) {
          let duration = parseInt(track.duration);
          let trackStarttime = parseInt(track.starttime);
          let trackEndtime = trackStarttime + duration;
          let currentTime = Math.floor(Date.now() / 1000);
          let delta = trackEndtime - currentTime;

          if (delta > 0) {
            //lied ist noch nicht vorbei
            trackToPlay = track;
            showTitlesInMusicBar(trackToPlay);
            console.log(track);
            trackTimePosition = duration - delta;
            break;
          }
        }
      } else {
        console.log("kein lied vorhanden");
      }

      let curId;
      if (trackToPlay) {
        curId = trackToPlay.uri;

        // player.playVideo()
        // 2. This code loads the IFrame Player API code asynchronously. But is no promise
        player.loadVideoById({
          videoId: curId,
          startSeconds: trackTimePosition,
        });

        // setTimeout(()=> {
        //   console.log("seekoti")
        //   console.log(trackTimePosition)
        //   player.seekTo(trackTimePosition, true)
        //   console.log(player.getVideoData()['video_id'])
        // }, 300)
      }

      showList(trackToPlay, playlist, "load");
    });
}

function showList(trackToPlay, playlist, type) {
  const LOAD = "load";
  let trackIndex;

  if (type == LOAD) {
    playlistElement.innerHTML = "";

    if (trackToPlay != undefined) {
      trackIndex = playlist.findIndex(
        (t) => t.starttime == trackToPlay.starttime
      );

      for (let i = trackIndex; i < playlist.length; i++) {
        let li = document.createElement("li");
        //li.innerText = playlist[i].title
        li.innerHTML =
          "<i class='playlist__icon fas fa-music'></i>" + playlist[i].title;
        li.className = "playlist__song";
        playlistElement.appendChild(li);
      }
    } //derzeit kein lied vorhanden
  } else {
    let i = playlist.length;
    console.log("playlist");
    let track = playlist[i - 1];
    let newTrack = document.createElement("li");
    newTrack.innerHTML =
      "<i class='playlist__icon fas fa-music'></i>" + track.title;
    newTrack.className = "playlist__song";
    //newTrack.innerText = track.title
    playlistElement.appendChild(newTrack);
  }
}

function showTitlesInMusicBar(currentTrack) {
  trackTitleNowElement.innerText = currentTrack.title;
  console.log(
    musicBarTitleCoverBlock.offsetWidth / trackTitleNowElement.offsetWidth
  );

  if (currentTrack.title.length > 30) {
    marquee.classList.add("marquee");
    trackTitleNowElement.classList.add("musicbar__titel-now--rolling");
  } else {
    marquee.classList.remove("marquee");
    trackTitleNowElement.classList.remove("musicbar__titel-now--rolling");
  }

  let trackIndex = playlist.findIndex(
    (t) => t.starttime == currentTrack.starttime
  );

  if (playlist[trackIndex + 1]) {
    trackTitleNextElement.innerText = `-next: ${
      playlist[trackIndex + 1].title
    }`;
  } else {
    trackTitleNextElement.innerText = "";
  }
}

function addSoundSettings() {
  const icon = document.getElementById("sound__icon");
  const range = document.getElementById("sound__range");
  icon.addEventListener("click", () => {
    if (player.isMuted()) {
      player.unMute();
      player.setVolume(30);
      range.value = "30";

      icon.innerHTML = "";
      let i = document.createElement("i");
      i.className = "fas fa-volume-up";
      icon.appendChild(i);
    } else {
      player.mute();
      range.value = "0";
      icon.innerHTML = "";
      let i = document.createElement("i");
      i.className = "fas fa-volume-mute";
      icon.appendChild(i);
    }
  });

  range.addEventListener("input", () => {
    let volume = range.value;
    if (volume == 0) {
      player.mute();
      player.setVolume(volume);
      icon.innerHTML = "";
      let i = document.createElement("i");
      i.className = "fas fa-volume-mute";
      icon.appendChild(i);
      player.setVolume(volume);
    } else {
      player.unMute();
      icon.innerHTML = "";
      let i = document.createElement("i");
      i.className = "fas fa-volume-up";
      icon.appendChild(i);
      player.setVolume(volume);
    }
  });
}

function updateTime() {
  try {
    if (player.getPlayerState() == 1) {
      let numberEndTime = player.getDuration();
      let numberRunTime = player.getCurrentTime();
      let minutesRun = Math.floor(numberRunTime / 60);
      let secondsRun = Math.floor(numberRunTime % 60);
      let minutesEnd = Math.floor(numberEndTime / 60);
      let secondsEnd = Math.floor(numberEndTime % 60);
      let lengthRun = secondsRun.toString();
      let lengthEnd = secondsEnd.toString();

      if (lengthRun.length < 2) {
        secondsRun = "0" + secondsRun;
      }
      if (lengthEnd.length < 2) {
        secondsEnd = "0" + secondsEnd;
      }

      runtime.innerHTML = "";
      runtime.innerText = minutesRun + ":" + secondsRun;

      endtime.innerHTML = "";
      endtime.innerText = minutesEnd + ":" + secondsEnd;

      let progress = numberRunTime.toFixed(2) / numberEndTime.toFixed(2);

      let musicRun = document.querySelector(".musicbar__run");
      let musicEnd = document.querySelector(".musicbar__end");
      let widthLeft = progress * 450;
      let widthRight = (1 - progress) * 450;
      musicRun.style.width = widthLeft + "px";
      musicEnd.style.width = widthRight + "px";
    }
  } catch (e) {
    console.log("der player sit noch nicht geladen" + e);
  }
}

self.setInterval(updateTime, 100);
