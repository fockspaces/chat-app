const socket = io();

const form = document.querySelector("#message-form");
const input = form.querySelector("input");
const button = form.querySelector("button");
const $message = document.querySelector("#messages");

// template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username,
    room,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
});

// location request to console
socket.on("LocationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username,
    room,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  button.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  if (message == "") {
    button.removeAttribute("disabled");
    return;
  }
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

socket.emit("join", { username, room });
