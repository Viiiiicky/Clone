import { activateContent } from "./menuTab.js";

// 左側選單
const navExpand = document.querySelector(".side-menu");
const menuButton = document.querySelector(".menu-button");
const closeButton = document.querySelector(".close-button");
const listContentWrapper = document.querySelector(".sidemenu-wrapper");

// 左側選單內的半徑下拉選單
const dropdownWrapper = document.querySelector(".distance-dropdown");
const buttonChevron = document.querySelector(".dropdown-button img");
const dropdownButton = document.querySelector(".dropdown-button");
const dropdownContent = document.querySelector(".dropdown-content");
const dropdownLinks = document.querySelectorAll(".dropdown-content button");
const hiddenInput = document.querySelector("#distance-value");
const dropdownText = document.querySelector(".dropdown-text");
let isVisible = false;

// 控制左側選單開關
export const toggleMenu = (shouldOpen) => {
  const currentState = navExpand.getAttribute("data-visible") === "true";
  const targetState = shouldOpen;

  if (currentState !== targetState) {
    navExpand.setAttribute("data-visible", targetState ? "true" : "false");
  }
};

// 控制半徑下拉選單開關
export const closeDropdown = () => {
  if (isVisible) {
    dropdownContent.classList.remove("active");
    buttonChevron.classList.remove("rotate");
    isVisible = false;
  }
};

// 選單文字被點擊時打開選單
menuButton.addEventListener("click", () => {
  toggleMenu(true);
  activateContent(-1);
});

// 關閉按鈕被點擊時關閉選單+關閉半徑下拉選單
closeButton.addEventListener("click", (event) => {
  // 阻止點擊事件冒泡到父元素而導致重複關閉
  event.stopPropagation();

  toggleMenu(false);

  closeDropdown();
});

// 設定左側選單展開時，何時要關閉對應的選單
navExpand.addEventListener("click", (event) => {
  const isClickedInsideListWrapper = listContentWrapper.contains(event.target);
  const isClickedInsideDropdown = dropdownWrapper.contains(event.target);

  if (!isClickedInsideListWrapper) {
    toggleMenu(false);
  }

  if (!isClickedInsideDropdown) {
    closeDropdown();
  }
});

dropdownButton.addEventListener("click", (event) => {
  event.stopPropagation();

  if (!isVisible) {
    dropdownContent.classList.add("active");
    buttonChevron.classList.add("rotate");
    isVisible = true;
  } else {
    closeDropdown();
  }
});

// 預設半徑選單的文字內容
export const initializeDropdown = () => {
  // 取得選單內第一個元素
  const defaultLink = document.querySelector(
    ".dropdown-content button:first-child"
  );

  // 將按鈕的內容設為第一個元素的內容
  dropdownText.textContent = defaultLink.textContent;

  // 使用隱藏的input儲存半徑的值
  hiddenInput.value = defaultLink.textContent.split(" ")[0];

  // 預設將第一個元素設為被選取的樣式
  defaultLink.classList.add("selected");
};

export const handleLinkClick = (event) => {
  event.preventDefault();

  const clickedLink = event.currentTarget;

  dropdownLinks.forEach((link) => {
    link.classList.remove("selected");
  });

  clickedLink.classList.add("selected");

  dropdownText.textContent = clickedLink.textContent;
  hiddenInput.value = clickedLink.textContent.split(" ")[0];

  closeDropdown();
};

dropdownLinks.forEach((link) =>
  link.addEventListener("click", handleLinkClick)
);

// 網頁載入時預設樣式
document.addEventListener("DOMContentLoaded", initializeDropdown);
