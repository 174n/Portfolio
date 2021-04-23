// Remove no-js classes
[...document.querySelectorAll(".no-js")].forEach(el => {
  el.classList.remove("no-js");
});

// Scrolling effects

const header = document.querySelector("#header");
const profile = document.querySelector("#profile");
const sectionsOffset = [...document.querySelectorAll("section")].
  map(v => v.offsetTop);

const scrolling = () => {

  if(window.scrollY > 100){
    header.classList.add("scrolling");
  }
  else if(window.scrollY < 100){
    header.classList.remove("scrolling");
  }

  sectionsOffset.forEach((v, i, a) => {
    if(window.scrollY >= v - a[0] - 150) {
      profile.style.top = (v - a[0]) + "px";
    }
  });

}
window.addEventListener('scroll', scrolling);
scrolling();


const workSelektors = [...document.querySelectorAll("#switch-groups input")];
const works = [...document.querySelectorAll(".work")];
const modals = [...document.querySelectorAll(".modal")];

// Sort works

workSelektors.forEach(input => {
    input.addEventListener("click", e => {
      let tag = e.target.value;
      works.
        forEach(work => {
          let tags = work.getAttribute("data-tags").split(",");
          if(tags.includes(tag) || tag === "all") {
            work.classList.remove("hidden");
          } else {
            work.classList.add("hidden");
          }
        });
        setTimeout(() => {
          window.AOS.refresh();
        }, 500)
    });
  });


// Open modal

works.forEach(work => {
  work.addEventListener("click", e => {
    let id = work.getAttribute("data-id");
    modals.forEach(modal => {
      if(modal.getAttribute("data-id") === id) {
        modal.scrollTop = 0;
        modal.classList.add("show");
        modal.querySelector(".close").focus();
        document.body.classList.add("noscroll");
      }
    });
  });
});


// Close modal

modals.forEach(modal => {
  const closeModal = e => {
    if(["fa-times", "close", "modal"]
      .map(className => e.target.classList.contains(className))
      .reduce((a, v) => a || v, false)) {
      modals.forEach(md => {
        md.classList.remove("show");
      });
      [...document.querySelectorAll(".video iframe")]
        .forEach(frm => {
          const vid = frm.parentElement;
          const link = vid.querySelector("a");
          const btn = vid.querySelector("button");

          link.classList.remove("hidden");
          btn.classList.remove("hidden");
          frm.remove();
        });
      document.body.classList.remove("noscroll");
    }
  };
  modal.addEventListener("click", closeModal);
  modal.addEventListener('keydown', e => {
     if(e.keyCode == 27) { //esc
       closeModal(e);
     }
  });

});


// Lasy loading images

// [...document.querySelectorAll(".lazyload")].forEach(img => {
//   [...img.parentElement.getElementsByTagName('source')].forEach(src => {
//     src.setAttribute("srcset", src.getAttribute("data-srcset"));
//   });
//   img.src = img.getAttribute("data-src");
//   img.classList.add("lazyloaded");
// });


// Lasy loading videos

[...document.querySelectorAll(".video")].forEach(vid => {
  const link = vid.querySelector("a");
  const btn = vid.querySelector("button");
  const vidId = vid.getAttribute("data-id");

  link.removeAttribute("href");
  btn.classList.add("initialized");

  vid.addEventListener("click", () => {
    let iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allow", "autoplay");
    iframe.setAttribute("src", `https://www.youtube.com/embed/${vidId}?autohide=1&autoplay=1&rel=0&modestbranding=1`);

    vid.appendChild(iframe);
    link.classList.add("hidden");
    btn.classList.add("hidden");
  });

});

// Refresh AOS after resizing

window.onresize = () => {
  if (window.refr) clearTimeout(window.refr);
  window.refr = setTimeout(() => {
    window.AOS.refresh();
  }, 1000);
}

// Enter -> Click

[...document.querySelectorAll("[tabindex]")].forEach(el => {
  el.addEventListener('keydown', e => {
     if(e.keyCode == 13 || e.keyCode == 32) {
       el.click();
     }
  });
})
