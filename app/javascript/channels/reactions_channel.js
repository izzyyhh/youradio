import consumer from "./consumer";

const server_id = document
  .getElementById("server-id")
  .getAttribute("data-server-id");

consumer.subscriptions.subscriptions.forEach((subscription) => {
  consumer.subscriptions.remove(subscription);
});

const ReactionsChannel = consumer.subscriptions.create(
  { channel: "ReactionsChannel", server_id: server_id },
  {
    connected() {
      console.log("reaction is ready on channel: " + server_id);
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
    },
  }
);

console.log("from reacitonjs" + ReactionsChannel);

export default ReactionsChannel;
