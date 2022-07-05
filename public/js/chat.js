const socket = io();


socket.on("message", (message) => {
  console.log(message);
});

const form = document.querySelector("#message-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
     if(error) { 
        return console.log(error);
     }
     console.log('Message delivered');
  });
});

const locat = document.querySelector("#send-location");
locat.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }, () => {
        console.log('Location shared!');
    });
  });
});

