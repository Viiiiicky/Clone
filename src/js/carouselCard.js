// 取得包住卡片的區塊
const allSeriesWrapper = document.querySelector(".all-series-wrapper");
// 取得個別卡片並轉為陣列
const allSeriesCard = Array.from(
  allSeriesWrapper.querySelectorAll(".all-series-card")
);

// 取得包住指示點的區塊 ( 指示點用在小螢幕時，表示當前播放的卡片 )
const indicatorWrapper = document.querySelector(".indicator-wrapper");

// 取得個別指示點元素並轉為陣列
const indicators = Array.from(indicatorWrapper.children);

// 取得小螢幕控制卡片播放暫停的按鈕
const controlButton = document.querySelector(".all-series-control-button");
const mediaQueryString = "(min-width: 62.5em)";
const mediaQuery = window.matchMedia(mediaQueryString);

let currentVideoIndex = 0; // 目前播放的卡片索引
let isPlaying = true; // 小螢幕狀態預設播放影片

// 切換控制按鈕的圖示(播放/暫停)
function toggleControlIcon(playing) {
  const pauseIcon = controlButton.querySelector(".control-pause");
  const playIcon = controlButton.querySelector(".control-play");

  if (pauseIcon && playIcon) {
    if (playing) {
      pauseIcon.classList.remove("hidden");
      playIcon.classList.add("hidden");
    } else {
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
    }
  }
}

// 手動暫停時，將影片暫停並設為靜態圖片
function resetVideo(video) {
  video.pause();
  video.closest(".all-series-card").classList.remove("video-active");
}

// 將影片已播放時間歸零並設為靜態圖片
function forceResetVideo(video) {
  video.pause();
  video.currentTime = 0;
  video.closest(".all-series-card").classList.remove("video-active");
}

// 更新指示點進度條 ( 適用於小螢幕 )
function updateProgressBar(video, indicator) {
  // 紀錄目前播放了多少
  const played = video.currentTime;
  // 紀錄總時長
  const duration = video.duration;
  // 計算進度條進度
  const progressPercentage = `${(played / duration) * 100}%`;
  // 將進度條套用到對應指示點上的width: var(--progress)變數
  indicator.style.setProperty("--progress", progressPercentage);
}

// 更新影片時間的回調函式
function videoTimeUpdateHandler(event) {
  // 確定要播放的影片是事件的target
  const video = event.target;
  // 找出對應的指示點
  const indicator = indicators[currentVideoIndex];
  // 找到指示點後，呼叫updateProgressBar來更新播放進度
  if (indicator) {
    updateProgressBar(video, indicator);
  }
}

// 處理播放完畢狀態的回調函式
function videoEndedHandler(event) {
  // 確定要暫停的影片為事件的target
  const video = event.target;

  // 暫停影片並設為靜態img
  video.pause();
  video.closest(".all-series-card").classList.remove("video-active");

  // 影片播畢，將指示點進度條設為100%
  const indicator = indicators[currentVideoIndex];
  if (indicator) {
    indicator.style.setProperty("--progress", "100%");
  }

  // 更新isPlaying和按鈕狀態
  isPlaying = false;
  toggleControlIcon(isPlaying);

  // 影片播畢後移除事件綁定，防止資源浪費及避免邏輯衝突
  video.removeEventListener("timeupdate", videoTimeUpdateHandler);
  video.removeEventListener("ended", videoEndedHandler);
}

// 控制影片播放，需接收索引及action ( 沒有傳入則預設值為播放 )
function controlVideo(index, action = "play") {
  // 確定要播放哪張卡片
  const currentCard = allSeriesCard[index];
  // 在卡片裡找到video元素
  const video = currentCard.querySelector("video");
  // 確認對應的指示點元素
  const indicator = indicators[index];

  if (!video) return;

  // 重設所有卡片及影片樣式
  allSeriesCard.forEach((card, index) => {
    // 非啟用狀態的卡片
    const otherVideo = card.querySelector("video");

    // 避免重複綁定timeupdate、ended的監聽事件，先全部清除
    if (otherVideo) {
      otherVideo.removeEventListener("timeupdate", videoTimeUpdateHandler);
      otherVideo.removeEventListener("ended", videoEndedHandler);
    }

    // 如果不是啟用的卡片，暫停並將影片進度重設為0
    if (index !== currentVideoIndex) {
      forceResetVideo(otherVideo);
    }

    // 重設所有指示點進度條 ( 包含當前卡片，等待下方 action 判斷來重新設定其狀態 )
    if (indicators[index]) {
      indicators[index].style.setProperty("--progress", "0%");
    }
  });

  // 判斷影片狀態
  if (action === "play") {
    if (video) {
      video.muted = true;
    }
    // 播放影片並移除loop屬性以確保小螢幕不會重複播
    video.play();
    video.removeAttribute("loop");
    currentCard.classList.add("video-active");
    isPlaying = true;

    // 在播放的影片上綁定事件監聽器
    video.addEventListener("timeupdate", videoTimeUpdateHandler);
    video.addEventListener("ended", videoEndedHandler);
  } else {
    // 點擊暫停控制鈕會傳入pause，此時將進度條設為100並記錄當前播放秒數
    resetVideo(video);
    isPlaying = false;

    indicator.style.setProperty("--progress", "100%");
  }
  // 切換對應的控制圖示
  toggleControlIcon(isPlaying);
}

