

AFRAME.registerComponent('uipack-menu', {
    schema: {
        icons: {type: 'array'},
        theme: {type: 'string', default: "dark"},
        buttons: {type: 'array', default: []},
        media_id: {type: 'string', default: ""},
        pitch: { type: 'number', default: -70},
        pitch_max: { type: 'number', default: -40},
        pitch_min: { type: 'number', default: -80},
        open: {type: 'boolean', default: false}

    },

    init: function () {

    var self = this;

    // Annotate pointer to camera on scene 'mounted' or on the fly it camera exists

    if(!('camera' in self.el.sceneEl)) {

        self.el.sceneEl.addEventListener("renderstart", function (e) {
            self.camera = self.el.sceneEl.camera;
        });
    }
    else {
        self.camera = self.el.sceneEl.camera;
    }

    // Class the element

    self.el.classList.add("uipack");
    self.el.classList.add("uipack-menu");

    self.container = document.createElement("a-entity");

    self.el.appendChild(self.container);

    // Opening / (closing?) icon

    self.open_icon = document.createElement("a-entity");

    self.open_icon.classList.add("non_click_while_loading");

    self.open_icon.setAttribute("uipack-button", {icon_name: "bars.png", theme: self.data.theme});

    self.container.appendChild(self.open_icon);

    // For keeping track of frame count in .tick()

    self.frame_count = 0;

    // Keep track of the whole component visibility based on user head pitch

    self.hidden = true;

    self.el.setAttribute("visible", !self.hidden);

    // Keeping track of whether the menu is open or not, to modify yaw or not

    self.open_menu = false;

    self.menu_group = document.createElement("a-entity");

    // Hide menu group at start (closed menu)

    self.menu_group.setAttribute("visible", false);

    self.container.appendChild(self.menu_group);

    // Arrays to store icon + button references

    self.icon_row = [];

    self.button_row = [];

    // Create icon row

    for(var i=0; i < self.data.icons.length; i++){

        var my_icon = document.createElement("a-entity");

        my_icon.icon_index = i;

        my_icon.classList.add("non_click_while_loading");

        my_icon.addEventListener("clicked", function(){
            if(self.open_menu && (!self.hidden)) {
                self.el.emit("clicked", {'type': "icon", "index": this.icon_index}, false);
            }
        });

        self.icon_row.push(my_icon);

        self.menu_group.appendChild(my_icon);
    }

    // Create button row

    // First create button parent to control centering

    self.button_parent = document.createElement("a-entity");

    self.menu_group.appendChild(self.button_parent);

    for(i=0; i < self.data.buttons.length; i++){

        var my_button = document.createElement("a-entity");

        my_button.button_index = i;

        my_button.addEventListener("clicked", function(){
            if(self.open_menu && (!self.hidden)) {

                self.el.emit("clicked", {'type': "button", "index": this.button_index}, false);
            }
        });

        self.button_row.push(my_button);

        self.button_parent.appendChild(my_button);
    }

    // Create player (if needed)

    if(self.data.media_id != ""){
        // LATER. Special version of video-controls?

        self.media_controls = document.createElement("a-entity");
        self.menu_group.appendChild(self.media_controls);
    }

    // Open/Close menu event

    self.open_icon.addEventListener("clicked", function(){

        // Close menu

        if(self.open_menu){

            // View the open icon and hide menu
            self.menu_group.setAttribute("visible", false);

            // Close icon should be now a menu icon

            self.open_icon.setAttribute("uipack-button", "icon_name", "bars.png");

            // Mark menu as closed

            self.open_menu = false;
        }

        // Open menu

        else {

            // Make visible the group

            self.menu_group.setAttribute("visible", true);

            // Open icon should be now a 'close'

            self.open_icon.setAttribute("uipack-button", "icon_name", "close.png");

            // Mark menu as open

            self.open_menu = true;
        }

    });

  },
  remove: function(){

  },

  update: function (oldData) {

    var self = this;

    // Position icons

    var icon_row_half_width = ((self.icon_row.length-1)*(AFRAME_UIPACK.UIPACK_CONSTANTS.button_radius*2) + (self.icon_row.length - 1) * AFRAME_UIPACK.UIPACK_CONSTANTS.icon_spacing)/2.0;

    for(var i=0; i< self.icon_row.length; i++){

      self.icon_row[i].setAttribute("uipack-button", {icon_name: self.data.icons[i]});

      self.icon_row[i].setAttribute("position", (i*(AFRAME_UIPACK.UIPACK_CONSTANTS.button_radius*2 +AFRAME_UIPACK.UIPACK_CONSTANTS.icon_spacing )) - icon_row_half_width + " " +  AFRAME_UIPACK.UIPACK_CONSTANTS.offset_icons +" 0");
    }

    // Position text buttons

    // button_parent

    var button_row_half_width = ((self.button_row.length-1)*(AFRAME_UIPACK.UIPACK_CONSTANTS.menu_button_width) + (self.button_row.length - 1) * AFRAME_UIPACK.UIPACK_CONSTANTS.button_spacing)/2.0;

    for(i=0; i< self.button_row.length; i++){

      self.button_row[i].setAttribute("uipack-textbutton", {text: self.data.buttons[i], width: AFRAME_UIPACK.UIPACK_CONSTANTS.menu_button_width, color: "#FFF", background: "#000"});

      self.button_row[i].setAttribute("position", (i*(AFRAME_UIPACK.UIPACK_CONSTANTS.menu_button_width + AFRAME_UIPACK.UIPACK_CONSTANTS.button_spacing )) - button_row_half_width + " " +  AFRAME_UIPACK.UIPACK_CONSTANTS.offset_buttons +" 0");
    }


    // Position video control if exists

    if(self.data.media_id != "") {

        self.media_controls.setAttribute("uipack-mediacontrols", {'src': "#" + self.data.media_id,
            width: AFRAME_UIPACK.UIPACK_CONSTANTS.menu_player_width,
            height: AFRAME_UIPACK.UIPACK_CONSTANTS.menu_player_height,
            theme: self.data.theme,
            button_radius: AFRAME_UIPACK.UIPACK_CONSTANTS.menu_player_button_radius});

        self.media_controls.setAttribute("position", "0 " + AFRAME_UIPACK.UIPACK_CONSTANTS.offset_player + " 0");
    }

    // If data.open, emulate open menu

    if(self.data.open) {

            // Make visible the group

            self.menu_group.setAttribute("visible", true);

            // Open icon should be now a 'close'

            self.open_icon.setAttribute("uipack-button", "icon_name", "close.png");

            // Mark menu as open

            self.open_menu = true;

            self.hidden = false;

    }


  },

  tick: function (t) {

      var self = this;

      self.frame_count++;

      if(self.frame_count % AFRAME_UIPACK.UIPACK_CONSTANTS.menu_tick_check === 0){

        // Get camera pitch and yaw

        var camera_rotation = this.el.sceneEl.camera.el.getAttribute("rotation");

        var camera_yaw = camera_rotation.y + 90;

        var camera_pitch = camera_rotation.x;

        // If pitch in configured range, show menu, else hide (only id menu is closed)

        if(camera_pitch <  self.data.pitch_max && camera_pitch > self.data.pitch_min){

                self.hidden = false;
        }
        else {

            if(!(self.open_menu)) {

                self.hidden = true;
            }
        }

        self.el.setAttribute("visible", !self.hidden);

        // Emulate 'look into menu' if open on init

        if(self.data.open) {

            self.y_position = AFRAME_UIPACK.UIPACK_CONSTANTS.menu_distance * Math.sin(this.data.pitch * Math.PI / 180.0);
            self.x_position = AFRAME_UIPACK.UIPACK_CONSTANTS.menu_distance * Math.cos(this.data.pitch * Math.PI / 180.0) * Math.cos(camera_yaw * Math.PI / 180.0);
            self.z_position = -AFRAME_UIPACK.UIPACK_CONSTANTS.menu_distance * Math.cos(this.data.pitch * Math.PI / 180.0) * Math.sin(camera_yaw * Math.PI / 180.0);

            this.container.setAttribute("position", [self.x_position, self.y_position, self.z_position].join(" "));

            if (self.camera) {

                var cam_position = self.camera.el.getAttribute("position");

                self.el.setAttribute("position", {x: cam_position.x, y: cam_position.y, z: cam_position.z});

                self.container.setAttribute("rotation", {x: this.data.pitch, y: camera_rotation.y, z: 0});

                self.data.open = false;

            }
        }


        // If menu closed but visible: synch rotation and position with camera

        if(!(self.open_menu) && !(self.hidden)) {

            // Set position of menu based on camera yaw and data.pitch

            self.y_position = AFRAME_UIPACK.UIPACK_CONSTANTS.menu_distance * Math.sin(this.data.pitch * Math.PI / 180.0);
            self.x_position = AFRAME_UIPACK.UIPACK_CONSTANTS.menu_distance * Math.cos(this.data.pitch * Math.PI / 180.0) * Math.cos(camera_yaw * Math.PI / 180.0);
            self.z_position = -AFRAME_UIPACK.UIPACK_CONSTANTS.menu_distance * Math.cos(this.data.pitch * Math.PI / 180.0) * Math.sin(camera_yaw * Math.PI / 180.0);

            this.container.setAttribute("position", [self.x_position, self.y_position, self.z_position].join(" "));

            // And again, face camera and pos

            if(self.camera) {

                var cam_position = self.camera.el.getAttribute("position");

                self.el.setAttribute("position",{x: cam_position.x, y: cam_position.y, z: cam_position.z});
                self.container.setAttribute("rotation",{x: camera_rotation.x, y: camera_rotation.y, z: 0});

            }


        }
        else {

            // If menu open, just synch camera position

            if(self.open_menu && (!self.hidden)){

                if(self.camera) {

                    var cam_position = self.camera.el.getAttribute("position");

                    self.el.setAttribute("position",{x: cam_position.x, y: cam_position.y, z: cam_position.z});

                }


            }
        }

      }

  }
});



