/*! howler.js v2.0.15 | (c) 2013-2018, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";var e=function(){this.init()};e.prototype={init:function(){var e=this||n;return e._counter=1e3,e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.mobileAutoEnable=!0,e._setup(),e},volume:function(e){var o=this||n;if(e=parseFloat(e),o.ctx||_(),void 0!==e&&e>=0&&e<=1){if(o._volume=e,o._muted)return o;o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.volume=u._volume*e)}return o}return o._volume},mute:function(e){var o=this||n;o.ctx||_(),o._muted=e,o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e?0:o._volume,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.muted=!!e||u._muted)}return o},unload:function(){for(var e=this||n,o=e._howls.length-1;o>=0;o--)e._howls[o].unload();return e.usingWebAudio&&e.ctx&&void 0!==e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return(this||n)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||n;if(e.state=e.ctx?e.ctx.state||"running":"running",e._autoSuspend(),!e.usingWebAudio)if("undefined"!=typeof Audio)try{var o=new Audio;void 0===o.oncanplaythrough&&(e._canPlayEvent="canplay")}catch(n){e.noAudio=!0}else e.noAudio=!0;try{var o=new Audio;o.muted&&(e.noAudio=!0)}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,o=null;try{o="undefined"!=typeof Audio?new Audio:null}catch(n){return e}if(!o||"function"!=typeof o.canPlayType)return e;var t=o.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator&&e._navigator.userAgent.match(/OPR\/([0-6].)/g),a=r&&parseInt(r[0].split("/")[1],10)<33;return e._codecs={mp3:!(a||!t&&!o.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!t,opus:!!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!o.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!o.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(o.canPlayType("audio/x-m4a;")||o.canPlayType("audio/m4a;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(o.canPlayType("audio/x-mp4;")||o.canPlayType("audio/mp4;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),dolby:!!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(o.canPlayType("audio/x-flac;")||o.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_enableMobileAudio:function(){var e=this||n,o=/iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi|Chrome/i.test(e._navigator&&e._navigator.userAgent);if(!e._mobileEnabled&&e.ctx&&o){e._mobileEnabled=!1,e.mobileAutoEnable=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var t=function(o){n._autoResume();var r=e.ctx.createBufferSource();r.buffer=e._scratchBuffer,r.connect(e.ctx.destination),void 0===r.start?r.noteOn(0):r.start(0),"function"==typeof e.ctx.resume&&e.ctx.resume(),r.onended=function(){r.disconnect(0),e._mobileEnabled=!0,document.removeEventListener("touchstart",t,!0),document.removeEventListener("touchend",t,!0),document.removeEventListener("click",t,!0);for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("unlock")}};return document.addEventListener("touchstart",t,!0),document.addEventListener("touchend",t,!0),document.addEventListener("click",t,!0),e}},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&void 0!==e.ctx.suspend&&n.usingWebAudio){for(var o=0;o<e._howls.length;o++)if(e._howls[o]._webAudio)for(var t=0;t<e._howls[o]._sounds.length;t++)if(!e._howls[o]._sounds[t]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){e.autoSuspend&&(e._suspendTimer=null,e.state="suspending",e.ctx.suspend().then(function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())}))},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&void 0!==e.ctx.resume&&n.usingWebAudio)return"running"===e.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state?(e.ctx.resume().then(function(){e.state="running";for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("resume")}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,o=function(e){var n=this;if(!e.src||0===e.src.length)return void console.error("An array of source files must be passed with any new Howl.");n.init(e)};o.prototype={init:function(e){var o=this;return n.ctx||_(),o._autoplay=e.autoplay||!1,o._format="string"!=typeof e.format?e.format:[e.format],o._html5=e.html5||!1,o._muted=e.mute||!1,o._loop=e.loop||!1,o._pool=e.pool||5,o._preload="boolean"!=typeof e.preload||e.preload,o._rate=e.rate||1,o._sprite=e.sprite||{},o._src="string"!=typeof e.src?e.src:[e.src],o._volume=void 0!==e.volume?e.volume:1,o._xhrWithCredentials=e.xhrWithCredentials||!1,o._duration=0,o._state="unloaded",o._sounds=[],o._endTimers={},o._queue=[],o._playLock=!1,o._onend=e.onend?[{fn:e.onend}]:[],o._onfade=e.onfade?[{fn:e.onfade}]:[],o._onload=e.onload?[{fn:e.onload}]:[],o._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],o._onplayerror=e.onplayerror?[{fn:e.onplayerror}]:[],o._onpause=e.onpause?[{fn:e.onpause}]:[],o._onplay=e.onplay?[{fn:e.onplay}]:[],o._onstop=e.onstop?[{fn:e.onstop}]:[],o._onmute=e.onmute?[{fn:e.onmute}]:[],o._onvolume=e.onvolume?[{fn:e.onvolume}]:[],o._onrate=e.onrate?[{fn:e.onrate}]:[],o._onseek=e.onseek?[{fn:e.onseek}]:[],o._onunlock=e.onunlock?[{fn:e.onunlock}]:[],o._onresume=[],o._webAudio=n.usingWebAudio&&!o._html5,void 0!==n.ctx&&n.ctx&&n.mobileAutoEnable&&n._enableMobileAudio(),n._howls.push(o),o._autoplay&&o._queue.push({event:"play",action:function(){o.play()}}),o._preload&&o.load(),o},load:function(){var e=this,o=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var u,i;if(e._format&&e._format[r])u=e._format[r];else{if("string"!=typeof(i=e._src[r])){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}u=/^data:audio\/([^;,]+);/i.exec(i),u||(u=/\.([^.]+)$/.exec(i.split("?",1)[0])),u&&(u=u[1].toLowerCase())}if(u||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),u&&n.codecs(u)){o=e._src[r];break}}return o?(e._src=o,e._state="loading","https:"===window.location.protocol&&"http:"===o.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new t(e),e._webAudio&&a(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,o){var t=this,r=null;if("number"==typeof e)r=e,e=null;else{if("string"==typeof e&&"loaded"===t._state&&!t._sprite[e])return null;if(void 0===e){e="__default";for(var a=0,u=0;u<t._sounds.length;u++)t._sounds[u]._paused&&!t._sounds[u]._ended&&(a++,r=t._sounds[u]._id);1===a?e=null:r=null}}var i=r?t._soundById(r):t._inactiveSound();if(!i)return null;if(r&&!e&&(e=i._sprite||"__default"),"loaded"!==t._state){i._sprite=e,i._ended=!1;var d=i._id;return t._queue.push({event:"play",action:function(){t.play(d)}}),d}if(r&&!i._paused)return o||t._loadQueue("play"),i._id;t._webAudio&&n._autoResume();var _=Math.max(0,i._seek>0?i._seek:t._sprite[e][0]/1e3),s=Math.max(0,(t._sprite[e][0]+t._sprite[e][1])/1e3-_),l=1e3*s/Math.abs(i._rate);if(i._paused=!1,i._ended=!1,i._sprite=e,i._seek=_,i._start=t._sprite[e][0]/1e3,i._stop=(t._sprite[e][0]+t._sprite[e][1])/1e3,i._loop=!(!i._loop&&!t._sprite[e][2]),i._seek>=i._stop)return void t._ended(i);var c=i._node;if(t._webAudio){var f=function(){t._refreshBuffer(i);var e=i._muted||t._muted?0:i._volume;c.gain.setValueAtTime(e,n.ctx.currentTime),i._playStart=n.ctx.currentTime,void 0===c.bufferSource.start?i._loop?c.bufferSource.noteGrainOn(0,_,86400):c.bufferSource.noteGrainOn(0,_,s):i._loop?c.bufferSource.start(0,_,86400):c.bufferSource.start(0,_,s),l!==1/0&&(t._endTimers[i._id]=setTimeout(t._ended.bind(t,i),l)),o||setTimeout(function(){t._emit("play",i._id)},0)};"running"===n.state?f():(t.once("resume",f),t._clearTimer(i._id))}else{var p=function(){c.currentTime=_,c.muted=i._muted||t._muted||n._muted||c.muted,c.volume=i._volume*n.volume(),c.playbackRate=i._rate;try{var r=c.play();if(r&&"undefined"!=typeof Promise&&(r instanceof Promise||"function"==typeof r.then)?(t._playLock=!0,r.then(function(){t._playLock=!1,o||t._emit("play",i._id)}).catch(function(){t._playLock=!1,t._emit("playerror",i._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.")})):o||t._emit("play",i._id),c.playbackRate=i._rate,c.paused)return void t._emit("playerror",i._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");"__default"!==e||i._loop?t._endTimers[i._id]=setTimeout(t._ended.bind(t,i),l):(t._endTimers[i._id]=function(){t._ended(i),c.removeEventListener("ended",t._endTimers[i._id],!1)},c.addEventListener("ended",t._endTimers[i._id],!1))}catch(e){t._emit("playerror",i._id,e)}},m=window&&window.ejecta||!c.readyState&&n._navigator.isCocoonJS;if(c.readyState>=3||m)p();else{var v=function(){p(),c.removeEventListener(n._canPlayEvent,v,!1)};c.addEventListener(n._canPlayEvent,v,!1),t._clearTimer(i._id)}}return i._id},pause:function(e){var n=this;if("loaded"!==n._state||n._playLock)return n._queue.push({event:"pause",action:function(){n.pause(e)}}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused&&(r._seek=n.seek(o[t]),r._rateSeek=0,r._paused=!0,n._stopFade(o[t]),r._node))if(n._webAudio){if(!r._node.bufferSource)continue;void 0===r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r?r._id:null)}return n},stop:function(e,n){var o=this;if("loaded"!==o._state||o._playLock)return o._queue.push({event:"stop",action:function(){o.stop(e)}}),o;for(var t=o._getSoundIds(e),r=0;r<t.length;r++){o._clearTimer(t[r]);var a=o._soundById(t[r]);a&&(a._seek=a._start||0,a._rateSeek=0,a._paused=!0,a._ended=!0,o._stopFade(t[r]),a._node&&(o._webAudio?a._node.bufferSource&&(void 0===a._node.bufferSource.stop?a._node.bufferSource.noteOff(0):a._node.bufferSource.stop(0),o._cleanBuffer(a._node)):isNaN(a._node.duration)&&a._node.duration!==1/0||(a._node.currentTime=a._start||0,a._node.pause())),n||o._emit("stop",a._id))}return o},mute:function(e,o){var t=this;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"mute",action:function(){t.mute(e,o)}}),t;if(void 0===o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),a=0;a<r.length;a++){var u=t._soundById(r[a]);u&&(u._muted=e,u._interval&&t._stopFade(u._id),t._webAudio&&u._node?u._node.gain.setValueAtTime(e?0:u._volume,n.ctx.currentTime):u._node&&(u._node.muted=!!n._muted||e),t._emit("mute",u._id))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length||2===r.length&&void 0===r[1]){t._getSoundIds().indexOf(r[0])>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else r.length>=2&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var a;if(!(void 0!==e&&e>=0&&e<=1))return a=o?t._soundById(o):t._sounds[0],a?a._volume:0;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"volume",action:function(){t.volume.apply(t,r)}}),t;void 0===o&&(t._volume=e),o=t._getSoundIds(o);for(var u=0;u<o.length;u++)(a=t._soundById(o[u]))&&(a._volume=e,r[2]||t._stopFade(o[u]),t._webAudio&&a._node&&!a._muted?a._node.gain.setValueAtTime(e,n.ctx.currentTime):a._node&&!a._muted&&(a._node.volume=e*n.volume()),t._emit("volume",a._id));return t},fade:function(e,o,t,r){var a=this;if("loaded"!==a._state||a._playLock)return a._queue.push({event:"fade",action:function(){a.fade(e,o,t,r)}}),a;a.volume(e,r);for(var u=a._getSoundIds(r),i=0;i<u.length;i++){var d=a._soundById(u[i]);if(d){if(r||a._stopFade(u[i]),a._webAudio&&!d._muted){var _=n.ctx.currentTime,s=_+t/1e3;d._volume=e,d._node.gain.setValueAtTime(e,_),d._node.gain.linearRampToValueAtTime(o,s)}a._startFadeInterval(d,e,o,t,u[i],void 0===r)}}return a},_startFadeInterval:function(e,n,o,t,r,a){var u=this,i=n,d=o-n,_=Math.abs(d/.01),s=Math.max(4,_>0?t/_:t),l=Date.now();e._fadeTo=o,e._interval=setInterval(function(){var r=(Date.now()-l)/t;l=Date.now(),i+=d*r,i=Math.max(0,i),i=Math.min(1,i),i=Math.round(100*i)/100,u._webAudio?e._volume=i:u.volume(i,e._id,!0),a&&(u._volume=i),(o<n&&i<=o||o>n&&i>=o)&&(clearInterval(e._interval),e._interval=null,e._fadeTo=null,u.volume(o,e._id),u._emit("fade",e._id))},s)},_stopFade:function(e){var o=this,t=o._soundById(e);return t&&t._interval&&(o._webAudio&&t._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(t._interval),t._interval=null,o.volume(t._fadeTo,e),t._fadeTo=null,o._emit("fade",e)),o},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return!!(o=t._soundById(parseInt(r[0],10)))&&o._loop;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var a=t._getSoundIds(n),u=0;u<a.length;u++)(o=t._soundById(a[u]))&&(o._loop=e,t._webAudio&&o._node&&o._node.bufferSource&&(o._node.bufferSource.loop=e,e&&(o._node.bufferSource.loopStart=o._start||0,o._node.bufferSource.loopEnd=o._stop)));return t},rate:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var i;if("number"!=typeof e)return i=t._soundById(o),i?i._rate:t._rate;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"rate",action:function(){t.rate.apply(t,r)}}),t;void 0===o&&(t._rate=e),o=t._getSoundIds(o);for(var d=0;d<o.length;d++)if(i=t._soundById(o[d])){i._rateSeek=t.seek(o[d]),i._playStart=t._webAudio?n.ctx.currentTime:i._playStart,i._rate=e,t._webAudio&&i._node&&i._node.bufferSource?i._node.bufferSource.playbackRate.setValueAtTime(e,n.ctx.currentTime):i._node&&(i._node.playbackRate=e);var _=t.seek(o[d]),s=(t._sprite[i._sprite][0]+t._sprite[i._sprite][1])/1e3-_,l=1e3*s/Math.abs(i._rate);!t._endTimers[o[d]]&&i._paused||(t._clearTimer(o[d]),t._endTimers[o[d]]=setTimeout(t._ended.bind(t,i),l)),t._emit("rate",i._id)}return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):t._sounds.length&&(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if(void 0===o)return t;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"seek",action:function(){t.seek.apply(t,r)}}),t;var i=t._soundById(o);if(i){if(!("number"==typeof e&&e>=0)){if(t._webAudio){var d=t.playing(o)?n.ctx.currentTime-i._playStart:0,_=i._rateSeek?i._rateSeek-i._seek:0;return i._seek+(_+d*Math.abs(i._rate))}return i._node.currentTime}var s=t.playing(o);s&&t.pause(o,!0),i._seek=e,i._ended=!1,t._clearTimer(o),!t._webAudio&&i._node&&(i._node.currentTime=e);var l=function(){t._emit("seek",o),s&&t.play(o,!0)};if(s&&!t._webAudio){var c=function(){t._playLock?setTimeout(c,0):l()};setTimeout(c,0)}else l()}return t},playing:function(e){var n=this;if("number"==typeof e){var o=n._soundById(e);return!!o&&!o._paused}for(var t=0;t<n._sounds.length;t++)if(!n._sounds[t]._paused)return!0;return!1},duration:function(e){var n=this,o=n._duration,t=n._soundById(e);return t&&(o=n._sprite[t._sprite][1]/1e3),o},state:function(){return this._state},unload:function(){for(var e=this,o=e._sounds,t=0;t<o.length;t++){if(o[t]._paused||e.stop(o[t]._id),!e._webAudio){/MSIE |Trident\//.test(n._navigator&&n._navigator.userAgent)||(o[t]._node.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"),o[t]._node.removeEventListener("error",o[t]._errorFn,!1),o[t]._node.removeEventListener(n._canPlayEvent,o[t]._loadFn,!1)}delete o[t]._node,e._clearTimer(o[t]._id)}var a=n._howls.indexOf(e);a>=0&&n._howls.splice(a,1);var u=!0;for(t=0;t<n._howls.length;t++)if(n._howls[t]._src===e._src){u=!1;break}return r&&u&&delete r[e._src],n.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,o,t){var r=this,a=r["_on"+e];return"function"==typeof n&&a.push(t?{id:o,fn:n,once:t}:{id:o,fn:n}),r},off:function(e,n,o){var t=this,r=t["_on"+e],a=0;if("number"==typeof n&&(o=n,n=null),n||o)for(a=0;a<r.length;a++){var u=o===r[a].id;if(n===r[a].fn&&u||!n&&u){r.splice(a,1);break}}else if(e)t["_on"+e]=[];else{var i=Object.keys(t);for(a=0;a<i.length;a++)0===i[a].indexOf("_on")&&Array.isArray(t[i[a]])&&(t[i[a]]=[])}return t},once:function(e,n,o){var t=this;return t.on(e,n,o,1),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],a=r.length-1;a>=0;a--)r[a].id&&r[a].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,o)}.bind(t,r[a].fn),0),r[a].once&&t.off(e,r[a].fn,r[a].id));return t._loadQueue(e),t},_loadQueue:function(e){var n=this;if(n._queue.length>0){var o=n._queue[0];o.event===e&&(n._queue.shift(),n._loadQueue()),e||o.action()}return n},_ended:function(e){var o=this,t=e._sprite;if(!o._webAudio&&e._node&&!e._node.paused&&!e._node.ended&&e._node.currentTime<e._stop)return setTimeout(o._ended.bind(o,e),100),o;var r=!(!e._loop&&!o._sprite[t][2]);if(o._emit("end",e._id),!o._webAudio&&r&&o.stop(e._id,!0).play(e._id),o._webAudio&&r){o._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var a=1e3*(e._stop-e._start)/Math.abs(e._rate);o._endTimers[e._id]=setTimeout(o._ended.bind(o,e),a)}return o._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,o._clearTimer(e._id),o._cleanBuffer(e._node),n._autoSuspend()),o._webAudio||r||o.stop(e._id,!0),o},_clearTimer:function(e){var n=this;if(n._endTimers[e]){if("function"!=typeof n._endTimers[e])clearTimeout(n._endTimers[e]);else{var o=n._soundById(e);o&&o._node&&o._node.removeEventListener("ended",n._endTimers[e],!1)}delete n._endTimers[e]}return n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new t(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(o<=n)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if(void 0===e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[o._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop||0),e._node.bufferSource.playbackRate.setValueAtTime(e._rate,n.ctx.currentTime),o},_cleanBuffer:function(e){var o=this;if(n._scratchBuffer&&e.bufferSource){e.bufferSource.onended=null,e.bufferSource.disconnect(0);try{e.bufferSource.buffer=n._scratchBuffer}catch(e){}}return e.bufferSource=null,o}};var t=function(e){this._parent=e,this.init()};t.prototype={init:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,o._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=n._muted||e._muted||e._parent._muted?0:e._volume;return o._webAudio?(e._node=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(t,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t*n.volume(),e._node.load()),e},reset:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,e},_errorListener:function(){var e=this;e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorFn,!1)},_loadListener:function(){var e=this,o=e._parent;o._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(o._sprite).length&&(o._sprite={__default:[0,1e3*o._duration]}),"loaded"!==o._state&&(o._state="loaded",o._emit("load"),o._loadQueue()),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1)}};var r={},a=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void d(e);if(/^data:[^;]+;base64,/.test(n)){for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),a=0;a<o.length;++a)t[a]=o.charCodeAt(a);i(t.buffer,e)}else{var _=new XMLHttpRequest;_.open("GET",n,!0),_.withCredentials=e._xhrWithCredentials,_.responseType="arraybuffer",_.onload=function(){var n=(_.status+"")[0];if("0"!==n&&"2"!==n&&"3"!==n)return void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+".");i(_.response,e)},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load())},u(_)}},u=function(e){try{e.send()}catch(n){e.onerror()}},i=function(e,o){var t=function(){o._emit("loaderror",null,"Decoding audio data failed.")},a=function(e){e&&o._sounds.length>0?(r[o._src]=e,d(o,e)):t()};"undefined"!=typeof Promise&&1===n.ctx.decodeAudioData.length?n.ctx.decodeAudioData(e).then(a).catch(t):n.ctx.decodeAudioData(e,a,t)},d=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue())},_=function(){try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch(e){n.usingWebAudio=!1}var e=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),o=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),t=o?parseInt(o[1],10):null;if(e&&t&&t<9){var r=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());(n._navigator&&n._navigator.standalone&&!r||n._navigator&&!n._navigator.standalone&&!r)&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.setValueAtTime(n._muted?0:1,n.ctx.currentTime),n.masterGain.connect(n.ctx.destination)),n._setup()};"function"==typeof define&&define.amd&&define([],function(){return{Howler:n,Howl:o}}),"undefined"!=typeof exports&&(exports.Howler=n,exports.Howl=o),"undefined"!=typeof window?(window.HowlerGlobal=e,window.Howler=n,window.Howl=o,window.Sound=t):"undefined"!=typeof global&&(global.HowlerGlobal=e,global.Howler=n,global.Howl=o,global.Sound=t)}();
/*! Spatial Plugin */
!function(){"use strict";HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(e){var n=this;if(!n.ctx||!n.ctx.listener)return n;for(var t=n._howls.length-1;t>=0;t--)n._howls[t].stereo(e);return n},HowlerGlobal.prototype.pos=function(e,n,t){var r=this;return r.ctx&&r.ctx.listener?(n="number"!=typeof n?r._pos[1]:n,t="number"!=typeof t?r._pos[2]:t,"number"!=typeof e?r._pos:(r._pos=[e,n,t],void 0!==r.ctx.listener.positionX?(r.ctx.listener.positionX.setTargetAtTime(r._pos[0],Howler.ctx.currentTime,.1),r.ctx.listener.positionY.setTargetAtTime(r._pos[1],Howler.ctx.currentTime,.1),r.ctx.listener.positionZ.setTargetAtTime(r._pos[2],Howler.ctx.currentTime,.1)):r.ctx.listener.setPosition(r._pos[0],r._pos[1],r._pos[2]),r)):r},HowlerGlobal.prototype.orientation=function(e,n,t,r,o,i){var a=this;if(!a.ctx||!a.ctx.listener)return a;var p=a._orientation;return n="number"!=typeof n?p[1]:n,t="number"!=typeof t?p[2]:t,r="number"!=typeof r?p[3]:r,o="number"!=typeof o?p[4]:o,i="number"!=typeof i?p[5]:i,"number"!=typeof e?p:(a._orientation=[e,n,t,r,o,i],void 0!==a.ctx.listener.forwardX?(a.ctx.listener.forwardX.setTargetAtTime(e,Howler.ctx.currentTime,.1),a.ctx.listener.forwardY.setTargetAtTime(n,Howler.ctx.currentTime,.1),a.ctx.listener.forwardZ.setTargetAtTime(t,Howler.ctx.currentTime,.1),a.ctx.listener.upX.setTargetAtTime(e,Howler.ctx.currentTime,.1),a.ctx.listener.upY.setTargetAtTime(n,Howler.ctx.currentTime,.1),a.ctx.listener.upZ.setTargetAtTime(t,Howler.ctx.currentTime,.1)):a.ctx.listener.setOrientation(e,n,t,r,o,i),a)},Howl.prototype.init=function(e){return function(n){var t=this;return t._orientation=n.orientation||[1,0,0],t._stereo=n.stereo||null,t._pos=n.pos||null,t._pannerAttr={coneInnerAngle:void 0!==n.coneInnerAngle?n.coneInnerAngle:360,coneOuterAngle:void 0!==n.coneOuterAngle?n.coneOuterAngle:360,coneOuterGain:void 0!==n.coneOuterGain?n.coneOuterGain:0,distanceModel:void 0!==n.distanceModel?n.distanceModel:"inverse",maxDistance:void 0!==n.maxDistance?n.maxDistance:1e4,panningModel:void 0!==n.panningModel?n.panningModel:"HRTF",refDistance:void 0!==n.refDistance?n.refDistance:1,rolloffFactor:void 0!==n.rolloffFactor?n.rolloffFactor:1},t._onstereo=n.onstereo?[{fn:n.onstereo}]:[],t._onpos=n.onpos?[{fn:n.onpos}]:[],t._onorientation=n.onorientation?[{fn:n.onorientation}]:[],e.call(this,n)}}(Howl.prototype.init),Howl.prototype.stereo=function(n,t){var r=this;if(!r._webAudio)return r;if("loaded"!==r._state)return r._queue.push({event:"stereo",action:function(){r.stereo(n,t)}}),r;var o=void 0===Howler.ctx.createStereoPanner?"spatial":"stereo";if(void 0===t){if("number"!=typeof n)return r._stereo;r._stereo=n,r._pos=[n,0,0]}for(var i=r._getSoundIds(t),a=0;a<i.length;a++){var p=r._soundById(i[a]);if(p){if("number"!=typeof n)return p._stereo;p._stereo=n,p._pos=[n,0,0],p._node&&(p._pannerAttr.panningModel="equalpower",p._panner&&p._panner.pan||e(p,o),"spatial"===o?void 0!==p._panner.positionX?(p._panner.positionX.setValueAtTime(n,Howler.ctx.currentTime),p._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime),p._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime)):p._panner.setPosition(n,0,0):p._panner.pan.setValueAtTime(n,Howler.ctx.currentTime)),r._emit("stereo",p._id)}}return r},Howl.prototype.pos=function(n,t,r,o){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"pos",action:function(){i.pos(n,t,r,o)}}),i;if(t="number"!=typeof t?0:t,r="number"!=typeof r?-.5:r,void 0===o){if("number"!=typeof n)return i._pos;i._pos=[n,t,r]}for(var a=i._getSoundIds(o),p=0;p<a.length;p++){var s=i._soundById(a[p]);if(s){if("number"!=typeof n)return s._pos;s._pos=[n,t,r],s._node&&(s._panner&&!s._panner.pan||e(s,"spatial"),void 0!==s._panner.positionX?(s._panner.positionX.setValueAtTime(n,Howler.ctx.currentTime),s._panner.positionY.setValueAtTime(t,Howler.ctx.currentTime),s._panner.positionZ.setValueAtTime(r,Howler.ctx.currentTime)):s._panner.setOrientation(n,t,r)),i._emit("pos",s._id)}}return i},Howl.prototype.orientation=function(n,t,r,o){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"orientation",action:function(){i.orientation(n,t,r,o)}}),i;if(t="number"!=typeof t?i._orientation[1]:t,r="number"!=typeof r?i._orientation[2]:r,void 0===o){if("number"!=typeof n)return i._orientation;i._orientation=[n,t,r]}for(var a=i._getSoundIds(o),p=0;p<a.length;p++){var s=i._soundById(a[p]);if(s){if("number"!=typeof n)return s._orientation;s._orientation=[n,t,r],s._node&&(s._panner||(s._pos||(s._pos=i._pos||[0,0,-.5]),e(s,"spatial")),void 0!==s._panner.orientationX?(s._panner.orientationX.setValueAtTime(n,Howler.ctx.currentTime),s._panner.orientationY.setValueAtTime(t,Howler.ctx.currentTime),s._panner.orientationZ.setValueAtTime(r,Howler.ctx.currentTime)):s._panner.setOrientation(n,t,r)),i._emit("orientation",s._id)}}return i},Howl.prototype.pannerAttr=function(){var n,t,r,o=this,i=arguments;if(!o._webAudio)return o;if(0===i.length)return o._pannerAttr;if(1===i.length){if("object"!=typeof i[0])return r=o._soundById(parseInt(i[0],10)),r?r._pannerAttr:o._pannerAttr;n=i[0],void 0===t&&(n.pannerAttr||(n.pannerAttr={coneInnerAngle:n.coneInnerAngle,coneOuterAngle:n.coneOuterAngle,coneOuterGain:n.coneOuterGain,distanceModel:n.distanceModel,maxDistance:n.maxDistance,refDistance:n.refDistance,rolloffFactor:n.rolloffFactor,panningModel:n.panningModel}),o._pannerAttr={coneInnerAngle:void 0!==n.pannerAttr.coneInnerAngle?n.pannerAttr.coneInnerAngle:o._coneInnerAngle,coneOuterAngle:void 0!==n.pannerAttr.coneOuterAngle?n.pannerAttr.coneOuterAngle:o._coneOuterAngle,coneOuterGain:void 0!==n.pannerAttr.coneOuterGain?n.pannerAttr.coneOuterGain:o._coneOuterGain,distanceModel:void 0!==n.pannerAttr.distanceModel?n.pannerAttr.distanceModel:o._distanceModel,maxDistance:void 0!==n.pannerAttr.maxDistance?n.pannerAttr.maxDistance:o._maxDistance,refDistance:void 0!==n.pannerAttr.refDistance?n.pannerAttr.refDistance:o._refDistance,rolloffFactor:void 0!==n.pannerAttr.rolloffFactor?n.pannerAttr.rolloffFactor:o._rolloffFactor,panningModel:void 0!==n.pannerAttr.panningModel?n.pannerAttr.panningModel:o._panningModel})}else 2===i.length&&(n=i[0],t=parseInt(i[1],10));for(var a=o._getSoundIds(t),p=0;p<a.length;p++)if(r=o._soundById(a[p])){var s=r._pannerAttr;s={coneInnerAngle:void 0!==n.coneInnerAngle?n.coneInnerAngle:s.coneInnerAngle,coneOuterAngle:void 0!==n.coneOuterAngle?n.coneOuterAngle:s.coneOuterAngle,coneOuterGain:void 0!==n.coneOuterGain?n.coneOuterGain:s.coneOuterGain,distanceModel:void 0!==n.distanceModel?n.distanceModel:s.distanceModel,maxDistance:void 0!==n.maxDistance?n.maxDistance:s.maxDistance,refDistance:void 0!==n.refDistance?n.refDistance:s.refDistance,rolloffFactor:void 0!==n.rolloffFactor?n.rolloffFactor:s.rolloffFactor,panningModel:void 0!==n.panningModel?n.panningModel:s.panningModel};var c=r._panner;c?(c.coneInnerAngle=s.coneInnerAngle,c.coneOuterAngle=s.coneOuterAngle,c.coneOuterGain=s.coneOuterGain,c.distanceModel=s.distanceModel,c.maxDistance=s.maxDistance,c.refDistance=s.refDistance,c.rolloffFactor=s.rolloffFactor,c.panningModel=s.panningModel):(r._pos||(r._pos=o._pos||[0,0,-.5]),e(r,"spatial"))}return o},Sound.prototype.init=function(e){return function(){var n=this,t=n._parent;n._orientation=t._orientation,n._stereo=t._stereo,n._pos=t._pos,n._pannerAttr=t._pannerAttr,e.call(this),n._stereo?t.stereo(n._stereo):n._pos&&t.pos(n._pos[0],n._pos[1],n._pos[2],n._id)}}(Sound.prototype.init),Sound.prototype.reset=function(e){return function(){var n=this,t=n._parent;return n._orientation=t._orientation,n._stereo=t._stereo,n._pos=t._pos,n._pannerAttr=t._pannerAttr,n._stereo?t.stereo(n._stereo):n._pos?t.pos(n._pos[0],n._pos[1],n._pos[2],n._id):n._panner&&(n._panner.disconnect(0),n._panner=void 0,t._refreshBuffer(n)),e.call(this)}}(Sound.prototype.reset);var e=function(e,n){n=n||"spatial","spatial"===n?(e._panner=Howler.ctx.createPanner(),e._panner.coneInnerAngle=e._pannerAttr.coneInnerAngle,e._panner.coneOuterAngle=e._pannerAttr.coneOuterAngle,e._panner.coneOuterGain=e._pannerAttr.coneOuterGain,e._panner.distanceModel=e._pannerAttr.distanceModel,e._panner.maxDistance=e._pannerAttr.maxDistance,e._panner.refDistance=e._pannerAttr.refDistance,e._panner.rolloffFactor=e._pannerAttr.rolloffFactor,e._panner.panningModel=e._pannerAttr.panningModel,void 0!==e._panner.positionX?(e._panner.positionX.setValueAtTime(e._pos[0],Howler.ctx.currentTime),e._panner.positionY.setValueAtTime(e._pos[1],Howler.ctx.currentTime),e._panner.positionZ.setValueAtTime(e._pos[2],Howler.ctx.currentTime)):e._panner.setPosition(e._pos[0],e._pos[1],e._pos[2]),void 0!==e._panner.orientationX?(e._panner.orientationX.setValueAtTime(e._orientation[0],Howler.ctx.currentTime),e._panner.orientationY.setValueAtTime(e._orientation[1],Howler.ctx.currentTime),e._panner.orientationZ.setValueAtTime(e._orientation[2],Howler.ctx.currentTime)):e._panner.setOrientation(e._orientation[0],e._orientation[1],e._orientation[2])):(e._panner=Howler.ctx.createStereoPanner(),e._panner.pan.setValueAtTime(e._stereo,Howler.ctx.currentTime)),e._panner.connect(e._node),e._paused||e._parent.pause(e._id,!0).play(e._id,!0)}}();
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
      open: {type: 'boolean', default: true}
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
            AFRAME_UIPACK.utils.insert_immersive_video_menu({el: self.el, theme: self.data.theme, open: self.data.open});
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


