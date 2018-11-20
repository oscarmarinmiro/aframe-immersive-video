ls -l
## aframe-immersive-video-component

[![Version](http://img.shields.io/npm/v/aframe-immersive-video-component.svg?style=flat-square)](https://npmjs.org/package/aframe-immersive-video-component)
[![License](http://img.shields.io/npm/l/aframe-immersive-video-component.svg?style=flat-square)](https://npmjs.org/package/aframe-immersive-video-component)

A one-liner component for viewing Stereo/Mono 360/180 videos in WebVR, including a control bar for it

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-immersive-video-component/dist/aframe-immersive-video-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity immersive-video="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-immersive-video-component
```

Then require and use.

```js
require('aframe');
require('aframe-immersive-video-component');
```
