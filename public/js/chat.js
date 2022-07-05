
const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log("The count has been updated!", count);
// });

// const button = document.querySelector("#increment");
// button.addEventListener("click", () => {
//   console.log("Clicked");
//   socket.emit("increment");
// });

socket.on("message", (message) => {
  console.log(message);
});

const form = document.querySelector("#message-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.querySelector("input").value;
  socket.emit("sendMessage", message);
});
