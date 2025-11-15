//捲動至全系列車款時更改背景色

const section = document.querySelector(".all-series");
const colorIn = "hsl(240, 2%, 6%)";
const colorOut = "#fff";

const title = document.querySelector(".all-series-title");
const dealerText = document.querySelector(".dealer-wrapper");

window.addEventListener("scroll", () => {
  const scrollFromTop = window.pageYOffset;

  const sectionTop = section.offsetTop;
  const sectionBottom = sectionTop + section.offsetHeight;

  const dealerTop = document.querySelector(".dealer-section").offsetTop;

  document.body.style.transition = "background-color 1s ease";
  title.style.transition = "color 1s ease";
  dealerText.style.transition = "color 1s ease";

  // if (
  //   scrollFromTop + window.innerHeight / 2 >= sectionTop &&
  //   scrollFromTop < sectionBottom
  // ) {
  //   title.style.color = colorOut;
  //   document.body.style.backgroundColor = colorIn;
  // } else {
  //   document.body.style.backgroundColor = colorOut;
  //   title.style.color = colorIn;
  // }

  if (
    scrollFromTop + window.innerHeight / 2 >= sectionTop &&
    scrollFromTop + +window.innerHeight / 2 < sectionBottom
  ) {
    document.body.style.backgroundColor = colorIn;
    title.style.color = colorOut;
    dealerText.style.color = colorOut;
  } else {
    document.body.style.backgroundColor = colorOut;
    title.style.color = colorIn;
    dealerText.style.color = colorIn;
  }
});
