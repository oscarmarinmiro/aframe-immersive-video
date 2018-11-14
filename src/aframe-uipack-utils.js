var AFRAME_UIPACK = AFRAME_UIPACK || {};

AFRAME_UIPACK.utils = {

    insert_immersive_video_menu: function(options) {

        var options = options || {};

        var theme = options.theme || AFRAME_UIPACK.constants.default_theme;

        var open = ('open' in options) ? options.open : true;

        var id = options.id || "immersive-video";

        function insert_cursor_and_menu(scene, component_id, theme, open) {

            var video_id = document.getElementById(component_id).components["immersive-video"].video_id;

            AFRAME_UIPACK.utils.set_cursor(scene);

            var menu = document.createElement("a-entity");

            menu.setAttribute("uipack-menu", {

                theme: theme,

                icons: [], buttons: [], media_id: video_id, open: open

            });


            scene.appendChild(menu);

        }

        var scene = document.querySelector("a-scene");

        if (scene.renderStarted) {
            insert_cursor_and_menu(scene, id, theme, open);
        }
        else {
            scene.addEventListener("renderstart", function () {
                insert_cursor_and_menu(scene, id, theme, open);
            });
        }
    },


    set_cursor: function (scene, theme) {

        var self = this;

        if(theme === undefined){
            theme = AFRAME_UIPACK.constants.default_theme;
        }

        self.scene = scene;

        self.camera = scene.camera.el;

        self.theme_data = AFRAME_UIPACK.themes[theme];

        console.log("SETTING CURSOR");

        console.log("HEADSET", AFRAME.utils.checkHeadsetConnected(), AFRAME.utils.isMobile(), AFRAME.utils.isGearVR(), navigator.userAgent);

        var mobile = AFRAME.utils.isMobile();
        var headset = AFRAME.utils.checkHeadsetConnected();

        var desktop = !(mobile) && !(headset);

        self.cursor = document.createElement("a-entity");

        console.log("CAMERA", self.camera);

        self.camera.appendChild(self.cursor);

        self.cursor.setAttribute("id", "cursor");

        self.cursor.setAttribute("cursor", {
            rayOrigin: desktop ? "mouse" : "entity",
            fuse: true,
            fuseTimeout: AFRAME_UIPACK.animation.button
        });
        self.cursor.setAttribute("position", {x: 0, y: 0, z: -1});
        self.cursor.setAttribute("geometry", {primitive: "ring", radiusInner: 0.01, radiusOuter: 0.02});
        self.cursor.setAttribute("material", {color: self.theme_data.cursor_color, shader: "flat"});
        self.cursor.setAttribute("visible", !desktop);

        // Oculus Go or GearVR;

        if (AFRAME.utils.isMobile() && AFRAME.utils.isGearVR()) {
            headset = true;
            mobile = false;
        }

        // To avoid clicks while loading and intro panel is present

        self.cursor.setAttribute("raycaster", {near: 0.0});

        if ((headset) && (!(mobile))) {

            self.laser_controls = document.createElement("a-entity");

            self.laser_controls.setAttribute("laser-controls", {});

            self.laser_controls.setAttribute("line", {color: self.theme_data.cursor_color});

            self.laser_controls.setAttribute("raycaster", {near: 0.0});

            // Hide and deactivate gaze cursor

            self.cursor.setAttribute("visible", false);

            self.cursor.setAttribute("raycaster", {far: 0.0});

            self.scene.appendChild(self.laser_controls);

        }


        AFRAME_UIPACK.cursor_mode = desktop ? "desktop" : (mobile ? "gaze" : "laser");

    }
};
