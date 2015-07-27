<page-feed>

  <div class="grid simple">
    <div class="grid-title no-border">
      <h4>Pages <span class="semi-bold">History</span></h4>
      <div class="tools"><a href="javascript:;" class="collapse"></a>
        <a href="#grid-config" data-toggle="modal" class="config"></a>
        <a href="javascript:;" class="reload"></a>
        <a href="javascript:;" class="remove"></a>
      </div>
    </div>
    <div class="grid-body no-border">
      <h3>User <span class="semi-bold">Actions</span></h3>
      <table class="table no-more-tables">
        <thead>
        <tr>
          <th>Title</th>
          <th>Url</th>
          <th>Type</th>
          <th>Ip Address</th>
          <th>Browser</th>
          <th>Cookie Enabled</th>
          <th>Language</th>
          <th>Platform</th>
        </tr>
        </thead>
        <tbody>
        <tr each="{ loaded_pages }">
          <td class="v-align-middle">{data.title}</td>
          <td class="v-align-middle"><span class="muted">{data.url}</span></td>
          <td class="v-align-middle"><span class="muted">{name}</span></td>
          <td class="v-align-middle text-center">{ip}</td>
          <td class="v-align-middle text-center">{data.navigator.appCodeName}</td>
          <td class="v-align-middle text-center">{data.navigator.cookieEnabled}</td>
          <td class="v-align-middle text-center">{data.navigator.language}</td>
          <td class="v-align-middle text-center">{data.navigator.platform}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>


  <script>
    var self = this;
    self.loaded_pages = [];

    this.on('mount', function(){
      RiotControl.trigger('pages-init')
    })

    // Listent to model events
    RiotControl.on('pages-loaded', function(data){
      self.loaded_pages = data
      self.update()
    })

    RiotControl.on('page-added', function(data){
      self.loaded_pages = data
      self.update()
    })
  </script>
</page-feed>