AFRAME.registerComponent('uipack-button', {
    schema: {
        icon_name: {type: 'string'},
        yaw: { type: 'number', default: 0.0},
        elevation: { type: 'number', default: AFRAME_UIPACK.UIPACK_CONSTANTS.button_elevation},
        distance: { type: 'number', default: AFRAME_UIPACK.UIPACK_CONSTANTS.button_distance},
        absolute_pos: { type: 'boolean', default: false},
        radius: {type: 'number', default: AFRAME_UIPACK.UIPACK_CONSTANTS.button_radius},
        arc_color: {type: 'string', default: "red"},
        theme: {type: 'string', default: ""}
    },


  init: function () {

    var self = this;

    self.button_mode = (AFRAME_UIPACK && ('cursor_mode' in AFRAME_UIPACK)) ? AFRAME_UIPACK.cursor_mode : "desktop";

    // Create the element

    self.button = document.createElement("a-circle");

    this.el.appendChild(self.button);

    // Class the element

    this.el.classList.add("uipack", "uipack-button", "clickable");

    self.button.classList.add("clickable");


    if(self.button_mode === "desktop") {

        this.el.addEventListener("mousedown", function (event) {

            var sound = new Howl({src: AFRAME_UIPACK.paths.click_sound, volume: 0.25});

            sound.play();

            self.el.emit("clicked", null, false);

        });

        this.el.addEventListener("mouseenter", function(event){

            self.el.sceneEl.canvas.classList.remove("a-grab-cursor");

        });

        this.el.addEventListener("mouseleave", function(event){

            self.el.sceneEl.canvas.classList.add("a-grab-cursor");

        });

    }

    else {

        // Hover flag and events...

        self.first_hover = true;

        this.el.addEventListener('raycaster-intersected', function (event) {


            // First 'fresh' hover

            if (self.first_hover) {

                // Insert ring for animation on hover

                self.ring = document.createElement("a-ring");
                self.ring.setAttribute("radius-inner", self.data.radius * 1.0);
                self.ring.setAttribute("radius-outer", self.data.radius * 1.2);
                self.ring.setAttribute("material", "color:" + (self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].arc_color : self.data.arc_color));
                self.ring.setAttribute("visible", true);

                // Create animation

                // Specific code for AFrame 0.9.x and up

                // if (AFRAME_UIPACK.utils.version_greater_than_nine()){

                if((AFRAME.version.startsWith("0.9.")) || (parseInt(AFRAME.version.split(".")[0]) > 1)){

                    self.ring.setAttribute("animation", {
                        easing: "linear",
                        property: "geometry.thetaLength",
                        dur: AFRAME_UIPACK.animation.button,
                        from: 0,
                        to: 360
                    });

                    self.el.appendChild(self.ring);

                    self.first_hover = false;

                    self.ring.addEventListener("animationcomplete", function() {

                        setTimeout(function () {
                            self.first_hover = true;
                        }, 500);

                        var sound = new Howl({src: AFRAME_UIPACK.paths.click_sound, volume: 0.25});

                        sound.play();

                        self.el.emit("clicked", null, false);

                        self.ring.parentNode.removeChild(self.ring);


                    });
                }
                else {
                    self.animation = document.createElement("a-animation");
                    self.animation.setAttribute("easing", "linear");
                    self.animation.setAttribute("attribute", "geometry.thetaLength");
                    self.animation.setAttribute("dur", AFRAME_UIPACK.animation.button);
                    self.animation.setAttribute("from", "0");
                    self.animation.setAttribute("to", "360");

                    self.ring.appendChild(self.animation);

                    self.el.appendChild(self.ring);

                    self.first_hover = false;

                    // Emit 'clicked' on ring animation end

                    self.animation.addEventListener("animationend", function () {

                        setTimeout(function () {
                            self.first_hover = true;
                        }, 500);

                        var sound = new Howl({src: AFRAME_UIPACK.paths.click_sound, volume: 0.25});

                        sound.play();

                        self.el.emit("clicked", null, false);

                        self.ring.parentNode.removeChild(self.ring);


                    });
                }
            }
        });

        this.el.addEventListener('raycaster-intersected-cleared', function (event) {

            self.first_hover = true;

            // Change cursor color and scale

            event.detail.el.setAttribute("scale", "1 1 1");

            // Remove ring if existing

            if (self.ring.parentNode) {

                self.ring.parentNode.removeChild(self.ring);
            }

        });
    }

  },
  update: function (oldData) {

    var self = this;

    // CHange material, radius, position and rotation

    // console.log("UPDATING BUTTON:")

    self.icon_path = (self.data.theme !== "" ? AFRAME_UIPACK.themes[self.data.theme].icon_path : AFRAME_UIPACK.UIPACK_CONSTANTS.icon_path) + "/" + self.data.icon_name;

    self.button.setAttribute("material",{"src": 'url(' + self.icon_path + ')', "shader": "flat"});

    self.button.setAttribute("radius", self.data.radius);

        // If parent is scene, absolute positioning, else, leave position up to the user

        if(self.el.parentEl === self.el.sceneEl || self.data.absolute_pos) {

            self.x_position = self.data.distance * Math.cos(this.data.yaw * Math.PI/180.0);
            self.y_position = self.data.elevation;
            self.z_position = -self.data.distance * Math.sin(this.data.yaw * Math.PI/180.0);

            this.el.setAttribute("rotation", {x: 0, y: this.data.yaw - 90, z: 0});

            this.el.setAttribute("position", [self.x_position, self.y_position, self.z_position].join(" "));

        }

        // What was this for??

//      else {
//            console.log("NON ABSOLUTE POSITIONING");
//        }

  }
});


