/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Immersive Video component for A-Frame.
 */
AFRAME.registerComponent('immersive-video', {
  schema: {
      source: {type: 'string', default: ""},
      type: {type: 'string', default: "360"},
      theme: {'type': 'string', default: "dark"},
      controls: {type: 'boolean', default: true},
      open: {type: 'boolean', default: true},
      // use touch style interface for mobile instead of gaze
      mobile_touch_ui: {type: 'boolean', default: false}
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
        // console.log("INIT IMMERSIVE VIDEO");

        var self = this;

        self.video_timestamp = Date.now();

        // Default types

        self.video_type = {'coverage': "full", 'stereo': false, 'split': 'horizontal'};

        // Get types from type

        if (self.data.type.includes('180')) self.video_type.coverage = "half";

        if (self.data.type.includes('stereo')) self.video_type.stereo = true;

        if (self.data.type.includes('vertical')) self.video_type.split = 'vertical';


        // ACTIVATE layer 1 (left eye) for camera on monoscopic view

        if(self.video_type.stereo) {

            // Camera is non existent at this point. If wait for scene "loaded", still is undefined.
            // So, should wait for scene 'renderstart', set a flag and fire component 'update'

            self.el.sceneEl.addEventListener("renderstart", function () {

                // Enable left eye on camera layers (1 == left, 2 == right)

                self.el.sceneEl.camera.layers.enable(1);

            });
        }

        // If controls: call UIPACK Utils

        if(self.data.controls){
            AFRAME_UIPACK.utils.insert_immersive_video_menu({
                el: self.el, theme: self.data.theme, open: self.data.open, mobile_touch_ui: self.data.mobile_touch_ui
            });
        }
  },


  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {


        var self = this;

        // console.log("EN EL VIDEO UPDATE");

        // Create if scene has not 'a-assets'

        if(document.getElementsByTagName("a-assets").length === 0){

            var assets = document.createElement("a-assets");

            self.el.sceneEl.appendChild(assets);

        }

        // Whatever needs to do to render...

        // Set sky src to data.source

            // If stereo video

            if (self.video_type.stereo) {

                self.video_id = "stereo_video" + "_" + self.video_timestamp;

                var scene = document.getElementsByTagName("a-scene")[0];
                var assets = document.getElementsByTagName("a-assets")[0];

                self.video = document.createElement("video");

                self.video.setAttribute("src", self.data.source);
                self.video.setAttribute("id", self.video_id);
                self.video.setAttribute("loop", false);
                self.video.setAttribute("autoplay", "true");
                self.video.setAttribute("crossorigin", "anonymous");

                assets.appendChild(self.video);

                // Emit event for attaching to a menu or player from the outside

                // console.log("EMITTING ASSET");
                self.el.emit("asset_added", {'id': self.video_id}, false);

                self.stereo_left_sphere = document.createElement("a-entity");
                self.stereo_left_sphere.setAttribute("class", "videospheres");
                self.stereo_left_sphere.setAttribute("geometry", "primitive:sphere; radius:100; segmentsWidth: 64; segmentsHeight:64");
                self.stereo_left_sphere.setAttribute("material", {shader: "flat", src: "#" + self.video_id, side: "back"});
                self.stereo_left_sphere.setAttribute("scale", "-1 1 1");

                // Sync rotation with 'camera landing rotation'

                self.stereo_left_sphere.setAttribute("rotation", {x:0, y: self.el.getAttribute("rotation").y, z:0});

                AFRAME.utils.entity.setComponentProperty(self.stereo_left_sphere, "stereo", {'eye': 'left', 'mode': self.video_type.coverage, 'split': self.video_type.split});

                self.el.appendChild(self.stereo_left_sphere);

                self.stereo_right_sphere = document.createElement("a-entity");

                self.stereo_right_sphere.setAttribute("class", "videospheres");

                self.stereo_right_sphere.setAttribute("geometry", "primitive:sphere; radius:100; segmentsWidth: 64; segmentsHeight:64");
                self.stereo_right_sphere.setAttribute("material", {shader: "flat", src: "#" + self.video_id, side: "back"});
                self.stereo_right_sphere.setAttribute("scale", "-1 1 1");


                self.stereo_right_sphere.addEventListener("materialvideoloadeddata", function(){

                    self.el.emit("video_loaded", {'id': self.video_id}, false);

                });


                AFRAME.utils.entity.setComponentProperty(self.stereo_right_sphere, "stereo", {'eye': 'right', 'mode': self.video_type.coverage, 'split': self.video_type.split});

                self.video.play();

                self.el.appendChild(self.stereo_right_sphere);

                // self.insert_bottom_menu();



            }
            else {

                // console.log("MONO VIDEO");

                self.video_id = "mono_video" + "_" + self.video_timestamp;

                var scene = document.getElementsByTagName("a-scene")[0];
                var assets = document.getElementsByTagName("a-assets")[0];

                self.video = document.createElement("video");

                self.video.setAttribute("src", self.data.source);
                self.video.setAttribute("id", self.video_id);
                self.video.setAttribute("loop", false);
                self.video.setAttribute("autoplay", "true");
                self.video.setAttribute("crossorigin", "anonymous");

                assets.appendChild(self.video);

                // Emit event for attaching to a menu or player from the outside

                self.el.emit("asset_added", {'id': self.video_id}, false);

                self.mono_sphere = document.createElement("a-entity");

                self.mono_sphere.setAttribute("class", "videospheres");

                self.mono_sphere.setAttribute("geometry", "primitive:sphere; radius:100; segmentsWidth: 64; segmentsHeight:64");
                self.mono_sphere.setAttribute("material", {shader: "flat", src: "#" + self.video_id, side: "back"});
                self.mono_sphere.setAttribute("scale", "-1 1 1");

                // console.log(self.mono_sphere.object3D);


                self.mono_sphere.addEventListener("materialvideoloadeddata", function(){

                    self.el.emit("video_loaded", {'id': self.video_id}, false);

                });


                self.video.play();

                self.el.appendChild(self.mono_sphere);

                // self.insert_bottom_menu();

            }




  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});


AFRAME.registerComponent('stereo', {
    schema: {
        eye: { type: 'string', default: "left"},
        mode: { type: 'string', default: "full"},
        split: { type: 'string', default: "horizontal"}
    },
    init: function () {

        // Flag for video

        this.material_is_a_video = false;

        // Check if material is a video from html tag (object3D.material.map instanceof THREE.VideoTexture does not
        // always work

        if (this.el.getAttribute("material") !== null && 'src' in this.el.getAttribute("material") && this.el.getAttribute("material").src !== "") {
            var src = this.el.getAttribute("material").src;

            // If src is an object and its tagName is video...

            if (typeof src === 'object' && ('tagName' in src && src.tagName === "VIDEO")) {
                this.material_is_a_video = true;
            }
        }

        var object3D = this.el.object3D.children[0];

        // In A-Frame 0.2.0, objects are all groups so sphere is the first children
        // Check if it's a sphere w/ video material, and if so
        // Note that in A-Frame 0.2.0, sphere entities are THREE.SphereBufferGeometry, while in A-Frame 0.3.0,
        // sphere entities are THREE.BufferGeometry.

        var validGeometries = [THREE.SphereGeometry, THREE.SphereBufferGeometry, THREE.BufferGeometry];
        var isValidGeometry = validGeometries.some(function (geometry) {
            return object3D.geometry instanceof geometry;
        });

        if (isValidGeometry && this.material_is_a_video) {

            // if half-dome mode, rebuild geometry (with default 100, radius, 64 width segments and 64 height segments)

            if (this.data.mode === "half") {

                var geo_def = this.el.getAttribute("geometry");
                var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64, Math.PI / 2, Math.PI, 0, Math.PI);

            }
            else {
                var geo_def = this.el.getAttribute("geometry");
                var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64);
            }

            // Panorama in front

            object3D.rotation.y = Math.PI / 2;

            // If left eye is set, and the split is horizontal, take the left half of the video texture. If the split
            // is set to vertical, take the top/upper half of the video texture.

            if (this.data.eye === "left") {
                var uvs = geometry.faceVertexUvs[ 0 ];
                var axis = this.data.split === "vertical" ? "y" : "x";
                for (var i = 0; i < uvs.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (axis == "x") {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                        }
                        else {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                            uvs[ i ][ j ][ axis ] += 0.5;
                        }
                    }
                }
            }

            // If right eye is set, and the split is horizontal, take the right half of the video texture. If the split
            // is set to vertical, take the bottom/lower half of the video texture.

            if (this.data.eye === "right") {
                var uvs = geometry.faceVertexUvs[ 0 ];
                var axis = this.data.split === "vertical" ? "y" : "x";
                for (var i = 0; i < uvs.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (axis == "x") {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                            uvs[ i ][ j ][ axis ] += 0.5;
                        }
                        else {
                            uvs[ i ][ j ][ axis ] *= 0.5;
                        }
                    }
                }
            }

            // As AFrame 0.2.0 builds bufferspheres from sphere entities, transform
            // into buffergeometry for coherence

            object3D.geometry = new THREE.BufferGeometry().fromGeometry(geometry);

        }

    },

    // On element update, put in the right layer, 0:both, 1:left, 2:right (spheres or not)

    update: function (oldData) {

        var object3D = this.el.object3D.children[0];
        var data = this.data;

        if (data.eye === "both") {
            object3D.layers.set(0);
        }
        else {
            object3D.layers.set(data.eye === 'left' ? 1 : 2);
        }

    },

    tick: function (time) {

    }
});

