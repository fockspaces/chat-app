const socket = io();

const form = document.querySelector("#message-form");
const input = form.querySelector("input");
const button = form.querySelector("button");
const $message = document.querySelector("#messages");
const $sideBar = document.querySelector("#sidebar");

// template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = $message.lastElementChild;
  // Height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // visible height
  const visibleHeight = $message.offsetHeight;
  // height of container
  const containerHeight = $message.scrollHeight;
  // How far have I scrolled?
  const scrollOffset = ($message.scrollTop + visibleHeight)*2;

  if(containerHeight - newMessageHeight < scrollOffset) {
    $message.scrollTop = $message.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    room,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

// location request to console
socket.on("LocationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    room,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    users,
    room,
  });
  $sideBar.innerHTML = "";
  $sideBar.insertAdjacentHTML("beforeend", html);
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
