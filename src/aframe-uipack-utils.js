var AFRAME_UIPACK = AFRAME_UIPACK || {};

AFRAME_UIPACK.utils = {

    // Insert a 'controls' menu for a video with 'theme' and 'open' params that 'act' on 'el' DOM element (a video component)

    // Also, sets cursor based on desktop, mobile or headset

    insert_immersive_video_menu: function(options) {

        var options = options || {};

        var theme = options.theme || AFRAME_UIPACK.constants.default_theme;

        var open = ('open' in options) ? options.open : true;

        var el = options.el;

        function insert_cursor_and_menu(scene, element, theme, open, mobile_touch_ui) {
            var touch_hide_ui = AFRAME.utils.isMobile() && mobile_touch_ui;
            var video_id = element.components["immersive-video"].video_id;

            AFRAME_UIPACK.utils.set_cursor(scene, theme, mobile_touch_ui);

            var menu = document.createElement("a-entity");

            menu.setAttribute("uipack-menu", {
                theme: theme,
                icons: [],
                buttons: [],
                media_id: video_id,
                open: open,
                touch_hide_ui: touch_hide_ui
            });

            scene.appendChild(menu);

            if (touch_hide_ui) {
                AFRAME_UIPACK.utils.cursor.addEventListener("mousedown", function() {
                    var ui_menu = menu.components['uipack-menu'];
                    var ui_controls = ui_menu.media_controls.components["uipack-mediacontrols"];
                    if (ui_controls.cursor_is_over() && !ui_menu.touch_hidden) return;
                    ui_menu.touch_hidden = !ui_menu.touch_hidden;

                    if (ui_menu.touch_hidden) {
                        ui_menu.menu_group.setAttribute("visible", false);
                        AFRAME_UIPACK.utils.cursor.setAttribute("visible", false);
                    } else {
                        ui_menu.menu_group.setAttribute("visible", true);
                        AFRAME_UIPACK.utils.cursor.setAttribute("visible", true);
                    }
                });
            }
        }

        var scene = document.querySelector("a-scene");

        if (scene.renderStarted) {
            insert_cursor_and_menu(scene, el, theme, open, options.mobile_touch_ui);
        }
        else {
            scene.addEventListener("renderstart", function () {
                insert_cursor_and_menu(scene, el, theme, open, options.mobile_touch_ui);
            });
        }
    },


    set_cursor: function (scene, theme, mobile_touch_ui) {

        var self = this;

        if(theme === undefined){
            theme = AFRAME_UIPACK.constants.default_theme;
        }

        self.scene = scene;

        self.camera = scene.camera.el;

        self.theme_data = AFRAME_UIPACK.themes[theme];

        // console.log("SETTING CURSOR");
        //
        // console.log("HEADSET", AFRAME.utils.checkHeadsetConnected(), AFRAME.utils.isMobile(), AFRAME.utils.isGearVR(), navigator.userAgent);

        var mobile = AFRAME.utils.isMobile();
        var headset = AFRAME.utils.checkHeadsetConnected();

        var desktop = !(mobile) && !(headset);

        self.cursor = document.createElement("a-entity");

        // console.log("CAMERA", self.camera);

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

        mobile_touch_ui = mobile && mobile_touch_ui;
        AFRAME_UIPACK.cursor_mode = (desktop || mobile_touch_ui) ? "desktop" : (mobile ? "gaze" : "laser");
    }
};
