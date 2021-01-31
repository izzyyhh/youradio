import consumer from "./consumer"

const JOIN_ROOM = "JOIN_ROOM";
const EXCHANGE = "EXCHANGE";
const REMOVE_USER = "REMOVE_USER";

const ice = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

let server_id
let currentUser;
let localVideo;
let remoteVideoContainer;

let pcPeers = {};
let localstream;


const logError = error => console.warn("Whoops! Error:", error);
//fetch broadcast
const broadcastData = (data) => {
  const csrfToken = document.querySelector("[name=csrf-token]").content;
  const headers = new Headers({
    "content-type": "application/json",
    "X-CSRF-TOKEN": csrfToken,
  });

  fetch("broadcastrtc", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
}

// Add event listener's to buttons
// We need to do this now that our JS isn't handled by the asset pipeline
document.addEventListener("DOMContentLoaded", () => {

});

//own video
document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        localstream = stream;
        localVideo.srcObject = stream;
        localVideo.muted = true;
      })
      .catch(logError);
  }
};

const handleJoinSession = async () => {
  console.log("moin")
  consumer.subscriptions.create({ channel: "ServerChannel", server_id: server_id}, {
    connected: () => {
      broadcastData({
        type: JOIN_ROOM,
        from: currentUser,
        server_id: server_id
      });
    },
    received: (data) => {
      console.log("received", data);
      if (data.from === currentUser) return;
      switch (data.type) {
      case JOIN_ROOM:
        return joinRoom(data);
      case EXCHANGE:
        if (data.to !== currentUser) return;
        return exchange(data);
      case REMOVE_USER:
        return removeUser(data);
      default:
        return;
      }
    },
  });
};

const handleLeaveSession = () => {
  for (let user in pcPeers) {
    pcPeers[user].close();
  }
  pcPeers = {};

  remoteVideoContainer.innerHTML = "";

  broadcastData({
    type: REMOVE_USER,
    from: currentUser,
    server_id: server_id
  });
};

const joinRoom = (data) => {
  // create a peerConnection to join a room
  createPC(data.from, true);
};

const removeUser = (data) => {
  // remove a user from a room
  console.log("removing user", data.from);
  let video = document.getElementById(`remoteVideoContainer+${data.from}`);
  video && video.remove();
  delete pcPeers[data.from];
};

const createPC = (userId, isOffer) => {
  // new instance of RTCPeerConnection
  // potentially create an "offer"
  // exchange SDP
  // exchange ICE
  // add stream
  // returns instance of peer connection
  let pc = new RTCPeerConnection(ice);
  pcPeers[userId] = pc;

  for (const track of localstream.getTracks()) {
    pc.addTrack(track, localstream);
  }

  console.log(isOffer && pc)

  isOffer &&
    pc
      .createOffer()
      .then((offer) => {
        return pc.setLocalDescription(offer);
      })
      .then(() => {
        broadcastData({
          type: EXCHANGE,
          from: currentUser,
          to: userId,
          sdp: JSON.stringify(pc.localDescription),
          server_id: server_id
        });
      })
      .catch(logError);

  pc.onicecandidate = (event) => {
    event.candidate &&
      broadcastData({
        type: EXCHANGE,
        from: currentUser,
        to: userId,
        candidate: JSON.stringify(event.candidate),
        server_id: server_id
      });
  };

  pc.ontrack = (event) => {
    const element = document.createElement("video");
    element.id = `remoteVideoContainer+${userId}`;
    element.autoplay = "autoplay";
    element.srcObject = event.streams[0];
    remoteVideoContainer.appendChild(element);
  };

  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState == "disconnected") {
      console.log("Disconnected:", userId);
      broadcastData({
        type: REMOVE_USER,
        from: userId,
        server_id: server_id
      });
    }
  };

  return pc;
}

const exchange = (data) => {
  // add ice candidates
  // sets remote and local description
  // creates answer to sdp offer
  let pc;

  if (!pcPeers[data.from]) {
    pc = createPC(data.from, false);
  } else {
    pc = pcPeers[data.from];
  }

  if (data.candidate) {
    pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
      .then(() => console.log("Ice candidate added"))
      .catch(logError);
  }

  if (data.sdp) {
    const sdp = JSON.parse(data.sdp);
    pc.setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer()
            .then((answer) => {
              return pc.setLocalDescription(answer);
            })
            .then(() => {
              broadcastData({
                type: EXCHANGE,
                from: currentUser,
                to: data.from,
                sdp: JSON.stringify(pc.localDescription),
                server_id: server_id
              });
            });
        }
      })
      .catch(logError);
  }
};

document.addEventListener("turbolinks:load", ()=>{
  const joinButton = document.getElementById("join-button");
  const leaveButton = document.getElementById("leave-button");

  joinButton.onclick = handleJoinSession;
  leaveButton.onclick = handleLeaveSession;

  server_id = document.getElementById('server-id').getAttribute('data-server-id')
  currentUser = document.getElementById('user-id').getAttribute('data-user-id')

  localVideo = document.getElementById("local-video");
  remoteVideoContainer = document.getElementById("remote-video-container");



  // consumer.subscriptions.subscriptions.forEach((subscription) => {
  //   consumer.subscriptions.remove(subscription)
  // })
  
  // consumer.subscriptions.create({ channel: "ServerChannel", server_id: server_id}, {
  //   connected() {
  //     //broadcastData({ type: "initiateConnection", server_id: server_id });

  //     console.log("connected to: " + server_id)
  //     // Called when the subscription is ready for use on the server
  //   },
  
  //   disconnected() {
  //     // Called when the subscription has been terminated by the server
  //   },
  
  //   received(data) {
  //     if(data.type == undefined){
  //       const messages = document.getElementById('server-messages')
  //       messages.innerHTML += data.html
  //       console.log(data)

  //     } else{

  //     }
  //     // Called when there's incoming data on the websocket for this channel
  //   }
  // });  
})