var AFRAME_UIPACK = AFRAME_UIPACK || {};


AFRAME_UIPACK.constants = {
            'default_theme': "dark",
};

AFRAME_UIPACK.cache = {

};

AFRAME_UIPACK.paths = {
    click_sound: "https://cdn.dataverse.xyz/audio/click.mp3",
    hover_sound: "https://cdn.dataverse.xyz/audio/hover.mp3",
    photo_thumbnail: "https://cdn.dataverse.xyz/img/plaholder-image.png",
    video_thumbnail: "https://cdn.dataverse.xyz/img/placeholder-video.png",
    viz_thumbnail: "https://cdn.dataverse.xyz/img/placeholder-vis.png",
    loading_thumbnail_static: "https://cdn.dataverse.xyz/img/loading_static.jpg"
};

AFRAME_UIPACK.dmms = {
    'close_button': 40,
    'plus_button': 40,
    'label': 20,
    'big_label': 30,
    'sublabel': 16,
    'subtitle': 12,
    'min_text': 1,
    'map_label': 8,
    'map_attribution': 20
};

AFRAME_UIPACK.animation = {
    geo: 500,
    button: 500
};

AFRAME_UIPACK.distances = {
    close: 1.75,
    panel: 1.5
};


AFRAME_UIPACK.height = 1.6;


