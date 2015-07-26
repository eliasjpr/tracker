<tile>
  <div class="tiles {opts.color} added-margin">
    <div class="tiles-body">
      <div class="controller">
        <a href="javascript:;" class="reload"></a>
        <a href="javascript:;" class="remove"></a>
      </div>
      <div class="tiles-title">{ opts.title }</div>
      <div class="heading">
        <span class="animate-number" data-value="{opts.value}" data-animation-duration="{opts.duration}">{opts.value}</span> {opts.type}
      </div>
      <div class="progress transparent progress-small no-radius">
        <div class="progress-bar progress-bar-white animate-progress-bar"
          data-percentage="{opts.percent}%"style="width:{opts.percent}%;"></div>
      </div>
      <div class="description">
        <i class="icon-custom-up"></i>
        <span class="text-white mini-description ">&nbsp; 4% higher
        <span class="blend">than last month</span></span></div>
      </div>
  </div>
</tile>
