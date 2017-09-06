'use strict';

Vue.use(VueMaterial);
Vue.material.registerTheme('default', {
  primary: 'black'
});
//filter components
Vue.component('canvasFilter', {

  template: ' <md-card md-with-hover><canvas></canvas> <md-card-header><p class="md-title">{{name}}</p> </md-card-header></md-card>',
  props: ['filter', 'name', 'image', 'style'],
  methods: {
    updateCanvas: function updateCanvas() {
      var _this = this;

      // Get canvas context

      var c = this.$el.children[0];
      var ctx = c.getContext("2d");
      var rect = c.getBoundingClientRect();

      var img = new Image();
      img.onload = function () {
        //sets up proper resolution
        c.width = Math.round(window.devicePixelRatio * rect.right) - Math.round(window.devicePixelRatio * rect.left);
        c.height = Math.round(window.devicePixelRatio * rect.bottom) - Math.round(window.devicePixelRatio * rect.top);

        //add filter
        ctx.filter = _this.filter;

        // console.log(c.width, 'w')
        // console.log(c.height, 'h')

        var hRatio = c.width / img.width;
        var vRatio = c.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (c.width - img.width * ratio) / 2;
        var centerShift_y = (c.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);

        // ctx.drawImage(img,0,0, img.width * ratio, img.height * ratio);
      };
      img.src = this.image;
      c.style.width = "500px";
    }
  }
});

new Vue({
  el: '#app',
  data: {
    active: false,
    image: 'https://source.unsplash.com/category/nature',
    filters: [{
      name: 'inkwell',
      filter: 'contrast(110%) brightness(110%) sepia(30%) grayscale(100%)'
    }, {
      name: 'reyes',
      filter: 'contrast(85%) brightness(110%) saturate(75%) sepia(22%)'
    }, {
      name: 'lo-fi',
      filter: 'contrast(150%) saturate(110%)'
    }, {
      name: 'brooklyn',
      filter: 'contrast(90%) brightness(110%)'
    }, {
      name: '1977',
      filter: 'contrast(110%) brightness(110%) saturate(130%)'
    }, {
      name: 'aden',
      filter: 'contrast(90%) brightness(120%) saturate(85%) hue-rotate(20deg);'
    }, {
      name: 'earlybird',
      filter: 'contrast(90%) sepia(20%)'
    }, {
      name: 'gingham',
      filter: 'brightness(105%) hue-rotate(350deg)'
    }, {
      name: 'toaster',
      filter: 'contrast(150%) brightness(90%)'
    }, {
      name: 'walden',
      filter: 'brightness(110%) saturate(160%) sepia(30%) hue-rotate(350deg)'
    }, {
      name: 'hudson',
      filter: 'contrast(90%) brightness(120%) saturate(110%)'
    }, {
      name: 'x-pro',
      filter: 'sepia(30%)'
    }]
  },

  methods: {
    onFileChange: function onFileChange(e) {

      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage: function createImage(file) {

      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function (e) {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    addFilter: function addFilter(e) {
      var vm = this;
      vm.filters.forEach(function (item, index) {
        vm.$refs.canvas[index].updateCanvas();
      });
    }
  },
  mounted: function mounted() {
    this.addFilter();
  }
});