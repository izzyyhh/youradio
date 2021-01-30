import consumer from "./consumer"

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