// 負責切換到指定的卡片，需傳入索引值
function goToSlide(targetIndex) {
  // 先重設所有指示點的樣式為未啟用
  indicators.forEach((indicator) => indicator.classList.remove("active"));

  // 計算整個wrapper移動的距離來實現滑動效果，剛好與索引值倍數對應
  const offset = `calc((-100% - 2rem) * ${targetIndex})`;

  // 移動wrapper來實現滑動效果
  allSeriesWrapper.style.transform = `translateX(${offset})`;

  // 在對應的指示點套用啟用樣式
  indicators[targetIndex].classList.add("active");

  // 更新並記錄目前的卡片索引
  currentVideoIndex = targetIndex;

  // 呼叫controlVideo，並播放指定索引的影片
  controlVideo(targetIndex, "play");
}

// 滑過卡片播放影片的回調函式 ( 適用大螢幕 )
function handleMouseEnter(event) {
  // 若為小螢幕觸發事件則不執行
  if (!mediaQuery.matches) return;

  // 取得卡片及對應的影片元素
  const card = event.currentTarget;
  const video = card.querySelector("video");

  if (!video) return;

  // 先清除計時器避免記憶體洩漏
  clearTimeout(card.dataset.hoverTimeoutId);

  // 啟用對應樣式並播放影片
  card.classList.add("video-active");
  video.play();
}

// 滑出卡片暫停影片的回調函式 ( 適用大螢幕 )
function handleMouseLeave(event) {
  // 若為小螢幕觸發事件則不執行
  if (!mediaQuery.matches) return;

  // 取得卡片及對應的影片元素
  const card = event.currentTarget;
  const video = card.querySelector("video");

  if (!video) return;

  // 設定計時器，500毫秒後暫停並將影片時間歸零
  card.dataset.hoverTimeoutId = setTimeout(() => {
    forceResetVideo(video);
  }, 500);
}

// 判斷是否啟用滑過卡片播放影片的事件監聽器
function toggleHoverEvents(shouldBind) {
  allSeriesCard.forEach((card) => {
    // shouldBind 為 true，也就是media query符合大螢幕規則，為所有卡片套用滑過滑出事件
    if (shouldBind) {
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    } else {
      // 否則為小螢幕規則，移除所有滑過滑出事件監聽
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      // 強制將卡片暫停並歸零
      forceResetVideo(card.querySelector("video"));
    }
  });
}

// 處理mediaQuery變動時的函式，啟用對應事件監聽器
function handleMediaChange(event) {
  // 大螢幕時啟用滑過滑出監聽，隱藏小螢幕的播放控制鈕，並歸零進度條
  if (event.matches) {
    toggleHoverEvents(true);
    controlButton.classList.add("hidden");
    indicators.forEach((indicator) =>
      indicator.style.setProperty("--progress", "0%")
    );
  } else {
    // 小螢幕時移除滑過滑出監聽，新增小螢幕的播放控制鈕，移動至指定卡片
    toggleHoverEvents(false);
    controlButton.classList.remove("hidden");
    goToSlide(currentVideoIndex);
  }
}

// 在包住指示點的區塊新增點擊監聽器 ( 小螢幕適用 )
indicatorWrapper.addEventListener("click", (event) => {
  // 若大螢幕時監聽到事件，不繼續執行
  if (mediaQuery.matches) return;

  // 找到最近的指示點
  const targetIndicator = event.target.closest(".all-series-nav-indicator");
  if (!targetIndicator) return;

  // 找出該指示點的索引並儲存至targetIndex
  const targetIndex = indicators.indexOf(targetIndicator);

  // 跳至對應的卡片
  goToSlide(targetIndex);
});

// 在影片控制鈕上新增點擊監聽器 ( 小螢幕適用 )
controlButton.addEventListener("click", () => {
  // 若大螢幕時監聽到事件，不繼續執行
  if (mediaQuery.matches) return;

  // 判斷並呼叫對應的控制事件
  if (isPlaying) {
    controlVideo(currentVideoIndex, "pause");
  } else {
    controlVideo(currentVideoIndex, "play");
  }
});

// 載入後先確認視窗尺寸並啟用對應的事件監聽
handleMediaChange(mediaQuery);

// 監聽媒體查詢有無變動，並呼叫handleMediaChange更新事件監聽
mediaQuery.addEventListener("change", handleMediaChange);

indicators[0].classList.add("active");
toggleControlIcon(true);
