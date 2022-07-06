const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const form = document.querySelector("#message-form");
const input = form.querySelector("input");
const button = form.querySelector("button");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  button.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    button.removeAttribute("disabled");
    input.value = "";
    input.focus();

    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");
  });
});

const locat = document.querySelector("#send-location");
locat.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  locat.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        locat.removeAttribute("disabled");
        console.log("Location shared!");
      }
    );
  });
});
