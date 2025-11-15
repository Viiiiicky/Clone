const videoSource = document.querySelector(".hero-video");
const controlButton = document.querySelector("button.control");

controlButton.addEventListener("click", () => {
  const isPlaying = controlButton.classList.contains("isPlaying");

  if (isPlaying) {
    videoSource.pause();
    controlButton.classList.remove("isPlaying");
  } else {
    videoSource.play();
    controlButton.classList.add("isPlaying");
  }
});