AFRAME_UIPACK.UIPACK_CONSTANTS = {
    button_hover: 1000,
    menu_pitch: -90,
    menu_begin_pitch: -20,
    menu_distance : 1.3,
    menu_tick_check: 1,
    offset_player : 0.30,
    offset_buttons : 0.9,
    offset_icons : 0.15,
    icon_spacing : 0.05,
    menu_player_width: 1.0,
    menu_player_height: 0.1,
    menu_player_button_radius: 0.03,
    button_spacing : 0.1,
    menu_button_width : 3.0,
    icon_path :  "themes/dark/icons/",
    button_radius : 0.05,
    button_distance : 2.9,
    button_elevation : 1.8,
    button_offset : 0.1,
    arc_color: "red",
    thumbnail_distance:3.1,
    thumbnail_elevation: 1.8,
    thumbnail_icon: "arrow-up.png",
    play_icon: "play-circle-o.png",
    pause_icon: "pause-circle-o.png",
    label_distance: 3.1,
    label_elevation: 1.8,
    label_front_gap : 0.1,
    label_width: 3.0
};

var AFRAME_UIPACK = AFRAME_UIPACK || {};

AFRAME_UIPACK.themes =
{
    'light': {
        'default_color': '#CCCCCC',
        'cursor_color': '#F91100',
        'arc_color': '#F91100',
        'icon_path': 'https://cdn.dataverse.xyz/themes/dark/icons',
        'player_background': "white",
        'player_text_color': "black",
        'player_font': '25px Roboto'
    },
    'dark': {
        'default_color': '#333333',
        'cursor_color': '#F91100',
        'arc_color': '#F91100',
        'icon_path': 'https://cdn.dataverse.xyz/themes/light/icons',
        'player_background': "#000000",
        'player_text_color': "white",
        'player_font': '25px Roboto'
    }
};




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

                var point;


                if((AFRAME.version.startsWith("0.9.")) || (parseInt(AFRAME.version.split(".")[0]) > 1)){

                    // console.log("EVENT DETAIL", event.detail);

                    point = event.detail.getIntersection(my_bar).point;

                    // console.log("EL POINT ES ", point);
                }
                else {

                    point = event.detail.intersection.point;
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
var AFRAME_UIPACK = AFRAME_UIPACK || {};

AFRAME_UIPACK.utils = {

    // Insert a 'controls' menu for a video with 'theme' and 'open' params that 'act' on 'el' DOM element (a video component)

    // Also, sets cursor based on desktop, mobile or headset

    insert_immersive_video_menu: function(options) {

        var options = options || {};

        var theme = options.theme || AFRAME_UIPACK.constants.default_theme;

        var open = ('open' in options) ? options.open : true;

        var el = options.el;

        function insert_cursor_and_menu(scene, element, theme, open) {

            var video_id = element.components["immersive-video"].video_id;

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
            insert_cursor_and_menu(scene, el, theme, open);
        }
        else {
            scene.addEventListener("renderstart", function () {
                insert_cursor_and_menu(scene, el, theme, open);
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


        AFRAME_UIPACK.cursor_mode = desktop ? "desktop" : (mobile ? "gaze" : "laser");

    }
};
