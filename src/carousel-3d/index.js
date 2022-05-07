import Slide from "@/carousel-3d/Slide.vue";
import Carousel3d from "@/carousel-3d/Carousel3d.vue";

const install = (Vue) => {
  Vue.component("Carousel3d", Carousel3d);
  Vue.component("Slide", Slide);
};

export default {
  install,
};

export { Carousel3d, Slide };