AFRAME.registerComponent('uipack-mediacontrols', {
  schema: {
    src: { type: 'string'},
    width: { type: 'number', default: 2.0},
    height: {type: 'number', default: 0.2},
    button_radius: {type: 'number', default: 0.3},
    backgroundColor: { default: 'black'},
    barColor: { default: 'red'},
    textColor: { default: 'yellow'},
    statusTextFont: { default: '50px Helvetica Neue'},
    timeTextFont: { default: '60px Helvetica Neue'},
    theme: {type: 'string', default: ""}
  },

  position_time_from_steps: function(){

        var unit_offset = this.current_step/this.bar_steps;

        if(this.video_el.readyState > 0) {

            this.video_el.currentTime = unit_offset * this.video_el.duration;
        }


  },

  init: function () {

    var self = this;

    // Class the element

    self.el.setAttribute("class", "uipack uipack-mediacontrols clickable");

    // Next two vars used to control transport bar with keyboard arrows

    this.bar_steps = 10.0;

    this.current_step = 0.0;

    this.el.setAttribute("visible", true);

    this.video_selector = this.data.src;

    this.video_el = document.querySelector(this.video_selector);

    self.icon = document.createElement("a-entity");

    self.icon.setAttribute("uipack-button", {'theme': self.data.theme, icon_name : AFRAME_UIPACK.UIPACK_CONSTANTS.play_icon, radius: self.data.button_radius});

    this.el.appendChild(self.icon);

    // Create icon image (play/pause), different image whether video is playing.

    if (this.video_el.paused) {
      self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.play_icon);
    } else {
      self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.pause_icon);
    }

    // Change icon to 'play' on end

    this.video_el.addEventListener("ended", function(e){

        self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.play_icon);

    });

    // Change icon to 'pause' on start.

    this.video_el.addEventListener("pause", function(e){

        self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.play_icon);

    });

    // Change icon to 'play' on pause.

    this.video_el.addEventListener("playing", function(e){

        self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.pause_icon);

    });

    this.bar_canvas = document.createElement("canvas");
    this.bar_canvas.setAttribute("id", "video_player_canvas");
    this.bar_canvas.width = 1024;
    this.bar_canvas.height = 64;

    this.bar_canvas.style.display = "none";

    this.context = this.bar_canvas.getContext('2d');

    this.texture = new THREE.Texture(this.bar_canvas);

    // On icon image, change video state and icon (play/pause)

    self.icon.addEventListener('clicked', function (event) {

        if(!self.video_el.paused){

            self.video_el.pause();

            self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.play_icon);

        }
        else {

            self.video_el.play();

            self.icon.setAttribute("uipack-button", "icon_name", AFRAME_UIPACK.UIPACK_CONSTANTS.pause_icon);

        }

    });


    window.addEventListener('keypress', function(event) {
      switch (event.keyCode) {

        // If space bar is pressed, fire click on play_image
        case 32:
          self.icon.emit("clicked", null, false);
        break;

        // Arrow left: beginning
        case 37:
           self.current_step = 0.0;
           self.position_time_from_steps();
        break;

        // Arrow right: end
        case 39:
           self.current_step = self.bar_steps;
           self.position_time_from_steps();

        break;

        // Arrow up: one step forward
        case 38:
           self.current_step = self.current_step < (self.bar_steps) ? self.current_step + 1 : self.current_step;
           self.position_time_from_steps();
        break;

        // Arrow down: one step back
        case 40:
           self.current_step = self.current_step > 0 ? self.current_step - 1 : self.current_step;
           self.position_time_from_steps();
        break;

      }
    }, false);


    // Create transport bar

    this.bar = document.createElement("a-plane");

    this.bar.setAttribute("color", self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_background : self.data.backgroundColor);

    this.real_bar_width = this.data.width - ((this.data.button_radius*5));

    self.button_mode = (AFRAME_UIPACK && ('cursor_mode' in AFRAME_UIPACK)) ? AFRAME_UIPACK.cursor_mode : "desktop";

    if(self.button_mode === "desktop"){

        this.bar.addEventListener("mousedown", function (event){

            // Get raycast intersection point, and from there, x_offset in bar

            // if((AFRAME.version.startsWith("0.9.")) || (parseInt(AFRAME.version.split(".")[0]) > 1)){
            //
            //     var point = event.detail.getIntersection(this.bar).point
            // }
            // else {

            var point = event.detail.intersection.point;
            // }

            var x_offset = this.object3D.worldToLocal(point).x;

            var unit_offset = (x_offset / self.real_bar_width) + 0.5;

            // Update current step for coherence between point+click and key methods

            self.current_step = Math.round(unit_offset * self.bar_steps);

            var timeout_function = function () {
                if (self.video_el.readyState > 0) {
                    self.video_el.currentTime = unit_offset * self.video_el.duration;
                }

            };

            self.ray_timeout = setTimeout(timeout_function, 300);

        });

        this.bar.addEventListener("mouseenter", function (event){

            self.el.sceneEl.canvas.classList.remove("a-grab-cursor");


        });

        this.bar.addEventListener("mouseleave", function (event){

            self.el.sceneEl.canvas.classList.add("a-grab-cursor");

            clearTimeout(self.ray_timeout);

        });

    }
    else {

        // On transport bar click, get point clicked, infer % of new pointer, and make video seek to that point

        self.first_hover = true;

        var my_bar = this.bar;

        this.bar.addEventListener('raycaster-intersected', function (event) {

            if (self.first_hover) {


                self.first_hover = false;

                // Get raycast intersection point, and from there, x_offset in bar


                if((AFRAME.version.startsWith("0.9.")) || (parseInt(AFRAME.version.split(".")[0]) > 1)){

                    var point = event.detail.getIntersection(my_bar).point
                }
                else {

                    var point = event.detail.intersection.point;
                }


                var x_offset = this.object3D.worldToLocal(point).x;

                var unit_offset = (x_offset / self.real_bar_width) + 0.5;

                // Update current step for coherence between point+click and key methods

                self.current_step = Math.round(unit_offset * self.bar_steps);

                var timeout_function = function () {
                    if (self.video_el.readyState > 0) {
                        self.video_el.currentTime = unit_offset * self.video_el.duration;
                    }

                };

                self.ray_timeout = setTimeout(timeout_function, 300);

                // Prevent propagation upwards (e.g: canvas click)

                event.stopPropagation();

                event.preventDefault();
            }

        });

        this.bar.addEventListener('raycaster-intersected-cleared', function (event) {

            self.first_hover = true;

            clearTimeout(self.ray_timeout);

        });
    }


    this.back_plane = document.createElement("a-plane");

    this.back_plane.setAttribute("material", {color: self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_background : self.data.backgroundColor, shader: "flat"});

    // Append image icon + info text + bar to component root

    this.el.appendChild(this.bar_canvas);
    this.el.appendChild(this.bar);
    this.el.appendChild(this.back_plane);


  },

  update: function (oldData) {

    var self = this;


    self.bar.setAttribute("height", this.data.height/2);
    self.bar.setAttribute("width", self.real_bar_width);
    self.bar.setAttribute("position", {x: self.data.button_radius*2, y: 0, z:0.01});

    self.back_plane.setAttribute("height", this.data.height);
    self.back_plane.setAttribute("width", this.data.width);

    self.icon.setAttribute("position", {x: -((this.data.width/2)) + self.data.button_radius * 2, y: 0, z:0.01});

  },
  tick: function (t) {

    var self = this;

    // Refresh every 250 millis

    if(typeof(this.last_time) === "undefined" || (t - this.last_time ) > 250) {

        // At the very least, have all video metadata
        // (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState)

        if(this.video_el.readyState > 0) {

            // Get current position minutes and second, and add leading zeroes if needed

            var current_minutes = Math.floor(this.video_el.currentTime / 60);
            var current_seconds = Math.floor(this.video_el.currentTime % 60);


            current_minutes = current_minutes < 10 ? "0" + current_minutes : current_minutes;
            current_seconds = current_seconds < 10 ? "0" + current_seconds : current_seconds;

            // Get video duration in  minutes and second, and add leading zeroes if needed

            var duration_minutes = Math.floor(this.video_el.duration / 60);
            var duration_seconds = Math.floor(this.video_el.duration % 60);


            duration_minutes = duration_minutes < 10 ? "0" + duration_minutes : duration_minutes;
            duration_seconds = duration_seconds < 10 ? "0" + duration_seconds : duration_seconds;

            // Refresh time information : currentTime / duration

            var time_info_text = current_minutes + ":" + current_seconds + " / " + duration_minutes + ":" + duration_seconds;

            //  Refresh transport bar canvas

            var inc = this.bar_canvas.width / this.video_el.duration;

            //  display buffered TimeRanges

            if (this.video_el.buffered.length > 0) {

                // Synchronize current step with currentTime

                this.current_step = Math.round((this.video_el.currentTime/this.video_el.duration)*this.bar_steps);

                var ctx = this.context;
                ctx.fillStyle = self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_background : self.data.backgroundColor;
                ctx.fillRect(0, 0, this.bar_canvas.width, this.bar_canvas.height);


                // Display time info text

                ctx.font = self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_font: this.data.timeTextFont;
                ctx.fillStyle = self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_text_color : self.data.textColor;
                ctx.textAlign = "center";
                ctx.fillText(time_info_text, this.bar_canvas.width*0.45, this.bar_canvas.height* 1.0);


                // If seeking to position, show

                if(this.video_el.seeking){
//                    ctx.font = this.data.statusTextFont;
//                    ctx.fillStyle = self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_text_color : self.data.textColor;
//                    ctx.textAlign = "end";
//                    ctx.fillText("Seeking", this.bar_canvas.width * 0.95, this.bar_canvas.height * 0.75);
                }

                // Uncomment below to see % of video loaded...

                else {

//                    var percent = (this.video_el.buffered.end(this.video_el.buffered.length - 1) / this.video_el.duration) * 100;
//
//                    ctx.font = this.data.statusTextFont;
//                    ctx.fillStyle = self.data.theme ? AFRAME_UIPACK.themes[self.data.theme].player_text_color : self.data.textColor;
//                    ctx.textAlign = "end";
//
//                    ctx.fillText(percent.toFixed(0) + "% loaded", this.bar_canvas.width * 0.95, this.bar_canvas.height * 0.75);
                }


                // Show buffered ranges 'bins'

                for (var i = 0; i < this.video_el.buffered.length; i++) {

                    var startX = this.video_el.buffered.start(i) * inc;
                    var endX = this.video_el.buffered.end(i) * inc;
                    var width = endX - startX;

                    ctx.fillStyle = "grey";
                    ctx.fillRect(startX, 0, width, this.bar_canvas.height/2);

                }

                // Red bar with already played range

                ctx.fillStyle = this.data.barColor;
                ctx.fillRect(0, 0,
                    (this.video_el.currentTime / this.video_el.duration)*this.bar_canvas.width,
                    this.bar_canvas.height/2);

            }


            // If material is not mapped yet to canvas texture and bar object3D is ready
            // assign canvas as a texture

            if(this.bar.object3D.children.length > 0) {

                // If material is not mapped yet to canvas texture...

                if(this.bar.object3D.children[0].material.map === null) {
                    this.bar.object3D.children[0].material = new THREE.MeshBasicMaterial();
                    this.bar.object3D.children[0].material.map = this.texture;
                }

                this.texture.needsUpdate = true;
            }


        }

        // Save this 't' to last_time

        this.last_time = t;
    }
  }
});