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
