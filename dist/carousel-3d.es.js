function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const EMPTY_ARR = [];
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const extend = Object.assign;
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
let currentRenderingInstance = null;
let currentScopeId = null;
const isSuspense = (type) => type.__isSuspense;
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isTeleport = (type) => type.__isTeleport;
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = currentBlock || EMPTY_ARR;
  closeBlock();
  if (currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref, ref_key, ref_for }) => {
  return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (!isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    return createVNode("slot", name === "default" ? null : { name }, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, { key: props.key || `_${name}` }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
let currentInstance = null;
function getComponentName(Component) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  };
};
var Slide_vue_vue_type_style_index_0_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {
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
      if (this.parent.oneDirectional && this.getSideIndex(this.parent.leftIndices) > this.parent.currentIndex - 1)
        return -1;
      return this.getSideIndex(this.parent.leftIndices);
    },
    rightIndex() {
      if (this.parent.oneDirectional && this.getSideIndex(this.parent.rightIndices) > this.parent.total - this.parent.currentIndex - 2)
        return -1;
      return this.getSideIndex(this.parent.rightIndices);
    },
    slideStyle() {
      let styles = {};
      if (!this.isCurrent) {
        const lIndex = this.leftIndex;
        const rIndex = this.rightIndex;
        if (rIndex >= 0 || lIndex >= 0) {
          styles = rIndex >= 0 ? this.calculatePosition(rIndex, true, this.zIndex) : this.calculatePosition(lIndex, false, this.zIndex);
          styles.opacity = 1;
          styles.visibility = "visible";
        }
        if (this.parent.hasHiddenSlides) {
          if (this.matchIndex(this.parent.leftOutIndex)) {
            styles = this.calculatePosition(this.parent.leftIndices.length - 1, false, this.zIndex);
          } else if (this.matchIndex(this.parent.rightOutIndex)) {
            styles = this.calculatePosition(this.parent.rightIndices.length - 1, true, this.zIndex);
          }
        }
      }
      return Object.assign(styles, {
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
    getSideIndex(array) {
      let index2 = -1;
      array.forEach((pos, i) => {
        if (this.matchIndex(pos)) {
          index2 = i;
        }
      });
      return index2;
    },
    matchIndex(index2) {
      return index2 >= 0 ? this.index === index2 : this.parent.total + index2 === this.index;
    },
    calculatePosition(i, positive, zIndex) {
      const z = !this.parent.disable3d ? parseInt(this.parent.inverseScaling) + (i + 1) * 100 : 0;
      const y = !this.parent.disable3d ? parseInt(this.parent.perspective) : 0;
      const leftRemain = this.parent.space === "auto" ? parseInt((i + 1) * (this.parent.width / 1.5), 10) : parseInt((i + 1) * this.parent.space, 10);
      const transform = positive ? "translateX(" + leftRemain + "px) translateZ(-" + z + "px) rotateY(-" + y + "deg)" : "translateX(-" + leftRemain + "px) translateZ(-" + z + "px) rotateY(" + y + "deg)";
      const top = this.parent.space === "auto" ? 0 : parseInt((i + 1) * this.parent.space);
      return {
        transform,
        top,
        zIndex: zIndex - (Math.abs(i) + 1)
      };
    },
    goTo() {
      if (!this.isCurrent) {
        if (this.parent.clickable === true) {
          this.parent.goFar(this.index);
        }
      } else {
        const { index: index2 } = this;
        this.parent.onMainSlideClick({ index: index2 });
      }
    }
  }
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["carousel-3d-slide", $options.computedClasses]),
    style: normalizeStyle($options.slideStyle),
    onClick: _cache[0] || (_cache[0] = ($event) => $options.goTo())
  }, [
    renderSlot(_ctx.$slots, "default", {
      index: $props.index,
      isCurrent: $options.isCurrent,
      leftIndex: $options.leftIndex,
      rightIndex: $options.rightIndex
    })
  ], 6);
}
var Slide = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const autoplay = {
  props: {
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplayTimeout: {
      type: Number,
      default: 2e3
    },
    autoplayHoverPause: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      autoplayInterval: null
    };
  },
  destroyed() {
    if (!this.process_server) {
      this.pauseAutoplay();
      this.$el.removeEventListener("mouseenter", this.pauseAutoplay);
      this.$el.removeEventListener("mouseleave", this.startAutoplay);
    }
  },
  methods: {
    pauseAutoplay() {
      if (this.autoplayInterval) {
        this.autoplayInterval = clearInterval(this.autoplayInterval);
      }
    },
    startAutoplay() {
      if (this.autoplay) {
        this.autoplayInterval = setInterval(() => {
          this.dir === "ltr" ? this.goPrev() : this.goNext();
        }, this.autoplayTimeout);
      }
    }
  },
  mounted() {
    if (!this.process_server && this.autoplayHoverPause) {
      this.$el.addEventListener("mouseenter", this.pauseAutoplay);
      this.$el.addEventListener("mouseleave", this.startAutoplay);
      this.startAutoplay();
    }
  }
};
var Controls_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$1 = {
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
};
const _hoisted_1 = { class: "carousel-3d-controls" };
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = ["innerHTML"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("a", {
      href: "#",
      class: normalizeClass(["prev", { disabled: !$data.parent.isPrevPossible }]),
      onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $data.parent.goPrev(), ["prevent"])),
      style: normalizeStyle(`width: ${$props.width}px; height: ${$props.height}px; line-height: ${$props.height}px;`),
      "aria-label": "Previous slide"
    }, [
      createBaseVNode("span", { innerHTML: $props.prevHtml }, null, 8, _hoisted_2)
    ], 6),
    createBaseVNode("a", {
      href: "#",
      class: normalizeClass(["next", { disabled: !$data.parent.isNextPossible }]),
      onClick: _cache[1] || (_cache[1] = withModifiers(($event) => $data.parent.goNext(), ["prevent"])),
      style: normalizeStyle(`width: ${$props.width}px; height: ${$props.height}px; line-height: ${$props.height}px;`),
      "aria-label": "Next slide"
    }, [
      createBaseVNode("span", { innerHTML: $props.nextHtml }, null, 8, _hoisted_3)
    ], 6)
  ]);
}
var Controls = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-067f74c8"]]);
var Carousel3d_vue_vue_type_style_index_0_scoped_true_lang = "";
const noop = () => {
};
const _sfc_main = {
  name: "Carousel3d",
  components: {
    Controls
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
      default: true
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
      default: true
    },
    disable3d: {
      type: Boolean,
      default: false
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
      default: false
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
      default: noop
    },
    onSlideChange: {
      type: Function,
      default: noop
    },
    bias: {
      type: String,
      default: "left"
    },
    onMainSlideClick: {
      type: Function,
      default: noop
    },
    oneDirectional: {
      type: Boolean,
      default: false
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
      mousedown: false,
      zIndex: 998,
      process_server: typeof window === void 0
    };
  },
  mixins: [autoplay],
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
      const vw = this.viewport;
      const sw = parseInt(this.width) + parseInt(this.border, 10) * 2;
      return vw < sw && !this.process_server ? vw : sw;
    },
    slideHeight() {
      const sw = parseInt(this.width, 10) + parseInt(this.border, 10) * 2;
      const sh = parseInt(parseInt(this.height) + this.border * 2, 10);
      const ar = this.calculateAspectRatio(sw, sh);
      return this.slideWidth / ar;
    },
    visible() {
      const v = this.display > this.total ? this.total : this.display;
      return v;
    },
    hasHiddenSlides() {
      return this.total > this.visible;
    },
    leftIndices() {
      let n = (this.visible - 1) / 2;
      n = this.bias.toLowerCase() === "left" ? Math.ceil(n) : Math.floor(n);
      const indices = [];
      for (let m = 1; m <= n; m++) {
        indices.push(this.dir === "ltr" ? (this.currentIndex + m) % this.total : (this.currentIndex - m) % this.total);
      }
      return indices;
    },
    rightIndices() {
      let n = (this.visible - 1) / 2;
      n = this.bias.toLowerCase() === "right" ? Math.ceil(n) : Math.floor(n);
      const indices = [];
      for (let m = 1; m <= n; m++) {
        indices.push(this.dir === "ltr" ? (this.currentIndex - m) % this.total : (this.currentIndex + m) % this.total);
      }
      return indices;
    },
    leftOutIndex() {
      let n = (this.visible - 1) / 2;
      n = this.bias.toLowerCase() === "left" ? Math.ceil(n) : Math.floor(n);
      n++;
      if (this.dir === "ltr") {
        return this.total - this.currentIndex - n <= 0 ? -parseInt(this.total - this.currentIndex - n) : this.currentIndex + n;
      } else {
        return this.currentIndex - n;
      }
    },
    rightOutIndex() {
      let n = (this.visible - 1) / 2;
      n = this.bias.toLowerCase() === "right" ? Math.ceil(n) : Math.floor(n);
      n++;
      if (this.dir === "ltr") {
        return this.currentIndex - n;
      } else {
        return this.total - this.currentIndex - n <= 0 ? -parseInt(this.total - this.currentIndex - n, 10) : this.currentIndex + n;
      }
    }
  },
  methods: {
    goNext() {
      if (this.isNextPossible) {
        this.isLastSlide ? this.goSlide(0) : this.goSlide(this.currentIndex + 1);
      }
    },
    goPrev() {
      if (this.isPrevPossible) {
        this.isFirstSlide ? this.goSlide(this.total - 1) : this.goSlide(this.currentIndex - 1);
      }
    },
    goSlide(index2) {
      this.currentIndex = index2 < 0 || index2 > this.total - 1 ? 0 : index2;
      if (this.isLastSlide) {
        if (this.onLastSlide !== noop) {
          console.warn("onLastSlide deprecated, please use @last-slide");
        }
        this.onLastSlide(this.currentIndex);
        this.$emit("last-slide", this.currentIndex);
      }
      this.$emit("before-slide-change", this.currentIndex);
      setTimeout(() => this.animationEnd(), this.animationSpeed);
    },
    goFar(index2) {
      let diff = index2 === this.total - 1 && this.isFirstSlide ? -1 : index2 - this.currentIndex;
      if (this.isLastSlide && index2 === 0) {
        diff = 1;
      }
      const diff2 = diff < 0 ? -diff : diff;
      let timeBuff = 0;
      let i = 0;
      while (i < diff2) {
        i += 1;
        const timeout = diff2 === 1 ? 0 : timeBuff;
        setTimeout(() => diff < 0 ? this.goPrev(diff2) : this.goNext(diff2), timeout);
        timeBuff += this.animationSpeed / diff2;
      }
    },
    animationEnd() {
      if (this.onSlideChange !== noop) {
        console.warn("onSlideChange deprecated, please use @after-slide-change");
      }
      this.onSlideChange(this.currentIndex);
      this.$emit("after-slide-change", this.currentIndex);
    },
    handleMouseup() {
      this.mousedown = false;
      this.dragOffsetX = 0;
      this.dragOffsetY = 0;
    },
    handleMousedown(e) {
      if (!e.touches) {
        e.preventDefault();
      }
      this.mousedown = true;
      this.dragStartX = "ontouchstart" in window ? e.touches[0].clientX : e.clientX;
      this.dragStartY = "ontouchstart" in window ? e.touches[0].clientY : e.clientY;
    },
    handleMousemove(e) {
      if (!this.mousedown) {
        return;
      }
      const eventPosX = "ontouchstart" in window ? e.touches[0].clientX : e.clientX;
      const eventPosY = "ontouchstart" in window ? e.touches[0].clientY : e.clientY;
      const deltaX = this.dragStartX - eventPosX;
      const deltaY = this.dragStartY - eventPosY;
      this.dragOffsetX = deltaX;
      this.dragOffsetY = deltaY;
      if (Math.abs(this.dragOffsetY) > Math.abs(this.dragOffsetX)) {
        return;
      }
      if (this.dragOffsetX > this.minSwipeDistance) {
        this.handleMouseup();
        this.goNext();
      } else if (this.dragOffsetX < -this.minSwipeDistance) {
        this.handleMouseup();
        this.goPrev();
      }
    },
    attachMutationObserver() {
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      if (MutationObserver) {
        const config = {
          attributes: true,
          childList: true,
          characterData: true
        };
        this.mutationObserver = new MutationObserver(() => {
          this.$nextTick(() => {
            this.computeData();
          });
        });
        if (this.$el) {
          this.mutationObserver.observe(this.$el, config);
        }
      }
    },
    detachMutationObserver() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }
    },
    getSlideCount() {
      const children = this.$slots.default();
      if (children.length > 0) {
        return children[0].children.length;
      }
      return 0;
    },
    calculateAspectRatio(width, height) {
      return Math.min(width / height);
    },
    computeData(firstRun) {
      this.total = this.getSlideCount();
      if (firstRun || this.currentIndex >= this.total) {
        this.currentIndex = parseInt(this.startIndex) > this.total - 1 ? this.total - 1 : parseInt(this.startIndex);
      }
      this.viewport = this.$el.clientWidth;
    },
    setSize() {
      this.$el.style.cssText += "height:" + this.slideHeight + "px;";
      this.$el.childNodes[0].style.cssText += "width:" + this.slideWidth + "px; height:" + this.slideHeight + "px;";
    }
  },
  mounted() {
    if (!this.process_server) {
      this.computeData(true);
      this.attachMutationObserver();
      window.addEventListener("resize", this.setSize);
      if ("ontouchstart" in window) {
        this.$el.addEventListener("touchstart", this.handleMousedown);
        this.$el.addEventListener("touchend", this.handleMouseup);
        this.$el.addEventListener("touchmove", this.handleMousemove);
      } else {
        this.$el.addEventListener("mousedown", this.handleMousedown);
        this.$el.addEventListener("mouseup", this.handleMouseup);
        this.$el.addEventListener("mousemove", this.handleMousemove);
      }
    }
  },
  beforeDestroy() {
    if (!this.process_server) {
      this.detachMutationObserver();
      if ("ontouchstart" in window) {
        this.$el.removeEventListener("touchmove", this.handleMousemove);
      } else {
        this.$el.removeEventListener("mousemove", this.handleMousemove);
      }
      window.removeEventListener("resize", this.setSize);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_controls = resolveComponent("controls");
  return openBlock(), createElementBlock("div", {
    class: "carousel-3d-container",
    style: normalizeStyle({ height: this.slideHeight + "px" })
  }, [
    createBaseVNode("div", {
      class: "carousel-3d-slider",
      style: normalizeStyle({ width: this.slideWidth + "px", height: this.slideHeight + "px" })
    }, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 4),
    $props.controlsVisible ? (openBlock(), createBlock(_component_controls, {
      key: 0,
      "next-html": $props.controlsNextHtml,
      "prev-html": $props.controlsPrevHtml,
      width: $props.controlsWidth,
      height: $props.controlsHeight
    }, null, 8, ["next-html", "prev-html", "width", "height"])) : createCommentVNode("", true)
  ], 4);
}
var Carousel3d = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-164aa45b"]]);
const install = (Vue) => {
  Vue.component("Carousel3d", Carousel3d);
  Vue.component("Slide", Slide);
};
var index = {
  install
};
export { Carousel3d, Slide, index as default };
//# sourceMappingURL=carousel-3d.es.js.map
