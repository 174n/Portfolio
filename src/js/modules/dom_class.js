var dom_class = {
  getRegex: function(className){
    return new RegExp("(?:^|\s)"+className+"(?!\S)","g");
  },
  add: function(elem, className){
    if(!this.has(elem, className)){
      elem.className += " "+className;
      return className;
    }
    else return false
  },
  remove: function(elem, className){
    elem.className = elem.className.replace(this.getRegex(className),'');
    return className;
  },
  has: function(elem, className){
    return elem.className.match(this.getRegex(className))!==null;
  }
}