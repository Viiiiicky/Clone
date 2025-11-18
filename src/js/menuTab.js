import { toggleMenu } from "./expandMenu.js";

// 選項的對應內容
const contentModels = document.querySelector(".sidemenu-content-models");
const contentOrder = document.querySelector(".sidemenu-content-order");
const contentService = document.querySelector(".sidemenu-content-service");
const contentDiscover = document.querySelector(".sidemenu-content-discover");
const contentDealer = document.querySelector(".sidemenu-content-dealer");
const contentLogin = document.querySelector(".sidemenu-content-login");

// 選單的項目
const optionModels = document.querySelector(".option-models");
const optionOrder = document.querySelector(".option-order");
const optionService = document.querySelector(".option-service");
const subjectDiscover = document.querySelector(".option-discover");
const optionDealer = document.querySelector(".option-dealer");
const optionLogin = document.querySelector(".option-login");

// 包住選項及對應內容區塊
const optionsWrapper = document.querySelector(".sidemenu-options-wrapper");
const contentWrapper = document.querySelector(".sidemenu-content-wrapper");
const sideMenuWrapper = document.querySelector(".sidemenu-wrapper");

// 方便查詢的陣列
const optionLinks = [
  optionModels,
  optionOrder,
  optionService,
  subjectDiscover,
  optionDealer,
  optionLogin,
];

const linkContent = [
  contentModels,
  contentOrder,
  contentService,
  contentDiscover,
  contentDealer,
  contentLogin,
];

const linkTitle = [
  "車型系列",
  "諮詢與購買",
  "服務",
  "發現更多",
  "尋找經銷商",
  "登入",
];

const spanContext = document.querySelector(".content-wrapper-title");

const isLargeScreen = () => window.matchMedia("(min-width: 62.5em)").matches;

const CALCULATION_DELAY_MS = 100;

// 控制要展示哪個項目的內容
export const activateContent = (index) => {
  if (index === -1) {
    optionsWrapper.classList.remove("hidden");

    linkContent.forEach((content) => {
      content.classList.remove("active");
    });

    checkAndSetScroll(linkContent[0], contentWrapper);

    if (!isLargeScreen()) {
      contentWrapper.classList.remove("active");
    } else {
      contentWrapper.classList.add("active");

      if (contentModels) {
        contentModels.classList.add("active");
      }
    }

    return;
  }

  // 小螢幕時選單為一欄
  if (!isLargeScreen()) {
    optionsWrapper.classList.add("hidden");
    contentWrapper.classList.add("active");
  } else {
    optionsWrapper.classList.remove("hidden");
    contentWrapper.classList.add("active");
  }

  // 確保移除所有項目的active類別，避免重疊顯示
  linkContent.forEach((content) => {
    content.classList.remove("active");
  });

  contentWrapper.classList.remove("needs-scroll");

  // 依據接收到的索引值，套用至對應的內容
  if (index !== undefined && index >= 0 && linkContent[index]) {
    linkContent[index].classList.add("active");
    spanContext.textContent = linkTitle[index];

    checkAndSetScroll(linkContent[index], contentWrapper);
  }
};

// 根據對應content的內容高度判斷是否需增加滾動軸
function checkAndSetScroll(contentElement, targetWrapper) {
  targetWrapper.classList.remove("needs-scroll");

  setTimeout(() => {
    const contentScrollHeight = contentElement.scrollHeight;
    const availableHeight = window.innerHeight;

    if (contentScrollHeight > availableHeight) {
      targetWrapper.classList.add("needs-scroll");
    } else {
      targetWrapper.classList.remove("needs-scroll");
    }
  }, CALCULATION_DELAY_MS);
}

// 小螢幕時出現的上一頁按鈕功能
const backButton = document.querySelector(".back-button");

backButton.addEventListener("click", (event) => {
  event.stopPropagation();

  if (!isLargeScreen()) {
    optionsWrapper.classList.remove("hidden");
    contentWrapper.classList.remove("active");
  }
});

optionsWrapper.addEventListener("click", (event) => {
  // 根據被點擊的元素，找到最近的.sidemenu-option項目
  const clickedListItem = event.target.closest(".sidemenu-option");

  if (clickedListItem) {
    const targetIndex = optionLinks.indexOf(clickedListItem);

    // indexOf若沒找到會回傳-1，非-1則代表有對應的內容可顯示
    if (targetIndex !== -1) {
      activateContent(targetIndex);
    }
  }
});

// 點擊nav的會員打開登入頁面
const loginButton = document.querySelector(".login-button");
const indexOfLogin = linkContent.indexOf(contentLogin);

loginButton.addEventListener("click", () => {
  toggleMenu(true);

  if (indexOfLogin !== -1) {
    activateContent(indexOfLogin);
  }
});

let lastIsLargeScreen = isLargeScreen();
const sideMenu = document.querySelector(".side-menu");

const handleRwdResize = () => {
  const currentIsLargeScreen = isLargeScreen();
  const isMenuOpen = sideMenu.getAttribute("data-visible") === "true";

  // 只在斷點不一樣時才執行DOM操作
  if (currentIsLargeScreen !== lastIsLargeScreen && isMenuOpen) {
    // 小螢幕變成大螢幕
    if (currentIsLargeScreen) {
      optionsWrapper.classList.remove("hidden");
      contentWrapper.classList.add("active");
    } else {
      //大螢幕變成小螢幕
      optionsWrapper.classList.add("hidden");
      contentWrapper.classList.add("active");
    }
  }

  // 紀錄本次為大或小螢幕
  lastIsLargeScreen = isLargeScreen();
};

window.addEventListener("resize", handleRwdResize);

handleRwdResize();
