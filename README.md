# Vue3 Carousel 3d
[![NPM downloads](https://img.shields.io/npm/dm/vue3-carousel-3d.svg)](https://npmjs.com/package/vue3-carousel-3d)
[![Latest Stable Version](https://img.shields.io/npm/v/vue3-carousel-3d.svg)](https://www.npmjs.com/package/vue3-carousel-3d)

The repository is back in action. I'll try to keep it updated and to merge pull requests occasionally. Also, some new features are coming soon.

## This repository is based on [vue-carousel-3d](https://wlada.github.io/vue-carousel-3d)

**Feel free to submit issues and feature requests [here](https://github.com/Ray93/vue3-carousel-3d/issues)**.

**[Full documentation and examples](https://wlada.github.io/vue-carousel-3d)**

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

## Installation

``` bash
npm install vue3-carousel-3d
# or
yarn add vue3-carousel-3d
```

## Usage

##### Usage (Global)

You may install Vue Carousel 3d globally:

``` js
import Vue from 'vue';
import Carousel3d from 'vue3-carousel-3d';
import "vue3-carousel-3d/dist/index.css"

Vue.use(Carousel3d);
```
This will make **&lt;carousel-3d&gt;** and **&lt;slide&gt;** available to all components within your Vue app.

##### Usage (Local)

Include the Carousel 3d into your component using import:

```js
<template>
  <carousel-3d>
    <slide :index="0">
      Content
    </slide>
  </carousel-3d>
</template>

import { Carousel3d, Slide } from 'vue3-carousel-3d';

```

## HTML Structure

Once the **Carousel3d** and **Slide** components are installed globally or imported, they can be used in templates like below:

``` html
  <carousel-3d>
    <slide :index="0">
      Slide 1 Content
    </slide>
    <slide :index="1">
      Slide 2 Content
    </slide>
  </carousel-3d>
```

Keep in mind that **index** property on slide component is required property and you will need to pass it for every slide starting from 0

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Changelog
####Version 1.0.3

- modify for vue3 version
