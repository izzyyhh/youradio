window.document.addEventListener("DOMContentLoaded", () => {
  let sendMessageButton = document.getElementById("send-message-button");
  let messageInput = document.getElementById("content-input");

  sendMessageButton.addEventListener("click", (e) => {
    if (messageInput.value == "") {
      e.preventDefault();
    }
  });
});
