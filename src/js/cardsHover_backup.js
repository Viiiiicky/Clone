// 滑過車款圖片播放影片

const cards = document.querySelectorAll(".all-series-card");

cards.forEach((card) => {
  const video = card.querySelector("video");
  if (!video) return;

  let timeoutId;

  card.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);

    card.classList.add("video-active");
    video.play();
  });

  card.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => {
      card.classList.remove("video-active");
      video.pause();
      video.currentTime = 0;
    }, 500);
  });
});
