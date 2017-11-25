let modal = {
  selector: document.querySelector(".modal"),
  open: function(title="Work example", description="Some of my works I've created", tags=["Web development"], image="http://via.placeholder.com/1080x3000", link={}){
    document.body.style.overflow = "hidden";
    this.selector.style.visibility = "visible";
    this.selector.style.opacity = "1";
    this.selector.scrollTop = 0;
    modal.selector.querySelector("img").src=image;
    modal.selector.querySelector(".title").innerHTML = title;
    modal.selector.querySelector(".description").innerHTML = description;

    let display_link = Object.keys(link).length !== 0;
    modal.selector.querySelector(".link").style.display = display_link ? "flex" : "none";
    if(display_link){
      modal.selector.querySelector(".link .link-text").innerHTML = link.text;
      modal.selector.querySelector(".link a").href = link.url;
    }

    modal.selector.querySelector(".tags").innerHTML = "";
    tags.forEach((v)=>{
      modal.selector.querySelector(".tags").innerHTML += '<div class="tag">'+v+'</div>';
    });
  },
  close: function(){
    this.selector.style.visibility = "hidden";
    this.selector.style.opacity = "0";
    document.body.style.overflow = "visible";
  },
  init: function(){
    this.selector.querySelector(".close").onclick = function(){
      modal.close();
    }
    this.selector.onclick = function(e){
      if(e.target.getAttribute('class') === "modal") modal.close();
    }
  }
}

modal.init();