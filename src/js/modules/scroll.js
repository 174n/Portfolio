let header = document.getElementById("header");
let profile = document.getElementById("profile");



AOS.init();

var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  offset: 70
});





let scrolled = false;
let scrolling = function(){
  if(window.scrollY > 100 && !scrolled){
    // dom_class.add(header,"scrolling");
    header.style.backgroundColor = "#E1E9F4";
    header.style.backgroundImage = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
    header.style.boxShadow = "0 0 18px 0px rgba(0,0,0,.3)";
    scrolled = true;
  }
  else if(window.scrollY < 100){
    header.style.backgroundColor = "";//rgba(255,255,255,.5)
    header.style.backgroundImage = "";
    header.style.boxShadow = "";
    scrolled = false;
  }

  document.querySelectorAll("section").forEach((v)=>{
    if(window.scrollY >= v.offsetTop-150) profile.style.top = v.offsetTop+"px";
    
  });

}
window.addEventListener('scroll', scrolling);
scrolling();