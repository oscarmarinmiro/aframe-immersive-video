## aframe-immersive-video-component

[![Version](http://img.shields.io/npm/v/aframe-immersive-video-component.svg?style=flat-square)](https://npmjs.org/package/aframe-immersive-video-component)
[![License](http://img.shields.io/npm/l/aframe-immersive-video-component.svg?style=flat-square)](https://npmjs.org/package/aframe-immersive-video-component)

A one-liner component for viewing Stereo/Mono 360/180 videos in WebVR, including a control bar for it

See [example here](https://oscarmarinmiro.github.io/aframe-immersive-video/)

For [A-Frame](https://aframe.io).


<img src="img/capture.gif" alt="example" width="500">

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| type         |      Any combination of "360", "180", "mono", "stereo", "horizontal", "vertical" that describe the video format. E.g: "360_stereo_vertical" is a 360 stereo top/bottom format, "180_stereo_horizontal" is a stereo 180 L/R format       |   360_mono_horizontal            |
| source    | URL of the video to display (remember it must be served with 'CORS' headers if in a different domain)   | None    | 
|  theme | The 'theme' of the video controls: "dark" or "light" | "dark" |
| controls | Whether to show controls at the feet of the user | true |
| open | Whether controls should be open or closed on video launch | true |
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
    <a-scene antialias="true">
      <!--360 stereo LR-->
      <a-entity id="immersive-video" immersive-video="type: 360_stereo; source:https://cdn.dataverse.xyz/examples/allvizs/immersive/MaryOculus.mp4"></a-entity>

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


#### Credits

The video used in the examples is from http://pedrofe.com/rendering-for-oculus-rift-with-arnold/, from the project http://www.meryproject.com/
