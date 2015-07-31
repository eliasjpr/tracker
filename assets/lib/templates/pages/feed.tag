<page-feed>

  <div class="grid simple">
    <div class="grid-title no-border">

    </div>
    <div class="grid-body no-border">
      <h3>User <span class="semi-bold">Actions</span></h3>
      <table class="table no-more-tables">
        <thead>
        <tr>
          <th>No.</th>
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
        <tr each="{ page, i in loaded_pages }">
          <td class="v-align-middle">{i}</td>
          <td class="v-align-middle">{page.data.title}</td>
          <td class="v-align-middle"><span class="muted">{page.data.url}</span></td>
          <td class="v-align-middle"><span class="muted">{page.name}</span></td>
          <td class="v-align-middle text-center">{page.ip}</td>
          <td class="v-align-middle text-center">{page.data.navigator.appCodeName}</td>
          <td class="v-align-middle text-center">{page.data.navigator.cookieEnabled}</td>
          <td class="v-align-middle text-center">{page.data.navigator.language}</td>
          <td class="v-align-middle text-center">{page.data.navigator.platform}</td>
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
