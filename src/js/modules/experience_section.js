// var Shuffle = window.Shuffle;

var works = new Shuffle(document.querySelector('.works'), {
  itemSelector: '.work',
});



document.getElementById("switch-groups").onchange = function(e){
  let tags = [];
  document.querySelectorAll("#switch-groups > input").forEach((v)=>{
    tags.push(v.value);
  });
  let groups = e.target.value === "all" ? tags : e.target.value;
  works.filter(groups);
};




document.querySelectorAll('.work').forEach((elem)=>{
  elem.onclick = function(e){
    modal.open(
      elem.getAttribute("data-title"),
      elem.getAttribute("data-description"),
      JSON.parse(elem.getAttribute("data-groups")),
      elem.querySelector("img").src.replace('preview', 'full'),
      JSON.parse(elem.getAttribute("data-link")||"{}")
    );
  }
});