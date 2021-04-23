import AOS from "aos";
import SmoothScroll from "smooth-scroll";

window.AOS = AOS;

AOS.init({
  offset: 10
});

var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  offset: 70
});
