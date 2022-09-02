import { openBlock as d, createElementBlock as c, normalizeClass as u, normalizeStyle as h, renderSlot as m, createElementVNode as l, withModifiers as f, resolveComponent as v, createBlock as x, createCommentVNode as I } from "vue";
const p = (t, i) => {
  const e = t.__vccOpts || t;
  for (const [n, s] of i)
    e[n] = s;
  return e;
}, y = {
  name: "Slide",
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      parent: this.$parent,
      styles: {},
      zIndex: 999
    };
  },
  computed: {
    isCurrent() {
      return this.index === this.parent.currentIndex;
    },
    leftIndex() {
      return this.parent.oneDirectional && this.getSideIndex(this.parent.leftIndices) > this.parent.currentIndex - 1 ? -1 : this.getSideIndex(this.parent.leftIndices);
    },
    rightIndex() {
      return this.parent.oneDirectional && this.getSideIndex(this.parent.rightIndices) > this.parent.total - this.parent.currentIndex - 2 ? -1 : this.getSideIndex(this.parent.rightIndices);
    },
    slideStyle() {
      let t = {};
      if (!this.isCurrent) {
        const i = this.leftIndex, e = this.rightIndex;
        (e >= 0 || i >= 0) && (t = e >= 0 ? this.calculatePosition(e, !0, this.zIndex) : this.calculatePosition(i, !1, this.zIndex), t.opacity = 1, t.visibility = "visible"), this.parent.hasHiddenSlides && (this.matchIndex(this.parent.leftOutIndex) ? t = this.calculatePosition(this.parent.leftIndices.length - 1, !1, this.zIndex) : this.matchIndex(this.parent.rightOutIndex) && (t = this.calculatePosition(this.parent.rightIndices.length - 1, !0, this.zIndex)));
      }
      return Object.assign(t, {
        "border-width": this.parent.border + "px",
        width: this.parent.slideWidth + "px",
        height: this.parent.slideHeight + "px",
        transition: " transform " + this.parent.animationSpeed + "ms,                opacity " + this.parent.animationSpeed + "ms,                visibility " + this.parent.animationSpeed + "ms"
      });
    },
    computedClasses() {
      return {
        [`left-${this.leftIndex + 1}`]: this.leftIndex >= 0,
        [`right-${this.rightIndex + 1}`]: this.rightIndex >= 0,
        current: this.isCurrent
      };
    }
  },
  methods: {
    getSideIndex(t) {
      let i = -1;
      return t.forEach((e, n) => {
        this.matchIndex(e) && (i = n);
      }), i;
    },
    matchIndex(t) {
      return t >= 0 ? this.index === t : this.parent.total + t === this.index;
    },
    calculatePosition(t, i, e) {
      const n = this.parent.disable3d ? 0 : parseInt(this.parent.inverseScaling) + (t + 1) * 100, s = this.parent.disable3d ? 0 : parseInt(this.parent.perspective), r = this.parent.space === "auto" ? parseInt((t + 1) * (this.parent.width / 1.5), 10) : parseInt((t + 1) * this.parent.space, 10), a = i ? "translateX(" + r + "px) translateZ(-" + n + "px) rotateY(-" + s + "deg)" : "translateX(-" + r + "px) translateZ(-" + n + "px) rotateY(" + s + "deg)", g = this.parent.space === "auto" ? 0 : parseInt((t + 1) * this.parent.space);
      return {
        transform: a,
        top: g,
        zIndex: e - (Math.abs(t) + 1)
      };
    },
    goTo() {
      if (!this.isCurrent)
        this.parent.clickable === !0 && this.parent.goFar(this.index);
      else {
        const { index: t } = this;
        this.parent.onMainSlideClick({ index: t });
      }
    }
  }
};
function S(t, i, e, n, s, r) {
  return d(), c("div", {
    class: u(["carousel-3d-slide", r.computedClasses]),
    style: h(r.slideStyle),
    onClick: i[0] || (i[0] = (a) => r.goTo())
  }, [
    m(t.$slots, "default", {
      index: e.index,
      isCurrent: r.isCurrent,
      leftIndex: r.leftIndex,
      rightIndex: r.rightIndex
    })
  ], 6);
}
const b = /* @__PURE__ */ p(y, [["render", S]]), w = {
  props: {
    autoplay: {
      type: Boolean,
      default: !1
    },
    autoplayTimeout: {
      type: Number,
      default: 2e3
    },
    autoplayHoverPause: {
      type: Boolean,
      default: !0
    }
  },
  data() {
    return {
      autoplayInterval: null
    };
  },
  destroyed() {
    this.process_server || (this.pauseAutoplay(), this.$el.removeEventListener("mouseenter", this.pauseAutoplay), this.$el.removeEventListener("mouseleave", this.startAutoplay));
  },
  methods: {
    pauseAutoplay() {
      this.autoplayInterval && (this.autoplayInterval = clearInterval(this.autoplayInterval));
    },
    startAutoplay() {
      this.autoplay && (this.autoplayInterval = setInterval(() => {
        this.dir === "ltr" ? this.goPrev() : this.goNext();
      }, this.autoplayTimeout));
    }
  },
  mounted() {
    !this.process_server && this.autoplayHoverPause && (this.$el.addEventListener("mouseenter", this.pauseAutoplay), this.$el.addEventListener("mouseleave", this.startAutoplay), this.startAutoplay());
  }
};
const _ = {
  name: "Controls",
  props: {
    width: {
      type: [String, Number],
      default: 50
    },
    height: {
      type: [String, Number],
      default: 60
    },
    prevHtml: {
      type: String,
      default: "&lsaquo;"
    },
    nextHtml: {
      type: String,
      default: "&rsaquo;"
    }
  },
  data() {
    return {
      parent: this.$parent
    };
  }
}, M = { class: "carousel-3d-controls" }, C = ["innerHTML"], L = ["innerHTML"];
function N(t, i, e, n, s, r) {
  return d(), c("div", M, [
    l("a", {
      href: "#",
      class: u(["prev", { disabled: !s.parent.isPrevPossible }]),
      onClick: i[0] || (i[0] = f((a) => s.parent.goPrev(), ["prevent"])),
      style: h(`width: ${e.width}px; height: ${e.height}px; line-height: ${e.height}px;`),
      "aria-label": "Previous slide"
    }, [
      l("span", { innerHTML: e.prevHtml }, null, 8, C)
    ], 6),
    l("a", {
      href: "#",
      class: u(["next", { disabled: !s.parent.isNextPossible }]),
      onClick: i[1] || (i[1] = f((a) => s.parent.goNext(), ["prevent"])),
      style: h(`width: ${e.width}px; height: ${e.height}px; line-height: ${e.height}px;`),
      "aria-label": "Next slide"
    }, [
      l("span", { innerHTML: e.nextHtml }, null, 8, L)
    ], 6)
  ]);
}
const $ = /* @__PURE__ */ p(_, [["render", N], ["__scopeId", "data-v-475a7b20"]]);
const o = () => {
}, O = {
  name: "Carousel3d",
  components: {
    Controls: $
  },
  props: {
    count: {
      type: [Number, String],
      default: 0
    },
    perspective: {
      type: [Number, String],
      default: 35
    },
    display: {
      type: [Number, String],
      default: 5
    },
    loop: {
      type: Boolean,
      default: !0
    },
    animationSpeed: {
      type: [Number, String],
      default: 500
    },
    dir: {
      type: String,
      default: "rtl"
    },
    width: {
      type: [Number, String],
      default: 360
    },
    height: {
      type: [Number, String],
      default: 270
    },
    border: {
      type: [Number, String],
      default: 1
    },
    space: {
      type: [Number, String],
      default: "auto"
    },
    startIndex: {
      type: [Number, String],
      default: 0
    },
    clickable: {
      type: Boolean,
      default: !0
    },
    disable3d: {
      type: Boolean,
      default: !1
    },
    minSwipeDistance: {
      type: Number,
      default: 10
    },
    inverseScaling: {
      type: [Number, String],
      default: 300
    },
    controlsVisible: {
      type: Boolean,
      default: !1
    },
    controlsPrevHtml: {
      type: String,
      default: "&lsaquo;"
    },
    controlsNextHtml: {
      type: String,
      default: "&rsaquo;"
    },
    controlsWidth: {
      type: [String, Number],
      default: 50
    },
    controlsHeight: {
      type: [String, Number],
      default: 50
    },
    onLastSlide: {
      type: Function,
      default: o
    },
    onSlideChange: {
      type: Function,
      default: o
    },
    bias: {
      type: String,
      default: "left"
    },
    onMainSlideClick: {
      type: Function,
      default: o
    },
    oneDirectional: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      viewport: 0,
      currentIndex: 0,
      total: 0,
      dragOffsetX: 0,
      dragStartX: 0,
      dragOffsetY: 0,
      dragStartY: 0,
      mousedown: !1,
      zIndex: 998,
      process_server: typeof window === void 0
    };
  },
  mixins: [w],
  watch: {
    count() {
      this.computeData();
    }
  },
  computed: {
    isLastSlide() {
      return this.currentIndex === this.total - 1;
    },
    isFirstSlide() {
      return this.currentIndex === 0;
    },
    isNextPossible() {
      return !(!this.loop && this.isLastSlide);
    },
    isPrevPossible() {
      return !(!this.loop && this.isFirstSlide);
    },
    slideWidth() {
      const t = this.viewport, i = parseInt(this.width) + parseInt(this.border, 10) * 2;
      return t < i && !this.process_server ? t : i;
    },
    slideHeight() {
      const t = parseInt(this.width, 10) + parseInt(this.border, 10) * 2, i = parseInt(parseInt(this.height) + this.border * 2, 10), e = this.calculateAspectRatio(t, i);
      return this.slideWidth / e;
    },
    visible() {
      return this.display > this.total ? this.total : this.display;
    },
    hasHiddenSlides() {
      return this.total > this.visible;
    },
    leftIndices() {
      let t = (this.visible - 1) / 2;
      t = this.bias.toLowerCase() === "left" ? Math.ceil(t) : Math.floor(t);
      const i = [];
      for (let e = 1; e <= t; e++)
        i.push(this.dir === "ltr" ? (this.currentIndex + e) % this.total : (this.currentIndex - e) % this.total);
      return i;
    },
    rightIndices() {
      let t = (this.visible - 1) / 2;
      t = this.bias.toLowerCase() === "right" ? Math.ceil(t) : Math.floor(t);
      const i = [];
      for (let e = 1; e <= t; e++)
        i.push(this.dir === "ltr" ? (this.currentIndex - e) % this.total : (this.currentIndex + e) % this.total);
      return i;
    },
    leftOutIndex() {
      let t = (this.visible - 1) / 2;
      return t = this.bias.toLowerCase() === "left" ? Math.ceil(t) : Math.floor(t), t++, this.dir === "ltr" ? this.total - this.currentIndex - t <= 0 ? -parseInt(this.total - this.currentIndex - t) : this.currentIndex + t : this.currentIndex - t;
    },
    rightOutIndex() {
      let t = (this.visible - 1) / 2;
      return t = this.bias.toLowerCase() === "right" ? Math.ceil(t) : Math.floor(t), t++, this.dir === "ltr" ? this.currentIndex - t : this.total - this.currentIndex - t <= 0 ? -parseInt(this.total - this.currentIndex - t, 10) : this.currentIndex + t;
    }
  },
  methods: {
    goNext() {
      this.isNextPossible && (this.isLastSlide ? this.goSlide(0) : this.goSlide(this.currentIndex + 1));
    },
    goPrev() {
      this.isPrevPossible && (this.isFirstSlide ? this.goSlide(this.total - 1) : this.goSlide(this.currentIndex - 1));
    },
    goSlide(t) {
      this.currentIndex = t < 0 || t > this.total - 1 ? 0 : t, this.isLastSlide && (this.onLastSlide !== o && console.warn("onLastSlide deprecated, please use @last-slide"), this.onLastSlide(this.currentIndex), this.$emit("last-slide", this.currentIndex)), this.$emit("before-slide-change", this.currentIndex), setTimeout(() => this.animationEnd(), this.animationSpeed);
    },
    goFar(t) {
      let i = t === this.total - 1 && this.isFirstSlide ? -1 : t - this.currentIndex;
      this.isLastSlide && t === 0 && (i = 1);
      const e = i < 0 ? -i : i;
      let n = 0, s = 0;
      for (; s < e; )
        s += 1, setTimeout(() => i < 0 ? this.goPrev(e) : this.goNext(e), e === 1 ? 0 : n), n += this.animationSpeed / e;
    },
    animationEnd() {
      this.onSlideChange !== o && console.warn("onSlideChange deprecated, please use @after-slide-change"), this.onSlideChange(this.currentIndex), this.$emit("after-slide-change", this.currentIndex);
    },
    handleMouseup() {
      this.mousedown = !1, this.dragOffsetX = 0, this.dragOffsetY = 0;
    },
    handleMousedown(t) {
      t.touches || t.preventDefault(), this.mousedown = !0, this.dragStartX = "ontouchstart" in window ? t.touches[0].clientX : t.clientX, this.dragStartY = "ontouchstart" in window ? t.touches[0].clientY : t.clientY;
    },
    handleMousemove(t) {
      if (!this.mousedown)
        return;
      const i = "ontouchstart" in window ? t.touches[0].clientX : t.clientX, e = "ontouchstart" in window ? t.touches[0].clientY : t.clientY, n = this.dragStartX - i, s = this.dragStartY - e;
      this.dragOffsetX = n, this.dragOffsetY = s, !(Math.abs(this.dragOffsetY) > Math.abs(this.dragOffsetX)) && (this.dragOffsetX > this.minSwipeDistance ? (this.handleMouseup(), this.goNext()) : this.dragOffsetX < -this.minSwipeDistance && (this.handleMouseup(), this.goPrev()));
    },
    attachMutationObserver() {
      const t = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      if (t) {
        const i = {
          attributes: !0,
          childList: !0,
          characterData: !0
        };
        this.mutationObserver = new t(() => {
          this.$nextTick(() => {
            this.computeData();
          });
        }), this.$el && this.mutationObserver.observe(this.$el, i);
      }
    },
    detachMutationObserver() {
      this.mutationObserver && this.mutationObserver.disconnect();
    },
    getSlideCount() {
      const t = this.$slots.default();
      return t.length > 0 ? t[0].children.length : 0;
    },
    calculateAspectRatio(t, i) {
      return Math.min(t / i);
    },
    computeData(t) {
      this.total = this.getSlideCount(), (t || this.currentIndex >= this.total) && (this.currentIndex = parseInt(this.startIndex) > this.total - 1 ? this.total - 1 : parseInt(this.startIndex)), this.viewport = this.$el.clientWidth;
    },
    setSize() {
      this.$el.style.cssText += "height:" + this.slideHeight + "px;", this.$el.childNodes[0].style.cssText += "width:" + this.slideWidth + "px; height:" + this.slideHeight + "px;";
    }
  },
  mounted() {
    this.process_server || (this.computeData(!0), this.attachMutationObserver(), window.addEventListener("resize", this.setSize), "ontouchstart" in window ? (this.$el.addEventListener("touchstart", this.handleMousedown), this.$el.addEventListener("touchend", this.handleMouseup), this.$el.addEventListener("touchmove", this.handleMousemove)) : (this.$el.addEventListener("mousedown", this.handleMousedown), this.$el.addEventListener("mouseup", this.handleMouseup), this.$el.addEventListener("mousemove", this.handleMousemove)));
  },
  beforeDestroy() {
    this.process_server || (this.detachMutationObserver(), "ontouchstart" in window ? this.$el.removeEventListener("touchmove", this.handleMousemove) : this.$el.removeEventListener("mousemove", this.handleMousemove), window.removeEventListener("resize", this.setSize));
  }
};
function P(t, i, e, n, s, r) {
  const a = v("controls");
  return d(), c("div", {
    class: "carousel-3d-container",
    style: h({ height: this.slideHeight + "px" })
  }, [
    l("div", {
      class: "carousel-3d-slider",
      style: h({ width: this.slideWidth + "px", height: this.slideHeight + "px" })
    }, [
      m(t.$slots, "default", {}, void 0, !0)
    ], 4),
    e.controlsVisible ? (d(), x(a, {
      key: 0,
      "next-html": e.controlsNextHtml,
      "prev-html": e.controlsPrevHtml,
      width: e.controlsWidth,
      height: e.controlsHeight
    }, null, 8, ["next-html", "prev-html", "width", "height"])) : I("", !0)
  ], 4);
}
const H = /* @__PURE__ */ p(O, [["render", P], ["__scopeId", "data-v-d1f6685d"]]), E = (t) => {
  t.component("Carousel3d", H), t.component("Slide", b);
}, z = {
  install: E
};
export {
  H as Carousel3d,
  b as Slide,
  z as default
};
//# sourceMappingURL=carousel-3d.es.js.map
