function PagesStore(){
  self = this
  riot.observable(this),
  self.pages = [];

  self.load = function(data){
    self.pages = data
    self.trigger('pages-loaded', self.pages)
  }

  self.add = function(item){
    self.pages.unshift(item)
    self.trigger('page-added', self.pages)
  }

  self.count = function(type){
    self.count  =  $.grep(self.pages, function(v) {
        return v.name === type;
    });
  }

}
