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

// 控制要展示哪個項目的內容
export const activateContent = (index) => {
  // 確保移除所有項目的active類別，避免重疊顯示
  linkContent.forEach((content) => {
    content.classList.remove("active");
  });

  // 依據接收到的索引值，套用至對應的內容
  linkContent[index].classList.add("active");
};

// 預設在頁面顯示linkContent陣列的第一個項目
activateContent(0);

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

const loginButton = document.querySelector(".login-button");
const indexOfLogin = linkContent.indexOf(contentLogin);

loginButton.addEventListener("click", () => {
  toggleMenu(true);

  if (indexOfLogin !== -1) {
    activateContent(indexOfLogin);
  }
});
