const app = Vue.createApp({
  //  template: '<h2>I am Here</h2>'
  data(){
      return{
         title: 'First time' ,
         showData: true,
         x: 0,
         y: 0,
         courses: [
             { title: 'network security 2', image: 'css/img/1.jpg', isFav: true},
             { title: 'network security 3', image: 'css/img/2.jpg', isFav: true},
             { title: 'network security 4', image: 'css/img/3.jpg', isFav: false},
             { title: 'network security 5', image: 'css/img/4.jpg', isFav: true},
             { title: 'network security 6', image: 'css/img/5.jpg', isFav: true}

         ]
       }
  },
  methods: {
      doSomeThing(){
          this.title="Something has been Done"
      },
      hideIt(){
          this.showData = !this.showData;
          console.log(this.showData);
      },
      checkPX(e){
          this.x = e.offsetX;
          this.y = e.offsetY;
      },
      checkMouseOver(e){
        this.x = "MouseOver";
        this.y = "MouseOver";
    },
    checkDoubleClick(){
        this.x = "DoubleClick";
        this.y = "DoubleClick";
    },
    checkMouseLeave(){
        this.x = "MouseLeft";
        this.y = "MouseLeft";
    },
    isFavOff(course){
        course.isFav=!course.isFav;
        console.log(course.isFav);
    }
  },
  computed: {
      filteredCourses(){
        return this.courses.filter((course) => course.isFav)
      }
  }
});

app.mount('#app');