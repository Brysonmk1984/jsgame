var STATIC_URL = 'http://static.merixstudio.com/skytte/';
this.createjs = this.createjs || {};
(function() {
    "use strict";
    createjs.proxy = function(method, scope) {
        var aArgs = Array.prototype.slice.call(arguments, 2);
        return function() {
            return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    }
}());
this.createjs = this.createjs || {};
(function() {
    "use strict";
    createjs.indexOf = function(array, searchElement) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (searchElement === array[i]) {
                return i;
            }
        }
        return -1;
    }
}());
this.createjs = this.createjs || {};
(function() {
    "use strict";
    var Event = function(type, bubbles, cancelable) {
        this.initialize(type, bubbles, cancelable);
    };
    var p = Event.prototype;
    p.type = null;
    p.target = null;
    p.currentTarget = null;
    p.eventPhase = 0;
    p.bubbles = false;
    p.cancelable = false;
    p.timeStamp = 0;
    p.defaultPrevented = false;
    p.propagationStopped = false;
    p.immediatePropagationStopped = false;
    p.removed = false;
    p.initialize = function(type, bubbles, cancelable) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.timeStamp = (new Date()).getTime();
    };
    p.preventDefault = function() {
        this.defaultPrevented = true;
    };
    p.stopPropagation = function() {
        this.propagationStopped = true;
    };
    p.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = true;
    };
    p.remove = function() {
        this.removed = true;
    };
    p.clone = function() {
        return new Event(this.type, this.bubbles, this.cancelable);
    };
    p.toString = function() {
        return "[Event (type=" + this.type + ")]";
    };
    createjs.Event = Event;
}());
this.createjs = this.createjs || {};
(function() {
    "use strict";
    var EventDispatcher = function() {};
    var p = EventDispatcher.prototype;
    EventDispatcher.initialize = function(target) {
        target.addEventListener = p.addEventListener;
        target.on = p.on;
        target.removeEventListener = target.off = p.removeEventListener;
        target.removeAllEventListeners = p.removeAllEventListeners;
        target.hasEventListener = p.hasEventListener;
        target.dispatchEvent = p.dispatchEvent;
        target._dispatchEvent = p._dispatchEvent;
    };
    p._listeners = null;
    p._captureListeners = null;
    p.initialize = function() {};
    p.addEventListener = function(type, listener, useCapture) {
        var listeners;
        if (useCapture) {
            listeners = this._captureListeners = this._captureListeners || {};
        } else {
            listeners = this._listeners = this._listeners || {};
        }
        var arr = listeners[type];
        if (arr) {
            this.removeEventListener(type, listener, useCapture);
        }
        arr = listeners[type];
        if (!arr) {
            listeners[type] = [listener];
        } else {
            arr.push(listener);
        }
        return listener;
    };
    p.on = function(type, listener, scope, once, data, useCapture) {
        if (listener.handleEvent) {
            scope = scope || listener;
            listener = listener.handleEvent;
        }
        scope = scope || this;
        return this.addEventListener(type, function(evt) {
            listener.call(scope, evt, data);
            once && evt.remove();
        }, useCapture);
    };
    p.removeEventListener = function(type, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) {
            return;
        }
        var arr = listeners[type];
        if (!arr) {
            return;
        }
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == listener) {
                if (l == 1) {
                    delete(listeners[type]);
                } else {
                    arr.splice(i, 1);
                }
                break;
            }
        }
    };
    p.off = p.removeEventListener;
    p.removeAllEventListeners = function(type) {
        if (!type) {
            this._listeners = this._captureListeners = null;
        } else {
            if (this._listeners) {
                delete(this._listeners[type]);
            }
            if (this._captureListeners) {
                delete(this._captureListeners[type]);
            }
        }
    };
    p.dispatchEvent = function(eventObj, target) {
        if (typeof eventObj == "string") {
            var listeners = this._listeners;
            if (!listeners || !listeners[eventObj]) {
                return false;
            }
            eventObj = new createjs.Event(eventObj);
        }
        eventObj.target = target || this;
        if (!eventObj.bubbles || !this.parent) {
            this._dispatchEvent(eventObj, 2);
        } else {
            var top = this,
                list = [top];
            while (top.parent) {
                list.push(top = top.parent);
            }
            var i, l = list.length;
            for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
                list[i]._dispatchEvent(eventObj, 1 + (i == 0));
            }
            for (i = 1; i < l && !eventObj.propagationStopped; i++) {
                list[i]._dispatchEvent(eventObj, 3);
            }
        }
        return eventObj.defaultPrevented;
    };
    p.hasEventListener = function(type) {
        var listeners = this._listeners,
            captureListeners = this._captureListeners;
        return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
    };
    p.toString = function() {
        return "[EventDispatcher]";
    };
    p._dispatchEvent = function(eventObj, eventPhase) {
        var l, listeners = (eventPhase == 1) ? this._captureListeners : this._listeners;
        if (eventObj && listeners) {
            var arr = listeners[eventObj.type];
            if (!arr || !(l = arr.length)) {
                return;
            }
            eventObj.currentTarget = this;
            eventObj.eventPhase = eventPhase;
            eventObj.removed = false;
            arr = arr.slice();
            for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
                var o = arr[i];
                if (o.handleEvent) {
                    o.handleEvent(eventObj);
                } else {
                    o(eventObj);
                }
                if (eventObj.removed) {
                    this.off(eventObj.type, o, eventPhase == 1);
                    eventObj.removed = false;
                }
            }
        }
    };
    createjs.EventDispatcher = EventDispatcher;
}());
this.createjs = this.createjs || {};
(function() {
    "use strict";

    function Sound() {
        throw "Sound cannot be instantiated";
    }
    var s = Sound;
    s.DELIMITER = "|";
    s.AUDIO_TIMEOUT = 8000;
    s.INTERRUPT_ANY = "any";
    s.INTERRUPT_EARLY = "early";
    s.INTERRUPT_LATE = "late";
    s.INTERRUPT_NONE = "none";
    s.PLAY_INITED = "playInited";
    s.PLAY_SUCCEEDED = "playSucceeded";
    s.PLAY_INTERRUPTED = "playInterrupted";
    s.PLAY_FINISHED = "playFinished";
    s.PLAY_FAILED = "playFailed";
    s.SUPPORTED_EXTENSIONS = ["mp3", "ogg", "mpeg", "wav", "m4a", "mp4", "aiff", "wma", "mid"];
    s.EXTENSION_MAP = {
        m4a: "mp4"
    };
    s.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/;
    s.defaultInterruptBehavior = s.INTERRUPT_NONE;
    s.lastId = 0;
    s.activePlugin = null;
    s.pluginsRegistered = false;
    s.masterVolume = 1;
    s.masterMute = false;
    s.instances = [];
    s.idHash = {};
    s.preloadHash = {};
    s.defaultSoundInstance = null;
    s.addEventListener = null;
    s.removeEventListener = null;
    s.removeAllEventListeners = null;
    s.dispatchEvent = null;
    s.hasEventListener = null;
    s._listeners = null;
    createjs.EventDispatcher.initialize(s);
    s.sendFileLoadEvent = function(src) {
        if (!s.preloadHash[src]) {
            return;
        }
        for (var i = 0, l = s.preloadHash[src].length; i < l; i++) {
            var item = s.preloadHash[src][i];
            s.preloadHash[src][i] = true;
            if (!s.hasEventListener("fileload")) {
                continue;
            }
            var event = new createjs.Event("fileload");
            event.src = item.src, event.id = item.id, event.data = item.data
            s.dispatchEvent(event);
        }
    }
    s.getPreloadHandlers = function() {
        return {
            callback: createjs.proxy(s.initLoad, s),
            types: ["sound"],
            extensions: s.SUPPORTED_EXTENSIONS
        };
    }
    s.registerPlugin = function(plugin) {
        s.pluginsRegistered = true;
        if (plugin == null) {
            return false;
        }
        if (plugin.isSupported()) {
            s.activePlugin = new plugin();
            return true;
        }
        return false;
    }
    s.registerPlugins = function(plugins) {
        for (var i = 0, l = plugins.length; i < l; i++) {
            var plugin = plugins[i];
            if (s.registerPlugin(plugin)) {
                return true;
            }
        }
        return false;
    }
    s.initializeDefaultPlugins = function() {
        if (s.activePlugin != null) {
            return true;
        }
        if (s.pluginsRegistered) {
            return false;
        }
        if (s.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin])) {
            return true;
        }
        return false;
    }
    s.isReady = function() {
        return (s.activePlugin != null);
    }
    s.getCapabilities = function() {
        if (s.activePlugin == null) {
            return null;
        }
        return s.activePlugin.capabilities;
    }
    s.getCapability = function(key) {
        if (s.activePlugin == null) {
            return null;
        }
        return s.activePlugin.capabilities[key];
    }
    s.initLoad = function(src, type, id, data, basePath) {
        var details = s.registerSound(src, id, data, false, basePath);
        if (details == null) {
            return false;
        }
        return details;
    }
    s.registerSound = function(src, id, data, preload, basePath) {
        if (!s.initializeDefaultPlugins()) {
            return false;
        }
        if (src instanceof Object) {
            basePath = id;
            id = src.id;
            data = src.data;
            src = src.src;
        }
        var details = s.parsePath(src, "sound", id, data);
        if (details == null) {
            return false;
        }
        if (id != null) {
            s.idHash[id] = details.src;
        }
        var numChannels = null;
        if (data != null) {
            if (!isNaN(data.channels)) {
                numChannels = parseInt(data.channels);
            } else if (!isNaN(data)) {
                numChannels = parseInt(data);
            }
        }
        var loader = s.activePlugin.register(details.src, numChannels);
        if (loader != null) {
            if (loader.numChannels != null) {
                numChannels = loader.numChannels;
            }
            SoundChannel.create(details.src, numChannels);
            if (data == null || !isNaN(data)) {
                data = details.data = numChannels || SoundChannel.maxPerChannel();
            } else {
                data.channels = details.data.channels = numChannels || SoundChannel.maxPerChannel();
            }
            if (loader.tag != null) {
                details.tag = loader.tag;
            } else if (loader.src) {
                details.src = loader.src;
            }
            if (loader.completeHandler != null) {
                details.completeHandler = loader.completeHandler;
            }
            if (loader.type) {
                details.type = loader.type;
            }
        }
        if (preload != false) {
            if (!s.preloadHash[details.src]) {
                s.preloadHash[details.src] = [];
            }
            s.preloadHash[details.src].push({
                src: src,
                id: id,
                data: data
            });
            if (s.preloadHash[details.src].length == 1) {
                if (basePath == null) {
                    basePath = "";
                }
                s.activePlugin.preload(details.src, loader, basePath);
            } else {
                if (s.preloadHash[details.src][0] == true) {
                    return true;
                }
            }
        }
        return details;
    }
    s.registerManifest = function(manifest, basePath) {
        var returnValues = [];
        for (var i = 0, l = manifest.length; i < l; i++) {
            returnValues[i] = createjs.Sound.registerSound(manifest[i].src, manifest[i].id, manifest[i].data, manifest[i].preload, basePath);
        }
        return returnValues;
    }
    s.removeSound = function(src) {
        if (s.activePlugin == null) {
            return false;
        }
        if (src instanceof Object) {
            src = src.src;
        }
        src = s.getSrcById(src);
        var details = s.parsePath(src);
        if (details == null) {
            return false;
        }
        src = details.src;
        for (var prop in s.idHash) {
            if (s.idHash[prop] == src) {
                delete(s.idHash[prop]);
            }
        }
        SoundChannel.removeSrc(src);
        delete(s.preloadHash[src]);
        s.activePlugin.removeSound(src);
        return true;
    }
    s.removeManifest = function(manifest) {
        var returnValues = [];
        for (var i = 0, l = manifest.length; i < l; i++) {
            returnValues[i] = createjs.Sound.removeSound(manifest[i].src);
        }
        return returnValues;
    }
    s.removeAllSounds = function() {
        s.idHash = {};
        s.preloadHash = {};
        SoundChannel.removeAll();
        s.activePlugin.removeAllSounds();
    }
    s.loadComplete = function(src) {
        var details = s.parsePath(src, "sound");
        if (details) {
            src = s.getSrcById(details.src);
        } else {
            src = s.getSrcById(src);
        }
        return (s.preloadHash[src][0] == true);
    }
    s.parsePath = function(value, type, id, data) {
        if (typeof(value) != "string") {
            value = value.toString();
        }
        var sounds = value.split(s.DELIMITER);
        var ret = {
            type: type || "sound",
            id: id,
            data: data
        };
        var c = s.getCapabilities();
        for (var i = 0, l = sounds.length; i < l; i++) {
            var sound = sounds[i];
            var match = sound.match(s.FILE_PATTERN);
            if (match == null) {
                return false;
            }
            var name = match[4];
            var ext = match[5];
            if (c[ext] && createjs.indexOf(s.SUPPORTED_EXTENSIONS, ext) > -1) {
                ret.name = name;
                ret.src = sound;
                ret.extension = ext;
                return ret;
            }
        }
        return null;
    }
    s.play = function(src, interrupt, delay, offset, loop, volume, pan) {
        var instance = s.createInstance(src);
        var ok = s.playInstance(instance, interrupt, delay, offset, loop, volume, pan);
        if (!ok) {
            instance.playFailed();
        }
        return instance;
    }
    s.createInstance = function(src) {
        if (!s.initializeDefaultPlugins()) {
            return s.defaultSoundInstance;
        }
        src = s.getSrcById(src);
        var details = s.parsePath(src, "sound");
        var instance = null;
        if (details != null && details.src != null) {
            SoundChannel.create(details.src);
            instance = s.activePlugin.create(details.src);
        } else {
            instance = Sound.defaultSoundInstance;
        }
        instance.uniqueId = s.lastId++;
        return instance;
    }
    s.setVolume = function(value) {
        if (Number(value) == null) {
            return false;
        }
        value = Math.max(0, Math.min(1, value));
        s.masterVolume = value;
        if (!this.activePlugin || !this.activePlugin.setVolume || !this.activePlugin.setVolume(value)) {
            var instances = this.instances;
            for (var i = 0, l = instances.length; i < l; i++) {
                instances[i].setMasterVolume(value);
            }
        }
    }
    s.getVolume = function() {
        return s.masterVolume;
    }
    s.setMute = function(value) {
        if (value == null || value == undefined) {
            return false;
        }
        this.masterMute = value;
        if (!this.activePlugin || !this.activePlugin.setMute || !this.activePlugin.setMute(value)) {
            var instances = this.instances;
            for (var i = 0, l = instances.length; i < l; i++) {
                instances[i].setMasterMute(value);
            }
        }
        return true;
    }
    s.getMute = function() {
        return this.masterMute;
    }
    s.stop = function() {
        var instances = this.instances;
        for (var i = instances.length; i--;) {
            instances[i].stop();
        }
    }
    s.playInstance = function(instance, interrupt, delay, offset, loop, volume, pan) {
        if (interrupt instanceof Object) {
            delay = interrupt.delay;
            offset = interrupt.offset;
            loop = interrupt.loop;
            volume = interrupt.volume;
            pan = interrupt.pan;
        }
        interrupt = interrupt || s.defaultInterruptBehavior;
        if (delay == null) {
            delay = 0;
        }
        if (offset == null) {
            offset = instance.getPosition();
        }
        if (loop == null) {
            loop = 0;
        }
        if (volume == null) {
            volume = instance.volume;
        }
        if (pan == null) {
            pan = instance.pan;
        }
        if (delay == 0) {
            var ok = s.beginPlaying(instance, interrupt, offset, loop, volume, pan);
            if (!ok) {
                return false;
            }
        } else {
            var delayTimeoutId = setTimeout(function() {
                s.beginPlaying(instance, interrupt, offset, loop, volume, pan);
            }, delay);
            instance.delayTimeoutId = delayTimeoutId;
        }
        this.instances.push(instance);
        return true;
    }
    s.beginPlaying = function(instance, interrupt, offset, loop, volume, pan) {
        if (!SoundChannel.add(instance, interrupt)) {
            return false;
        }
        var result = instance.beginPlaying(offset, loop, volume, pan);
        if (!result) {
            var index = createjs.indexOf(this.instances, instance);
            if (index > -1) {
                this.instances.splice(index, 1);
            }
            return false;
        }
        return true;
    }
    s.getSrcById = function(value) {
        if (s.idHash == null || s.idHash[value] == null) {
            return value;
        }
        return s.idHash[value];
    }
    s.playFinished = function(instance) {
        SoundChannel.remove(instance);
        var index = createjs.indexOf(this.instances, instance);
        if (index > -1) {
            this.instances.splice(index, 1);
        }
    }
    createjs.Sound = Sound;

    function SoundChannel(src, max) {
        this.init(src, max);
    }
    SoundChannel.channels = {};
    SoundChannel.create = function(src, max) {
        var channel = SoundChannel.get(src);
        if (channel == null) {
            SoundChannel.channels[src] = new SoundChannel(src, max);
            return true;
        }
        return false;
    }
    SoundChannel.removeSrc = function(src) {
        var channel = SoundChannel.get(src);
        if (channel == null) {
            return false;
        }
        channel.removeAll();
        delete(SoundChannel.channels[src]);
        return true;
    }
    SoundChannel.removeAll = function() {
        for (var channel in SoundChannel.channels) {
            SoundChannel.channels[channel].removeAll();
        }
        SoundChannel.channels = {};
    }
    SoundChannel.add = function(instance, interrupt) {
        var channel = SoundChannel.get(instance.src);
        if (channel == null) {
            return false;
        }
        return channel.add(instance, interrupt);
    }
    SoundChannel.remove = function(instance) {
        var channel = SoundChannel.get(instance.src);
        if (channel == null) {
            return false;
        }
        channel.remove(instance);
        return true;
    }
    SoundChannel.maxPerChannel = function() {
        return p.maxDefault;
    }
    SoundChannel.get = function(src) {
        return SoundChannel.channels[src];
    }
    var p = SoundChannel.prototype;
    p.src = null;
    p.max = null;
    p.maxDefault = 100;
    p.length = 0;
    p.init = function(src, max) {
        this.src = src;
        this.max = max || this.maxDefault;
        if (this.max == -1) {
            this.max == this.maxDefault;
        }
        this.instances = [];
    };
    p.get = function(index) {
        return this.instances[index];
    };
    p.add = function(instance, interrupt) {
        if (!this.getSlot(interrupt, instance)) {
            return false;
        }
        this.instances.push(instance);
        this.length++;
        return true;
    };
    p.remove = function(instance) {
        var index = createjs.indexOf(this.instances, instance);
        if (index == -1) {
            return false;
        }
        this.instances.splice(index, 1);
        this.length--;
        return true;
    };
    p.removeAll = function() {
        for (var i = this.length - 1; i >= 0; i--) {
            this.instances[i].stop();
        }
    };
    p.getSlot = function(interrupt, instance) {
        var target, replacement;
        for (var i = 0, l = this.max; i < l; i++) {
            target = this.get(i);
            if (target == null) {
                return true;
            } else if (interrupt == Sound.INTERRUPT_NONE && target.playState != Sound.PLAY_FINISHED) {
                continue;
            }
            if (i == 0) {
                replacement = target;
                continue;
            }
            if (target.playState == Sound.PLAY_FINISHED || target.playState == Sound.PLAY_INTERRUPTED || target.playState == Sound.PLAY_FAILED) {
                replacement = target;
            } else if ((interrupt == Sound.INTERRUPT_EARLY && target.getPosition() < replacement.getPosition()) || (interrupt == Sound.INTERRUPT_LATE && target.getPosition() > replacement.getPosition())) {
                replacement = target;
            }
        }
        if (replacement != null) {
            replacement.interrupt();
            this.remove(replacement);
            return true;
        }
        return false;
    };
    p.toString = function() {
        return "[Sound SoundChannel]";
    };

    function SoundInstance() {
        this.isDefault = true;
        this.addEventListener = this.removeEventListener = this.removeAllEventListener = this.dispatchEvent = this.hasEventListener = this._listeners = this.interrupt = this.playFailed = this.pause = this.resume = this.play = this.beginPlaying = this.cleanUp = this.stop = this.setMasterVolume = this.setVolume = this.mute = this.setMute = this.getMute = this.setPan = this.getPosition = this.setPosition = function() {
            return false;
        };
        this.getVolume = this.getPan = this.getDuration = function() {
            return 0;
        }
        this.playState = Sound.PLAY_FAILED;
        this.toString = function() {
            return "[Sound Default Sound Instance]";
        }
    }
    Sound.defaultSoundInstance = new SoundInstance();
    if (createjs.proxy == null) {
        createjs.proxy = function() {
            throw ("Proxy has been moved to an external file, and must be included separately.");
        }
    }

    function BrowserDetect() {}
    BrowserDetect.init = function() {
        var agent = window.navigator.userAgent;
        BrowserDetect.isFirefox = (agent.indexOf("Firefox") > -1);
        BrowserDetect.isOpera = (window.opera != null);
        BrowserDetect.isChrome = (agent.indexOf("Chrome") > -1);
        BrowserDetect.isIOS = agent.indexOf("iPod") > -1 || agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1;
        BrowserDetect.isAndroid = (agent.indexOf("Android") > -1);
        BrowserDetect.isBlackberry = (agent.indexOf("Blackberry") > -1);
    }
    BrowserDetect.init();
    createjs.Sound.BrowserDetect = BrowserDetect;
}());
this.createjs = this.createjs || {};
(function() {
    "use strict";

    function WebAudioPlugin() {
        this.init();
    }
    var s = WebAudioPlugin;
    s.capabilities = null;
    s.isSupported = function() {
        var isMobilePhoneGap = createjs.Sound.BrowserDetect.isIOS || createjs.Sound.BrowserDetect.isAndroid || createjs.Sound.BrowserDetect.isBlackberry;
        if (location.protocol == "file:" && !isMobilePhoneGap && !this.isFileXHRSupported()) {
            return false;
        }
        s.generateCapabilities();
        if (s.context == null) {
            return false;
        }
        return true;
    };
    s.isFileXHRSupported = function() {
        var supported = true;
        var xhr = new XMLHttpRequest();
        try {
            xhr.open("GET", "fail.fail", false);
        } catch (error) {
            supported = false;
            return supported;
        }
        xhr.onerror = function() {
            supported = false;
        };
        xhr.onload = function() {
            supported = this.status == 404 || (this.status == 200 || (this.status == 0 && this.response != ""));
        };
        try {
            xhr.send();
        } catch (error) {
            supported = false;
        }
        return supported;
    }
    s.generateCapabilities = function() {
        if (s.capabilities != null) {
            return;
        }
        var t = document.createElement("audio");
        if (t.canPlayType == null) {
            return null;
        }
        if (window.webkitAudioContext) {
            s.context = new webkitAudioContext();
        } else if (window.AudioContext) {
            s.context = new AudioContext();
        } else {
            return null;
        }
        s.compatibilitySetUp();
        s.playEmptySound();
        s.capabilities = {
            panning: true,
            volume: true,
            tracks: -1
        };
        var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
        var extensionMap = createjs.Sound.EXTENSION_MAP;
        for (var i = 0, l = supportedExtensions.length; i < l; i++) {
            var ext = supportedExtensions[i];
            var playType = extensionMap[ext] || ext;
            s.capabilities[ext] = (t.canPlayType("audio/" + ext) != "no" && t.canPlayType("audio/" + ext) != "") || (t.canPlayType("audio/" + playType) != "no" && t.canPlayType("audio/" + playType) != "");
        }
        if (s.context.destination.numberOfChannels < 2) {
            s.capabilities.panning = false;
        }
        s.dynamicsCompressorNode = s.context.createDynamicsCompressor();
        s.dynamicsCompressorNode.connect(s.context.destination);
        s.gainNode = s.context.createGain();
        s.gainNode.connect(s.dynamicsCompressorNode);
    };
    s.compatibilitySetUp = function() {
        if (s.context.createGain) {
            return;
        }
        s.context.createGain = s.context.createGainNode;
        var audioNode = s.context.createBufferSource();
        audioNode.__proto__.start = audioNode.__proto__.noteGrainOn;
        audioNode.__proto__.stop = audioNode.__proto__.noteOff;
        this.panningModel = 0;
    }
    s.playEmptySound = function() {
        var buffer = this.context.createBuffer(1, 1, 22050);
        var source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0, 0, 0);
    };
    var p = WebAudioPlugin.prototype;
    p.capabilities = null;
    p.volume = 1;
    p.context = null;
    p.panningModel = "equalpower";
    p.dynamicsCompressorNode = null;
    p.gainNode = null;
    p.arrayBuffers = null;
    p.init = function() {
        this.capabilities = s.capabilities;
        this.arrayBuffers = {};
        this.context = s.context;
        this.gainNode = s.gainNode;
        this.dynamicsCompressorNode = s.dynamicsCompressorNode;
    };
    p.register = function(src, instances) {
        this.arrayBuffers[src] = true;
        var tag = new createjs.WebAudioPlugin.Loader(src, this);
        return {
            tag: tag
        };
    };
    p.isPreloadStarted = function(src) {
        return (this.arrayBuffers[src] != null);
    };
    p.isPreloadComplete = function(src) {
        return (!(this.arrayBuffers[src] == null || this.arrayBuffers[src] == true));
    };
    p.removeFromPreload = function(src) {
        delete(this.arrayBuffers[src]);
    };
    p.removeSound = function(src) {
        delete(this.arrayBuffers[src]);
    };
    p.removeAllSounds = function() {
        this.arrayBuffers = {};
    };
    p.addPreloadResults = function(src, result) {
        this.arrayBuffers[src] = result;
    };
    p.handlePreloadComplete = function() {
        createjs.Sound.sendFileLoadEvent(this.src);
    };
    p.preload = function(src, instance, basePath) {
        this.arrayBuffers[src] = true;
        var loader = new createjs.WebAudioPlugin.Loader(src, this);
        loader.onload = this.handlePreloadComplete;
        if (basePath != null) {
            loader.src = basePath + loader.src;
        }
        loader.load();
    };
    p.create = function(src) {
        if (!this.isPreloadStarted(src)) {
            this.preload(src);
        }
        return new createjs.WebAudioPlugin.SoundInstance(src, this);
    };
    p.setVolume = function(value) {
        this.volume = value;
        this.updateVolume();
        return true;
    };
    p.updateVolume = function() {
        var newVolume = createjs.Sound.masterMute ? 0 : this.volume;
        if (newVolume != this.gainNode.gain.value) {
            this.gainNode.gain.value = newVolume;
        }
    };
    p.getVolume = function() {
        return this.volume;
    };
    p.setMute = function(value) {
        this.updateVolume();
        return true;
    };
    p.toString = function() {
        return "[WebAudioPlugin]";
    };
    createjs.WebAudioPlugin = WebAudioPlugin;
}());
(function() {
    "use strict";

    function SoundInstance(src, owner) {
        this.init(src, owner);
    }
    var p = SoundInstance.prototype;
    p.src = null;
    p.uniqueId = -1;
    p.playState = null;
    p.owner = null;
    p.offset = 0;
    p.delay = 0;
    p._volume = 1;
    Object.defineProperty(p, "volume", {
        get: function() {
            return this._volume;
        },
        set: function(value) {
            if (Number(value) == null) {
                return false
            }
            value = Math.max(0, Math.min(1, value));
            this._volume = value;
            this.updateVolume();
        }
    });
    p._pan = 0;
    Object.defineProperty(p, "pan", {
        get: function() {
            return this._pan;
        },
        set: function(value) {
            if (!this.owner.capabilities.panning || Number(value) == null) {
                return false;
            }
            value = Math.max(-1, Math.min(1, value));
            this._pan = value;
            this.panNode.setPosition(value, 0, -0.5);
        }
    });
    p.duration = 0;
    p.remainingLoops = 0;
    p.delayTimeoutId = null;
    p.soundCompleteTimeout = null;
    p.panNode = null;
    p.gainNode = null;
    p.sourceNode = null;
    p.sourceNodeNext = null;
    p.muted = false;
    p.paused = false;
    p.startTime = 0;
    p.addEventListener = null;
    p.removeEventListener = null;
    p.removeAllEventListeners = null;
    p.dispatchEvent = null;
    p.hasEventListener = null;
    p._listeners = null;
    p.endedHandler = null;
    p.readyHandler = null;
    p.stalledHandler = null;
    p.sendEvent = function(type) {
        var event = new createjs.Event(type);
        this.dispatchEvent(event);
    };
    p.init = function(src, owner) {
        this.owner = owner;
        this.src = src;
        this.panNode = this.owner.context.createPanner();
        this.panNode.panningModel = this.owner.panningModel;
        this.gainNode = this.owner.context.createGain();
        this.gainNode.connect(this.panNode);
        if (this.owner.isPreloadComplete(this.src)) {
            this.duration = this.owner.arrayBuffers[this.src].duration * 1000;
        }
        this.endedHandler = createjs.proxy(this.handleSoundComplete, this);
        this.readyHandler = createjs.proxy(this.handleSoundReady, this);
        this.stalledHandler = createjs.proxy(this.handleSoundStalled, this);
    };
    p.cleanUp = function() {
        if (this.sourceNode && this.sourceNode.playbackState != this.sourceNode.UNSCHEDULED_STATE) {
            this.sourceNode = this.cleanUpAudioNode(this.sourceNode);
            this.sourceNodeNext = this.cleanUpAudioNode(this.sourceNodeNext);
        }
        if (this.panNode.numberOfOutputs != 0) {
            this.panNode.disconnect(0);
        }
        clearTimeout(this.delayTimeoutId);
        clearTimeout(this.soundCompleteTimeout);
        this.startTime = 0;
        if (window.createjs == null) {
            return;
        }
        createjs.Sound.playFinished(this);
    };
    p.cleanUpAudioNode = function(audioNode) {
        if (audioNode) {
            audioNode.stop(0);
            audioNode.disconnect(this.gainNode);
            audioNode = null;
        }
        return audioNode;
    };
    p.interrupt = function() {
        this.playState = createjs.Sound.PLAY_INTERRUPTED;
        this.cleanUp();
        this.paused = false;
        this.sendEvent("interrupted");
    };
    p.handleSoundStalled = function(event) {
        this.sendEvent("failed");
    };
    p.handleSoundReady = function(event) {
        if (window.createjs == null) {
            return;
        }
        if ((this.offset * 1000) > this.getDuration()) {
            this.playFailed();
            return;
        } else if (this.offset < 0) {
            this.offset = 0;
        }
        this.playState = createjs.Sound.PLAY_SUCCEEDED;
        this.paused = false;
        this.panNode.connect(this.owner.gainNode);
        var dur = this.owner.arrayBuffers[this.src].duration;
        this.sourceNode = this.createAndPlayAudioNode((this.owner.context.currentTime - dur), this.offset);
        this.duration = dur * 1000;
        this.startTime = this.sourceNode.startTime - this.offset;
        this.soundCompleteTimeout = setTimeout(this.endedHandler, (dur - this.offset) * 1000);
        if (this.remainingLoops != 0) {
            this.sourceNodeNext = this.createAndPlayAudioNode(this.startTime, 0);
        }
    };
    p.createAndPlayAudioNode = function(startTime, offset) {
        var audioNode = this.owner.context.createBufferSource();
        audioNode.buffer = this.owner.arrayBuffers[this.src];
        audioNode.connect(this.gainNode);
        var currentTime = this.owner.context.currentTime;
        audioNode.startTime = startTime + audioNode.buffer.duration;
        audioNode.start(audioNode.startTime, offset, audioNode.buffer.duration - offset);
        return audioNode;
    };
    p.play = function(interrupt, delay, offset, loop, volume, pan) {
        this.cleanUp();
        createjs.Sound.playInstance(this, interrupt, delay, offset, loop, volume, pan);
    };
    p.beginPlaying = function(offset, loop, volume, pan) {
        if (window.createjs == null) {
            return;
        }
        if (!this.src) {
            return;
        }
        this.offset = offset / 1000;
        this.remainingLoops = loop;
        this.volume = volume;
        this.pan = pan;
        if (this.owner.isPreloadComplete(this.src)) {
            this.handleSoundReady(null);
            this.sendEvent("succeeded");
            return 1;
        } else {
            this.playFailed();
            return;
        }
    };
    p.pause = function() {
        if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED) {
            this.paused = true;
            this.offset = this.owner.context.currentTime - this.startTime;
            this.cleanUpAudioNode(this.sourceNode);
            this.cleanUpAudioNode(this.sourceNodeNext);
            if (this.panNode.numberOfOutputs != 0) {
                this.panNode.disconnect();
            }
            clearTimeout(this.delayTimeoutId);
            clearTimeout(this.soundCompleteTimeout);
            return true;
        }
        return false;
    };
    p.resume = function() {
        if (!this.paused) {
            return false;
        }
        this.handleSoundReady(null);
        return true;
    };
    p.stop = function() {
        this.playState = createjs.Sound.PLAY_FINISHED;
        this.cleanUp();
        this.offset = 0;
        return true;
    };
    p.setVolume = function(value) {
        this.volume = value;
        return true;
    };
    p.updateVolume = function() {
        var newVolume = this.muted ? 0 : this._volume;
        if (newVolume != this.gainNode.gain.value) {
            this.gainNode.gain.value = newVolume;
            return true;
        }
        return false;
    };
    p.getVolume = function() {
        return this.volume;
    };
    p.setMute = function(value) {
        if (value == null || value == undefined) {
            return false;
        }
        this.muted = value;
        this.updateVolume();
        return true;
    };
    p.getMute = function() {
        return this.muted;
    };
    p.setPan = function(value) {
        this.pan = value;
        if (this.pan != value) {
            return false;
        }
    };
    p.getPan = function() {
        return this.pan;
    };
    p.getPosition = function() {
        if (this.paused || this.sourceNode == null) {
            var pos = this.offset;
        } else {
            var pos = this.owner.context.currentTime - this.startTime;
        }
        return pos * 1000;
    };
    p.setPosition = function(value) {
        this.offset = value / 1000;
        if (this.sourceNode && this.sourceNode.playbackState != this.sourceNode.UNSCHEDULED_STATE) {
            this.cleanUpAudioNode(this.sourceNode);
            this.cleanUpAudioNode(this.sourceNodeNext);
            clearTimeout(this.soundCompleteTimeout);
        }
        if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED) {
            this.handleSoundReady(null);
        }
        return true;
    };
    p.getDuration = function() {
        return this.duration;
    };
    p.handleSoundComplete = function(event) {
        this.offset = 0;
        if (this.remainingLoops != 0) {
            this.remainingLoops--;
            if (this.sourceNodeNext) {
                this.cleanUpAudioNode(this.sourceNode);
                this.sourceNode = this.sourceNodeNext;
                this.startTime = this.sourceNode.startTime;
                this.sourceNodeNext = this.createAndPlayAudioNode(this.startTime, 0);
                this.soundCompleteTimeout = setTimeout(this.endedHandler, this.duration);
            } else {
                this.handleSoundReady(null);
            }
            this.sendEvent("loop");
            return;
        }
        if (window.createjs == null) {
            return;
        }
        this.playState = createjs.Sound.PLAY_FINISHED;
        this.cleanUp();
        this.sendEvent("complete");
    };
    p.playFailed = function() {
        if (window.createjs == null) {
            return;
        }
        this.playState = createjs.Sound.PLAY_FAILED;
        this.cleanUp();
        this.sendEvent("failed");
    };
    p.toString = function() {
        return "[WebAudioPlugin SoundInstance]";
    };
    createjs.EventDispatcher.initialize(SoundInstance.prototype);
    createjs.WebAudioPlugin.SoundInstance = SoundInstance;
}());
(function() {
    "use strict";

    function Loader(src, owner) {
        this.init(src, owner);
    }
    var p = Loader.prototype;
    p.request = null;
    p.owner = null;
    p.progress = -1;
    p.src = null;
    p.originalSrc = null;
    p.result = null;
    p.onload = null;
    p.onprogress = null;
    p.onError = null;
    p.init = function(src, owner) {
        this.src = src;
        this.originalSrc = src;
        this.owner = owner;
    };
    p.load = function(src) {
        if (src != null) {
            this.src = src;
        }
        this.request = new XMLHttpRequest();
        this.request.open("GET", this.src, true);
        this.request.responseType = "arraybuffer";
        this.request.onload = createjs.proxy(this.handleLoad, this);
        this.request.onError = createjs.proxy(this.handleError, this);
        this.request.onprogress = createjs.proxy(this.handleProgress, this);
        this.request.send();
    };
    p.handleProgress = function(loaded, total) {
        this.progress = loaded / total;
        this.onprogress != null && this.onprogress({
            loaded: loaded,
            total: total,
            progress: this.progress
        });
    };
    p.handleLoad = function() {
        this.owner.context.decodeAudioData(this.request.response, createjs.proxy(this.handleAudioDecoded, this), createjs.proxy(this.handleError, this));
    };
    p.handleAudioDecoded = function(decodedAudio) {
        this.progress = 1;
        this.result = decodedAudio;
        this.src = this.originalSrc;
        this.owner.addPreloadResults(this.src, this.result);
        this.onload && this.onload();
    };
    p.handleError = function(evt) {
        this.owner.removeSound(this.src);
        this.onerror && this.onerror(evt);
    };
    p.toString = function() {
        return "[WebAudioPlugin Loader]";
    };
    createjs.WebAudioPlugin.Loader = Loader;
}());
this.createjs = this.createjs || {};
(function() {
    "use strict";

    function HTMLAudioPlugin() {
        this.init();
    }
    var s = HTMLAudioPlugin;
    s.MAX_INSTANCES = 30;
    s.capabilities = null;
    s.AUDIO_READY = "canplaythrough";
    s.AUDIO_ENDED = "ended";
    s.AUDIO_SEEKED = "seeked";
    s.AUDIO_ERROR = "error";
    s.AUDIO_STALLED = "stalled";
    s.enableIOS = false;
    s.isSupported = function() {
        if (createjs.Sound.BrowserDetect.isIOS && !s.enableIOS) {
            return false;
        }
        s.generateCapabilities();
        var t = s.tag;
        if (t == null || s.capabilities == null) {
            return false;
        }
        return true;
    };
    s.generateCapabilities = function() {
        if (s.capabilities != null) {
            return;
        }
        var t = s.tag = document.createElement("audio");
        if (t.canPlayType == null) {
            return null;
        }
        s.capabilities = {
            panning: true,
            volume: true,
            tracks: -1
        };
        var supportedExtensions = createjs.Sound.SUPPORTED_EXTENSIONS;
        var extensionMap = createjs.Sound.EXTENSION_MAP;
        for (var i = 0, l = supportedExtensions.length; i < l; i++) {
            var ext = supportedExtensions[i];
            var playType = extensionMap[ext] || ext;
            s.capabilities[ext] = (t.canPlayType("audio/" + ext) != "no" && t.canPlayType("audio/" + ext) != "") || (t.canPlayType("audio/" + playType) != "no" && t.canPlayType("audio/" + playType) != "");
        }
    }
    var p = HTMLAudioPlugin.prototype;
    p.capabilities = null;
    p.audioSources = null;
    p.defaultNumChannels = 2;
    p.loadedHandler = null;
    p.init = function() {
        this.capabilities = s.capabilities;
        this.audioSources = {};
    };
    p.register = function(src, instances) {
        this.audioSources[src] = true;
        var channel = createjs.HTMLAudioPlugin.TagPool.get(src);
        var tag = null;
        var l = instances || this.defaultNumChannels;
        for (var i = 0; i < l; i++) {
            tag = this.createTag(src);
            channel.add(tag);
        }
        tag.id = src;
        this.loadedHandler = createjs.proxy(this.handleTagLoad, this);
        tag.addEventListener && tag.addEventListener("canplaythrough", this.loadedHandler);
        if (tag.onreadystatechange == null) {
            tag.onreadystatechange = this.loadedHandler;
        } else {
            var f = tag.onreadystatechange;
            tag.onreadystatechange = function() {
                f();
                this.loadedHandler();
            }
        }
        return {
            tag: tag,
            numChannels: l
        };
    };
    p.handleTagLoad = function(event) {
        event.target.removeEventListener && event.target.removeEventListener("canplaythrough", this.loadedHandler);
        event.target.onreadystatechange = null;
        if (event.target.src == event.target.id) {
            return;
        }
        createjs.HTMLAudioPlugin.TagPool.checkSrc(event.target.id);
    };
    p.createTag = function(src) {
        var tag = document.createElement("audio");
        tag.autoplay = false;
        tag.preload = "none";
        tag.src = src;
        return tag;
    };
    p.removeSound = function(src) {
        delete(this.audioSources[src]);
        createjs.HTMLAudioPlugin.TagPool.remove(src);
    };
    p.removeAllSounds = function() {
        this.audioSources = {};
        createjs.HTMLAudioPlugin.TagPool.removeAll();
    };
    p.create = function(src) {
        if (!this.isPreloadStarted(src)) {
            var channel = createjs.HTMLAudioPlugin.TagPool.get(src);
            var tag = this.createTag(src);
            tag.id = src;
            channel.add(tag);
            this.preload(src, {
                tag: tag
            });
        }
        return new createjs.HTMLAudioPlugin.SoundInstance(src, this);
    };
    p.isPreloadStarted = function(src) {
        return (this.audioSources[src] != null);
    };
    p.preload = function(src, instance, basePath) {
        this.audioSources[src] = true;
        if (basePath != null) {
            instance.tag.src = basePath + src;
        }
        new createjs.HTMLAudioPlugin.Loader(src, instance.tag);
    };
    p.toString = function() {
        return "[HTMLAudioPlugin]";
    };
    createjs.HTMLAudioPlugin = HTMLAudioPlugin;
}());
(function() {
    "use strict";

    function SoundInstance(src, owner) {
        this.init(src, owner);
    }
    var p = SoundInstance.prototype;
    p.src = null, p.uniqueId = -1;
    p.playState = null;
    p.owner = null;
    p.loaded = false;
    p.offset = 0;
    p.delay = 0;
    p._volume = 1;
    Object.defineProperty(p, "volume", {
        get: function() {
            return this._volume;
        },
        set: function(value) {
            if (Number(value) == null) {
                return;
            }
            value = Math.max(0, Math.min(1, value));
            this._volume = value;
            this.updateVolume();
        }
    });
    p.pan = 0;
    p.duration = 0;
    p.remainingLoops = 0;
    p.delayTimeoutId = null;
    p.tag = null;
    p.muted = false;
    p.paused = false;
    p.addEventListener = null;
    p.removeEventListener = null;
    p.removeAllEventListeners = null;
    p.dispatchEvent = null;
    p.hasEventListener = null;
    p._listeners = null;
    p.endedHandler = null;
    p.readyHandler = null;
    p.stalledHandler = null;
    p.loopHandler = null;
    p.init = function(src, owner) {
        this.src = src;
        this.owner = owner;
        this.endedHandler = createjs.proxy(this.handleSoundComplete, this);
        this.readyHandler = createjs.proxy(this.handleSoundReady, this);
        this.stalledHandler = createjs.proxy(this.handleSoundStalled, this);
        this.loopHandler = createjs.proxy(this.handleSoundLoop, this);
    };
    p.sendEvent = function(type) {
        var event = new createjs.Event(type);
        this.dispatchEvent(event);
    };
    p.cleanUp = function() {
        var tag = this.tag;
        if (tag != null) {
            tag.pause();
            tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED, this.endedHandler, false);
            tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, false);
            tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, false);
            try {
                tag.currentTime = 0;
            } catch (e) {}
            createjs.HTMLAudioPlugin.TagPool.setInstance(this.src, tag);
            this.tag = null;
        }
        clearTimeout(this.delayTimeoutId);
        if (window.createjs == null) {
            return;
        }
        createjs.Sound.playFinished(this);
    };
    p.interrupt = function() {
        if (this.tag == null) {
            return;
        }
        this.playState = createjs.Sound.PLAY_INTERRUPTED;
        this.cleanUp();
        this.paused = false;
        this.sendEvent("interrupted");
    };
    p.play = function(interrupt, delay, offset, loop, volume, pan) {
        this.cleanUp();
        createjs.Sound.playInstance(this, interrupt, delay, offset, loop, volume, pan);
    };
    p.beginPlaying = function(offset, loop, volume, pan) {
        if (window.createjs == null) {
            return -1;
        }
        var tag = this.tag = createjs.HTMLAudioPlugin.TagPool.getInstance(this.src);
        if (tag == null) {
            this.playFailed();
            return -1;
        }
        tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED, this.endedHandler, false);
        this.offset = offset;
        this.volume = volume;
        this.pan = pan;
        this.updateVolume();
        this.remainingLoops = loop;
        if (tag.readyState !== 4) {
            tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, false);
            tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_STALLED, this.stalledHandler, false);
            tag.preload = "auto";
            tag.load();
        } else {
            this.handleSoundReady(null);
        }
        this.sendEvent("succeeded");
        return 1;
    };
    p.handleSoundStalled = function(event) {
        this.cleanUp();
        this.sendEvent("failed");
    };
    p.handleSoundReady = function(event) {
        if (window.createjs == null) {
            return;
        }
        this.duration = this.tag.duration * 1000;
        this.playState = createjs.Sound.PLAY_SUCCEEDED;
        this.paused = false;
        this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY, this.readyHandler, false);
        if (this.offset >= this.getDuration()) {
            this.playFailed();
            return;
        } else if (this.offset > 0) {
            this.tag.currentTime = this.offset * 0.001;
        }
        if (this.remainingLoops == -1) {
            this.tag.loop = true;
        }
        if (this.remainingLoops != 0) {
            this.tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, false);
            this.tag.loop = true;
        }
        this.tag.play();
    };
    p.pause = function() {
        if (!this.paused && this.playState == createjs.Sound.PLAY_SUCCEEDED && this.tag != null) {
            this.paused = true;
            this.tag.pause();
            clearTimeout(this.delayTimeoutId);
            return true;
        }
        return false;
    };
    p.resume = function() {
        if (!this.paused || this.tag == null) {
            return false;
        }
        this.paused = false;
        this.tag.play();
        return true;
    };
    p.stop = function() {
        this.offset = 0;
        this.pause();
        this.playState = createjs.Sound.PLAY_FINISHED;
        this.cleanUp();
        return true;
    };
    p.setMasterVolume = function(value) {
        this.updateVolume();
        return true;
    };
    p.setVolume = function(value) {
        this.volume = value;
        return true;
    };
    p.updateVolume = function() {
        if (this.tag != null) {
            var newVolume = (this.muted || createjs.Sound.masterMute) ? 0 : this._volume * createjs.Sound.masterVolume;
            if (newVolume != this.tag.volume) {
                this.tag.volume = newVolume;
            }
            return true;
        } else {
            return false;
        }
    };
    p.getVolume = function(value) {
        return this.volume;
    };
    p.setMasterMute = function(isMuted) {
        this.updateVolume();
        return true;
    };
    p.setMute = function(isMuted) {
        if (isMuted == null || isMuted == undefined) {
            return false;
        }
        this.muted = isMuted;
        this.updateVolume();
        return true;
    };
    p.getMute = function() {
        return this.muted;
    };
    p.setPan = function(value) {
        return false;
    };
    p.getPan = function() {
        return 0;
    };
    p.getPosition = function() {
        if (this.tag == null) {
            return this.offset;
        }
        return this.tag.currentTime * 1000;
    };
    p.setPosition = function(value) {
        if (this.tag == null) {
            this.offset = value
        } else {
            this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, false);
            try {
                this.tag.currentTime = value * 0.001;
            } catch (error) {
                return false;
            }
            this.tag.addEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, false);
        }
        return true;
    };
    p.getDuration = function() {
        return this.duration;
    };
    p.handleSoundComplete = function(event) {
        this.offset = 0;
        if (window.createjs == null) {
            return;
        }
        this.playState = createjs.Sound.PLAY_FINISHED;
        this.cleanUp();
        this.sendEvent("complete");
    };
    p.handleSoundLoop = function(event) {
        this.offset = 0;
        this.remainingLoops--;
        if (this.remainingLoops == 0) {
            this.tag.loop = false;
            this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_SEEKED, this.loopHandler, false);
        }
        this.sendEvent("loop");
    };
    p.playFailed = function() {
        if (window.createjs == null) {
            return;
        }
        this.playState = createjs.Sound.PLAY_FAILED;
        this.cleanUp();
        this.sendEvent("failed");
    };
    p.toString = function() {
        return "[HTMLAudioPlugin SoundInstance]";
    };
    createjs.EventDispatcher.initialize(SoundInstance.prototype);
    createjs.HTMLAudioPlugin.SoundInstance = SoundInstance;
}());
(function() {
    "use strict";

    function Loader(src, tag) {
        this.init(src, tag);
    }
    var p = Loader.prototype;
    p.src = null;
    p.tag = null;
    p.preloadTimer = null;
    p.loadedHandler = null;
    p.init = function(src, tag) {
        this.src = src;
        this.tag = tag;
        this.preloadTimer = setInterval(createjs.proxy(this.preloadTick, this), 200);
        this.loadedHandler = createjs.proxy(this.sendLoadedEvent, this);
        this.tag.addEventListener && this.tag.addEventListener("canplaythrough", this.loadedHandler);
        if (this.tag.onreadystatechange == null) {
            this.tag.onreadystatechange = createjs.proxy(this.sendLoadedEvent, this);
        } else {
            var f = this.tag.onreadystatechange;
            this.tag.onreadystatechange = function() {
                f();
                this.tag.onreadystatechange = createjs.proxy(this.sendLoadedEvent, this);
            }
        }
        this.tag.preload = "auto";
        this.tag.load();
    };
    p.preloadTick = function() {
        var buffered = this.tag.buffered;
        var duration = this.tag.duration;
        if (buffered.length > 0) {
            if (buffered.end(0) >= duration - 1) {
                this.handleTagLoaded();
            }
        }
    };
    p.handleTagLoaded = function() {
        clearInterval(this.preloadTimer);
    };
    p.sendLoadedEvent = function(evt) {
        this.tag.removeEventListener && this.tag.removeEventListener("canplaythrough", this.loadedHandler);
        this.tag.onreadystatechange = null;
        createjs.Sound.sendFileLoadEvent(this.src);
    };
    p.toString = function() {
        return "[HTMLAudioPlugin Loader]";
    }
    createjs.HTMLAudioPlugin.Loader = Loader;
}());
(function() {
    "use strict";

    function TagPool(src) {
        this.init(src);
    }
    var s = TagPool;
    s.tags = {};
    s.get = function(src) {
        var channel = s.tags[src];
        if (channel == null) {
            channel = s.tags[src] = new TagPool(src);
        }
        return channel;
    }
    s.remove = function(src) {
        var channel = s.tags[src];
        if (channel == null) {
            return false;
        }
        channel.removeAll();
        delete(s.tags[src]);
        return true;
    }
    s.removeAll = function() {
        for (var channel in s.tags) {
            s.tags[channel].removeAll();
        }
        s.tags = {};
    }
    s.getInstance = function(src) {
        var channel = s.tags[src];
        if (channel == null) {
            return null;
        }
        return channel.get();
    }
    s.setInstance = function(src, tag) {
        var channel = s.tags[src];
        if (channel == null) {
            return null;
        }
        return channel.set(tag);
    }
    s.checkSrc = function(src) {
        var channel = s.tags[src];
        if (channel == null) {
            return null;
        }
        channel.checkSrcChange();
    }
    var p = TagPool.prototype;
    p.src = null;
    p.length = 0;
    p.available = 0;
    p.tags = null;
    p.init = function(src) {
        this.src = src;
        this.tags = [];
    };
    p.add = function(tag) {
        this.tags.push(tag);
        this.length++;
        this.available++;
    };
    p.removeAll = function() {
        while (this.length--) {
            delete(this.tags[this.length]);
        }
        this.src = null;
        this.tags.length = 0;
    };
    p.get = function() {
        if (this.tags.length == 0) {
            return null;
        }
        this.available = this.tags.length;
        var tag = this.tags.pop();
        if (tag.parentNode == null) {
            document.body.appendChild(tag);
        }
        return tag;
    };
    p.set = function(tag) {
        var index = createjs.indexOf(this.tags, tag);
        if (index == -1) {
            this.tags.push(tag);
        }
        this.available = this.tags.length;
    };
    p.checkSrcChange = function() {
        var i = this.tags.length - 1;
        if (i < 0)
            return;
        var newSrc = this.tags[i].src;
        while (i--) {
            this.tags[i].src = newSrc;
        }
    };
    p.toString = function() {
        return "[HTMLAudioPlugin TagPool]";
    }
    createjs.HTMLAudioPlugin.TagPool = TagPool;
}());
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(10, 15 - currTime + lastTime);
            var id = window.setTimeout(function() {
                callback();
            }, timeToCall);
            lastTime = currTime + timeToCall;
        };
}());
if (!Function.prototype.bind)
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function")
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        var aArgs = Array.prototype.slice.call(arguments, 1);
        var fToBind = this;
        var fNOP = function() {};
        var fBound = function() {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };

function define(moduleName) {
    var dependencies = [],
        moduleCode, i, args;
    if (moduleName in define.modules && moduleName !== 'settings')
        throw new ReferenceError("module '" + moduleName + "' is already defined");
    if (arguments.length === 3)
        dependencies = arguments[1];
    moduleCode = arguments[arguments.length - 1];
    if (typeof moduleCode === 'function') {
        args = [];
        for (i = 0; i < dependencies.length; i++)
            args.push(require(dependencies[i]));
        moduleCode = moduleCode.apply(this, args);
    }
    if (typeof moduleCode === 'undefined')
        throw new TypeError("module '" + moduleName + "' doesn't export any definitions");
    if (moduleName === 'settings')
        moduleName = '_settings';
    if (moduleName === 'jquery')
        jQuery.noConflict(true);
    define.modules[moduleName] = moduleCode;
}

function require(moduleName) {
    if (moduleName in define.modules)
        return define.modules[moduleName];
    throw new ReferenceError("no module named '" + moduleName + "'");
}
require.jQueryPlugins = function() {
    var jQuery = require('jquery');
    var missing = [];
    for (var i = 0; i < arguments.length; i++)
        if (typeof jQuery.fn[arguments[i]] === 'undefined' && typeof jQuery[arguments[i]] === 'undefined')
            missing.push(arguments[i]);
    if (missing.length)
        throw new ReferenceError("no jQuery plugins named '" + missing.join("', '") + "'");
};
define.amd = {
    'jQuery': true
};
define.modules = {
    'settings': function(name, fallback) {
        if (typeof define.modules._settings[name] !== 'undefined')
            return define.modules._settings[name];
        return fallback;
    },
    '_settings': {}
};
define('settings', {
    'DEBUG': false,
    'GAME_SPEED': 1.5,
    'MUSIC_VOLUME': .49,
    'PLAYER_PLASMA_VOLUME': .273,
    'PLAYER_STORM_VOLUME': .273,
    'PLAYER_RAY_VOLUME': .753,
    'PLAYER_ROCKETS_VOLUME': .333,
    'PLAYER_FLAK_VOLUME': .433,
    'PLAYER_ELECTRO_VOLUME': .383,
    'WEAPON_CHANGE_VOLUME': .5,
    'LOW_LIFE_VOLUME': 1,
    'ENEMY_LASER_VOLUME': .333,
    'ENEMY_ELECTRO_VOLUME': .333,
    'ENEMY_FLAK_VOLUME': .333,
    'POWERUP_SCORE_VOLUME': 1,
    'POWERUP_SCORE_MULTIPLIER_VOLUME': 1,
    'POWERUP_DAMAGE_MULTIPLIER_VOLUME': 1,
    'POWERUP_REPAIR_VOLUME': 1,
    'POWERUP_LIFE_VOLUME': 1,
    'POWERUP_INVINCIBILITY_VOLUME': 1,
    'POWERUP_SHIELD_UPGRADE_VOLUME': 1,
    'POWERUP_WEAPON_UPGRADE_VOLUME': 1,
    'ROCKET_EXPLODE_VOLUME': .5,
    'ROCKET_FLYING_VOLUME': .1,
    'MINE_APPROACH_VOLUME': .05,
    'SHIP_EXPLODE_VOLUME': 1,
    'SHIP_INVINCIBILITY_VOLUME': .9,
    'PLASMA_EXPLODE_VOLUME': .333,
});
(function(window, undefined) {
    var
        rootjQuery, readyList, document = window.document,
        location = window.location,
        navigator = window.navigator,
        _jQuery = window.jQuery,
        _$ = window.$,
        core_push = Array.prototype.push,
        core_slice = Array.prototype.slice,
        core_indexOf = Array.prototype.indexOf,
        core_toString = Object.prototype.toString,
        core_hasOwn = Object.prototype.hasOwnProperty,
        core_trim = String.prototype.trim,
        jQuery = function(selector, context) {
            return new jQuery.fn.init(selector, context, rootjQuery);
        },
        core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
        core_rnotwhite = /\S/,
        core_rspace = /\s+/,
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,
        fcamelCase = function(all, letter) {
            return (letter + "").toUpperCase();
        },
        DOMContentLoaded = function() {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                jQuery.ready();
            } else if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                jQuery.ready();
            }
        },
        class2type = {};
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function(selector, context, rootjQuery) {
            var match, elem, ret, doc;
            if (!selector) {
                return this;
            }
            if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }
            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [null, selector, null];
                } else {
                    match = rquickExpr.exec(selector);
                }
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        doc = (context && context.nodeType ? context.ownerDocument || context : document);
                        selector = jQuery.parseHTML(match[1], doc, true);
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            this.attr.call(selector, context, true);
                        }
                        return jQuery.merge(this, selector);
                    } else {
                        elem = document.getElementById(match[2]);
                        if (elem && elem.parentNode) {
                            if (elem.id !== match[2]) {
                                return rootjQuery.find(selector);
                            }
                            this.length = 1;
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
                } else if (!context || context.jquery) {
                    return (context || rootjQuery).find(selector);
                } else {
                    return this.constructor(context).find(selector);
                }
            } else if (jQuery.isFunction(selector)) {
                return rootjQuery.ready(selector);
            }
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            return jQuery.makeArray(selector, this);
        },
        selector: "",
        jquery: "1.8.3",
        length: 0,
        size: function() {
            return this.length;
        },
        toArray: function() {
            return core_slice.call(this);
        },
        get: function(num) {
            return num == null ? this.toArray() : (num < 0 ? this[this.length + num] : this[num]);
        },
        pushStack: function(elems, name, selector) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            ret.context = this.context;
            if (name === "find") {
                ret.selector = this.selector + (this.selector ? " " : "") + selector;
            } else if (name) {
                ret.selector = this.selector + "." + name + "(" + selector + ")";
            }
            return ret;
        },
        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },
        ready: function(fn) {
            jQuery.ready.promise().done(fn);
            return this;
        },
        eq: function(i) {
            i = +i;
            return i === -1 ? this.slice(i) : this.slice(i, i + 1);
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        slice: function() {
            return this.pushStack(core_slice.apply(this, arguments), "slice", core_slice.call(arguments).join(","));
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    jQuery.extend({
        noConflict: function(deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }
            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }
            return jQuery;
        },
        isReady: false,
        readyWait: 1,
        holdReady: function(hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },
        ready: function(wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }
            if (!document.body) {
                return setTimeout(jQuery.ready, 1);
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }
            readyList.resolveWith(document, [jQuery]);
            if (jQuery.fn.trigger) {
                jQuery(document).trigger("ready").off("ready");
            }
        },
        isFunction: function(obj) {
            return jQuery.type(obj) === "function";
        },
        isArray: Array.isArray || function(obj) {
            return jQuery.type(obj) === "array";
        },
        isWindow: function(obj) {
            return obj != null && obj == obj.window;
        },
        isNumeric: function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function(obj) {
            return obj == null ? String(obj) : class2type[core_toString.call(obj)] || "object";
        },
        isPlainObject: function(obj) {
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }
            try {
                if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in obj) {}
            return key === undefined || core_hasOwn.call(obj, key);
        },
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        error: function(msg) {
            throw new Error(msg);
        },
        parseHTML: function(data, context, scripts) {
            var parsed;
            if (!data || typeof data !== "string") {
                return null;
            }
            if (typeof context === "boolean") {
                scripts = context;
                context = 0;
            }
            context = context || document;
            if ((parsed = rsingleTag.exec(data))) {
                return [context.createElement(parsed[1])];
            }
            parsed = jQuery.buildFragment([data], context, scripts ? null : []);
            return jQuery.merge([], (parsed.cacheable ? jQuery.clone(parsed.fragment) : parsed.fragment).childNodes);
        },
        parseJSON: function(data) {
            if (!data || typeof data !== "string") {
                return null;
            }
            data = jQuery.trim(data);
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }
            if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
                return (new Function("return " + data))();
            }
            jQuery.error("Invalid JSON: " + data);
        },
        parseXML: function(data) {
            var xml, tmp;
            if (!data || typeof data !== "string") {
                return null;
            }
            try {
                if (window.DOMParser) {
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                jQuery.error("Invalid XML: " + data);
            }
            return xml;
        },
        noop: function() {},
        globalEval: function(data) {
            if (data && core_rnotwhite.test(data)) {
                (window.execScript || function(data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },
        camelCase: function(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        each: function(obj, callback, args) {
            var name, i = 0,
                length = obj.length,
                isObj = length === undefined || jQuery.isFunction(obj);
            if (args) {
                if (isObj) {
                    for (name in obj) {
                        if (callback.apply(obj[name], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(obj[i++], args) === false) {
                            break;
                        }
                    }
                }
            } else {
                if (isObj) {
                    for (name in obj) {
                        if (callback.call(obj[name], name, obj[name]) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.call(obj[i], i, obj[i++]) === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ? function(text) {
            return text == null ? "" : core_trim.call(text);
        } : function(text) {
            return text == null ? "" : (text + "").replace(rtrim, "");
        },
        makeArray: function(arr, results) {
            var type, ret = results || [];
            if (arr != null) {
                type = jQuery.type(arr);
                if (arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(arr)) {
                    core_push.call(ret, arr);
                } else {
                    jQuery.merge(ret, arr);
                }
            }
            return ret;
        },
        inArray: function(elem, arr, i) {
            var len;
            if (arr) {
                if (core_indexOf) {
                    return core_indexOf.call(arr, elem, i);
                }
                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                for (; i < len; i++) {
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }
            return -1;
        },
        merge: function(first, second) {
            var l = second.length,
                i = first.length,
                j = 0;
            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        },
        grep: function(elems, callback, inv) {
            var retVal, ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;
            for (; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }
            return ret;
        },
        map: function(elems, callback, arg) {
            var value, key, ret = [],
                i = 0,
                length = elems.length,
                isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || jQuery.isArray(elems));
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            } else {
                for (key in elems) {
                    value = callback(elems[key], key, arg);
                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }
            return ret.concat.apply([], ret);
        },
        guid: 1,
        proxy: function(fn, context) {
            var tmp, args, proxy;
            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            args = core_slice.call(arguments, 2);
            proxy = function() {
                return fn.apply(context, args.concat(core_slice.call(arguments)));
            };
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        },
        access: function(elems, fn, key, value, chainable, emptyGet, pass) {
            var exec, bulk = key == null,
                i = 0,
                length = elems.length;
            if (key && typeof key === "object") {
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], 1, emptyGet, value);
                }
                chainable = 1;
            } else if (value !== undefined) {
                exec = pass === undefined && jQuery.isFunction(value);
                if (bulk) {
                    if (exec) {
                        exec = fn;
                        fn = function(elem, key, value) {
                            return exec.call(jQuery(elem), value);
                        };
                    } else {
                        fn.call(elems, value);
                        fn = null;
                    }
                }
                if (fn) {
                    for (; i < length; i++) {
                        fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                    }
                }
                chainable = 1;
            }
            return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
        },
        now: function() {
            return (new Date()).getTime();
        }
    });
    jQuery.ready.promise = function(obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();
            if (document.readyState === "complete") {
                setTimeout(jQuery.ready, 1);
            } else if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                window.addEventListener("load", jQuery.ready, false);
            } else {
                document.attachEvent("onreadystatechange", DOMContentLoaded);
                window.attachEvent("onload", jQuery.ready);
                var top = false;
                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) {}
                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {
                            try {
                                top.doScroll("left");
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise(obj);
    };
    jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    rootjQuery = jQuery(document);
    var optionsCache = {};

    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.split(core_rspace), function(_, flag) {
            object[flag] = true;
        });
        return object;
    }
    jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : jQuery.extend({}, options);
        var
            memory, fired, firing, firingStart, firingLength, firingIndex, list = [],
            stack = !options.once && [],
            fire = function(data) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for (; list && firingIndex < firingLength; firingIndex++) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false;
                        break;
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
            self = {
                add: function() {
                    if (list) {
                        var start = list.length;
                        (function add(args) {
                            jQuery.each(args, function(_, arg) {
                                var type = jQuery.type(arg);
                                if (type === "function") {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && type !== "string") {
                                    add(arg);
                                }
                            });
                        })(arguments);
                        if (firing) {
                            firingLength = list.length;
                        } else if (memory) {
                            firingStart = start;
                            fire(memory);
                        }
                    }
                    return this;
                },
                remove: function() {
                    if (list) {
                        jQuery.each(arguments, function(_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                if (firing) {
                                    if (index <= firingLength) {
                                        firingLength--;
                                    }
                                    if (index <= firingIndex) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                has: function(fn) {
                    return jQuery.inArray(fn, list) > -1;
                },
                empty: function() {
                    list = [];
                    return this;
                },
                disable: function() {
                    list = stack = memory = undefined;
                    return this;
                },
                disabled: function() {
                    return !list;
                },
                lock: function() {
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                },
                locked: function() {
                    return !stack;
                },
                fireWith: function(context, args) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    if (list && (!fired || stack)) {
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                    return this;
                },
                fire: function() {
                    self.fireWith(this, arguments);
                    return this;
                },
                fired: function() {
                    return !!fired;
                }
            };
        return self;
    };
    jQuery.extend({
        Deferred: function(func) {
            var tuples = [
                    ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.Callbacks("memory")]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    then: function() {
                        var fns = arguments;
                        return jQuery.Deferred(function(newDefer) {
                            jQuery.each(tuples, function(i, tuple) {
                                var action = tuple[0],
                                    fn = fns[i];
                                deferred[tuple[1]](jQuery.isFunction(fn) ? function() {
                                    var returned = fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                                    } else {
                                        newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
                                    }
                                } : newDefer[action]);
                            });
                            fns = null;
                        }).promise();
                    },
                    promise: function(obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                },
                deferred = {};
            promise.pipe = promise.then;
            jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2],
                    stateString = tuple[3];
                promise[tuple[1]] = list.add;
                if (stateString) {
                    list.add(function() {
                        state = stateString;
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }
                deferred[tuple[0]] = list.fire;
                deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
                func.call(deferred, deferred);
            }
            return deferred;
        },
        when: function(subordinate) {
            var i = 0,
                resolveValues = core_slice.call(arguments),
                length = resolveValues.length,
                remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
                updateFunc = function(i, contexts, values) {
                    return function(value) {
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values);
                        } else if (!(--remaining)) {
                            deferred.resolveWith(contexts, values);
                        }
                    };
                },
                progressValues, progressContexts, resolveContexts;
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }
            return deferred.promise();
        }
    });
    jQuery.support = (function() {
        var support, all, a, select, opt, input, fragment, eventName, i, isSupported, clickFn, div = document.createElement("div");
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[0];
        if (!all || !a || !all.length) {
            return {};
        }
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];
        a.style.cssText = "top:1px;float:left;opacity:.5";
        support = {
            leadingWhitespace: (div.firstChild.nodeType === 3),
            tbody: !div.getElementsByTagName("tbody").length,
            htmlSerialize: !!div.getElementsByTagName("link").length,
            style: /top/.test(a.getAttribute("style")),
            hrefNormalized: (a.getAttribute("href") === "/a"),
            opacity: /^0.5/.test(a.style.opacity),
            cssFloat: !!a.style.cssFloat,
            checkOn: (input.value === "on"),
            optSelected: opt.selected,
            getSetAttribute: div.className !== "t",
            enctype: !!document.createElement("form").enctype,
            html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",
            boxModel: (document.compatMode === "CSS1Compat"),
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true,
            boxSizingReliable: true,
            pixelPosition: false
        };
        input.checked = true;
        support.noCloneChecked = input.cloneNode(true).checked;
        select.disabled = true;
        support.optDisabled = !opt.disabled;
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = false;
        }
        if (!div.addEventListener && div.attachEvent && div.fireEvent) {
            div.attachEvent("onclick", clickFn = function() {
                support.noCloneEvent = false;
            });
            div.cloneNode(true).fireEvent("onclick");
            div.detachEvent("onclick", clickFn);
        }
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        fragment = document.createDocumentFragment();
        fragment.appendChild(div.lastChild);
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
        support.appendChecked = input.checked;
        fragment.removeChild(input);
        fragment.appendChild(div);
        if (div.attachEvent) {
            for (i in {
                    submit: true,
                    change: true,
                    focusin: true
                }) {
                eventName = "on" + i;
                isSupported = (eventName in div);
                if (!isSupported) {
                    div.setAttribute(eventName, "return;");
                    isSupported = (typeof div[eventName] === "function");
                }
                support[i + "Bubbles"] = isSupported;
            }
        }
        jQuery(function() {
            var container, div, tds, marginDiv, divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                body = document.getElementsByTagName("body")[0];
            if (!body) {
                return;
            }
            container = document.createElement("div");
            container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
            body.insertBefore(container, body.firstChild);
            div = document.createElement("div");
            container.appendChild(div);
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
            isSupported = (tds[0].offsetHeight === 0);
            tds[0].style.display = "";
            tds[1].style.display = "none";
            support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
            support.boxSizing = (div.offsetWidth === 4);
            support.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== 1);
            if (window.getComputedStyle) {
                support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%";
                support.boxSizingReliable = (window.getComputedStyle(div, null) || {
                    width: "4px"
                }).width === "4px";
                marginDiv = document.createElement("div");
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";
                div.appendChild(marginDiv);
                support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
            }
            if (typeof div.style.zoom !== "undefined") {
                div.innerHTML = "";
                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                support.inlineBlockNeedsLayout = (div.offsetWidth === 3);
                div.style.display = "block";
                div.style.overflow = "visible";
                div.innerHTML = "<div></div>";
                div.firstChild.style.width = "5px";
                support.shrinkWrapBlocks = (div.offsetWidth !== 3);
                container.style.zoom = 1;
            }
            body.removeChild(container);
            container = div = tds = marginDiv = null;
        });
        fragment.removeChild(div);
        all = a = select = opt = input = fragment = div = null;
        return support;
    })();
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;
    jQuery.extend({
        cache: {},
        deletedIds: [],
        uuid: 0,
        expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            "embed": true,
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },
        hasData: function(elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },
        data: function(elem, name, data, pvt) {
            if (!jQuery.acceptData(elem)) {
                return;
            }
            var thisCache, ret, internalKey = jQuery.expando,
                getByName = typeof name === "string",
                isNode = elem.nodeType,
                cache = isNode ? jQuery.cache : elem,
                id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
            if ((!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined) {
                return;
            }
            if (!id) {
                if (isNode) {
                    elem[internalKey] = id = jQuery.deletedIds.pop() || jQuery.guid++;
                } else {
                    id = internalKey;
                }
            }
            if (!cache[id]) {
                cache[id] = {};
                if (!isNode) {
                    cache[id].toJSON = jQuery.noop;
                }
            }
            if (typeof name === "object" || typeof name === "function") {
                if (pvt) {
                    cache[id] = jQuery.extend(cache[id], name);
                } else {
                    cache[id].data = jQuery.extend(cache[id].data, name);
                }
            }
            thisCache = cache[id];
            if (!pvt) {
                if (!thisCache.data) {
                    thisCache.data = {};
                }
                thisCache = thisCache.data;
            }
            if (data !== undefined) {
                thisCache[jQuery.camelCase(name)] = data;
            }
            if (getByName) {
                ret = thisCache[name];
                if (ret == null) {
                    ret = thisCache[jQuery.camelCase(name)];
                }
            } else {
                ret = thisCache;
            }
            return ret;
        },
        removeData: function(elem, name, pvt) {
            if (!jQuery.acceptData(elem)) {
                return;
            }
            var thisCache, i, l, isNode = elem.nodeType,
                cache = isNode ? jQuery.cache : elem,
                id = isNode ? elem[jQuery.expando] : jQuery.expando;
            if (!cache[id]) {
                return;
            }
            if (name) {
                thisCache = pvt ? cache[id] : cache[id].data;
                if (thisCache) {
                    if (!jQuery.isArray(name)) {
                        if (name in thisCache) {
                            name = [name];
                        } else {
                            name = jQuery.camelCase(name);
                            if (name in thisCache) {
                                name = [name];
                            } else {
                                name = name.split(" ");
                            }
                        }
                    }
                    for (i = 0, l = name.length; i < l; i++) {
                        delete thisCache[name[i]];
                    }
                    if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
                        return;
                    }
                }
            }
            if (!pvt) {
                delete cache[id].data;
                if (!isEmptyDataObject(cache[id])) {
                    return;
                }
            }
            if (isNode) {
                jQuery.cleanData([elem], true);
            } else if (jQuery.support.deleteExpando || cache != cache.window) {
                delete cache[id];
            } else {
                cache[id] = null;
            }
        },
        _data: function(elem, name, data) {
            return jQuery.data(elem, name, data, true);
        },
        acceptData: function(elem) {
            var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });
    jQuery.fn.extend({
        data: function(key, value) {
            var parts, part, attr, name, l, elem = this[0],
                i = 0,
                data = null;
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);
                    if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                        attr = elem.attributes;
                        for (l = attr.length; i < l; i++) {
                            name = attr[i].name;
                            if (!name.indexOf("data-")) {
                                name = jQuery.camelCase(name.substring(5));
                                dataAttr(elem, name, data[name]);
                            }
                        }
                        jQuery._data(elem, "parsedAttrs", true);
                    }
                }
                return data;
            }
            if (typeof key === "object") {
                return this.each(function() {
                    jQuery.data(this, key);
                });
            }
            parts = key.split(".", 2);
            parts[1] = parts[1] ? "." + parts[1] : "";
            part = parts[1] + "!";
            return jQuery.access(this, function(value) {
                if (value === undefined) {
                    data = this.triggerHandler("getData" + part, [parts[0]]);
                    if (data === undefined && elem) {
                        data = jQuery.data(elem, key);
                        data = dataAttr(elem, key, data);
                    }
                    return data === undefined && parts[1] ? this.data(parts[0]) : data;
                }
                parts[1] = value;
                this.each(function() {
                    var self = jQuery(this);
                    self.triggerHandler("setData" + part, parts);
                    jQuery.data(this, key, value);
                    self.triggerHandler("changeData" + part, parts);
                });
            }, null, value, arguments.length > 1, null, false);
        },
        removeData: function(key) {
            return this.each(function() {
                jQuery.removeData(this, key);
            });
        }
    });

    function dataAttr(elem, key, data) {
        if (data === undefined && elem.nodeType === 1) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
                try {
                    data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                } catch (e) {}
                jQuery.data(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }

    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {
            if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== "toJSON") {
                return false;
            }
        }
        return true;
    }
    jQuery.extend({
        queue: function(elem, type, data) {
            var queue;
            if (elem) {
                type = (type || "fx") + "queue";
                queue = jQuery._data(elem, type);
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type),
                next = function() {
                    jQuery.dequeue(elem, type);
                };
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }
            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },
        _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    jQuery.removeData(elem, type + "queue", true);
                    jQuery.removeData(elem, key, true);
                })
            });
        }
    });
    jQuery.fn.extend({
        queue: function(type, data) {
            var setter = 2;
            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }
            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }
            return data === undefined ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                jQuery._queueHooks(this, type);
                if (type === "fx" && queue[0] !== "inprogress") {
                    jQuery.dequeue(this, type);
                }
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        delay: function(time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";
            return this.queue(type, function(next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        promise: function(type, obj) {
            var tmp, count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function() {
                    if (!(--count)) {
                        defer.resolveWith(elements, [elements]);
                    }
                };
            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";
            while (i--) {
                tmp = jQuery._data(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var nodeHook, boolHook, fixSpecified, rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea|)$/i,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute;
    jQuery.fn.extend({
        attr: function(name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        },
        prop: function(name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            name = jQuery.propFix[name] || name;
            return this.each(function() {
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) {}
            });
        },
        addClass: function(value) {
            var classNames, i, l, elem, setClass, c, cl;
            if (jQuery.isFunction(value)) {
                return this.each(function(j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }
            if (value && typeof value === "string") {
                classNames = value.split(core_rspace);
                for (i = 0, l = this.length; i < l; i++) {
                    elem = this[i];
                    if (elem.nodeType === 1) {
                        if (!elem.className && classNames.length === 1) {
                            elem.className = value;
                        } else {
                            setClass = " " + elem.className + " ";
                            for (c = 0, cl = classNames.length; c < cl; c++) {
                                if (setClass.indexOf(" " + classNames[c] + " ") < 0) {
                                    setClass += classNames[c] + " ";
                                }
                            }
                            elem.className = jQuery.trim(setClass);
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function(value) {
            var removes, className, elem, c, cl, i, l;
            if (jQuery.isFunction(value)) {
                return this.each(function(j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if ((value && typeof value === "string") || value === undefined) {
                removes = (value || "").split(core_rspace);
                for (i = 0, l = this.length; i < l; i++) {
                    elem = this[i];
                    if (elem.nodeType === 1 && elem.className) {
                        className = (" " + elem.className + " ").replace(rclass, " ");
                        for (c = 0, cl = removes.length; c < cl; c++) {
                            while (className.indexOf(" " + removes[c] + " ") >= 0) {
                                className = className.replace(" " + removes[c] + " ", " ");
                            }
                        }
                        elem.className = value ? jQuery.trim(className) : "";
                    }
                }
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";
            if (jQuery.isFunction(value)) {
                return this.each(function(i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }
            return this.each(function() {
                if (type === "string") {
                    var className, i = 0,
                        self = jQuery(this),
                        state = stateVal,
                        classNames = value.split(core_rspace);
                    while ((className = classNames[i++])) {
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? "addClass" : "removeClass"](className);
                    }
                } else if (type === "undefined" || type === "boolean") {
                    if (this.className) {
                        jQuery._data(this, "__className__", this.className);
                    }
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },
        hasClass: function(selector) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                    return true;
                }
            }
            return false;
        },
        val: function(value) {
            var hooks, ret, isFunction, elem = this[0];
            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }
                    ret = elem.value;
                    return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
                }
                return;
            }
            isFunction = jQuery.isFunction(value);
            return this.each(function(i) {
                var val, self = jQuery(this);
                if (this.nodeType !== 1) {
                    return;
                }
                if (isFunction) {
                    val = value.call(this, i, self.val());
                } else {
                    val = value;
                }
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function(value) {
                        return value == null ? "" : value + "";
                    });
                }
                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });
    jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function(elem) {
                    var value, option, options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ? max : one ? index : 0;
                    for (; i < max; i++) {
                        option = options[i];
                        if ((option.selected || i === index) && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                            value = jQuery(option).val();
                            if (one) {
                                return value;
                            }
                            values.push(value);
                        }
                    }
                    return values;
                },
                set: function(elem, value) {
                    var values = jQuery.makeArray(value);
                    jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });
                    if (!values.length) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },
        attrFn: {},
        attr: function(elem, name, value, pass) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            if (pass && jQuery.isFunction(jQuery.fn[name])) {
                return jQuery(elem)[name](value);
            }
            if (typeof elem.getAttribute === "undefined") {
                return jQuery.prop(elem, name, value);
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
            }
            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                    return;
                } else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }
            } else if (hooks && "get" in hooks && notxml && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            } else {
                ret = elem.getAttribute(name);
                return ret === null ? undefined : ret;
            }
        },
        removeAttr: function(elem, value) {
            var propName, attrNames, name, isBool, i = 0;
            if (value && elem.nodeType === 1) {
                attrNames = value.split(core_rspace);
                for (; i < attrNames.length; i++) {
                    name = attrNames[i];
                    if (name) {
                        propName = jQuery.propFix[name] || name;
                        isBool = rboolean.test(name);
                        if (!isBool) {
                            jQuery.attr(elem, name, "");
                        }
                        elem.removeAttribute(getSetAttribute ? name : propName);
                        if (isBool && propName in elem) {
                            elem[propName] = false;
                        }
                    }
                }
            }
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (rtype.test(elem.nodeName) && elem.parentNode) {
                        jQuery.error("type property can't be changed");
                    } else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            },
            value: {
                get: function(elem, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button")) {
                        return nodeHook.get(elem, name);
                    }
                    return name in elem ? elem.value : null;
                },
                set: function(elem, value, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button")) {
                        return nodeHook.set(elem, value, name);
                    }
                    elem.value = value;
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }
            if (value !== undefined) {
                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    return (elem[name] = value);
                }
            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                    return ret;
                } else {
                    return elem[name];
                }
            }
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    var attributeNode = elem.getAttributeNode("tabindex");
                    return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                }
            }
        }
    });
    boolHook = {
        get: function(elem, name) {
            var attrNode, property = jQuery.prop(elem, name);
            return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
        },
        set: function(elem, value, name) {
            var propName;
            if (value === false) {
                jQuery.removeAttr(elem, name);
            } else {
                propName = jQuery.propFix[name] || name;
                if (propName in elem) {
                    elem[propName] = true;
                }
                elem.setAttribute(name, name.toLowerCase());
            }
            return name;
        }
    };
    if (!getSetAttribute) {
        fixSpecified = {
            name: true,
            id: true,
            coords: true
        };
        nodeHook = jQuery.valHooks.button = {
            get: function(elem, name) {
                var ret;
                ret = elem.getAttributeNode(name);
                return ret && (fixSpecified[name] ? ret.value !== "" : ret.specified) ? ret.value : undefined;
            },
            set: function(elem, value, name) {
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    ret = document.createAttribute(name);
                    elem.setAttributeNode(ret);
                }
                return (ret.value = value + "");
            }
        };
        jQuery.each(["width", "height"], function(i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                set: function(elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            });
        });
        jQuery.attrHooks.contenteditable = {
            get: nodeHook.get,
            set: function(elem, value, name) {
                if (value === "") {
                    value = "false";
                }
                nodeHook.set(elem, value, name);
            }
        };
    }
    if (!jQuery.support.hrefNormalized) {
        jQuery.each(["href", "src", "width", "height"], function(i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                get: function(elem) {
                    var ret = elem.getAttribute(name, 2);
                    return ret === null ? undefined : ret;
                }
            });
        });
    }
    if (!jQuery.support.style) {
        jQuery.attrHooks.style = {
            get: function(elem) {
                return elem.style.cssText.toLowerCase() || undefined;
            },
            set: function(elem, value) {
                return (elem.style.cssText = value + "");
            }
        };
    }
    if (!jQuery.support.optSelected) {
        jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
            get: function(elem) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        });
    }
    if (!jQuery.support.enctype) {
        jQuery.propFix.enctype = "encoding";
    }
    if (!jQuery.support.checkOn) {
        jQuery.each(["radio", "checkbox"], function() {
            jQuery.valHooks[this] = {
                get: function(elem) {
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
            set: function(elem, value) {
                if (jQuery.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                }
            }
        });
    });
    var rformElems = /^(?:textarea|input|select)$/i,
        rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        hoverHack = function(events) {
            return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
        };
    jQuery.event = {
        add: function(elem, types, handler, data, selector) {
            var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, handlers, special;
            if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data(elem))) {
                return;
            }
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }
            events = elemData.events;
            if (!events) {
                elemData.events = events = {};
            }
            eventHandle = elemData.handle;
            if (!eventHandle) {
                elemData.handle = eventHandle = function(e) {
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
                };
                eventHandle.elem = elem;
            }
            types = jQuery.trim(hoverHack(types)).split(" ");
            for (t = 0; t < types.length; t++) {
                tns = rtypenamespace.exec(types[t]) || [];
                type = tns[1];
                namespaces = (tns[2] || "").split(".").sort();
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                special = jQuery.event.special[type] || {};
                handleObj = jQuery.extend({
                    type: type,
                    origType: tns[1],
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);
                handlers = events[type];
                if (!handlers) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);
                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }
                if (special.add) {
                    special.add.call(elem, handleObj);
                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }
                jQuery.event.global[type] = true;
            }
            elem = null;
        },
        global: {},
        remove: function(elem, types, handler, selector, mappedTypes) {
            var t, tns, type, origType, namespaces, origCount, j, events, special, eventType, handleObj, elemData = jQuery.hasData(elem) && jQuery._data(elem);
            if (!elemData || !(events = elemData.events)) {
                return;
            }
            types = jQuery.trim(hoverHack(types || "")).split(" ");
            for (t = 0; t < types.length; t++) {
                tns = rtypenamespace.exec(types[t]) || [];
                type = origType = tns[1];
                namespaces = tns[2];
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                eventType = events[type] || [];
                origCount = eventType.length;
                namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                for (j = 0; j < eventType.length; j++) {
                    handleObj = eventType[j];
                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!namespaces || namespaces.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        eventType.splice(j--, 1);
                        if (handleObj.selector) {
                            eventType.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }
                if (eventType.length === 0 && origCount !== eventType.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }
                    delete events[type];
                }
            }
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;
                jQuery.removeData(elem, "events", true);
            }
        },
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },
        trigger: function(event, data, elem, onlyHandlers) {
            if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
                return;
            }
            var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType, type = event.type || event,
                namespaces = [];
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }
            if (type.indexOf("!") >= 0) {
                type = type.slice(0, -1);
                exclusive = true;
            }
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
                return;
            }
            event = typeof event === "object" ? event[jQuery.expando] ? event : new jQuery.Event(type, event) : new jQuery.Event(type);
            event.type = type;
            event.isTrigger = true;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            ontype = type.indexOf(":") < 0 ? "on" + type : "";
            if (!elem) {
                cache = jQuery.cache;
                for (i in cache) {
                    if (cache[i].events && cache[i].events[type]) {
                        jQuery.event.trigger(event, data, cache[i].handle.elem, true);
                    }
                }
                return;
            }
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }
            data = data != null ? jQuery.makeArray(data) : [];
            data.unshift(event);
            special = jQuery.event.special[type] || {};
            if (special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }
            eventPath = [
                [elem, special.bindType || type]
            ];
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type;
                cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
                for (old = elem; cur; cur = cur.parentNode) {
                    eventPath.push([cur, bubbleType]);
                    old = cur;
                }
                if (old === (elem.ownerDocument || document)) {
                    eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
                }
            }
            for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {
                cur = eventPath[i][0];
                event.type = eventPath[i][1];
                handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }
                handle = ontype && cur[ontype];
                if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
                    event.preventDefault();
                }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {
                    if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {
                        old = elem[ontype];
                        if (old) {
                            elem[ontype] = null;
                        }
                        jQuery.event.triggered = type;
                        elem[type]();
                        jQuery.event.triggered = undefined;
                        if (old) {
                            elem[ontype] = old;
                        }
                    }
                }
            }
            return event.result;
        },
        dispatch: function(event) {
            event = jQuery.event.fix(event || window.event);
            var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related, handlers = ((jQuery._data(this, "events") || {})[event.type] || []),
                delegateCount = handlers.delegateCount,
                args = core_slice.call(arguments),
                run_all = !event.exclusive && !event.namespace,
                special = jQuery.event.special[event.type] || {},
                handlerQueue = [];
            args[0] = event;
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }
            if (delegateCount && !(event.button && event.type === "click")) {
                for (cur = event.target; cur != this; cur = cur.parentNode || this) {
                    if (cur.disabled !== true || event.type !== "click") {
                        selMatch = {};
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            sel = handleObj.selector;
                            if (selMatch[sel] === undefined) {
                                selMatch[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (selMatch[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({
                                elem: cur,
                                matches: matches
                            });
                        }
                    }
                }
            }
            if (handlers.length > delegateCount) {
                handlerQueue.push({
                    elem: this,
                    matches: handlers.slice(delegateCount)
                });
            }
            for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++) {
                matched = handlerQueue[i];
                event.currentTarget = matched.elem;
                for (j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++) {
                    handleObj = matched.matches[j];
                    if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {
                        event.data = handleObj.data;
                        event.handleObj = handleObj;
                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                        if (ret !== undefined) {
                            event.result = ret;
                            if (ret === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }
            return event.result;
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(event, original) {
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }
                return event;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(event, original) {
                var eventDoc, doc, body, button = original.button,
                    fromElement = original.fromElement;
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;
                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }
                if (!event.which && button !== undefined) {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }
                return event;
            }
        },
        fix: function(event) {
            if (event[jQuery.expando]) {
                return event;
            }
            var i, prop, originalEvent = event,
                fixHook = jQuery.event.fixHooks[event.type] || {},
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            event = jQuery.Event(originalEvent);
            for (i = copy.length; i;) {
                prop = copy[--i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            event.metaKey = !!event.metaKey;
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        special: {
            load: {
                noBubble: true
            },
            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },
            beforeunload: {
                setup: function(data, namespaces, eventHandle) {
                    if (jQuery.isWindow(this)) {
                        this.onbeforeunload = eventHandle;
                    }
                },
                teardown: function(namespaces, eventHandle) {
                    if (this.onbeforeunload === eventHandle) {
                        this.onbeforeunload = null;
                    }
                }
            }
        },
        simulate: function(type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: true,
                originalEvent: {}
            });
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };
    jQuery.event.handle = jQuery.event.dispatch;
    jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        }
    } : function(elem, type, handle) {
        var name = "on" + type;
        if (elem.detachEvent) {
            if (typeof elem[name] === "undefined") {
                elem[name] = null;
            }
            elem.detachEvent(name, handle);
        }
    };
    jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;
        } else {
            this.type = src;
        }
        if (props) {
            jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || jQuery.now();
        this[jQuery.expando] = true;
    };

    function returnFalse() {
        return false;
    }

    function returnTrue() {
        return true;
    }
    jQuery.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if (!e) {
                return;
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if (!e) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
                var ret, target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj,
                    selector = handleObj.selector;
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });
    if (!jQuery.support.submitBubbles) {
        jQuery.event.special.submit = {
            setup: function() {
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }
                jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                    var elem = e.target,
                        form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                    if (form && !jQuery._data(form, "_submit_attached")) {
                        jQuery.event.add(form, "submit._submit", function(event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, "_submit_attached", true);
                    }
                });
            },
            postDispatch: function(event) {
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                    }
                }
            },
            teardown: function() {
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }
                jQuery.event.remove(this, "._submit");
            }
        };
    }
    if (!jQuery.support.changeBubbles) {
        jQuery.event.special.change = {
            setup: function() {
                if (rformElems.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") {
                        jQuery.event.add(this, "propertychange._change", function(event) {
                            if (event.originalEvent.propertyName === "checked") {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, "click._change", function(event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            jQuery.event.simulate("change", this, event, true);
                        });
                    }
                    return false;
                }
                jQuery.event.add(this, "beforeactivate._change", function(e) {
                    var elem = e.target;
                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "_change_attached")) {
                        jQuery.event.add(elem, "change._change", function(event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, "_change_attached", true);
                    }
                });
            },
            handle: function(event) {
                var elem = event.target;
                if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },
            teardown: function() {
                jQuery.event.remove(this, "._change");
                return !rformElems.test(this.nodeName);
            }
        };
    }
    if (!jQuery.support.focusinBubbles) {
        jQuery.each({
            focus: "focusin",
            blur: "focusout"
        }, function(orig, fix) {
            var attaches = 0,
                handler = function(event) {
                    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
                };
            jQuery.event.special[fix] = {
                setup: function() {
                    if (attaches++ === 0) {
                        document.addEventListener(orig, handler, true);
                    }
                },
                teardown: function() {
                    if (--attaches === 0) {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };
        });
    }
    jQuery.fn.extend({
        on: function(types, selector, data, fn, one) {
            var origFn, type;
            if (typeof types === "object") {
                if (typeof selector !== "string") {
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }
            if (data == null && fn == null) {
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    fn = data;
                    data = undefined;
                } else {
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }
            if (one === 1) {
                origFn = fn;
                fn = function(event) {
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function() {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function(types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if (typeof types === "object") {
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function() {
                jQuery.event.remove(this, types, fn, selector);
            });
        },
        bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
            return this.off(types, null, fn);
        },
        live: function(types, data, fn) {
            jQuery(this.context).on(types, this.selector, data, fn);
            return this;
        },
        die: function(types, fn) {
            jQuery(this.context).off(types, this.selector || "**", fn);
            return this;
        },
        delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            if (this[0]) {
                return jQuery.event.trigger(type, data, this[0], true);
            }
        },
        toggle: function(fn) {
            var args = arguments,
                guid = fn.guid || jQuery.guid++,
                i = 0,
                toggler = function(event) {
                    var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
                    jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);
                    event.preventDefault();
                    return args[lastToggle].apply(this, arguments) || false;
                };
            toggler.guid = guid;
            while (i < args.length) {
                args[i++].guid = guid;
            }
            return this.click(toggler);
        },
        hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });
    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {
        jQuery.fn[name] = function(data, fn) {
            if (fn == null) {
                fn = data;
                data = null;
            }
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
        if (rkeyEvent.test(name)) {
            jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
        }
        if (rmouseEvent.test(name)) {
            jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
        }
    });
    (function(window, undefined) {
        var cachedruns, assertGetIdNotName, Expr, getText, isXML, contains, compile, sortOrder, hasDuplicate, outermostContext, baseHasDuplicate = true,
            strundefined = "undefined",
            expando = ("sizcache" + Math.random()).replace(".", ""),
            Token = String,
            document = window.document,
            docElem = document.documentElement,
            dirruns = 0,
            done = 0,
            pop = [].pop,
            push = [].push,
            slice = [].slice,
            indexOf = [].indexOf || function(elem) {
                var i = 0,
                    len = this.length;
                for (; i < len; i++) {
                    if (this[i] === elem) {
                        return i;
                    }
                }
                return -1;
            },
            markFunction = function(fn, value) {
                fn[expando] = value == null || value;
                return fn;
            },
            createCache = function() {
                var cache = {},
                    keys = [];
                return markFunction(function(key, value) {
                    if (keys.push(key) > Expr.cacheLength) {
                        delete cache[keys.shift()];
                    }
                    return (cache[key + " "] = value);
                }, cache);
            },
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),
            whitespace = "[\\x20\\t\\r\\n\\f]",
            characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",
            identifier = characterEncoding.replace("w", "w#"),
            operators = "([*^$|!~]?=)",
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
            pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",
            pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"),
            rpseudo = new RegExp(pseudos),
            rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
            rnot = /^:not/,
            rsibling = /[\x20\t\r\n\f]*[+~]/,
            rendsWithNot = /:not\($/,
            rheader = /h\d/i,
            rinputs = /input|select|textarea|button/i,
            rbackslash = /\\(?!\\)/g,
            matchExpr = {
                "ID": new RegExp("^#(" + characterEncoding + ")"),
                "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
                "NAME": new RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
                "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                "ATTR": new RegExp("^" + attributes),
                "PSEUDO": new RegExp("^" + pseudos),
                "POS": new RegExp(pos, "i"),
                "CHILD": new RegExp("^:(only|nth|first|last)-child(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                "needsContext": new RegExp("^" + whitespace + "*[>+~]|" + pos, "i")
            },
            assert = function(fn) {
                var div = document.createElement("div");
                try {
                    return fn(div);
                } catch (e) {
                    return false;
                } finally {
                    div = null;
                }
            },
            assertTagNameNoComments = assert(function(div) {
                div.appendChild(document.createComment(""));
                return !div.getElementsByTagName("*").length;
            }),
            assertHrefNotNormalized = assert(function(div) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute("href") === "#";
            }),
            assertAttributes = assert(function(div) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                return type !== "boolean" && type !== "string";
            }),
            assertUsableClassName = assert(function(div) {
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
                if (!div.getElementsByClassName || !div.getElementsByClassName("e").length) {
                    return false;
                }
                div.lastChild.className = "e";
                return div.getElementsByClassName("e").length === 2;
            }),
            assertUsableName = assert(function(div) {
                div.id = expando + 0;
                div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
                docElem.insertBefore(div, docElem.firstChild);
                var pass = document.getElementsByName && document.getElementsByName(expando).length === 2 +
                    document.getElementsByName(expando + 0).length;
                assertGetIdNotName = !document.getElementById(expando);
                docElem.removeChild(div);
                return pass;
            });
        try {
            slice.call(docElem.childNodes, 0)[0].nodeType;
        } catch (e) {
            slice = function(i) {
                var elem, results = [];
                for (;
                    (elem = this[i]); i++) {
                    results.push(elem);
                }
                return results;
            };
        }

        function Sizzle(selector, context, results, seed) {
            results = results || [];
            context = context || document;
            var match, elem, xml, m, nodeType = context.nodeType;
            if (!selector || typeof selector !== "string") {
                return results;
            }
            if (nodeType !== 1 && nodeType !== 9) {
                return [];
            }
            xml = isXML(context);
            if (!xml && !seed) {
                if ((match = rquickExpr.exec(selector))) {
                    if ((m = match[1])) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            if (elem && elem.parentNode) {
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }
                    } else if (match[2]) {
                        push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
                        return results;
                    } else if ((m = match[3]) && assertUsableClassName && context.getElementsByClassName) {
                        push.apply(results, slice.call(context.getElementsByClassName(m), 0));
                        return results;
                    }
                }
            }
            return select(selector.replace(rtrim, "$1"), context, results, seed, xml);
        }
        Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        };
        Sizzle.matchesSelector = function(elem, expr) {
            return Sizzle(expr, null, null, [elem]).length > 0;
        };

        function createInputPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        function createButtonPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                argument = +argument;
                return markFunction(function(seed, matches) {
                    var j, matchIndexes = fn([], seed.length, argument),
                        i = matchIndexes.length;
                    while (i--) {
                        if (seed[(j = matchIndexes[i])]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }
        getText = Sizzle.getText = function(elem) {
            var node, ret = "",
                i = 0,
                nodeType = elem.nodeType;
            if (nodeType) {
                if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                    if (typeof elem.textContent === "string") {
                        return elem.textContent;
                    } else {
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                            ret += getText(elem);
                        }
                    }
                } else if (nodeType === 3 || nodeType === 4) {
                    return elem.nodeValue;
                }
            } else {
                for (;
                    (node = elem[i]); i++) {
                    ret += getText(node);
                }
            }
            return ret;
        };
        isXML = Sizzle.isXML = function(elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };
        contains = Sizzle.contains = docElem.contains ? function(a, b) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
        } : docElem.compareDocumentPosition ? function(a, b) {
            return b && !!(a.compareDocumentPosition(b) & 16);
        } : function(a, b) {
            while ((b = b.parentNode)) {
                if (b === a) {
                    return true;
                }
            }
            return false;
        };
        Sizzle.attr = function(elem, name) {
            var val, xml = isXML(elem);
            if (!xml) {
                name = name.toLowerCase();
            }
            if ((val = Expr.attrHandle[name])) {
                return val(elem);
            }
            if (xml || assertAttributes) {
                return elem.getAttribute(name);
            }
            val = elem.getAttributeNode(name);
            return val ? typeof elem[name] === "boolean" ? elem[name] ? name : null : val.specified ? val.value : null : null;
        };
        Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: assertHrefNotNormalized ? {} : {
                "href": function(elem) {
                    return elem.getAttribute("href", 2);
                },
                "type": function(elem) {
                    return elem.getAttribute("type");
                }
            },
            find: {
                "ID": assertGetIdNotName ? function(id, context, xml) {
                    if (typeof context.getElementById !== strundefined && !xml) {
                        var m = context.getElementById(id);
                        return m && m.parentNode ? [m] : [];
                    }
                } : function(id, context, xml) {
                    if (typeof context.getElementById !== strundefined && !xml) {
                        var m = context.getElementById(id);
                        return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [m] : undefined : [];
                    }
                },
                "TAG": assertTagNameNoComments ? function(tag, context) {
                    if (typeof context.getElementsByTagName !== strundefined) {
                        return context.getElementsByTagName(tag);
                    }
                } : function(tag, context) {
                    var results = context.getElementsByTagName(tag);
                    if (tag === "*") {
                        var elem, tmp = [],
                            i = 0;
                        for (;
                            (elem = results[i]); i++) {
                            if (elem.nodeType === 1) {
                                tmp.push(elem);
                            }
                        }
                        return tmp;
                    }
                    return results;
                },
                "NAME": assertUsableName && function(tag, context) {
                    if (typeof context.getElementsByName !== strundefined) {
                        return context.getElementsByName(name);
                    }
                },
                "CLASS": assertUsableClassName && function(className, context, xml) {
                    if (typeof context.getElementsByClassName !== strundefined && !xml) {
                        return context.getElementsByClassName(className);
                    }
                }
            },
            relative: {
                ">": {
                    dir: "parentNode",
                    first: true
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: true
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                "ATTR": function(match) {
                    match[1] = match[1].replace(rbackslash, "");
                    match[3] = (match[4] || match[5] || "").replace(rbackslash, "");
                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }
                    return match.slice(0, 4);
                },
                "CHILD": function(match) {
                    match[1] = match[1].toLowerCase();
                    if (match[1] === "nth") {
                        if (!match[2]) {
                            Sizzle.error(match[0]);
                        }
                        match[3] = +(match[3] ? match[4] + (match[5] || 1) : 2 * (match[2] === "even" || match[2] === "odd"));
                        match[4] = +((match[6] + match[7]) || match[2] === "odd");
                    } else if (match[2]) {
                        Sizzle.error(match[0]);
                    }
                    return match;
                },
                "PSEUDO": function(match) {
                    var unquoted, excess;
                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }
                    if (match[3]) {
                        match[2] = match[3];
                    } else if ((unquoted = match[4])) {
                        if (rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                            unquoted = unquoted.slice(0, excess);
                            match[0] = match[0].slice(0, excess);
                        }
                        match[2] = unquoted;
                    }
                    return match.slice(0, 3);
                }
            },
            filter: {
                "ID": assertGetIdNotName ? function(id) {
                    id = id.replace(rbackslash, "");
                    return function(elem) {
                        return elem.getAttribute("id") === id;
                    };
                } : function(id) {
                    id = id.replace(rbackslash, "");
                    return function(elem) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                        return node && node.value === id;
                    };
                },
                "TAG": function(nodeName) {
                    if (nodeName === "*") {
                        return function() {
                            return true;
                        };
                    }
                    nodeName = nodeName.replace(rbackslash, "").toLowerCase();
                    return function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                "CLASS": function(className) {
                    var pattern = classCache[expando][className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                        return pattern.test(elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "");
                    });
                },
                "ATTR": function(name, operator, check) {
                    return function(elem, context) {
                        var result = Sizzle.attr(elem, name);
                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }
                        result += "";
                        return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.substr(result.length - check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.substr(0, check.length + 1) === check + "-" : false;
                    };
                },
                "CHILD": function(type, argument, first, last) {
                    if (type === "nth") {
                        return function(elem) {
                            var node, diff, parent = elem.parentNode;
                            if (first === 1 && last === 0) {
                                return true;
                            }
                            if (parent) {
                                diff = 0;
                                for (node = parent.firstChild; node; node = node.nextSibling) {
                                    if (node.nodeType === 1) {
                                        diff++;
                                        if (elem === node) {
                                            break;
                                        }
                                    }
                                }
                            }
                            diff -= last;
                            return diff === first || (diff % first === 0 && diff / first >= 0);
                        };
                    }
                    return function(elem) {
                        var node = elem;
                        switch (type) {
                            case "only":
                            case "first":
                                while ((node = node.previousSibling)) {
                                    if (node.nodeType === 1) {
                                        return false;
                                    }
                                }
                                if (type === "first") {
                                    return true;
                                }
                                node = elem;
                            case "last":
                                while ((node = node.nextSibling)) {
                                    if (node.nodeType === 1) {
                                        return false;
                                    }
                                }
                                return true;
                        }
                    };
                },
                "PSEUDO": function(pseudo, argument) {
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    if (fn[expando]) {
                        return fn(argument);
                    }
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                            var idx, matched = fn(seed, argument),
                                i = matched.length;
                            while (i--) {
                                idx = indexOf.call(seed, matched[i]);
                                seed[idx] = !(matches[idx] = matched[i]);
                            }
                        }) : function(elem) {
                            return fn(elem, 0, args);
                        };
                    }
                    return fn;
                }
            },
            pseudos: {
                "not": markFunction(function(selector) {
                    var input = [],
                        results = [],
                        matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        var elem, unmatched = matcher(seed, null, xml, []),
                            i = seed.length;
                        while (i--) {
                            if ((elem = unmatched[i])) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) : function(elem, context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        return !results.pop();
                    };
                }),
                "has": markFunction(function(selector) {
                    return function(elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                "contains": markFunction(function(text) {
                    return function(elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),
                "enabled": function(elem) {
                    return elem.disabled === false;
                },
                "disabled": function(elem) {
                    return elem.disabled === true;
                },
                "checked": function(elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },
                "selected": function(elem) {
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }
                    return elem.selected === true;
                },
                "parent": function(elem) {
                    return !Expr.pseudos["empty"](elem);
                },
                "empty": function(elem) {
                    var nodeType;
                    elem = elem.firstChild;
                    while (elem) {
                        if (elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4) {
                            return false;
                        }
                        elem = elem.nextSibling;
                    }
                    return true;
                },
                "header": function(elem) {
                    return rheader.test(elem.nodeName);
                },
                "text": function(elem) {
                    var type, attr;
                    return elem.nodeName.toLowerCase() === "input" && (type = elem.type) === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type);
                },
                "radio": createInputPseudo("radio"),
                "checkbox": createInputPseudo("checkbox"),
                "file": createInputPseudo("file"),
                "password": createInputPseudo("password"),
                "image": createInputPseudo("image"),
                "submit": createButtonPseudo("submit"),
                "reset": createButtonPseudo("reset"),
                "button": function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },
                "input": function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                "focus": function(elem) {
                    var doc = elem.ownerDocument;
                    return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                "active": function(elem) {
                    return elem === elem.ownerDocument.activeElement;
                },
                "first": createPositionalPseudo(function() {
                    return [0];
                }),
                "last": createPositionalPseudo(function(matchIndexes, length) {
                    return [length - 1];
                }),
                "eq": createPositionalPseudo(function(matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),
                "even": createPositionalPseudo(function(matchIndexes, length) {
                    for (var i = 0; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                "odd": createPositionalPseudo(function(matchIndexes, length) {
                    for (var i = 1; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; --i >= 0;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
                    for (var i = argument < 0 ? argument + length : argument; ++i < length;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };

        function siblingCheck(a, b, ret) {
            if (a === b) {
                return ret;
            }
            var cur = a.nextSibling;
            while (cur) {
                if (cur === b) {
                    return -1;
                }
                cur = cur.nextSibling;
            }
            return 1;
        }
        sortOrder = docElem.compareDocumentPosition ? function(a, b) {
            if (a === b) {
                hasDuplicate = true;
                return 0;
            }
            return (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1;
        } : function(a, b) {
            if (a === b) {
                hasDuplicate = true;
                return 0;
            } else if (a.sourceIndex && b.sourceIndex) {
                return a.sourceIndex - b.sourceIndex;
            }
            var al, bl, ap = [],
                bp = [],
                aup = a.parentNode,
                bup = b.parentNode,
                cur = aup;
            if (aup === bup) {
                return siblingCheck(a, b);
            } else if (!aup) {
                return -1;
            } else if (!bup) {
                return 1;
            }
            while (cur) {
                ap.unshift(cur);
                cur = cur.parentNode;
            }
            cur = bup;
            while (cur) {
                bp.unshift(cur);
                cur = cur.parentNode;
            }
            al = ap.length;
            bl = bp.length;
            for (var i = 0; i < al && i < bl; i++) {
                if (ap[i] !== bp[i]) {
                    return siblingCheck(ap[i], bp[i]);
                }
            }
            return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
        };
        [0, 0].sort(sortOrder);
        baseHasDuplicate = !hasDuplicate;
        Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [],
                i = 1,
                j = 0;
            hasDuplicate = baseHasDuplicate;
            results.sort(sortOrder);
            if (hasDuplicate) {
                for (;
                    (elem = results[i]); i++) {
                    if (elem === results[i - 1]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }
            return results;
        };
        Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[expando][selector + " "];
            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }
                matched = false;
                if ((match = rcombinators.exec(soFar))) {
                    tokens.push(matched = new Token(match.shift()));
                    soFar = soFar.slice(matched.length);
                    matched.type = match[0].replace(rtrim, " ");
                }
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                        tokens.push(matched = new Token(match.shift()));
                        soFar = soFar.slice(matched.length);
                        matched.type = type;
                        matched.matches = match;
                    }
                }
                if (!matched) {
                    break;
                }
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
                checkNonElements = base && combinator.dir === "parentNode",
                doneName = done++;
            return combinator.first ? function(elem, context, xml) {
                while ((elem = elem[dir])) {
                    if (checkNonElements || elem.nodeType === 1) {
                        return matcher(elem, context, xml);
                    }
                }
            } : function(elem, context, xml) {
                if (!xml) {
                    var cache, dirkey = dirruns + " " + doneName + " ",
                        cachedkey = dirkey + cachedruns;
                    while ((elem = elem[dir])) {
                        if (checkNonElements || elem.nodeType === 1) {
                            if ((cache = elem[expando]) === cachedkey) {
                                return elem.sizset;
                            } else if (typeof cache === "string" && cache.indexOf(dirkey) === 0) {
                                if (elem.sizset) {
                                    return elem;
                                }
                            } else {
                                elem[expando] = cachedkey;
                                if (matcher(elem, context, xml)) {
                                    elem.sizset = true;
                                    return elem;
                                }
                                elem.sizset = false;
                            }
                        }
                    }
                } else {
                    while ((elem = elem[dir])) {
                        if (checkNonElements || elem.nodeType === 1) {
                            if (matcher(elem, context, xml)) {
                                return elem;
                            }
                        }
                    }
                }
            };
        }

        function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } : matchers[0];
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;
            for (; i < len; i++) {
                if ((elem = unmatched[i])) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }
            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context, xml) {
                var temp, i, elem, preMap = [],
                    postMap = [],
                    preexisting = results.length,
                    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
                    matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
                    matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);
                    i = temp.length;
                    while (i--) {
                        if ((elem = temp[i])) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i])) {
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }
                } else {
                    matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length,
                leadingRelative = Expr.relative[tokens[0].type],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,
                matchContext = addCombinator(function(elem) {
                    return elem === checkContext;
                }, implicitRelative, true),
                matchAnyContext = addCombinator(function(elem) {
                    return indexOf.call(checkContext, elem) > -1;
                }, implicitRelative, true),
                matchers = [function(elem, context, xml) {
                    return (!leadingRelative && (xml || context !== outermostContext)) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                }];
            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                    if (matcher[expando]) {
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && tokens.slice(0, i - 1).join("").replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && tokens.join(""));
                    }
                    matchers.push(matcher);
                }
            }
            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function(seed, context, xml, results, expandContext) {
                    var elem, j, matcher, setMatched = [],
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        outermost = expandContext != null,
                        contextBackup = outermostContext,
                        elems = seed || byElement && Expr.find["TAG"]("*", expandContext && context.parentNode || context),
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);
                    if (outermost) {
                        outermostContext = context !== document && context;
                        cachedruns = superMatcher.el;
                    }
                    for (;
                        (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            for (j = 0;
                                (matcher = elementMatchers[j]); j++) {
                                if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                                cachedruns = ++superMatcher.el;
                            }
                        }
                        if (bySet) {
                            if ((elem = !matcher && elem)) {
                                matchedCount--;
                            }
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }
                    matchedCount += i;
                    if (bySet && i !== matchedCount) {
                        for (j = 0;
                            (matcher = setMatchers[j]); j++) {
                            matcher(unmatched, setMatched, context, xml);
                        }
                        if (seed) {
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }
                            setMatched = condense(setMatched);
                        }
                        push.apply(results, setMatched);
                        if (outermost && !seed && setMatched.length > 0 && (matchedCount + setMatchers.length) > 1) {
                            Sizzle.uniqueSort(results);
                        }
                    }
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }
                    return unmatched;
                };
            superMatcher.el = 0;
            return bySet ? markFunction(superMatcher) : superMatcher;
        }
        compile = Sizzle.compile = function(selector, group) {
            var i, setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[expando][selector + " "];
            if (!cached) {
                if (!group) {
                    group = tokenize(selector);
                }
                i = group.length;
                while (i--) {
                    cached = matcherFromTokens(group[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
            }
            return cached;
        };

        function multipleContexts(selector, contexts, results) {
            var i = 0,
                len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function select(selector, context, results, seed, xml) {
            var i, tokens, token, type, find, match = tokenize(selector),
                j = match.length;
            if (!seed) {
                if (match.length === 1) {
                    tokens = match[0] = match[0].slice(0);
                    if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && !xml && Expr.relative[tokens[1].type]) {
                        context = Expr.find["ID"](token.matches[0].replace(rbackslash, ""), context, xml)[0];
                        if (!context) {
                            return results;
                        }
                        selector = selector.slice(tokens.shift().length);
                    }
                    for (i = matchExpr["POS"].test(selector) ? -1 : tokens.length - 1; i >= 0; i--) {
                        token = tokens[i];
                        if (Expr.relative[(type = token.type)]) {
                            break;
                        }
                        if ((find = Expr.find[type])) {
                            if ((seed = find(token.matches[0].replace(rbackslash, ""), rsibling.test(tokens[0].type) && context.parentNode || context, xml))) {
                                tokens.splice(i, 1);
                                selector = seed.length && tokens.join("");
                                if (!selector) {
                                    push.apply(results, slice.call(seed, 0));
                                    return results;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            compile(selector, match)(seed, context, xml, results, rsibling.test(selector));
            return results;
        }
        if (document.querySelectorAll) {
            (function() {
                var disconnectedMatch, oldSelect = select,
                    rescape = /'|\\/g,
                    rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                    rbuggyQSA = [":focus"],
                    rbuggyMatches = [":active"],
                    matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;
                assert(function(div) {
                    div.innerHTML = "<select><option selected=''></option></select>";
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
                    }
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }
                });
                assert(function(div) {
                    div.innerHTML = "<p test=''></p>";
                    if (div.querySelectorAll("[test^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')");
                    }
                    div.innerHTML = "<input type='hidden'/>";
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }
                });
                rbuggyQSA = new RegExp(rbuggyQSA.join("|"));
                select = function(selector, context, results, seed, xml) {
                    if (!seed && !xml && !rbuggyQSA.test(selector)) {
                        var groups, i, old = true,
                            nid = expando,
                            newContext = context,
                            newSelector = context.nodeType === 9 && selector;
                        if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                            groups = tokenize(selector);
                            if ((old = context.getAttribute("id"))) {
                                nid = old.replace(rescape, "\\$&");
                            } else {
                                context.setAttribute("id", nid);
                            }
                            nid = "[id='" + nid + "'] ";
                            i = groups.length;
                            while (i--) {
                                groups[i] = nid + groups[i].join("");
                            }
                            newContext = rsibling.test(selector) && context.parentNode || context;
                            newSelector = groups.join(",");
                        }
                        if (newSelector) {
                            try {
                                push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0));
                                return results;
                            } catch (qsaError) {} finally {
                                if (!old) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }
                    return oldSelect(selector, context, results, seed, xml);
                };
                if (matches) {
                    assert(function(div) {
                        disconnectedMatch = matches.call(div, "div");
                        try {
                            matches.call(div, "[test!='']:sizzle");
                            rbuggyMatches.push("!=", pseudos);
                        } catch (e) {}
                    });
                    rbuggyMatches = new RegExp(rbuggyMatches.join("|"));
                    Sizzle.matchesSelector = function(elem, expr) {
                        expr = expr.replace(rattributeQuotes, "='$1']");
                        if (!isXML(elem) && !rbuggyMatches.test(expr) && !rbuggyQSA.test(expr)) {
                            try {
                                var ret = matches.call(elem, expr);
                                if (ret || disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                                    return ret;
                                }
                            } catch (e) {}
                        }
                        return Sizzle(expr, null, null, [elem]).length > 0;
                    };
                }
            })();
        }
        Expr.pseudos["nth"] = Expr.pseudos["eq"];

        function setFilters() {}
        Expr.filters = setFilters.prototype = Expr.pseudos;
        Expr.setFilters = new setFilters();
        Sizzle.attr = jQuery.attr;
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;
    })(window);
    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        isSimple = /^.[^:#\[\.,]*$/,
        rneedsContext = jQuery.expr.match.needsContext,
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };
    jQuery.fn.extend({
        find: function(selector) {
            var i, l, length, n, r, ret, self = this;
            if (typeof selector !== "string") {
                return jQuery(selector).filter(function() {
                    for (i = 0, l = self.length; i < l; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                });
            }
            ret = this.pushStack("", "find", selector);
            for (i = 0, l = this.length; i < l; i++) {
                length = ret.length;
                jQuery.find(selector, this[i], ret);
                if (i > 0) {
                    for (n = length; n < ret.length; n++) {
                        for (r = 0; r < length; r++) {
                            if (ret[r] === ret[n]) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }
            return ret;
        },
        has: function(target) {
            var i, targets = jQuery(target, this),
                len = targets.length;
            return this.filter(function() {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector, false), "not", selector);
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector, true), "filter", selector);
        },
        is: function(selector) {
            return !!selector && (typeof selector === "string" ? rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
        },
        closest: function(selectors, context) {
            var cur, i = 0,
                l = this.length,
                ret = [],
                pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;
            for (; i < l; i++) {
                cur = this[i];
                while (cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11) {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break;
                    }
                    cur = cur.parentNode;
                }
            }
            ret = ret.length > 1 ? jQuery.unique(ret) : ret;
            return this.pushStack(ret, "closest", selectors);
        },
        index: function(elem) {
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
            }
            if (typeof elem === "string") {
                return jQuery.inArray(this[0], jQuery(elem));
            }
            return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
        },
        add: function(selector, context) {
            var set = typeof selector === "string" ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
                all = jQuery.merge(this.get(), set);
            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
        },
        addBack: function(selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        }
    });
    jQuery.fn.andSelf = jQuery.fn.addBack;

    function isDisconnected(node) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);
        return cur;
    }
    jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function(elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var ret = jQuery.map(this, fn, until);
            if (!runtil.test(name)) {
                selector = until;
            }
            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }
            ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;
            if (this.length > 1 && rparentsprev.test(name)) {
                ret = ret.reverse();
            }
            return this.pushStack(ret, name, core_slice.call(arguments).join(","));
        };
    });
    jQuery.extend({
        filter: function(expr, elems, not) {
            if (not) {
                expr = ":not(" + expr + ")";
            }
            return elems.length === 1 ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] : jQuery.find.matches(expr, elems);
        },
        dir: function(elem, dir, until) {
            var matched = [],
                cur = elem[dir];
            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },
        sibling: function(n, elem) {
            var r = [];
            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }
            return r;
        }
    });

    function winnow(elements, qualifier, keep) {
        qualifier = qualifier || 0;
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function(elem, i) {
                var retVal = !!qualifier.call(elem, i, elem);
                return retVal === keep;
            });
        } else if (qualifier.nodeType) {
            return jQuery.grep(elements, function(elem, i) {
                return (elem === qualifier) === keep;
            });
        } else if (typeof qualifier === "string") {
            var filtered = jQuery.grep(elements, function(elem) {
                return elem.nodeType === 1;
            });
            if (isSimple.test(qualifier)) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter(qualifier, filtered);
            }
        }
        return jQuery.grep(elements, function(elem, i) {
            return (jQuery.inArray(elem, qualifier) >= 0) === keep;
        });
    }

    function createSafeFragment(document) {
        var list = nodeNames.split("|"),
            safeFrag = document.createDocumentFragment();
        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(list.pop());
            }
        }
        return safeFrag;
    }
    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        rnocache = /<(?:script|object|embed|option|style)/i,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rcheckableType = /^(?:checkbox|radio)$/,
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /\/(java|ecma)script/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
        wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        safeFragment = createSafeFragment(document),
        fragmentDiv = safeFragment.appendChild(document.createElement("div"));
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    if (!jQuery.support.htmlSerialize) {
        wrapMap._default = [1, "X<div>", "</div>"];
    }
    jQuery.fn.extend({
        text: function(value) {
            return jQuery.access(this, function(value) {
                return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },
        wrapAll: function(html) {
            if (jQuery.isFunction(html)) {
                return this.each(function(i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }
                wrap.map(function() {
                    var elem = this;
                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }
                    return elem;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(html) {
            if (jQuery.isFunction(html)) {
                return this.each(function(i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }
            return this.each(function() {
                var self = jQuery(this),
                    contents = self.contents();
                if (contents.length) {
                    contents.wrapAll(html);
                } else {
                    self.append(html);
                }
            });
        },
        wrap: function(html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        },
        append: function() {
            return this.domManip(arguments, true, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11) {
                    this.appendChild(elem);
                }
            });
        },
        prepend: function() {
            return this.domManip(arguments, true, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11) {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },
        before: function() {
            if (!isDisconnected(this[0])) {
                return this.domManip(arguments, false, function(elem) {
                    this.parentNode.insertBefore(elem, this);
                });
            }
            if (arguments.length) {
                var set = jQuery.clean(arguments);
                return this.pushStack(jQuery.merge(set, this), "before", this.selector);
            }
        },
        after: function() {
            if (!isDisconnected(this[0])) {
                return this.domManip(arguments, false, function(elem) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                });
            }
            if (arguments.length) {
                var set = jQuery.clean(arguments);
                return this.pushStack(jQuery.merge(this, set), "after", this.selector);
            }
        },
        remove: function(selector, keepData) {
            var elem, i = 0;
            for (;
                (elem = this[i]) != null; i++) {
                if (!selector || jQuery.filter(selector, [elem]).length) {
                    if (!keepData && elem.nodeType === 1) {
                        jQuery.cleanData(elem.getElementsByTagName("*"));
                        jQuery.cleanData([elem]);
                    }
                    if (elem.parentNode) {
                        elem.parentNode.removeChild(elem);
                    }
                }
            }
            return this;
        },
        empty: function() {
            var elem, i = 0;
            for (;
                (elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                }
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value) {
            return jQuery.access(this, function(value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;
                if (value === undefined) {
                    return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
                }
                if (typeof value === "string" && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(elem.getElementsByTagName("*"));
                                elem.innerHTML = value;
                            }
                        }
                        elem = 0;
                    } catch (e) {}
                }
                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },
        replaceWith: function(value) {
            if (!isDisconnected(this[0])) {
                if (jQuery.isFunction(value)) {
                    return this.each(function(i) {
                        var self = jQuery(this),
                            old = self.html();
                        self.replaceWith(value.call(this, i, old));
                    });
                }
                if (typeof value !== "string") {
                    value = jQuery(value).detach();
                }
                return this.each(function() {
                    var next = this.nextSibling,
                        parent = this.parentNode;
                    jQuery(this).remove();
                    if (next) {
                        jQuery(next).before(value);
                    } else {
                        jQuery(parent).append(value);
                    }
                });
            }
            return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this;
        },
        detach: function(selector) {
            return this.remove(selector, true);
        },
        domManip: function(args, table, callback) {
            args = [].concat.apply([], args);
            var results, first, fragment, iNoClone, i = 0,
                value = args[0],
                scripts = [],
                l = this.length;
            if (!jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test(value)) {
                return this.each(function() {
                    jQuery(this).domManip(args, table, callback);
                });
            }
            if (jQuery.isFunction(value)) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip(args, table, callback);
                });
            }
            if (this[0]) {
                results = jQuery.buildFragment(args, this, scripts);
                fragment = results.fragment;
                first = fragment.firstChild;
                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }
                if (first) {
                    table = table && jQuery.nodeName(first, "tr");
                    for (iNoClone = results.cacheable || l - 1; i < l; i++) {
                        callback.call(table && jQuery.nodeName(this[i], "table") ? findOrAppend(this[i], "tbody") : this[i], i === iNoClone ? fragment : jQuery.clone(fragment, true, true));
                    }
                }
                fragment = first = null;
                if (scripts.length) {
                    jQuery.each(scripts, function(i, elem) {
                        if (elem.src) {
                            if (jQuery.ajax) {
                                jQuery.ajax({
                                    url: elem.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    "throws": true
                                });
                            } else {
                                jQuery.error("no ajax");
                            }
                        } else {
                            jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, ""));
                        }
                        if (elem.parentNode) {
                            elem.parentNode.removeChild(elem);
                        }
                    });
                }
            }
            return this;
        }
    });

    function findOrAppend(elem, tag) {
        return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
    }

    function cloneCopyEvent(src, dest) {
        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }
        var type, i, l, oldData = jQuery._data(src),
            curData = jQuery._data(dest, oldData),
            events = oldData.events;
        if (events) {
            delete curData.handle;
            curData.events = {};
            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }

    function cloneFixAttributes(src, dest) {
        var nodeName;
        if (dest.nodeType !== 1) {
            return;
        }
        if (dest.clearAttributes) {
            dest.clearAttributes();
        }
        if (dest.mergeAttributes) {
            dest.mergeAttributes(src);
        }
        nodeName = dest.nodeName.toLowerCase();
        if (nodeName === "object") {
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }
            if (jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                dest.innerHTML = src.innerHTML;
            }
        } else if (nodeName === "input" && rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
                dest.value = src.value;
            }
        } else if (nodeName === "option") {
            dest.selected = src.defaultSelected;
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        } else if (nodeName === "script" && dest.text !== src.text) {
            dest.text = src.text;
        }
        dest.removeAttribute(jQuery.expando);
    }
    jQuery.buildFragment = function(args, context, scripts) {
        var fragment, cacheable, cachehit, first = args[0];
        context = context || document;
        context = !context.nodeType && context[0] || context;
        context = context.ownerDocument || context;
        if (args.length === 1 && typeof first === "string" && first.length < 512 && context === document && first.charAt(0) === "<" && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && (jQuery.support.html5Clone || !rnoshimcache.test(first))) {
            cacheable = true;
            fragment = jQuery.fragments[first];
            cachehit = fragment !== undefined;
        }
        if (!fragment) {
            fragment = context.createDocumentFragment();
            jQuery.clean(args, context, fragment, scripts);
            if (cacheable) {
                jQuery.fragments[first] = cachehit && fragment;
            }
        }
        return {
            fragment: fragment,
            cacheable: cacheable
        };
    };
    jQuery.fragments = {};
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            var elems, i = 0,
                ret = [],
                insert = jQuery(selector),
                l = insert.length,
                parent = this.length === 1 && this[0].parentNode;
            if ((parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1) {
                insert[original](this[0]);
                return this;
            } else {
                for (; i < l; i++) {
                    elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery(insert[i])[original](elems);
                    ret = ret.concat(elems);
                }
                return this.pushStack(ret, name, insert.selector);
            }
        };
    });

    function getAll(elem) {
        if (typeof elem.getElementsByTagName !== "undefined") {
            return elem.getElementsByTagName("*");
        } else if (typeof elem.querySelectorAll !== "undefined") {
            return elem.querySelectorAll("*");
        } else {
            return [];
        }
    }

    function fixDefaultChecked(elem) {
        if (rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }
    jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var srcElements, destElements, i, clone;
            if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                clone = elem.cloneNode(true);
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }
            if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                cloneFixAttributes(elem, clone);
                srcElements = getAll(elem);
                destElements = getAll(clone);
                for (i = 0; srcElements[i]; ++i) {
                    if (destElements[i]) {
                        cloneFixAttributes(srcElements[i], destElements[i]);
                    }
                }
            }
            if (dataAndEvents) {
                cloneCopyEvent(elem, clone);
                if (deepDataAndEvents) {
                    srcElements = getAll(elem);
                    destElements = getAll(clone);
                    for (i = 0; srcElements[i]; ++i) {
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                }
            }
            srcElements = destElements = null;
            return clone;
        },
        clean: function(elems, context, fragment, scripts) {
            var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags, safe = context === document && safeFragment,
                ret = [];
            if (!context || typeof context.createDocumentFragment === "undefined") {
                context = document;
            }
            for (i = 0;
                (elem = elems[i]) != null; i++) {
                if (typeof elem === "number") {
                    elem += "";
                }
                if (!elem) {
                    continue;
                }
                if (typeof elem === "string") {
                    if (!rhtml.test(elem)) {
                        elem = context.createTextNode(elem);
                    } else {
                        safe = safe || createSafeFragment(context);
                        div = context.createElement("div");
                        safe.appendChild(div);
                        elem = elem.replace(rxhtmlTag, "<$1></$2>");
                        tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        depth = wrap[0];
                        div.innerHTML = wrap[1] + elem + wrap[2];
                        while (depth--) {
                            div = div.lastChild;
                        }
                        if (!jQuery.support.tbody) {
                            hasBody = rtbody.test(elem);
                            tbody = tag === "table" && !hasBody ? div.firstChild && div.firstChild.childNodes : wrap[1] === "<table>" && !hasBody ? div.childNodes : [];
                            for (j = tbody.length - 1; j >= 0; --j) {
                                if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                    tbody[j].parentNode.removeChild(tbody[j]);
                                }
                            }
                        }
                        if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                        }
                        elem = div.childNodes;
                        div.parentNode.removeChild(div);
                    }
                }
                if (elem.nodeType) {
                    ret.push(elem);
                } else {
                    jQuery.merge(ret, elem);
                }
            }
            if (div) {
                elem = div = safe = null;
            }
            if (!jQuery.support.appendChecked) {
                for (i = 0;
                    (elem = ret[i]) != null; i++) {
                    if (jQuery.nodeName(elem, "input")) {
                        fixDefaultChecked(elem);
                    } else if (typeof elem.getElementsByTagName !== "undefined") {
                        jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
                    }
                }
            }
            if (fragment) {
                handleScript = function(elem) {
                    if (!elem.type || rscriptType.test(elem.type)) {
                        return scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem);
                    }
                };
                for (i = 0;
                    (elem = ret[i]) != null; i++) {
                    if (!(jQuery.nodeName(elem, "script") && handleScript(elem))) {
                        fragment.appendChild(elem);
                        if (typeof elem.getElementsByTagName !== "undefined") {
                            jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);
                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                            i += jsTags.length;
                        }
                    }
                }
            }
            return ret;
        },
        cleanData: function(elems, acceptData) {
            var data, id, elem, type, i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                deleteExpando = jQuery.support.deleteExpando,
                special = jQuery.event.special;
            for (;
                (elem = elems[i]) != null; i++) {
                if (acceptData || jQuery.acceptData(elem)) {
                    id = elem[internalKey];
                    data = id && cache[id];
                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }
                        if (cache[id]) {
                            delete cache[id];
                            if (deleteExpando) {
                                delete elem[internalKey];
                            } else if (elem.removeAttribute) {
                                elem.removeAttribute(internalKey);
                            } else {
                                elem[internalKey] = null;
                            }
                            jQuery.deletedIds.push(id);
                        }
                    }
                }
            }
        }
    });
    (function() {
        var matched, browser;
        jQuery.uaMatch = function(ua) {
            ua = ua.toLowerCase();
            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[\/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[\/]([\w.]+)/.exec(ua) || /(msie)([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        };
        matched = jQuery.uaMatch(navigator.userAgent);
        browser = {};
        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }
        jQuery.browser = browser;
        jQuery.sub = function() {
            function jQuerySub(selector, context) {
                return new jQuerySub.fn.init(selector, context);
            }
            jQuery.extend(true, jQuerySub, this);
            jQuerySub.superclass = this;
            jQuerySub.fn = jQuerySub.prototype = this();
            jQuerySub.fn.constructor = jQuerySub;
            jQuerySub.sub = this.sub;
            jQuerySub.fn.init = function init(selector, context) {
                if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
                    context = jQuerySub(context);
                }
                return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
            };
            jQuerySub.fn.init.prototype = jQuerySub.fn;
            var rootjQuerySub = jQuerySub(document);
            return jQuerySub;
        };
    })();
    var curCSS, iframe, iframeDoc, ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,
        rposition = /^(top|right|bottom|left)$/,
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
        rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
        rrelNum = new RegExp("^([-+])=(" + core_pnum + ")", "i"),
        elemdisplay = {
            BODY: "block"
        },
        cssShow = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },
        cssExpand = ["Top", "Right", "Bottom", "Left"],
        cssPrefixes = ["Webkit", "O", "Moz", "ms"],
        eventsToggle = jQuery.fn.toggle;

    function vendorPropName(style, name) {
        if (name in style) {
            return name;
        }
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }
        return origName;
    }

    function isHidden(elem, el) {
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    }

    function showHide(elements, show) {
        var elem, display, values = [],
            index = 0,
            length = elements.length;
        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            values[index] = jQuery._data(elem, "olddisplay");
            if (show) {
                if (!values[index] && elem.style.display === "none") {
                    elem.style.display = "";
                }
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName));
                }
            } else {
                display = curCSS(elem, "display");
                if (!values[index] && display !== "none") {
                    jQuery._data(elem, "olddisplay", display);
                }
            }
        }
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }
        return elements;
    }
    jQuery.fn.extend({
        css: function(name, value) {
            return jQuery.access(this, function(elem, name, value) {
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function() {
            return showHide(this, true);
        },
        hide: function() {
            return showHide(this);
        },
        toggle: function(state, fn2) {
            var bool = typeof state === "boolean";
            if (jQuery.isFunction(state) && jQuery.isFunction(fn2)) {
                return eventsToggle.apply(this, arguments);
            }
            return this.each(function() {
                if (bool ? state : isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });
    jQuery.extend({
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
        cssProps: {
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }
            var ret, type, hooks, origName = jQuery.camelCase(name),
                style = elem.style;
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== undefined) {
                type = typeof value;
                if (type === "string" && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    type = "number";
                }
                if (value == null || type === "number" && isNaN(value)) {
                    return;
                }
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    try {
                        style[name] = value;
                    } catch (e) {}
                }
            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }
                return style[name];
            }
        },
        css: function(elem, name, numeric, extra) {
            var val, num, hooks, origName = jQuery.camelCase(name);
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }
            if (val === undefined) {
                val = curCSS(elem, name);
            }
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }
            if (numeric || extra !== undefined) {
                num = parseFloat(val);
                return numeric || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        },
        swap: function(elem, options, callback) {
            var ret, name, old = {};
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            ret = callback.call(elem);
            for (name in options) {
                elem.style[name] = old[name];
            }
            return ret;
        }
    });
    if (window.getComputedStyle) {
        curCSS = function(elem, name) {
            var ret, width, minWidth, maxWidth, computed = window.getComputedStyle(elem, null),
                style = elem.style;
            if (computed) {
                ret = computed.getPropertyValue(name) || computed[name];
                if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }
            return ret;
        };
    } else if (document.documentElement.currentStyle) {
        curCSS = function(elem, name) {
            var left, rsLeft, ret = elem.currentStyle && elem.currentStyle[name],
                style = elem.style;
            if (ret == null && style && style[name]) {
                ret = style[name];
            }
            if (rnumnonpx.test(ret) && !rposition.test(name)) {
                left = style.left;
                rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;
                if (rsLeft) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";
                style.left = left;
                if (rsLeft) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }
            return ret === "" ? "auto" : ret;
        };
    }

    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }

    function augmentWidthOrHeight(elem, name, extra, isBorderBox) {
        var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0,
            val = 0;
        for (; i < 4; i += 2) {
            if (extra === "margin") {
                val += jQuery.css(elem, extra + cssExpand[i], true);
            }
            if (isBorderBox) {
                if (extra === "content") {
                    val -= parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0;
                }
                if (extra !== "margin") {
                    val -= parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0;
                }
            } else {
                val += parseFloat(curCSS(elem, "padding" + cssExpand[i])) || 0;
                if (extra !== "padding") {
                    val += parseFloat(curCSS(elem, "border" + cssExpand[i] + "Width")) || 0;
                }
            }
        }
        return val;
    }

    function getWidthOrHeight(elem, name, extra) {
        var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            valueIsBorderBox = true,
            isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing") === "border-box";
        if (val <= 0 || val == null) {
            val = curCSS(elem, name);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }
            if (rnumnonpx.test(val)) {
                return val;
            }
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);
            val = parseFloat(val) || 0;
        }
        return (val +
            augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox)) + "px";
    }

    function css_defaultDisplay(nodeName) {
        if (elemdisplay[nodeName]) {
            return elemdisplay[nodeName];
        }
        var elem = jQuery("<" + nodeName + ">").appendTo(document.body),
            display = elem.css("display");
        elem.remove();
        if (display === "none" || display === "") {
            iframe = document.body.appendChild(iframe || jQuery.extend(document.createElement("iframe"), {
                frameBorder: 0,
                width: 0,
                height: 0
            }));
            if (!iframeDoc || !iframe.createElement) {
                iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                iframeDoc.write("<!doctype html><html><body>");
                iframeDoc.close();
            }
            elem = iframeDoc.body.appendChild(iframeDoc.createElement(nodeName));
            display = curCSS(elem, "display");
            document.body.removeChild(iframe);
        }
        elemdisplay[nodeName] = display;
        return display;
    }
    jQuery.each(["height", "width"], function(i, name) {
        jQuery.cssHooks[name] = {
            get: function(elem, computed, extra) {
                if (computed) {
                    if (elem.offsetWidth === 0 && rdisplayswap.test(curCSS(elem, "display"))) {
                        return jQuery.swap(elem, cssShow, function() {
                            return getWidthOrHeight(elem, name, extra);
                        });
                    } else {
                        return getWidthOrHeight(elem, name, extra);
                    }
                }
            },
            set: function(elem, value, extra) {
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && jQuery.css(elem, "boxSizing") === "border-box") : 0);
            }
        };
    });
    if (!jQuery.support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function(elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : computed ? "1" : "";
            },
            set: function(elem, value) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";
                style.zoom = 1;
                if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {
                    style.removeAttribute("filter");
                    if (currentStyle && !currentStyle.filter) {
                        return;
                    }
                }
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
            }
        };
    }
    jQuery(function() {
        if (!jQuery.support.reliableMarginRight) {
            jQuery.cssHooks.marginRight = {
                get: function(elem, computed) {
                    return jQuery.swap(elem, {
                        "display": "inline-block"
                    }, function() {
                        if (computed) {
                            return curCSS(elem, "marginRight");
                        }
                    });
                }
            };
        }
        if (!jQuery.support.pixelPosition && jQuery.fn.position) {
            jQuery.each(["top", "left"], function(i, prop) {
                jQuery.cssHooks[prop] = {
                    get: function(elem, computed) {
                        if (computed) {
                            var ret = curCSS(elem, prop);
                            return rnumnonpx.test(ret) ? jQuery(elem).position()[prop] + "px" : ret;
                        }
                    }
                };
            });
        }
    });
    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function(elem) {
            return (elem.offsetWidth === 0 && elem.offsetHeight === 0) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS(elem, "display")) === "none");
        };
        jQuery.expr.filters.visible = function(elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                var i, parts = typeof value === "string" ? value.split(" ") : [value],
                    expanded = {};
                for (i = 0; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                }
                return expanded;
            }
        };
        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        rselectTextarea = /^(?:select|textarea)/i;
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val, i) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    });
    jQuery.param = function(a, traditional) {
        var prefix, s = [],
            add = function(key, value) {
                value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }
        if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
            jQuery.each(a, function() {
                add(this.name, this.value);
            });
        } else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }
        return s.join("&").replace(r20, "+");
    };

    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
                if (traditional || rbracket.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === "object") {
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else {
            add(prefix, obj);
        }
    }
    var
        ajaxLocParts, ajaxLocation, rhash = /#.*$/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rts = /([?&])_=[^&]*/,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        _load = jQuery.fn.load,
        prefilters = {},
        transports = {},
        allTypes = ["*/"] + ["*"];
    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }
            var dataType, list, placeBefore, dataTypes = dataTypeExpression.toLowerCase().split(core_rspace),
                i = 0,
                length = dataTypes.length;
            if (jQuery.isFunction(func)) {
                for (; i < length; i++) {
                    dataType = dataTypes[i];
                    placeBefore = /^\+/.test(dataType);
                    if (placeBefore) {
                        dataType = dataType.substr(1) || "*";
                    }
                    list = structure[dataType] = structure[dataType] || [];
                    list[placeBefore ? "unshift" : "push"](func);
                }
            }
        };
    }

    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected) {
        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};
        inspected[dataType] = true;
        var selection, list = structure[dataType],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = (structure === prefilters);
        for (; i < length && (executeOnly || !selection); i++) {
            selection = list[i](options, originalOptions, jqXHR);
            if (typeof selection === "string") {
                if (!executeOnly || inspected[selection]) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift(selection);
                    selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
                }
            }
        }
        if ((executeOnly || !selection) && !inspected["*"]) {
            selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected);
        }
        return selection;
    }

    function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
    }
    jQuery.fn.load = function(url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }
        if (!this.length) {
            return this;
        }
        var selector, type, response, self = this,
            off = url.indexOf(" ");
        if (off >= 0) {
            selector = url.slice(off, url.length);
            url = url.slice(0, off);
        }
        if (jQuery.isFunction(params)) {
            callback = params;
            params = undefined;
        } else if (params && typeof params === "object") {
            type = "POST";
        }
        jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params,
            complete: function(jqXHR, status) {
                if (callback) {
                    self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
                }
            }
        }).done(function(responseText) {
            response = arguments;
            self.html(selector ? jQuery("<div>").append(responseText.replace(rscript, "")).find(selector) : responseText);
        });
        return this;
    };
    jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o) {
        jQuery.fn[o] = function(f) {
            return this.on(o, f);
        };
    });
    jQuery.each(["get", "post"], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });
    jQuery.extend({
        getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        ajaxSetup: function(target, settings) {
            if (settings) {
                ajaxExtend(target, jQuery.ajaxSettings);
            } else {
                settings = target;
                target = jQuery.ajaxSettings;
            }
            ajaxExtend(target, settings);
            return target;
        },
        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true,
            async: true,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": allTypes
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": window.String,
                "text html": true,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },
            flatOptions: {
                context: true,
                url: true
            }
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function(url, options) {
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }
            options = options || {};
            var
                ifModifiedKey, responseHeadersString, responseHeaders, transport, timeoutTimer, parts, fireGlobals, i, s = jQuery.ajaxSetup({}, options),
                callbackContext = s.context || s,
                globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event,
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
                statusCode = s.statusCode || {},
                requestHeaders = {},
                requestHeadersNames = {},
                state = 0,
                strAbort = "canceled",
                jqXHR = {
                    readyState: 0,
                    setRequestHeader: function(name, value) {
                        if (!state) {
                            var lname = name.toLowerCase();
                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    },
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },
                    getResponseHeader: function(key) {
                        var match;
                        if (state === 2) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while ((match = rheaders.exec(responseHeadersString))) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match === undefined ? null : match;
                    },
                    overrideMimeType: function(type) {
                        if (!state) {
                            s.mimeType = type;
                        }
                        return this;
                    },
                    abort: function(statusText) {
                        statusText = statusText || strAbort;
                        if (transport) {
                            transport.abort(statusText);
                        }
                        done(0, statusText);
                        return this;
                    }
                };

            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                if (state === 2) {
                    return;
                }
                state = 2;
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
                transport = undefined;
                responseHeadersString = headers || "";
                jqXHR.readyState = status > 0 ? 4 : 0;
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }
                if (status >= 200 && status < 300 || status === 304) {
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[ifModifiedKey] = modified;
                        }
                        modified = jqXHR.getResponseHeader("Etag");
                        if (modified) {
                            jQuery.etag[ifModifiedKey] = modified;
                        }
                    }
                    if (status === 304) {
                        statusText = "notmodified";
                        isSuccess = true;
                    } else {
                        isSuccess = ajaxConvert(s, response);
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    error = statusText;
                    if (!statusText || status) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }
                jqXHR.statusCode(statusCode);
                statusCode = undefined;
                if (fireGlobals) {
                    globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [jqXHR, s, isSuccess ? success : error]);
                }
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }
            deferred.promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.add;
            jqXHR.statusCode = function(map) {
                if (map) {
                    var tmp;
                    if (state < 2) {
                        for (tmp in map) {
                            statusCode[tmp] = [statusCode[tmp], map[tmp]];
                        }
                    } else {
                        tmp = map[jqXHR.status];
                        jqXHR.always(tmp);
                    }
                }
                return this;
            };
            s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(core_rspace);
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))));
            }
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (state === 2) {
                return jqXHR;
            }
            fireGlobals = s.global;
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }
            if (!s.hasContent) {
                if (s.data) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
                    delete s.data;
                }
                ifModifiedKey = s.url;
                if (s.cache === false) {
                    var ts = jQuery.now(),
                        ret = s.url.replace(rts, "$1_=" + ts);
                    s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            if (s.ifModified) {
                ifModifiedKey = ifModifiedKey || s.url;
                if (jQuery.lastModified[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                }
                if (jQuery.etag[ifModifiedKey]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
                }
            }
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                return jqXHR.abort();
            }
            strAbort = "abort";
            for (i in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) {
                jqXHR[i](s[i]);
            }
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }
                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    if (state < 2) {
                        done(-1, e);
                    } else {
                        throw e;
                    }
                }
            }
            return jqXHR;
        },
        active: 0,
        lastModified: {},
        etag: {}
    });

    function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;
        for (type in responseFields) {
            if (type in responses) {
                jqXHR[responseFields[type]] = responses[type];
            }
        }
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("content-type");
            }
        }
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    function ajaxConvert(s, response) {
        var conv, conv2, current, tmp, dataTypes = s.dataTypes.slice(),
            prev = dataTypes[0],
            converters = {},
            i = 0;
        if (s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
        }
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }
        for (;
            (current = dataTypes[++i]);) {
            if (current !== "*") {
                if (prev !== "*" && prev !== current) {
                    conv = converters[prev + " " + current] || converters["* " + current];
                    if (!conv) {
                        for (conv2 in converters) {
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {
                                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                                if (conv) {
                                    if (conv === true) {
                                        conv = converters[conv2];
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.splice(i--, 0, current);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (conv !== true) {
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: conv ? e : "No conversion from " + prev + " to " + current
                                };
                            }
                        }
                    }
                }
                prev = current;
            }
        }
        return {
            state: "success",
            data: response
        };
    }
    var oldCallbacks = [],
        rquestion = /\?/,
        rjsonp = /(=)\?(?=&|$)|\?\?/,
        nonce = jQuery.now();
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
            this[callback] = true;
            return callback;
        }
    });
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, data = s.data,
            url = s.url,
            hasCallback = s.jsonp !== false,
            replaceInUrl = hasCallback && rjsonp.test(url),
            replaceInData = hasCallback && !replaceInUrl && typeof data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(data);
        if (s.dataTypes[0] === "jsonp" || replaceInUrl || replaceInData) {
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            overwritten = window[callbackName];
            if (replaceInUrl) {
                s.url = url.replace(rjsonp, "$1" + callbackName);
            } else if (replaceInData) {
                s.data = data.replace(rjsonp, "$1" + callbackName);
            } else if (hasCallback) {
                s.url += (rquestion.test(url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            window[callbackName] = function() {
                responseContainer = arguments;
            };
            jqXHR.always(function() {
                window[callbackName] = overwritten;
                if (s[callbackName]) {
                    s.jsonpCallback = originalSettings.jsonpCallback;
                    oldCallbacks.push(callbackName);
                }
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }
                responseContainer = overwritten = undefined;
            });
            return "script";
        }
    });
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });
    jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });
    jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain) {
            var script, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            return {
                send: function(_, callback) {
                    script = document.createElement("script");
                    script.async = "async";
                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }
                    script.src = s.url;
                    script.onload = script.onreadystatechange = function(_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            script.onload = script.onreadystatechange = null;
                            if (head && script.parentNode) {
                                head.removeChild(script);
                            }
                            script = undefined;
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };
                    head.insertBefore(script, head.firstChild);
                },
                abort: function() {
                    if (script) {
                        script.onload(0, 1);
                    }
                }
            };
        }
    });
    var xhrCallbacks, xhrOnUnloadAbort = window.ActiveXObject ? function() {
            for (var key in xhrCallbacks) {
                xhrCallbacks[key](0, 1);
            }
        } : false,
        xhrId = 0;

    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {}
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    jQuery.ajaxSettings.xhr = window.ActiveXObject ? function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } : createStandardXHR;
    (function(xhr) {
        jQuery.extend(jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ("withCredentials" in xhr)
        });
    })(jQuery.ajaxSettings.xhr());
    if (jQuery.support.ajax) {
        jQuery.ajaxTransport(function(s) {
            if (!s.crossDomain || jQuery.support.cors) {
                var callback;
                return {
                    send: function(headers, complete) {
                        var handle, i, xhr = s.xhr();
                        if (s.username) {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else {
                            xhr.open(s.type, s.url, s.async);
                        }
                        if (s.xhrFields) {
                            for (i in s.xhrFields) {
                                xhr[i] = s.xhrFields[i];
                            }
                        }
                        if (s.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(s.mimeType);
                        }
                        if (!s.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }
                        try {
                            for (i in headers) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch (_) {}
                        xhr.send((s.hasContent && s.data) || null);
                        callback = function(_, isAbort) {
                            var status, statusText, responseHeaders, responses, xml;
                            try {
                                if (callback && (isAbort || xhr.readyState === 4)) {
                                    callback = undefined;
                                    if (handle) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if (xhrOnUnloadAbort) {
                                            delete xhrCallbacks[handle];
                                        }
                                    }
                                    if (isAbort) {
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;
                                        if (xml && xml.documentElement) {
                                            responses.xml = xml;
                                        }
                                        try {
                                            responses.text = xhr.responseText;
                                        } catch (e) {}
                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            statusText = "";
                                        }
                                        if (!status && s.isLocal && !s.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort) {
                                    complete(-1, firefoxAccessException);
                                }
                            }
                            if (responses) {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };
                        if (!s.async) {
                            callback();
                        } else if (xhr.readyState === 4) {
                            setTimeout(callback, 0);
                        } else {
                            handle = ++xhrId;
                            if (xhrOnUnloadAbort) {
                                if (!xhrCallbacks) {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },
                    abort: function() {
                        if (callback) {
                            callback(0, 1);
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp("^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i"),
        rrun = /queueHooks$/,
        animationPrefilters = [defaultPrefilter],
        tweeners = {
            "*": [function(prop, value) {
                var end, unit, tween = this.createTween(prop, value),
                    parts = rfxnum.exec(value),
                    target = tween.cur(),
                    start = +target || 0,
                    scale = 1,
                    maxIterations = 20;
                if (parts) {
                    end = +parts[2];
                    unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px");
                    if (unit !== "px" && start) {
                        start = jQuery.css(tween.elem, prop, true) || end || 1;
                        do {
                            scale = scale || ".5";
                            start = start / scale;
                            jQuery.style(tween.elem, prop, start + unit);
                        } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
                    }
                    tween.unit = unit;
                    tween.start = start;
                    tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
                }
                return tween;
            }]
        };

    function createFxNow() {
        setTimeout(function() {
            fxNow = undefined;
        }, 0);
        return (fxNow = jQuery.now());
    }

    function createTweens(animation, props) {
        jQuery.each(props, function(prop, value) {
            var collection = (tweeners[prop] || []).concat(tweeners["*"]),
                index = 0,
                length = collection.length;
            for (; index < length; index++) {
                if (collection[index].call(animation, prop, value)) {
                    return;
                }
            }
        });
    }

    function Animation(elem, properties, options) {
        var result, index = 0,
            tweenerIndex = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always(function() {
                delete tick.elem;
            }),
            tick = function() {
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;
                for (; index < length; index++) {
                    animation.tweens[index].run(percent);
                }
                deferred.notifyWith(elem, [animation, percent, remaining]);
                if (percent < 1 && length) {
                    return remaining;
                } else {
                    deferred.resolveWith(elem, [animation]);
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend({}, properties),
                opts: jQuery.extend(true, {
                    specialEasing: {}
                }, options),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function(prop, end, easing) {
                    var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                    animation.tweens.push(tween);
                    return tween;
                },
                stop: function(gotoEnd) {
                    var index = 0,
                        length = gotoEnd ? animation.tweens.length : 0;
                    for (; index < length; index++) {
                        animation.tweens[index].run(1);
                    }
                    if (gotoEnd) {
                        deferred.resolveWith(elem, [animation, gotoEnd]);
                    } else {
                        deferred.rejectWith(elem, [animation, gotoEnd]);
                    }
                    return this;
                }
            }),
            props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }
        createTweens(animation, props);
        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }
        jQuery.fx.timer(jQuery.extend(tick, {
            anim: animation,
            queue: animation.opts.queue,
            elem: elem
        }));
        return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }

    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }
            if (index !== name) {
                props[name] = value;
                delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function(props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ["*"];
            } else {
                props = props.split(" ");
            }
            var prop, index = 0,
                length = props.length;
            for (; index < length; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        },
        prefilter: function(callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });

    function defaultPrefilter(elem, props, opts) {
        var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire, anim = this,
            style = elem.style,
            orig = {},
            handled = [],
            hidden = elem.nodeType && isHidden(elem);
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;
            anim.always(function() {
                anim.always(function() {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];
            if (jQuery.css(elem, "display") === "inline" && jQuery.css(elem, "float") === "none") {
                if (!jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === "inline") {
                    style.display = "inline-block";
                } else {
                    style.zoom = 1;
                }
            }
        }
        if (opts.overflow) {
            style.overflow = "hidden";
            if (!jQuery.support.shrinkWrapBlocks) {
                anim.done(function() {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }
        for (index in props) {
            value = props[index];
            if (rfxtypes.exec(value)) {
                delete props[index];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    continue;
                }
                handled.push(index);
            }
        }
        length = handled.length;
        if (length) {
            dataShow = jQuery._data(elem, "fxshow") || jQuery._data(elem, "fxshow", {});
            if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
            }
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function() {
                    jQuery(elem).hide();
                });
            }
            anim.done(function() {
                var prop;
                jQuery.removeData(elem, "fxshow", true);
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (index = 0; index < length; index++) {
                prop = handled[index];
                tween = anim.createTween(prop, hidden ? dataShow[prop] : 0);
                orig[prop] = dataShow[prop] || jQuery.style(elem, prop);
                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;
    Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };
    Tween.prototype.init.prototype = Tween.prototype;
    Tween.propHooks = {
        _default: {
            get: function(tween) {
                var result;
                if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }
                result = jQuery.css(tween.elem, tween.prop, false, "");
                return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };
    jQuery.each(["toggle", "show", "hide"], function(i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" || (!i && jQuery.isFunction(speed) && jQuery.isFunction(easing)) ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
    });
    jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHidden).css("opacity", 0).show().end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop),
                optall = jQuery.speed(speed, easing, callback),
                doAnimation = function() {
                    var anim = Animation(this, jQuery.extend({}, prop), optall);
                    if (empty) {
                        anim.stop(true);
                    }
                };
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };
            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }
            return this.each(function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data(this);
                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        }
    });

    function genFx(type, includeWidth) {
        var which, attrs = {
                height: type
            },
            i = 0;
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }
        return attrs;
    }
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });
    jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }
            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };
        return opt;
    };
    jQuery.easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    };
    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function() {
        var timer, timers = jQuery.timers,
            i = 0;
        fxNow = jQuery.now();
        for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }
        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };
    jQuery.fx.timer = function(timer) {
        if (timer() && jQuery.timers.push(timer) && !timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };
    jQuery.fx.interval = 13;
    jQuery.fx.stop = function() {
        clearInterval(timerId);
        timerId = null;
    };
    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    jQuery.fx.step = {};
    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.animated = function(elem) {
            return jQuery.grep(jQuery.timers, function(fn) {
                return elem === fn.elem;
            }).length;
        };
    }
    var rroot = /^(?:body|html)$/i;
    jQuery.fn.offset = function(options) {
        if (arguments.length) {
            return options === undefined ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
            });
        }
        var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, box = {
                top: 0,
                left: 0
            },
            elem = this[0],
            doc = elem && elem.ownerDocument;
        if (!doc) {
            return;
        }
        if ((body = doc.body) === elem) {
            return jQuery.offset.bodyOffset(elem);
        }
        docElem = doc.documentElement;
        if (!jQuery.contains(docElem, elem)) {
            return box;
        }
        if (typeof elem.getBoundingClientRect !== "undefined") {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        clientTop = docElem.clientTop || body.clientTop || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;
        scrollTop = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    };
    jQuery.offset = {
        bodyOffset: function(body) {
            var top = body.offsetTop,
                left = body.offsetLeft;
            if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }
            return {
                top: top,
                left: left
            };
        },
        setOffset: function(elem, options, i) {
            var position = jQuery.css(elem, "position");
            if (position === "static") {
                elem.style.position = "relative";
            }
            var curElem = jQuery(elem),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css(elem, "top"),
                curCSSLeft = jQuery.css(elem, "left"),
                calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {},
                curPosition = {},
                curTop, curLeft;
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }
            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }
            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };
    jQuery.fn.extend({
        position: function() {
            if (!this[0]) {
                return;
            }
            var elem = this[0],
                offsetParent = this.offsetParent(),
                offset = this.offset(),
                parentOffset = rroot.test(offsetParent[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : offsetParent.offset();
            offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;
            parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.body;
                while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.body;
            });
        }
    });
    jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        var top = /Y/.test(prop);
        jQuery.fn[method] = function(val) {
            return jQuery.access(this, function(elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) {
                    return win ? (prop in win) ? win[prop] : win.document.documentElement[method] : elem[method];
                }
                if (win) {
                    win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });

    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
    }
    jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name, type) {
        jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
        }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
                return jQuery.access(this, function(elem, type, value) {
                    var doc;
                    if (jQuery.isWindow(elem)) {
                        return elem.document.documentElement["client" + name];
                    }
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;
                        return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
                    }
                    return value === undefined ? jQuery.css(elem, type, value, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    window.jQuery = window.$ = jQuery;
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define("jquery", [], function() {
            return jQuery;
        });
    }
})(window);
(function() {
    var $ = require('jquery');

    function rewriteSelector(context, name, argPos) {
        var original = context[name];
        if (!original) return;
        context[name] = function() {
            arguments[argPos] = arguments[argPos].replace(/@([\w\u00c0-\uFFFF\-]+)/g, '[data-role~="$1"]');
            return original.apply(context, arguments);
        };
        $.extend(context[name], original);
    }
    rewriteSelector($, 'find', 0);
    rewriteSelector($, 'multiFilter', 0);
    rewriteSelector($.find, 'matchesSelector', 1);
    rewriteSelector($.find, 'matches', 0);

    function parse(roleString, without) {
        var role, result = [],
            roles = $.trim(roleString).split(/\s+/);
        for (var i = 0; i < roles.length; i++) {
            role = roles[i];
            if (!~$.inArray(role, result) && (!without || !~$.inArray(role, without)))
                result.push(role);
        }
        return result;
    };
    $.extend($.fn, {
        roles: function() {
            return parse(this.attr('data-role'));
        },
        hasRole: function(roleName) {
            var roles = parse(roleName);
            for (var i = 0; i < roles.length; i++)
                if (!this.is('@' + roles[i])) return false;
            return true;
        },
        addRole: function(roleName) {
            if (this.hasRole(roleName)) return this;
            return this.each(function(_, element) {
                var $el = $(element);
                $el.attr('data-role', parse($el.attr('data-role') + ' ' + roleName).join(' '));
            });
        },
        removeRole: function(roleName) {
            if (!this.hasRole(roleName)) return this;
            return this.each(function(_, element) {
                var $el = $(element);
                $el.attr('data-role', parse($el.attr('data-role'), parse(roleName)).join(' '));
            });
        },
        toggleRole: function(roleName) {
            var roles = parse(roleName);
            for (var i = 0; i < roles.length; i++)
                this[this.hasRole(roles[i]) ? 'removeRole' : 'addRole'].call(this, roles[i]);
            return this;
        }
    });
})();
define('skytte.signal', function() {
    function Signal() {
        this.receivers = [];
    }
    Signal.prototype.connect = function(receiver) {
        if (typeof receiver !== 'function')
            throw new Error("can't connect receiver to a signal, receiver is not a function");
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i] === receiver)
                return;
        this.receivers.push(receiver);
    };
    Signal.prototype.disconnect = function(receiver) {
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i] === receiver) {
                this.receivers.splice(i, 1);
                break;
            }
    };
    Signal.prototype.send = function() {
        for (var i = 0; i < this.receivers.length; i++)
            this.receivers[i].apply(this, arguments);
    };
    return Signal;
});
define('skytte.utils', function() {
    function copy(other) {
        if (typeof other === 'undefined' || other === null)
            return other;
        var target = other instanceof Array ? [] : {},
            property;
        for (property in other)
            if (other.hasOwnProperty(property))
                target[property] = typeof other[property] === 'object' ? copy(other[property]) : other[property];
        return target;
    }

    function _merge(target, other) {
        if (typeof target === 'undefined' || target === null)
            return typeof other === 'object' ? copy(other) : other;
        for (var property in other)
            if (other.hasOwnProperty(property)) {
                if (typeof target[property] === 'object' || typeof other[property] === 'object')
                    target[property] = _merge(target[property], other[property]);
                else
                    target[property] = other[property];
            }
        return target;
    }

    function merge() {
        var target = copy(arguments[0]),
            i;
        for (i = 1; i < arguments.length; i++)
            target = _merge(target, arguments[i]);
        return target;
    }

    function inArray(item, array) {
        for (var i = 0; i < array.length; i++)
            if (array[i] === item)
                return true;
        return false;
    }
    return {
        'copy': copy,
        'merge': merge,
        '_merge': _merge,
        'inArray': inArray
    };
});
define('skytte.numbers', function() {
    var numbers = {};
    numbers.clip = function(min, n, max) {
        return Math.max(min, Math.min(n, max));
    };
    numbers.sign = function(n) {
        return (n > 0) - (n < 0);
    };
    numbers.radians = function(n) {
        return n * Math.PI / 180;
    };
    numbers.degrees = function(n) {
        return n * 180 / Math.PI;
    };
    numbers.mod = function(n, m) {
        return ((n % m) + m) % m;
    };
    numbers.toHex = function(n, width) {
        width = typeof width === 'undefined' ? 2 : width;
        var hex = n.toString(16);
        while (hex.length < width)
            hex = '0' + hex;
        return hex;
    };
    numbers.inRange = function(min, n, max, inclusive) {
        return inclusive ? (min <= n && n <= max) : (min < n && n < max);
    };
    numbers.format = function(n, separator) {
        if (typeof separator === 'undefined')
            separator = ' ';
        return String(n).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + separator);
    };
    return numbers;
});
define('skytte.easings', function() {
    var easings = {};
    easings.toggle = function(p) {
        return 2 * Math.abs(p - .5);
    };
    easings.toggleShifted = function(p) {
        return 1 - easings.toggle(p);
    };
    easings.linear = function(p) {
        return p;
    };
    easings.quadraticIn = function(p) {
        return p * p;
    };
    easings.quadraticOut = function(p) {
        return -(p * (p - 2));
    };
    easings.quadraticInOut = function(p) {
        if (p < 0.5)
            return 2 * p * p;
        else
            return (-2 * p * p) + (4 * p) - 1;
    };
    easings.cubicIn = function(p) {
        return p * p * p;
    };
    easings.cubicOut = function(p) {
        var f = p - 1;
        return f * f * f + 1;
    };
    easings.cubicInOut = function(p) {
        if (p < 0.5)
            return 4 * p * p * p;
        else {
            var f = ((2 * p) - 2);
            return 0.5 * f * f * f + 1;
        }
    };
    easings.quarticIn = function(p) {
        return p * p * p * p;
    };
    easings.quarticOut = function(p) {
        var f = p - 1;
        return f * f * f * (1 - p) + 1;
    };
    easings.quarticInOut = function(p) {
        if (p < 0.5)
            return 8 * p * p * p * p;
        else {
            var f = p - 1;
            return -8 * f * f * f * f + 1;
        }
    };
    easings.quinticIn = function(p) {
        return p * p * p * p * p;
    };
    easings.quinticOut = function(p) {
        var f = p - 1;
        return f * f * f * f * f + 1;
    };
    easings.quinticInOut = function(p) {
        if (p < .5)
            return 16 * p * p * p * p * p;
        else {
            var f = (2 * p - 2);
            return .5 * f * f * f * f * f + 1;
        }
    };
    easings.sineIn = function(p) {
        return Math.sin((p - 1) * Math.PI / 2) + 1;
    };
    easings.sineOut = function(p) {
        return Math.sin(p * Math.PI / 2);
    };
    easings.sineInOut = function(p) {
        return .5 * (1 - Math.cos(p * Math.PI));
    };
    easings.circularIn = function(p) {
        return 1 - Math.sqrt(1 - p * p);
    };
    easings.circularOut = function(p) {
        return Math.sqrt((2 - p) * p);
    };
    easings.circularInOut = function(p) {
        if (p < .5)
            return .5 * (1 - Math.sqrt(1 - 4 * p * p));
        else
            return .5 * (Math.sqrt(-(2 * p - 3) * (2 * p - 1)) + 1);
    };
    easings.exponentialIn = function(p) {
        return (p == 0) ? p : Math.pow(2, 10 * (p - 1));
    };
    easings.exponentialOut = function(p) {
        return (p == 1) ? p : 1 - Math.pow(2, -10 * p);
    };
    easings.exponentialInOut = function(p) {
        if (p == 0.0 || p == 1.0)
            return p;
        if (p < .5)
            return .5 * Math.pow(2, 20 * p - 10);
        else
            return -.5 * Math.pow(2, -20 * p + 10) + 1;
    };
    easings.elasticIn = function(p) {
        return Math.sin(13 * Math.PI / 2 * p) * Math.pow(2, 10 * (p - 1));
    };
    easings.elasticOut = function(p) {
        return Math.sin(-13 * Math.PI / 2 * (p + 1)) * Math.pow(2, -10 * p) + 1;
    };
    easings.elasticInOut = function(p) {
        if (p < .5)
            return .5 * Math.sin(13 * Math.PI / 2 * 2 * p) * Math.pow(2, 10 * (2 * p - 1));
        else
            return .5 * (Math.sin(-13 * Math.PI / 2 * ((2 * p - 1) + 1)) * Math.pow(2, -10 * (2 * p - 1)) + 2);
    };
    easings.backIn = function(p) {
        return p * p * p - p * Math.sin(p * Math.PI);
    };
    easings.backOut = function(p) {
        var f = 1 - p;
        return 1 - (f * f * f - f * Math.sin(f * Math.PI));
    };
    easings.backInOut = function(p) {
        if (p < .5) {
            var f = 2 * p;
            return .5 * (f * f * f - f * Math.sin(f * Math.PI));
        } else {
            var f = (1 - (2 * p - 1));
            return .5 * (1 - (f * f * f - f * Math.sin(f * Math.PI))) + .5;
        }
    };
    easings.bounceIn = function(p) {
        return 1 - easings.bounceOut(1 - p);
    };
    easings.bounceOut = function(p) {
        if (p < 4 / 11)
            return (121 * p * p) / 16;
        else if (p < 8 / 11)
            return (363 / 40 * p * p) - (99 / 10 * p) + 17 / 5;
        else if (p < 9 / 10)
            return (4356 / 361 * p * p) - (35442 / 1805 * p) + 16061 / 1805;
        else
            return (54 / 5 * p * p) - (513 / 25 * p) + 268 / 25;
    };
    easings.bounceInOut = function(p) {
        if (p < .5)
            return .5 * easings.bounceIn(p * 2);
        else
            return .5 * easings.bounceOut(p * 2 - 1) + .5;
    };
    return easings;
});
define('skytte.tween', function() {
    function Tween(begin, change, duration, easingFunc, mode) {
        this.begin = begin;
        this.change = change;
        this.mode = mode || Tween.MODE_ONCE;
        this.duration = duration / 1000;
        this.easingFunc = easingFunc;
        this.restart();
    }
    Tween.MODE_ONCE = 'once';
    Tween.MODE_REPEAT = 'repeat';
    Tween.prototype.restart = function() {
        this.time = 0;
        this.hasEnded = false;
    };
    Tween.prototype.toEnd = function() {
        this.time = this.duration;
        this.value = this.begin + this.change;
        this.hasEnded = true;
    };
    Tween.prototype.logic = function(timeDelta) {
        if (this.hasEnded)
            return;
        this.value = this.begin + this.easingFunc(this.time / this.duration) * this.change;
        if (this.time >= this.duration && this.mode == Tween.MODE_REPEAT)
            this.restart();
        else
            this.time = Math.min(this.time + timeDelta, this.duration);
        if (this.time >= this.duration && this.mode == Tween.MODE_ONCE)
            this.toEnd();
    };
    Tween.prototype.toNumber = function() {
        return this.value;
    };
    return Tween;
});
define('skytte.per_second', function() {
    function PerSecond(timesPerSecond, func) {
        this.fps = timesPerSecond;
        this.func = func;
        this.delay = 0;
    }
    PerSecond.prototype.logic = function(timeDelta) {
        this.delay -= timeDelta;
        if (this.delay <= 0) {
            this.delay += 1000 / this.fps / 1000;
            this.func();
        }
    };
    return PerSecond;
});
define('skytte.vector2', function() {
    function Vector2() {
        this.set.apply(this, arguments);
    }
    Vector2.prototype.toString = function(decPlaces) {
        return '<Vector2 ' + this.x + ',' + this.y + '>';
    };
    Vector2.prototype.copy = function() {
        return new Vector2(this);
    };
    Vector2.prototype.set = function() {
        var pair = [0, 0];
        if (arguments.length === 1 && arguments[0].length && arguments[0].length === 2)
            pair = arguments[0];
        else if (arguments.length === 1 && typeof arguments[0].x !== 'undefined' && typeof arguments[0].y !== 'undefined')
            pair = [arguments[0].x, arguments[0].y];
        else if (arguments.length === 2)
            pair = arguments;
        this.x = pair[0];
        this.y = pair[1];
        return this;
    };
    Vector2.prototype.lengthSquared = function() {
        return this.x * this.x + this.y * this.y;
    };
    Vector2.prototype.length = function() {
        return Math.sqrt(this.lengthSquared());
    };
    Vector2.prototype.normalize = function() {
        var l = this.length();
        if (l > 0) {
            this.x /= l;
            this.y /= l;
        }
        return this;
    };
    Vector2.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vector2.prototype.sub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vector2.prototype.scale = function(x, y) {
        this.x *= x;
        this.y *= typeof y !== 'undefined' ? y : x;
        return this;
    };
    Vector2.prototype.div = function(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    };
    Vector2.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.angle = function() {
        return Math.atan2(this.y, this.x);
    };
    Vector2.prototype.distanceTo = function(o) {
        var distance = new Vector2(o.x, o.y);
        return distance.sub(this).length();
    };
    Vector2.prototype.perp = function() {
        var x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
    };
    Vector2.prototype.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var tempX = this.x;
        var tempY = this.y;
        this.x = tempX * cos - tempY * sin;
        this.y = tempX * sin + tempY * cos;
        return this;
    };
    Vector2.prototype.equals = function(o) {
        return (this.x == o.x && this.y == o.x);
    };
    Vector2.prototype.isCloseTo = function(v, tolerance) {
        if (this.equals(v))
            return true;
        return (new Vector2(this).sub(v)).lengthSquared() < tolerance * tolerance;
    };
    return Vector2;
});
define('skytte.bounding_box', function() {
    function BoundingBox(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    }
    BoundingBox.fromString = function(str) {
        var points = str.split(' ');
        var pos = points[0].split(',');
        var size = points[1].split(',');
        return new BoundingBox(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(size[0]), parseFloat(size[1]));
    };
    BoundingBox.fromPolygon = function(polygon) {
        return (new BoundingBox()).fromPolygon(polygon);
    };
    BoundingBox.prototype.toString = function() {
        return '<Rectangle ' + this.x + ',' + this.y + ' ' + this.width + ',' + this.height + '>';
    };
    BoundingBox.prototype.fromPolygon = function(polygon) {
        var minX = Number.MAX_VALUE,
            minY = Number.MAX_VALUE,
            maxX = Number.MIN_VALUE,
            maxY = Number.MIN_VALUE,
            i, p;
        for (i = 0; i < polygon.points.length; i++) {
            p = polygon.points[i];
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }
        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        return this;
    };
    BoundingBox.prototype.copy = function() {
        return new BoundingBox(this.x, this.y, this.width, this.height);
    };
    BoundingBox.prototype.draw = function(context, x, y, lineColor) {
        context.save();
        context.strokeStyle = lineColor || '#fff';
        context.lineWidth = 1.25;
        context.strokeRect(x + this.x, y + this.y, this.width, this.height);
        context.restore();
    };
    return BoundingBox;
});
define('skytte.polygon', ['skytte.vector2'], function(Vector2) {
    function Polygon(points) {
        this.points = points;
        if (this.points)
            this.recalcNormals();
    };
    Polygon.fromCoords = function(coords) {
        points = [];
        for (var i = 0; i < coords.length; i++)
            points.push(new Vector2(coords[i][0], coords[i][1]));
        return new Polygon(points);
    };
    Polygon.fromString = function(coords) {
        var pointsStr = coords.split(' '),
            points = [],
            point;
        for (var i = 0; i < pointsStr.length; i++) {
            point = pointsStr[i].split(',');
            points.push(new Vector2(parseFloat(point[0]), parseFloat(point[1])));
        }
        return new Polygon(points);
    };
    Polygon.fromBox = function(box) {
        return (new Polygon()).fromBox(box);
    };
    Polygon.prototype.fromBox = function(box) {
        this.points = [new Vector2(box.x, box.y), new Vector2(box.x + box.width, box.y), new Vector2(box.x + box.width, box.y + box.height), new Vector2(box.x, box.y + box.height)];
        return this.recalcNormals();
    };
    Polygon.prototype.toString = function(decPlaces) {
        return '<Polygon ' + this.points.join(' ') + '>';
    };
    Polygon.prototype.recalcNormals = function() {
        var i, p1, p2, edge = new Vector2(),
            normal = new Vector2();
        this.normals = [];
        for (i = 0; i < this.points.length; i++) {
            p1 = this.points[i];
            p2 = i < this.points.length - 1 ? this.points[i + 1] : this.points[0];
            edge.set(p2).sub(p1);
            normal.set(edge).perp().normalize();
            this.normals.push(normal.copy());
        }
        return this;
    };
    Polygon.prototype.draw = function(context, x, y, lineColor, normalsColor) {
        context.save();
        context.beginPath();
        for (var i = 0; i < this.points.length; i++)
            context.lineTo(x + this.points[i].x, y + this.points[i].y);
        context.closePath();
        context.lineWidth = 1.25;
        context.strokeStyle = lineColor || '#fff';
        context.stroke();
        context.beginPath();
        var current, next, midpoint = new Vector2();
        for (var i = 0; i < this.points.length; i++) {
            next = this.points[i < this.points.length - 1 ? i + 1 : 0];
            current = this.points[i];
            midpoint.x = (next.x + current.x) / 2;
            midpoint.y = (next.y + current.y) / 2;
            context.moveTo(x + midpoint.x, y + midpoint.y);
            context.lineTo(x + midpoint.x + this.normals[i].x * 20, y + midpoint.y + this.normals[i].y * 20);
        }
        context.strokeStyle = normalsColor || '#f0f';
        context.stroke();
        context.restore();
    };
    return Polygon;
});
define('skytte.collision', ['skytte.vector2'], function(Vector2) {
    var collision = {};
    collision._flattenPointsOn = function(points, normal) {
        var min = Number.MAX_VALUE,
            max = -Number.MAX_VALUE,
            dot, i;
        for (i = 0; i < points.length; i++) {
            dot = points[i].x * normal.x + points[i].y * normal.y;
            if (dot < min)
                min = dot;
            if (dot > max)
                max = dot;
        }
        return [min, max];
    };
    collision._isSeparatingAxis = function(posA, pointsA, posB, pointsB, axis) {
        var offset = (posB.x - posA.x) * axis.x + (posB.y - posA.y) * axis.y;
        var rangeA = collision._flattenPointsOn(pointsA, axis);
        var rangeB = collision._flattenPointsOn(pointsB, axis);
        rangeB[0] += offset;
        rangeB[1] += offset;
        if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1])
            return true;
        return false;
    };
    collision.testPolygons = function(posA, polygonA, posB, polygonB) {
        var i;
        for (i = 0; i < polygonA.points.length; i++)
            if (collision._isSeparatingAxis(posA, polygonA.points, posB, polygonB.points, polygonA.normals[i]))
                return false;
        for (i = 0; i < polygonB.points.length; i++)
            if (collision._isSeparatingAxis(posA, polygonA.points, posB, polygonB.points, polygonB.normals[i]))
                return false;
        return true;
    };
    collision.testBoundingBoxes = function(posA, boxA, posB, boxB) {
        return !(posA.x + boxA.x > posB.x + boxB.x + boxB.width || posB.x + boxB.x > posA.x + boxA.x + boxA.width || posA.y + boxA.y > posB.y + boxB.y + boxB.height || posB.y + boxB.y > posA.y + boxA.y + boxA.height);
    };
    collision.testPointInBoundingBox = function(point, box) {
        if (point.x < box.x || point.x > box.x + box.width || point.y < box.y || point.y > box.y + box.height)
            return false;
        return true;
    };
    return collision;
});
define('skytte.sprite', ['skytte.signal'], function(Signal) {
    function Sprite(url) {
        this.url = url;
        this.image = new Image();
        this.loaded = new Signal();
        this.hasLoaded = false;
    }
    Sprite.prototype.load = function() {
        this.image.addEventListener('load', this._onLoad.bind(this), false);
        this.image.addEventListener('error', this._onError.bind(this), false);
        this.image.src = this.url;
    };
    Sprite.prototype._onLoad = function() {
        this.hasLoaded = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.loaded.send(this);
    };
    Sprite.prototype._onError = function() {
        throw new Error("couldn't load resource '" + this.url + "'");
    };
    Sprite.prototype.draw = function(context, x, y) {
        context.drawImage(this.image, Math.floor(x), Math.floor(y));
    };
    return Sprite;
});
define('skytte.spritesheet', ['skytte.sprite'], function(Sprite) {
    function SpritesheetSprite(spritesheet, x, y) {
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.width = this.spritesheet.width;
        this.height = this.spritesheet.height;
    }
    SpritesheetSprite.prototype.draw = function(context, x, y) {
        this.spritesheet.drawSprite(context, this.x, this.y, x, y);
    };

    function Spritesheet(imageURL, spriteW, spriteH) {
        Sprite.apply(this, [imageURL]);
        this.width = spriteW;
        this.height = spriteH;
        this.sprites = {};
    }
    Spritesheet.prototype = Object.create(Sprite.prototype);
    Spritesheet.prototype._onLoad = function() {
        this.hasLoaded = true;
        this.loaded.send(this);
    };
    Spritesheet.prototype.getSprite = function(spriteX, spriteY) {
        var cacheKey = spriteX + ',' + spriteY;
        if (!this.sprites[cacheKey])
            this.sprites[cacheKey] = new SpritesheetSprite(this, spriteX, spriteY);
        return this.sprites[cacheKey];
    };
    Spritesheet.prototype.drawSprite = function(context, spriteX, spriteY, x, y) {
        context.drawImage(this.image, spriteX * this.width, spriteY * this.height, this.width, this.height, Math.floor(x), Math.floor(y), this.width, this.height);
    };
    return {
        'Spritesheet': Spritesheet,
        'SpritesheetSprite': SpritesheetSprite
    };
});
define('skytte.sprite_list', ['skytte.signal', 'skytte.sprite'], function(Signal, Sprite) {
    function SpriteList(urlPattern, count) {
        this.urlPattern = urlPattern;
        this.count = count;
        this.loaded = new Signal();
        this.hasLoaded = false;
        this.sprites = [];
        this.toLoad = count;
        this._onSpriteLoadProxy = this._onSpriteLoad.bind(this);
        for (var i = 1; i <= count; i++) {
            var url = urlPattern.replace('%i', i);
            var sprite = new Sprite(url);
            this.sprites.push(sprite);
            sprite.loaded.connect(this._onSpriteLoadProxy);
        }
    }
    SpriteList.prototype._onSpriteLoad = function() {
        this.toLoad--;
        if (!this.toLoad) {
            this.hasLoaded = true;
            this.loaded.send(this);
        }
    };
    SpriteList.prototype.load = function() {
        this.toLoad = this.count;
        for (var i = 0; i < this.sprites.length; i++)
            this.sprites[i].load();
    };
    SpriteList.prototype.draw = function(context, x, y, i) {
        this.sprites[i].draw(context, x, y);
    };
    return SpriteList;
});
define('skytte.sound', ['skytte.signal'], function(Signal) {
    function Sound(url, minDelay) {
        this.url = url;
        this.minDelay = minDelay || 0;
        this.loaded = new Signal();
        this.hasLoaded = false;
        this.toLoad = 0;
        this.lastPlay = null;
        this._onLoadProxy = this._onLoad.bind(this);
        createjs.Sound.addEventListener('fileload', this._onLoadProxy);
    }
    Sound.id = 0;
    Sound.prototype.load = function() {
        this._soundIds = [];
        var urls = this.url.split(' '),
            id;
        this.toLoad = urls.length;
        for (var i = 0; i < urls.length; i++) {
            var id = 'sound' + Sound.id;
            this._soundIds.push(id);
            Sound.id += 1;
            createjs.Sound.registerSound({
                'id': id,
                'src': urls[i]
            });
        }
    };
    Sound.prototype._onLoad = function(event) {
        for (var i = 0; i < this._soundIds.length; i++)
            if (event.id === this._soundIds[i]) {
                this.toLoad -= 1;
                if (this.toLoad === 0) {
                    this.hasLoaded = true;
                    this.loaded.send(this);
                    createjs.Sound.removeEventListener('fileload', this._onLoadProxy);
                }
                break;
            }
    };
    Sound.prototype.getInstance = function() {
        var id = this._soundIds[Math.floor(Math.random() * this._soundIds.length)];
        return createjs.Sound.createInstance(id);
    };
    Sound.prototype.play = function(kwargs) {
        kwargs = kwargs || {};
        if (this.minDelay && this.lastPlay) {
            var time = new Date();
            if (time - this.lastPlay < this.minDelay)
                return createjs.Sound.defaultSoundInstance;
            this.lastPlay = time;
        } else if (this.minDelay)
            this.lastPlay = new Date();
        var id = this._soundIds[Math.floor(Math.random() * this._soundIds.length)];
        return createjs.Sound.play(id, kwargs);
    };
    Sound.prototype.playLoop = function(kwargs) {
        kwargs = kwargs || {};
        kwargs.loop = -1;
        return this.play(kwargs);
    };
    return Sound;
});
define('skytte.font', ['skytte.sprite'], function(Sprite) {
    function Font(url, kwargs) {
        Sprite.apply(this, [url]);
        this.chars = kwargs.chars;
        this.widths = kwargs.widths;
        this.colors = kwargs.colors || 1;
        this.spacing = kwargs.spacing || 0;
        this.positions = {};
        var i, c, x = 0;
        for (i = 0; i < this.chars.length; i++) {
            c = this.chars[i];
            this.positions[c] = x;
            x += this.widths[c];
        }
    }
    Font.prototype = Object.create(Sprite.prototype);
    Font.prototype._onLoad = function() {
        Sprite.prototype._onLoad.apply(this, arguments);
        this.height = this.image.height / this.colors;
    };
    Font.prototype.textWidth = function(text) {
        var c, width = 0;
        for (var i = 0; i < text.length; i++)
            width += this.widths[text[i]] + this.spacing;
        return width;
    };
    Font.prototype.drawText = function(context, text, color, x, y, align) {
        if (align === 'center')
            x -= this.textWidth(text) / 2;
        if (align === 'right')
            x -= this.textWidth(text);
        x = Math.floor(x);
        y = Math.floor(y);
        var c, srcY = this.height * color;
        for (var i = 0; i < text.length; i++) {
            c = text[i];
            context.drawImage(this.image, this.positions[c], srcY, this.widths[c], this.height, x, y, this.widths[c], this.height);
            x += this.widths[c] + this.spacing;
        }
    };
    return Font;
});
define('skytte.beam', ['skytte.numbers', 'skytte.vector2'], function(numbers, Vector2) {
    function Beam(glowColor, maxOffset, rayCount, smoothness, start, end) {
        this.rays = [];
        for (var i = 0; i < rayCount; i++)
            this.rays.push([]);
        this.maxOffset = maxOffset;
        this.glowColor = glowColor;
        this.start = start || new Vector2();
        this.end = end || new Vector2();
        this.alpha = 0;
        this.smoothness = smoothness || 15;
    }
    Beam.prototype.update = function() {
        var i, middle = new Vector2(),
            offset = new Vector2(),
            current, next, maxOffset, segments, iterations, len = new Vector2();
        for (var r = 0; r < this.rays.length; r++) {
            this.rays[r] = segments = [this.start, this.end];
            maxOffset = this.maxOffset;
            iterations = Math.ceil(Math.sqrt(this.start.distanceTo(this.end) / this.smoothness));
            for (i = 0; i < iterations; i++) {
                for (s = 0; s < segments.length - 1; s += 2) {
                    current = segments[s];
                    next = segments[s + 1];
                    middle.x = (current.x + next.x) / 2;
                    middle.y = (current.y + next.y) / 2;
                    offset.x = current.x - next.x;
                    offset.y = current.y - next.y;
                    offset.normalize().perp().scale(Math.round(Math.random() * maxOffset * 2) - maxOffset);
                    middle.add(offset);
                    segments.splice(s + 1, 0, middle.copy());
                }
                maxOffset *= .8;
            }
        }
        this.alpha = .2 + Math.random() * .8;
    };
    Beam.prototype.draw = function(context, scale, x, y) {
        var r, i, j, segments;
        x = x || 0;
        y = y || 0;
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalAlpha = this.alpha;
        for (r = 0; r < this.rays.length; r++) {
            segments = this.rays[r];
            for (j = 0; j < 3; j++) {
                context.beginPath();
                for (i = 0; i < segments.length; i++)
                    context.lineTo(scale * (x + segments[i].x), scale * (y + segments[i].y));
                context.lineWidth = scale * (5 + j * 5);
                context.strokeStyle = this.glowColor;
                context.stroke();
            }
            context.beginPath();
            for (i = 0; i < segments.length; i++)
                context.lineTo(scale * (x + segments[i].x), scale * (y + segments[i].y));
            context.lineWidth = 3 * scale;
            context.strokeStyle = '#fff';
            context.stroke();
        }
        context.restore();
    }
    return Beam;
});
define('skytte.entity', ['skytte.numbers', 'skytte.vector2', 'skytte.bounding_box', 'skytte.polygon'], function(numbers, Vector2, BoundingBox, Polygon) {
    function Entity(game, name, x, y, kwargs) {
        this.game = game;
        this.name = name;
        this.position = new Vector2(x, y);
        kwargs = kwargs || {};
        if (typeof kwargs.box === 'string')
            this.box = BoundingBox.fromString(kwargs.box);
        else if (kwargs.box)
            this.box = kwargs.box;
        if (typeof kwargs.polygon === 'string') {
            this.polygon = Polygon.fromString(kwargs.polygon);
        } else if (kwargs.polygon)
            this.polygon = kwargs.polygon;
        if (this.polygon && !this.box)
            this.box = BoundingBox.fromPolygon(this.polygon);
        else if (!this.polygon && this.box)
            this.polygon = Polygon.fromBox(this.box);
        this.collectible = Boolean(kwargs.collectible);
        this.velocity = new Vector2(kwargs.vx || 0, kwargs.vy || 0);
        this.force = new Vector2(kwargs.fx || 0, kwargs.fy || 0);
        this.mass = kwargs.mass || 0;
        this.ai = kwargs.ai;
        this.team = kwargs.team || 0;
        this.score = kwargs.score || 0;
        this.killWhenOffScreen = typeof kwargs.killWhenOffScreen !== 'undefined' ? kwargs.killWhenOffScreen : true;
        this.dead = typeof kwargs.dead === 'undefined' ? false : kwargs.dead;
    }
    Entity.prototype.toString = function() {
        return '<' + this.name + '>';
    };
    Entity.prototype.getCenter = function() {
        if (this.box)
            return {
                'x': this.position.x + this.box.x + this.box.width / 2,
                'y': this.position.y + this.box.y + this.box.height / 2
            };
        return {
            'x': this.position.x,
            'y': this.position.y
        };
    };
    Entity.prototype.logic = function(timeDelta) {
        var worldW, worldH, center;
        if (this.ai)
            this.ai.logic(timeDelta);
        if (Math.abs(this.force.x) - this.mass * timeDelta <= 0)
            this.force.x = 0;
        else
            this.force.x -= numbers.sign(this.force.x) * this.mass * timeDelta;
        if (Math.abs(this.force.y) - this.mass * timeDelta <= 0)
            this.force.y = 0;
        else
            this.force.y -= numbers.sign(this.force.y) * this.mass * timeDelta;
        this.position.x += (this.velocity.x + this.force.x) * timeDelta;
        this.position.y += (this.velocity.y + this.force.y) * timeDelta;
        if (this.killWhenOffScreen && this.game) {
            worldW = this.game.WORLD.WIDTH;
            worldH = this.game.WORLD.HEIGHT;
            center = this.getCenter();
            if ((center.x < -worldW / 2 && this.velocity.x <= 0) || (center.x > worldW * 1.5 && this.velocity.x >= 0) || (center.y < -worldH / 2 && this.velocity.y <= 0) || (center.y > worldH * 1.5 && this.velocity.y >= 0)) {
                delete this.score;
                this.dead = true;
            }
        }
    };
    Entity.prototype.collidesWith = function(other) {};
    Entity.prototype.draw = function(context, scale, x, y) {
        if (this.game.debug) {
            context.save();
            context.scale(scale, scale);
            if (this.polygon)
                this.polygon.draw(context, this.position.x, this.position.y, this.hit && this.hit.value ? '#f00' : '#fff');
            if (this.box)
                this.box.draw(context, this.position.x, this.position.y, this.hit && this.hit.value ? '#f00' : '#fff');
            var center = this.getCenter();
            context.fillStyle = '#0ff';
            context.fillRect(center.x - 1, center.y - 1, 3, 3);
            context.restore();
        }
    };
    Entity.prototype.onRemove = function() {};
    return Entity;
});
define('skytte.particles.particle', ['skytte.numbers', 'skytte.vector2', 'skytte.entity'], function(numbers, Vector2, Entity) {
    function Particle(kwargs) {
        this.emitter = kwargs.emitter;
        this.position = new Vector2(kwargs.x, kwargs.y);
        this.velocity = new Vector2(kwargs.vx || 0, kwargs.vy || 0);
        this.force = new Vector2(kwargs.fx || 0, kwargs.fy || 0);
        this.mass = kwargs.mass || 0;
        this.dead = typeof kwargs.dead === 'undefined' ? false : kwargs.dead;
        this.life = this.time = kwargs.life / 1000;
        this.color = kwargs.color;
        if (kwargs.sprite) {
            this.game = kwargs.game;
            this.sprite = this.game.getResource(kwargs.sprite);
        }
        this.size = kwargs.size;
    };
    Particle.prototype = Object.create(Entity.prototype);
    Particle.prototype.logic = function(timeDelta) {
        if (Math.abs(this.force.x) - this.mass * timeDelta <= 0)
            this.force.x = 0;
        else
            this.force.x -= numbers.sign(this.force.x) * this.mass * timeDelta;
        if (Math.abs(this.force.y) - this.mass * timeDelta <= 0)
            this.force.y = 0;
        else
            this.force.y -= numbers.sign(this.force.y) * this.mass * timeDelta;
        this.position.x += (this.velocity.x + this.force.x) * timeDelta;
        this.position.y += (this.velocity.y + this.force.y) * timeDelta;
        this.time -= timeDelta;
        this.p = Math.max(0, this.time / this.life);
        if (this.time <= 0)
            this.dead = true;
    };
    Particle.prototype.draw = function(context, scale, x, y) {
        if (this.sprite) {
            context.save();
            context.translate(scale * (x + this.position.x), scale * (y + this.position.y));
            if (this.size !== 1)
                context.scale(this.size, this.size);
            this.sprite.draw(context, -this.sprite.width / 2, -this.sprite.height / 2);
            context.restore();
        } else {
            context.beginPath();
            context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)), Math.floor(scale * this.size), 0, 2 * Math.PI);
            context.fillStyle = this.color;
            context.fill();
        }
    };
    return Particle;
});
define('skytte.particles.emitter', ['skytte.utils', 'skytte.numbers', 'skytte.entity', 'skytte.particles.particle'], function(utils, numbers, Entity, Particle) {
    var DEFAULTS = {
        'spawnCount': 0,
        'spawnSpeed': 0,
        'spawn': true,
        'particle': {
            'offsetX': 0,
            'offsetY': 0,
            'spreadX': 0,
            'spreadY': 0,
            'direction': 0,
            'directionSpread': 0,
            'size': 0,
            'sizeSpread': 0,
            'vx': 0,
            'vy': 0,
            'speed': 0,
            'speedSpread': 0,
            'mass': 0,
            'life': 0,
            'color': '#fff',
            'colors': null,
            'sprite': null,
            'logic': null
        }
    };

    function Emitter(game, x, y, kwargs) {
        Entity.apply(this, [game, 'EmitterEntity', x, y, kwargs]);
        kwargs = utils.merge(DEFAULTS, kwargs);
        if (kwargs.sprite)
            this.sprite = this.game.getResource(kwargs.sprite);
        this.spawnTime = 0;
        this.spawnCount = kwargs.spawnCount;
        this.spawnSpeed = kwargs.spawnSpeed;
        this.spawn = Boolean(kwargs.spawn);
        this.particle = kwargs.particle;
        this.particle.color = String(this.particle.color);
        this.stopped = false;
        if (kwargs.life)
            this.life = this.time = kwargs.life / 1000;
        this.particleTime = 1000 / this.spawnSpeed / 1000;
        this.particles = [];
    };
    Emitter.prototype = Object.create(Entity.prototype);
    Emitter.prototype.spawnParticle = function() {
        var direction = numbers.radians(this.particle.direction + (Math.random() - .5) * this.particle.directionSpread);
        var particleConfig = {
            'game': this.game,
            'emitter': this,
            'life': this.particle.life * (Math.random() + .5),
            'x': this.position.x + this.particle.offsetX + (Math.random() - .5) * this.particle.spreadX,
            'y': this.position.y + this.particle.offsetY + (Math.random() - .5) * this.particle.spreadY,
            'size': this.particle.size + (Math.random() - .5) * this.particle.sizeSpread,
            'vx': this.particle.vx + Math.cos(direction) * (this.particle.speed + (Math.random() - .5) * this.particle.speedSpread),
            'vy': this.particle.vy + Math.sin(direction) * (this.particle.speed + (Math.random() - .5) * this.particle.speedSpread),
            'color': this.particle.color,
            'mass': this.particle.mass,
            'sprite': this.particle.sprite
        };
        var particle = new Particle(particleConfig);
        this.particles.push(particle);
        return particle;
    };
    Emitter.prototype.stop = function() {
        this.stopped = true;
    };
    Emitter.prototype.logic = function(timeDelta) {
        Entity.prototype.logic.apply(this, arguments);
        if (!this.stopped) {
            if (this.spawn && !this.spawnCount) {
                this.spawnTime += timeDelta;
                var particlesToGenerate = Math.floor(this.spawnTime / this.particleTime);
                for (var i = 0; i < particlesToGenerate; i++)
                    this.spawnParticle();
                this.spawnTime -= particlesToGenerate * this.particleTime;
            }
            if (!this.spawn && this.spawnCount) {
                for (var i = 0; i < this.spawnCount; i++)
                    this.spawnParticle();
                this.stopped = true;
            }
        }
        var i = this.particles.length;
        while (--i >= 0)
            if (!this.particles[i].dead) {
                if (this.particle.logic)
                    this.particle.logic.apply(this.particles[i], arguments);
                else
                    this.particles[i].logic(timeDelta);
            } else
                this.particles.splice(i, 1);
        if (this.stopped && !this.particles.length)
            this.dead = true;
        this.time -= timeDelta;
        if (this.life) {
            this.p = Math.max(0, this.time / this.life);
            if (this.time <= 0)
                this.dead = true;
        }
    };
    Emitter.prototype.draw = function(context, scale, x, y) {
        context.save();
        x = x || 0;
        y = y || 0;
        for (var i = 0; i < this.particles.length; i++)
            if (this.particle.draw)
                this.particle.draw.apply(this.particles[i], [context, scale, x, y]);
            else
                this.particles[i].draw(context, scale, x, y);
        if (this.sprite)
            this.sprite.draw(context, scale * (x + this.position.x), scale * (y + this.position.y));
        if (this.game.debug) {
            context.fillStyle = '#f00';
            context.fillRect(scale * (x + this.position.x + this.particle.offsetX) - 1, scale * (y + this.position.y + this.particle.offsetY) - 1, 3, 3);
        }
        context.restore();
    };
    return Emitter;
});
define('skytte.particles.mushroom', ['skytte.utils', 'skytte.particles.emitter'], function(utils, Emitter) {
    function MushroomEmitter(game, kwargs) {
        kwargs = utils.merge(MushroomEmitter.DEFAULTS, kwargs);
        Emitter.apply(this, [game, 0, 0, kwargs]);
        this.sprites = [];
        for (var i = 0; i < kwargs.sprites.length; i++)
            this.sprites.push(this.game.getResource(kwargs.sprites[i]));
        this.reset(true);
    }
    MushroomEmitter.DEFAULTS = {
        'vx': -140,
        'spawnSpeed': 1,
        'particle': {
            'offsetX': 40,
            'offsetY': 47,
            'spreadX': 20,
            'direction': 270,
            'directionSpread': 90,
            'size': 1.5,
            'sizeSpread': .5,
            'vx': -140,
            'vy': 0,
            'speed': 30,
            'speedSpread': 10,
            'life': 3000,
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                if (typeof this._originalSize === 'undefined')
                    this._originalSize = this.size;
                this.size = this._originalSize * this.p;
            }
        }
    };
    MushroomEmitter.prototype = Object.create(Emitter.prototype);
    MushroomEmitter.prototype.reset = function(firstTime) {
        this.sprite = this.sprites[Math.floor(Math.random() * this.sprites.length)];
        this.position.x = this.game.WORLD.WIDTH * Math.random();
        if (!firstTime)
            this.position.x += this.game.WORLD.WIDTH;
        this.position.y = this.game.WORLD.FULL_HEIGHT - ((Math.random() * .3 + .7) * this.sprite.height) / this.game.SCREEN.SCALE;
    };
    MushroomEmitter.prototype.logic = function(timeDelta) {
        Emitter.prototype.logic.apply(this, arguments);
        if (this.position.x + this.sprite.width < 0)
            this.reset();
    };
    return MushroomEmitter;
});
define('skytte.weapons.weapon', ['skytte.numbers', 'skytte.easings', 'skytte.vector2', 'skytte.tween', 'skytte.entity'], function(numbers, easings, Vector2, Tween, Entity) {
    function Weapon(game, ownerOrTeam, x, y, kwargs) {
        Entity.apply(this, [game, 'WeaponEntity', x, y, kwargs]);
        if (kwargs.fireSound)
            this.fireSound = this.game.getResource(kwargs.fireSound);
        this.fireSoundVolume = typeof kwargs.fireSoundVolume !== 'undefined' ? kwargs.fireSoundVolume : 1;
        this.sprite = this.game.getResource(kwargs.sprite);
        this.hitSprite = this.game.getResource(kwargs.hitSprite);
        this.direction = kwargs.direction || 0;
        if (typeof ownerOrTeam === 'number')
            this.team = ownerOrTeam;
        else {
            this.owner = ownerOrTeam;
            this.team = this.owner.team;
        }
        this.rateOfFire = kwargs.rateOfFire;
        this.barrelOffset = new Vector2(kwargs.barrelOffset);
        this.damage = kwargs.damage;
        this.level = kwargs.level || 1;
        this.delay = 0;
        this.shooting = false;
        if (this.rateOfFire > 0) {
            this.recoil = new Tween(0, 3, numbers.clip(100, 1000 / this.rateOfFire / 2, 500), easings.quadraticIn);
            this.recoil.toEnd();
        }
    }
    Weapon.prototype = Object.create(Entity.prototype);
    Weapon.prototype.spawnProjectile = function() {
        if (this.fireSound)
            this.fireSound.play({
                'volume': this.fireSoundVolume
            });
    };
    Weapon.prototype.startShooting = function() {
        this.shooting = true;
        this.delay = 1000 / this.rateOfFire / 1000;
    };
    Weapon.prototype.stopShooting = function() {
        this.shooting = false;
    };
    Weapon.prototype.getBarrel = function() {
        return {
            'x': this.position.x + this.owner.position.x + this.barrelOffset.x,
            'y': this.position.y + this.owner.position.y + this.barrelOffset.y
        };
    };
    Weapon.prototype.logic = function(timeDelta) {
        if (this.shooting && (this.delay <= 0 || this.rateOfFire <= 0)) {
            this.spawnProjectile();
            if (this.recoil) {
                this.recoil.restart();
                this.delay = 1000 / this.rateOfFire / 1000;
            }
        }
        if (this.recoil)
            this.recoil.logic(timeDelta);
        this.delay = Math.max(0, this.delay - timeDelta);
    };
    Weapon.prototype.draw = function(context, scale, x, y) {
        var dx, dy;
        var recoilOffsetX = Math.cos(numbers.radians(this.direction));
        var recoilOffsetY = Math.sin(numbers.radians(this.direction));
        if (this.recoil)
            dx = Math.floor((x + this.position.x + this.recoil.value * recoilOffsetX) * scale);
        else
            dx = Math.floor((x + this.position.x + 3 * recoilOffsetX) * scale);
        if (this.recoil)
            dy = Math.floor((y + this.position.y + this.recoil.value * recoilOffsetY) * scale);
        else
            dy = Math.floor((y + this.position.y + 3 * recoilOffsetY) * scale);
        this.sprite.draw(context, dx, dy);
        if (this.owner.hit.value) {
            context.save();
            context.globalAlpha = this.owner.hit.value;
            this.hitSprite.draw(context, dx, dy);
            context.restore();
        }
        if (this.game.debug) {
            context.save();
            context.scale(scale, scale);
            context.fillStyle = '#ff0';
            context.fillRect(x + this.position.x + this.barrelOffset.x - 1, y + this.position.y + this.barrelOffset.y - 1, 3, 3);
            context.restore();
        }
    };
    return Weapon;
});
define('skytte.weapons.projectile', ['skytte.numbers', 'skytte.entity'], function(numbers, Entity) {
    function Projectile(game, x, y, kwargs) {
        Entity.apply(this, [game, 'Projectile', x, y, kwargs]);
        this.weapon = kwargs.weapon;
        this.damage = kwargs.damage;
        this.sprite = kwargs.sprite;
        this.size = typeof kwargs.size === 'undefined' ? 1 : kwargs.size;
        this.angle = typeof kwargs.angle === 'undefined' ? 0 : kwargs.angle;
        if (this.box) {
            this.box.x = -this.box.width / 2;
            this.box.y = -this.box.height / 2;
        }
    };
    Projectile.prototype = Object.create(Entity.prototype);
    Projectile.prototype.explode = function() {
        this.dead = true;
    };
    Projectile.prototype.collidesWith = function(other) {
        var ShipEntity = require('skytte.entities.ship');
        if (other instanceof ShipEntity && this.team !== other.team)
            this.explode();
    };
    Projectile.prototype.draw = function(context, scale, x, y) {
        if (this.sprite) {
            context.save();
            context.translate(this.position.x * scale + x, this.position.y * scale + y);
            if (this.angle)
                context.rotate(numbers.radians(this.angle));
            if (this.size !== 1)
                context.scale(this.size, this.size);
            this.sprite.draw(context, -this.sprite.width / 2, -this.sprite.height / 2);
            context.restore();
        }
        Entity.prototype.draw.apply(this, arguments);
    };
    return Projectile;
});
define('skytte.weapons.plasma', ['settings', 'skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.entity', 'skytte.weapons.weapon', 'skytte.weapons.projectile'], function(settings, numbers, BoundingBox, Polygon, Entity, Weapon, Projectile) {
    function PlasmaProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.rotationSpeed = -360;
        this.explodeSound = kwargs.explodeSound;
    }
    PlasmaProjectile.prototype = Object.create(Projectile.prototype);
    PlasmaProjectile.prototype.explode = function() {
        Projectile.prototype.explode.apply(this, arguments);
        this.game.addExplosion(this.position.x, this.position.y, 50, this.damage, this.team);
        this.explodeSound.play({
            'volume': settings('PLASMA_EXPLODE_VOLUME', 1)
        });
    };
    PlasmaProjectile.prototype.logic = function(timeDelta) {
        Projectile.prototype.logic.apply(this, arguments);
        this.angle += this.rotationSpeed * numbers.sign(this.velocity.x) * timeDelta;
    };

    function PlasmaWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileExplodeSound = this.game.getResource(kwargs.projectileExplodeSound);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.initialProjectileSpeed = 350;
        this.projectilePolygon = Polygon.fromString('-10,-10 10,-10 10,10 -10,10');
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
    };
    PlasmaWeapon.prototype = Object.create(Weapon.prototype);
    PlasmaWeapon.prototype.spawnProjectile = function() {
        var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var config = {
            'vx': Math.cos(numbers.radians(this.direction)) * this.initialProjectileSpeed,
            'explodeSound': this.projectileExplodeSound,
            'sprite': this.projectileSprite,
            'box': this.projectileBox,
            'polygon': this.projectilePolygon,
            'damage': this.damage,
            'team': this.team
        };
        var bullet = new PlasmaProjectile(this.game, x, y, config);
        this.game.prependEntity(bullet);
        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };
    return {
        'PlasmaWeapon': PlasmaWeapon,
        'PlasmaProjectile': PlasmaProjectile
    };
});
define('skytte.weapons.storm', ['skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.weapon', 'skytte.weapons.projectile'], function(numbers, BoundingBox, Polygon, Weapon, Projectile) {
    function StormProjectile() {
        Projectile.apply(this, arguments);
    }
    StormProjectile.prototype = Object.create(Projectile.prototype);

    function StormWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSpread = kwargs.projectileSpread || 100;
        this.projectileCount = kwargs.projectileCount || 3;
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.projectilePolygon = Polygon.fromString('-15,-5 15,-5 15,5 -15,5');
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
        this.initialProjectileSpeed = 700;
    };
    StormWeapon.prototype = Object.create(Weapon.prototype);
    StormWeapon.prototype.spawnProjectile = function() {
        var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var vx = this.initialProjectileSpeed * .75;
        var vy = -this.projectileSpread / 2;
        var vyi = this.projectileSpread / (this.projectileCount - 1);
        var config;
        for (var i = 0; i < this.projectileCount; i++) {
            config = {
                'sprite': this.projectileSprite,
                'polygon': this.projectilePolygon,
                'box': this.projectileBox,
                'vx': vx + Math.random() * this.initialProjectileSpeed / 2,
                'vy': vy + i * vyi,
                'damage': this.damage,
                'team': this.team
            };
            this.game.prependEntity(new StormProjectile(this.game, x, y, config));
        }
        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };
    return {
        'StormWeapon': StormWeapon,
        'StormProjectile': StormProjectile
    };
});
define('skytte.weapons.laser', ['skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.weapon', 'skytte.weapons.projectile', 'skytte.weapons.storm'], function(numbers, BoundingBox, Polygon, Weapon, Projectile, storm) {
    function LaserWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.projectilePolygon = kwargs.projectilePolygon;
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
        if (typeof kwargs.projectileSpeed !== 'undefined')
            this.projectileSpeed = kwargs.projectileSpeed;
        else {
            this.projectileSpeedX = kwargs.projectileSpeedX;
            this.projectileSpeedY = kwargs.projectileSpeedY;
        }
    };
    LaserWeapon.prototype = Object.create(Weapon.prototype);
    LaserWeapon.prototype.spawnProjectile = function() {
        var dir = numbers.radians(this.direction);
        var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var vx, vy;
        if (typeof this.projectileSpeed !== 'undefined') {
            vx = this.projectileSpeed * Math.cos(dir);
            vy = this.projectileSpeed * Math.sin(dir);
        } else {
            vx = this.projectileSpeedX;
            vy = this.projectileSpeedY;
        }
        var config = {
            'sprite': this.projectileSprite,
            'polygon': this.projectilePolygon,
            'team': this.team,
            'box': this.projectileBox,
            'vx': vx,
            'vy': vy,
            'damage': this.damage
        };
        var bullet = new storm.StormProjectile(this.game, x, y, config);
        this.game.prependEntity(bullet);
        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };
    return {
        'LaserWeapon': LaserWeapon
    };
});
define('skytte.weapons.ray', ['skytte.numbers', 'skytte.vector2', 'skytte.per_second', 'skytte.polygon', 'skytte.beam', 'skytte.entity', 'skytte.weapons.weapon', 'skytte.weapons.projectile'], function(numbers, Vector2, PerSecond, Polygon, Beam, Entity, Weapon, Projectile) {
    function RayProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.damagePerSecond = this.damage;
        this.damage = 0;
        this.beam = new Beam(kwargs.beamColor, 3, 2, 35);
        this.beam.start.x = 0;
        this.beam.start.y = 0;
        this.beam.end.x = this.game.WORLD.WIDTH;
        this.beam.end.y = 0;
        this.updateBeam = new PerSecond(15, this.beam.update.bind(this.beam));
    }
    RayProjectile.prototype = Object.create(Projectile.prototype);
    RayProjectile.prototype.logic = function(timeDelta) {
        if (this.weapon.owner && this.weapon.owner.dead)
            this.dead = true;
        else {
            this.damage = this.damagePerSecond * timeDelta;
            this.updateBeam.logic(timeDelta);
        }
    };
    RayProjectile.prototype.collidesWith = function(other) {};
    RayProjectile.prototype.draw = function(context, scale) {
        this.beam.draw(context, scale, this.position.x, this.position.y);
        Entity.prototype.draw.apply(this, arguments);
    };

    function RayWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectile = new RayProjectile(this.game, 0, 0, {
            'damage': this.damage,
            'box': '0,0 10,10',
            'team': this.team,
            'weapon': this,
            'beamColor': kwargs.beamColor
        });
        this.projectile.polygon = Polygon.fromBox(this.projectile.box);
        this.projectile.dead = true;
    };
    RayWeapon.prototype = Object.create(Weapon.prototype);
    RayWeapon.prototype.startShooting = function() {
        Weapon.prototype.startShooting.apply(this, arguments);
        this.projectile.dead = false;
        if (!this.game.isEntityInGame(this.projectile)) {
            this.game.prependEntity(this.projectile);
            if (!this._fireSoundInstance)
                this._fireSoundInstance = this.fireSound.playLoop({
                    'volume': this.fireSoundVolume
                });
        }
        this._fireSoundInstance.play({
            'loop': -1,
            'volume': this.fireSoundVolume
        });
    };
    RayWeapon.prototype.spawnProjectile = function() {};
    RayWeapon.prototype.stopShooting = function() {
        Weapon.prototype.stopShooting.apply(this, arguments);
        this.projectile.dead = true;
        this._fireSoundInstance.stop();
    };
    RayWeapon.prototype.logic = function() {
        Weapon.prototype.logic.apply(this, arguments);
        if (this.shooting) {
            var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
            var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
            var w = numbers.clip(30, this.game.WORLD.WIDTH - x + 4, this.game.WORLD.WIDTH);
            this.projectile.box.width = w;
            this.projectile.polygon.points[1].x = w;
            this.projectile.polygon.points[2].x = w;
            this.projectile.position.x = x;
            this.projectile.position.y = y;
            this.projectile.damagePerSecond = this.damage;
            if (!this.game.isEntityInGame(this.projectile))
                this.game.prependEntity(this.projectile);
        } else if (this._fireSoundInstance)
            this._fireSoundInstance.stop();
    };
    return {
        'RayWeapon': RayWeapon,
        'RayProjectile': RayProjectile
    };
});
define('skytte.weapons.rockets', ['settings', 'skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.particles.particle', 'skytte.particles.emitter', 'skytte.weapons.weapon', 'skytte.weapons.projectile'], function(settings, numbers, BoundingBox, Polygon, Particle, Emitter, Weapon, Projectile) {
    var SMOKE = {
        'spawnSpeed': 50,
        'particle': {
            'direction': 270,
            'spreadY': 8,
            'spreadX': 8,
            'speed': 0,
            'life': 500,
            'color': '#fff',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 5;
            }
        }
    };

    function RocketProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.turningSpeed = 135;
        this.minSpeed = kwargs.minSpeed;
        this.speed = kwargs.speed;
        this.maxSpeed = kwargs.maxSpeed;
        this.acceleration = kwargs.acceleration;
        this.explosionRadius = kwargs.explosionRadius;
        this.smoke = new Emitter(this.game, this.position.x, this.position.y, SMOKE);
        this.game.prependEntity(this.smoke);
        this.target = null;
        this.searchAfter = 50;
        this.distance = 0;
        this.maxDistance = game.WORLD.WIDTH * 2;
        this.explodeSound = kwargs.explodeSound;
        this.flyingSound = kwargs.flyingSound;
        this._flyingSoundInstance = this.flyingSound.playLoop({
            'volume': settings('ROCKET_FLYING_VOLUME', 1)
        });
    }
    RocketProjectile.prototype = Object.create(Projectile.prototype);
    RocketProjectile.prototype.searchForTarget = function() {
        var ShipEntity = require('skytte.entities.ship');
        var x = this.position.x,
            y = this.position.y,
            projectile = this;
        var result = this.game.findClosest(this.position.x, this.position.y, ShipEntity, 0, function(target) {
            return target.team && projectile.team !== target.team && target.position.x > projectile.position.x;
        });
        this.target = result.target;
    };
    RocketProjectile.prototype.explode = function() {
        if (!this.dead) {
            this.smoke.dead = this.dead = true;
            this.smoke.stop();
            this.smoke = null;
            this.game.addExplosion(this.position.x, this.position.y, this.explosionRadius, this.damage, this.team);
            this.explodeSound.play({
                'volume': settings('ROCKET_EXPLODE_VOLUME', 1)
            });
        }
    };
    RocketProjectile.prototype.onRemove = function() {
        this._flyingSoundInstance.stop();
    };
    RocketProjectile.prototype.logic = function(timeDelta) {
        if (this.distance >= this.searchAfter && (!this.target || (this.target && this.target.dead)))
            this.searchForTarget();
        if (this.target) {
            var targetCenter = this.target.getCenter();
            var targetAngle = numbers.degrees(Math.atan2(targetCenter.y - this.position.y, targetCenter.x - this.position.x));
            var diff = targetAngle - this.angle;
            var dist = Math.abs(diff);
            if (diff > 180)
                diff -= 360;
            else if (diff < -180)
                diff += 360;
            var change = numbers.sign(diff) * this.turningSpeed * timeDelta;
            if (Math.abs(change) > dist)
                change = dist * numbers.sign(change);
            this.angle += change;
        }
        var dir = numbers.radians(this.angle);
        this.speed = numbers.clip(this.minSpeed, this.speed + this.acceleration * timeDelta, this.maxSpeed);
        this.velocity.x = Math.cos(dir) * this.speed;
        this.velocity.y = Math.sin(dir) * this.speed;
        this.distance += (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) * timeDelta;
        Projectile.prototype.logic.apply(this, arguments);
        this.smoke.position.x = this.position.x + Math.cos(dir) * -20;
        this.smoke.position.y = this.position.y + Math.sin(dir) * -20;
        if (this.dead)
            this.smoke.dead = true;
        if (this.game.player) {
            var pan = this.game.getPanForPosition(this.position, this.game.player.getCenter().x);
            this._flyingSoundInstance.setPan(pan);
        }
        this._flyingSoundInstance.setVolume((1 - this.distance / this.maxDistance) * .1);
        if (this.distance >= this.maxDistance || this.position.y <= 0 || this.position.y >= this.game.WORLD.HEIGHT - 1)
            this.explode();
    };

    function RocketsWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.rocketFlyingSound = this.game.getResource(kwargs.rocketFlyingSound);
        this.rocketExplodeSound = this.game.getResource(kwargs.rocketExplodeSound);
        this.minProjectileSpeed = 200;
        this.initialProjectileSpeed = 200;
        this.maxProjectileSpeed = 700;
        this.projectileAccel = 200;
        this.explosionRadius = 75;
        this.projectilePolygon = Polygon.fromString('-7,-7 7,-7 7,7 -7,7');
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
    };
    RocketsWeapon.prototype = Object.create(Weapon.prototype);
    RocketsWeapon.prototype.spawnProjectile = function() {
        var barrel = this.getBarrel();
        var config = {
            'team': this.team,
            'sprite': this.projectileSprite,
            'flyingSound': this.rocketFlyingSound,
            'explodeSound': this.rocketExplodeSound,
            'damage': this.damage,
            'minSpeed': this.minProjectileSpeed,
            'speed': this.initialProjectileSpeed,
            'maxSpeed': this.maxProjectileSpeed,
            'acceleration': this.projectileAccel,
            'explosionRadius': this.explosionRadius,
            'box': this.projectileBox,
            'polygon': this.projectilePolygon
        };
        this.game.prependEntity(new RocketProjectile(this.game, barrel.x, barrel.y, config));
        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };
    return {
        'RocketsWeapon': RocketsWeapon,
        'RocketProjectile': RocketProjectile
    };
});
define('skytte.weapons.flak', ['skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.weapon', 'skytte.weapons.projectile'], function(numbers, BoundingBox, Polygon, Weapon, Projectile) {
    function FlakProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.time = kwargs.time;
    }
    FlakProjectile.prototype = Object.create(Projectile.prototype);
    FlakProjectile.prototype.logic = function(timeDelta) {
        Projectile.prototype.logic.apply(this, arguments);
        this.time -= timeDelta * 1000;
        if (this.time <= 0)
            this.dead = true;
    };

    function FlakWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.radius = 300;
        this.spread = 20;
        this.bullets = [];
        this.bulletTime = 200;
        if (typeof kwargs.projectileSpeed !== 'undefined') {
            this.projectileSpeed = kwargs.projectileSpeed;
            this.projectileSpeedX = this.projectileSpeed;
            this.projectileSpeedY = this.projectileSpeed;
        } else {
            this.projectileSpeedX = kwargs.projectileSpeedX || 0;
            this.projectileSpeedY = kwargs.projectileSpeedY || 0;
        }
        var bulletPolygon = Polygon.fromString('-3,-3 3,-3 3,3 -3,3');
        var bulletBox = BoundingBox.fromPolygon(bulletPolygon);
        for (var i = 0; i < 100; i++)
            this.bullets.push(new FlakProjectile(this.game, 0, 0, {
                'sprite': this.projectileSprite,
                'box': bulletBox,
                'team': this.team,
                'polygon': bulletPolygon,
                'weapon': this,
                'dead': true
            }));
    };
    FlakWeapon.prototype = Object.create(Weapon.prototype);
    FlakWeapon.prototype.spawnProjectile = function() {
        var startX = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var startY = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var x, y, vx, vy, angle, distance, bullet;
        for (var i = 0; i < 50; i++) {
            bullet = this.bullets[i];
            if (bullet.dead) {
                angle = this.direction + Math.round(Math.random() * this.spread * 2) - this.spread;
                distance = Math.random();
                vx = Math.cos(numbers.radians(angle));
                vy = Math.sin(numbers.radians(angle));
                x = vx * distance * this.radius;
                y = vy * distance * this.radius;
                bullet.size = 2 - distance;
                bullet.position.x = startX + x;
                bullet.position.y = startY + y;
                bullet.velocity.x = this.projectileSpeedX + vx * 50 * Math.random();
                bullet.velocity.y = this.projectileSpeedY + vy * 50 * Math.random();
                bullet.time = 50 + this.bulletTime * Math.random() * 2;
                bullet.damage = this.damage * distance;
                bullet.dead = false;
                this.game.prependEntity(bullet);
            }
        }
        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };
    return {
        'FlakWeapon': FlakWeapon,
        'FlakProjectile': FlakProjectile
    };
});
define('skytte.weapons.electro', ['skytte.utils', 'skytte.numbers', 'skytte.vector2', 'skytte.per_second', 'skytte.bounding_box', 'skytte.polygon', 'skytte.beam', 'skytte.entity', 'skytte.weapons.weapon', 'skytte.weapons.projectile'], function(utils, numbers, Vector2, PerSecond, BoundingBox, Polygon, Beam, Entity, Weapon, Projectile) {
    function ElectroProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.damagePerSecond = this.damage;
        this.barrelOffset = kwargs.barrelOffset;
        this.damage = 0;
        this.hitSprite = kwargs.hitSprite;
        this.beam = new Beam(kwargs.beamColor, 15, 2);
        this.target = null;
        this.updateBeam = new PerSecond(15, this.beam.update.bind(this.beam));
    }
    ElectroProjectile.prototype = Object.create(Projectile.prototype);
    ElectroProjectile.prototype.setTarget = function(target) {
        this.target = target;
        this.updateBeamPosition();
        this.beam.update();
    };
    ElectroProjectile.prototype.updateBeamPosition = function() {
        if (this.target) {
            var targetCenter = this.target.getCenter(),
                barrel = this.weapon.getBarrel();
            this.beam.start.x = barrel.x;
            this.beam.start.y = barrel.y;
            this.position.x = this.beam.end.x = targetCenter.x;
            this.position.y = this.beam.end.y = targetCenter.y;
        }
    };
    ElectroProjectile.prototype.logic = function(timeDelta) {
        if (this.weapon.owner && this.weapon.owner.dead) {
            this.dead = true;
            this.target = null;
        }
        this.damage = this.damagePerSecond * timeDelta;
        if (this.target) {
            this.updateBeamPosition();
            this.updateBeam.logic(timeDelta);
        }
        Projectile.prototype.logic.apply(this, arguments);
    };
    ElectroProjectile.prototype.collidesWith = function(other) {};
    ElectroProjectile.prototype.draw = function(context, scale) {
        if (this.target) {
            this.beam.draw(context, scale);
            this.hitSprite.draw(context, scale * (this.beam.end.x - this.hitSprite.image.width / 2), scale * (this.beam.end.y - this.hitSprite.image.height / 2));
        }
        Entity.prototype.draw.apply(this, arguments);
    };

    function ElectroWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.radius = kwargs.radius;
        this.projectiles = [];
        var bulletPolygon = Polygon.fromString('-10,-10 10,-10 10,10 -10,10');
        var bulletBox = BoundingBox.fromPolygon(bulletPolygon);
        var config, i, projectile
        for (i = 0; i < kwargs.rayCount; i++) {
            config = {
                'box': bulletBox,
                'polygon': bulletPolygon,
                'hitSprite': this.game.getResource(kwargs.projectileHitSprite),
                'damage': kwargs.damage,
                'barrelOffset': this.barrelOffset,
                'team': this.team,
                'weapon': this,
                'beamColor': kwargs.beamColor
            };
            projectile = new ElectroProjectile(this.game, this.position.x, this.position.y, config);
            projectile.dead = true;
            this.projectiles.push(projectile);
        }
        this._fireSoundInstance = this.fireSound.getInstance();
    };
    ElectroWeapon.prototype = Object.create(Weapon.prototype);
    ElectroWeapon.prototype.spawnProjectile = function() {};
    ElectroWeapon.prototype.stopShooting = function() {
        Weapon.prototype.stopShooting.apply(this, arguments);
        for (var i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].dead = true;
            this.projectiles[i].target = null;
        }
        this._fireSoundInstance.stop();
    };
    ElectroWeapon.prototype.logic = function(timeDelta) {
        Weapon.prototype.logic.apply(this, arguments);
        var oneRayAtLeast = false;
        if (this.shooting) {
            var ShipEntity = require('skytte.entities.ship');
            var targets = [],
                result, weapon = this;
            var weaponX = this.position.x + this.owner.position.x + this.barrelOffset.x;
            var weaponY = this.position.y + this.owner.position.y + this.barrelOffset.y;
            for (var i = 0; i < this.projectiles.length; i++) {
                result = this.game.findClosest(weaponX, weaponY, ShipEntity, 0, function(target) {
                    return target.team && weapon.team !== target.team && !utils.inArray(target, targets);
                });
                this.projectiles[i].damagePerSecond = this.damage;
                if (result.target && result.distance <= this.radius) {
                    if (this.projectiles[i].target !== result.target) {
                        this.projectiles[i].setTarget(result.target);
                    }
                    if (this.projectiles[i].dead) {
                        this.game.addEntity(this.projectiles[i]);
                        this.projectiles[i].dead = false;
                    }
                    targets.push(result.target);
                    oneRayAtLeast = true;
                } else {
                    this.projectiles[i].dead = true;
                    this.projectiles[i].target = null;
                }
            }
        }
        if (oneRayAtLeast) {
            if (this._fireSoundInstance.playState !== createjs.Sound.PLAY_SUCCEEDED)
                this._fireSoundInstance.play({
                    'loop': -1,
                    'volume': this.fireSoundVolume
                });
        } else
            this._fireSoundInstance.stop();
        if (this.owner.dead)
            for (var i = 0; i < this.projectiles.length; i++) {
                this.projectiles[i].dead = true;
                this.projectiles[i].target = null;
            }
    };
    return {
        'ElectroWeapon': ElectroWeapon,
        'ElectroProjectile': ElectroProjectile
    };
});
define('skytte.particles.explosion', ['skytte.utils', 'skytte.easings', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.projectile', 'skytte.particles.emitter'], function(utils, easings, BoundingBox, Polygon, Projectile, Emitter) {
    function SmokeEmitter() {
        Emitter.apply(this, arguments);
    }
    SmokeEmitter.prototype = Object.create(Emitter.prototype);
    SmokeEmitter.prototype.draw = function(context, scale, x, y) {
        Emitter.prototype.draw.apply(this, arguments);
        x = x || 0;
        y = y || 0;
        context.save();
        context.beginPath();
        context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)), Math.floor(scale * (1 + this.p * 5)), 0, 2 * Math.PI);
        context.fillStyle = '#fff';
        context.fill();
        context.restore();
    };
    var CLOUD = {
        'spawnCount': 20,
        'spawn': false,
        'particle': {
            'directionSpread': 360,
            'size': 30,
            'sizeSpread': 15,
            'speed': 100,
            'speedSpread': 50,
            'life': 650,
            'colors': ['#fff', '#fff', '#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444', '#333'],
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                if (typeof this._originalSize === 'undefined')
                    this._originalSize = this.size;
                this.size = this._originalSize * easings.cubicInOut(this.p);
            },
            'draw': function(context, scale, x, y) {
                context.beginPath();
                context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)), Math.floor(scale * this.size), 0, 2 * Math.PI);
                context.fillStyle = this.emitter.particle.colors[Math.floor((1 - this.p) * 14)];
                context.fill();
            }
        }
    };
    var SMOKE = {
        'spawnSpeed': 5,
        'particle': {
            'direction': 270,
            'life': 250,
            'colors': ['#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444', '#333', '#222', '#111'],
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = 1 + this.p * this.emitter.p * 8;
            },
            'draw': function(context, scale, x, y) {
                context.beginPath();
                context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)), Math.floor(scale * this.size), 0, 2 * Math.PI);
                context.fillStyle = this.emitter.particle.colors[Math.floor((1 - this.p) * 14)];
                context.fill();
            }
        },
        'life': 1000
    };

    function Explosion(game, x, y, kwargs) {
        kwargs = kwargs || {};
        Projectile.apply(this, [game, x, y, kwargs]);
        this.maxDamage = this.damage = kwargs.damage;
        this.life = 1;
        this.radius = kwargs.radius;
        this.box = new BoundingBox(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        this.polygon = Polygon.fromBox(this.box);
    }
    Explosion.prototype = Object.create(Projectile.prototype);
    Explosion.prototype.collidesWith = function(other) {
        var ShipEntity = require('skytte.entities.ship');
        if (other instanceof ShipEntity && this.team !== other.team) {
            var otherCenter = other.getCenter();
            var recoil = this.position.copy().sub(otherCenter);
            var distance = recoil.length();
            other.force.add(recoil.normalize().scale(-Math.max(0, this.radius - distance)));
        }
    };
    Explosion.prototype.logic = function(timeDelta) {
        this.life--;
        if (this.life < 0) {
            for (var i = 0; i < 4; i++) {
                var smoke = new SmokeEmitter(this.game, this.position.x, this.position.y, SMOKE);
                smoke.force.x = Math.random() - .5;
                smoke.force.y = Math.random() - .5;
                smoke.force.scale(400);
                this.game.prependForeground(smoke);
            }
            var size = this.radius / 3;
            var speed = size * 4;
            var cloudConfig = utils.merge(CLOUD, {
                'spawnCount': this.radius / 15,
                'particle': {
                    'speed': speed,
                    'speedSpread': speed / 2,
                    'size': size,
                    'sizeSpread': size / 2,
                }
            });
            this.game.prependForeground(new Emitter(this.game, this.position.x, this.position.y, cloudConfig));
            this.dead = true;
        } else
            Projectile.prototype.logic.apply(this, arguments);
    };
    return Explosion;
});
define('skytte.entities.sprite', ['skytte.entity'], function(Entity) {
    function SpriteEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'SpriteEntity', x, y, kwargs]);
        this.sprite = this.game.getResource(kwargs.sprite);
    }
    SpriteEntity.prototype = Object.create(Entity.prototype);
    SpriteEntity.prototype.getCenter = function() {
        return {
            'x': this.position.x + this.sprite.width / 2,
            'y': this.position.y + this.sprite.height / 2
        };
    };
    SpriteEntity.prototype.draw = function(context, scale, x, y) {
        this.sprite.draw(context, this.position.x * scale + x, this.position.y * scale + y);
    };
    return SpriteEntity;
});
define('skytte.entities.background', ['skytte.entity'], function(Entity) {
    function BackgroundEntity(game, kwargs) {
        kwargs.vx = -kwargs.speed * game.SCREEN.SCALE;
        Entity.apply(this, [game, 'BackgroundEntity', 0, 0, kwargs]);
        this.align = kwargs.align;
        this.spriteList = this.game.getResource(kwargs.spriteList);
        this.segments = [];
        this.chance = typeof kwargs.chance === 'undefined' ? 1 : kwargs.chance;
    }
    BackgroundEntity.ALIGN_TOP = 1;
    BackgroundEntity.ALIGN_MIDDLE = 2;
    BackgroundEntity.ALIGN_BOTTOM = 3;
    BackgroundEntity.prototype = Object.create(Entity.prototype);
    BackgroundEntity.prototype.addNewSegment = function(keepPosition) {
        var newSegment = 0,
            spriteCount = this.spriteList.sprites.length,
            other;
        if (Math.random() > this.chance)
            newSegment = null;
        else if (spriteCount > 1) {
            if (this.velocity.x < 0)
                other = this.segments[this.segments.length - 1];
            else
                other = this.segments[0];
            do
                newSegment = Math.floor(Math.random() * spriteCount); while (newSegment === other);
        }
        if (this.velocity.x <= 0)
            this.segments.push(newSegment);
        else {
            this.segments.unshift(newSegment);
            if (!keepPosition) {
                if (newSegment !== null)
                    this.position.x -= this.spriteList.sprites[newSegment].image.width;
                else
                    this.position.x -= this.game.WORLD.WIDTH;
            }
        }
        return newSegment;
    }
    BackgroundEntity.prototype.logic = function(timeDelta) {
        Entity.prototype.logic.apply(this, arguments);
        this.dead = false;
    };
    BackgroundEntity.prototype.draw = function(context, scale, x, y) {
        var segment, sprite, i = 0,
            dx = Math.floor(this.position.x + x),
            dy;
        if (this.velocity.x <= 0) {
            while (dx < this.game.WORLD.WIDTH) {
                if (typeof this.segments[i] === 'undefined')
                    this.addNewSegment();
                if (this.segments[i] === null)
                    dx += this.game.WORLD.WIDTH;
                else
                    dx += this.spriteList.sprites[this.segments[i]].image.width;
                if (dx < 0) {
                    this.segments.shift();
                    this.position.x = dx;
                } else
                    i++;
            }
        } else if (this.velocity.x > 0) {
            while (this.position.x + x > 0)
                this.addNewSegment();
            do {
                if (typeof this.segments[i] === 'undefined')
                    this.addNewSegment(true);
                segment = this.segments[i];
                if (dx > this.game.WORLD.WIDTH)
                    this.segments.pop();
                else {
                    i += 1;
                    dx += segment === null ? this.game.WORLD.WIDTH : this.spriteList.sprites[segment].image.width;
                }
            } while (dx < this.game.WORLD.WIDTH)
        }
        dx = Math.floor(this.position.x + x);
        for (i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];
            if (segment === null)
                dx += this.game.WORLD.WIDTH;
            else {
                sprite = this.spriteList.sprites[segment];
                if (this.align === BackgroundEntity.ALIGN_TOP)
                    dy = y;
                else if (this.align === BackgroundEntity.ALIGN_MIDDLE)
                    dy = Math.floor((this.game.SCREEN.HEIGHT - sprite.image.height) / 2 + y);
                else if (this.align === BackgroundEntity.ALIGN_BOTTOM)
                    dy = this.game.SCREEN.HEIGHT - sprite.image.height + y + 8;
                sprite.draw(context, dx, dy);
                dx += sprite.image.width;
            }
        }
    };
    return BackgroundEntity;
});
define('skytte.entities.fog', ['skytte.numbers', 'skytte.entity'], function(numbers, Entity) {
    function FogEntity(game, kwargs) {
        Entity.apply(this, [game, 'FogEntity', 0, 0, kwargs]);
        this.sprite = this.game.getResource(kwargs.sprite);
        this.killWhenOffScreen = false;
        this.velocity.x = -140;
        this.reset(true);
    }
    FogEntity.prototype = Object.create(Entity.prototype);
    FogEntity.prototype.reset = function(firstTime) {
        if (firstTime)
            this.position.x = this.game.WORLD.WIDTH * (Math.random() - .5) * 2;
        else
            this.position.x = this.game.WORLD.WIDTH + this.game.WORLD.WIDTH * Math.random();
        this.position.y = this.game.WORLD.HEIGHT - this.sprite.height / this.game.SCREEN.SCALE / 2;
        this.angle = Math.random() * 360;
    };
    FogEntity.prototype.logic = function(timeDelta) {
        this.angle += 45 * timeDelta;
        this.velocity.y = Math.cos(numbers.radians(this.angle)) * 40;
        Entity.prototype.logic.apply(this, arguments);
        if (this.position.x + this.sprite.width < 0)
            this.reset();
    };
    FogEntity.prototype.draw = function(context, scale, x, y) {
        this.sprite.draw(context, scale * this.position.x + x, scale * this.position.y + y);
        Entity.prototype.draw.apply(this, arguments);
    };
    return FogEntity;
});
define('skytte.entities.ship', ['settings', 'skytte.numbers', 'skytte.easings', 'skytte.tween', 'skytte.entity', 'skytte.weapons.projectile', 'skytte.particles.emitter', 'skytte.particles.explosion'], function(settings, numbers, easings, Tween, Entity, Projectile, Emitter, Explosion) {
    function ShipEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'ShipEntity', x, y, kwargs]);
        if (kwargs.explosionSound)
            this.explosionSound = this.game.getResource(kwargs.explosionSound);
        this.sprite = this.game.getResource(kwargs.sprite);
        this.hitSprite = this.game.getResource(kwargs.hitSprite);
        this.shieldSprite = this.game.getResource(kwargs.shieldSprite);
        if (kwargs.invincibleShieldSprite)
            this.invincibleShieldSprite = this.game.getResource(kwargs.invincibleShieldSprite);
        this.health = this.maxHealth = kwargs.health;
        this.healthPerSecond = kwargs.healthPerSecond || 0;
        this.shield = this.maxShield = kwargs.shield;
        this.shieldLevel = 1;
        this.shieldPerSecond = kwargs.shieldPerSecond || 0;
        this.regenerationDelay = 1500;
        this.engines = [];
        if (kwargs.engines)
            for (var i = 0; i < kwargs.engines.length; i++)
                this.engines.push(new Emitter(this.game, kwargs.engines[i].x, kwargs.engines[i].y, kwargs.engines[i].emitter));
        this.weapons = [];
        if (kwargs.weapons)
            for (var i = 0; i < kwargs.weapons.length; i++)
                this.weapons.push(new kwargs.weapons[i].weapon.cls(this.game, this, kwargs.weapons[i].x, kwargs.weapons[i].y, kwargs.weapons[i].weapon));
        this.speed = kwargs.speed || 0;
        this.explosionRadius = kwargs.explosionRadius || 0;
        this.explosionDamage = kwargs.explosionDamage || 0;
        this.score = kwargs.score || 0;
        this.invincibleTime = kwargs.invincibleTime || 0;
        this.hit = new Tween(0, 0, 250, easings.quadraticOut);
        this.hit.toEnd();
        this.powerUps = kwargs.powerUps;
        this._invincibilitySound = this.game.getResource('soundPlayerInvincibility');
        this.angle = 0;
    }
    ShipEntity.prototype = Object.create(Entity.prototype);
    ShipEntity.prototype.hasWeapon = function() {
        return this.weapons && this.weapons.length > 0;
    };
    ShipEntity.prototype.startShooting = function() {
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].startShooting();
    };
    ShipEntity.prototype.stopShooting = function() {
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].stopShooting();
    };
    ShipEntity.prototype.moveUp = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.y = Math.max(this.velocity.y - this.speed * scale, -this.speed);
    };
    ShipEntity.prototype.moveDown = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.y = Math.min(this.velocity.y + this.speed * scale, this.speed);
    };
    ShipEntity.prototype.moveLeft = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.x = Math.max(this.velocity.x - this.speed * scale, -this.speed);
    };
    ShipEntity.prototype.moveRight = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.x = Math.min(this.velocity.x + this.speed * scale, this.speed);
    };
    ShipEntity.prototype.logic = function(timeDelta) {
        var particle, i;
        this.regenerationDelay -= timeDelta * 1000;
        if (this.regenerationDelay <= 0 && this.shieldPerSecond && this.maxShield)
            this.shield = Math.min(this.maxShield, this.shield + this.shieldPerSecond * timeDelta);
        if (this.regenerationDelay <= 0 && this.healthPerSecond && this.maxShield)
            this.health = Math.min(this.maxHealth, this.health + this.healthPerSecond * timeDelta);
        Entity.prototype.logic.apply(this, arguments);
        this.hit.logic(timeDelta);
        if (this.hit.hasEnded && this.health > 0) {
            this.hit.begin = this.hit.change = 0;
            this.hit.toEnd();
        }
        if (this === this.game.player) {
            for (i = 0; i < this.engines.length; i++) {
                this.engines[i].particle.direction = 180 + (this.velocity.y / this.speed) * 45;
                this.engines[i].particle.speed = 40 + 40 * (this.velocity.x / this.speed);
            }
            this.position.x = numbers.clip(0 - this.box.x - this.box.width / 2, this.position.x, this.game.WORLD.WIDTH - this.box.x - this.box.width);
            this.position.y = numbers.clip(0 - this.box.y, this.position.y, this.game.WORLD.HEIGHT - this.box.y - this.box.height);
            this.velocity.scale(1 - timeDelta * 4);
        } else if (this.box) {
            if (this.position.y + this.box.y < 0 && this.velocity.y + this.force.y <= 0) {
                this.position.y = -this.box.y;
                this.velocity.y = Math.abs(this.velocity.y);
                this.force.y = Math.abs(this.force.y / 2);
            } else if (this.position.y + this.box.y + this.box.height > this.game.WORLD.HEIGHT && this.velocity.y + this.force.y >= 0) {
                this.position.y = this.game.WORLD.HEIGHT - this.box.y - this.box.height;
                this.velocity.y = -Math.abs(this.velocity.y);
                this.force.y = -Math.abs(this.force.y / 2);
            }
        }
        this.angle = this.velocity.y / this.speed * 15;
        if (this !== this.game.player)
            this.angle *= -1;
        for (i = 0; i < this.engines.length; i++)
            this.engines[i].logic(timeDelta);
        for (i = 0; i < this.weapons.length; i++)
            this.weapons[i].logic(timeDelta);
        this.invincibleTime = Math.max(0, this.invincibleTime - timeDelta * 1000);
        if (this === this.game.player) {
            if (this.invincibleTime > 0) {
                if (!this._invincibilitySoundInstance)
                    this._invincibilitySoundInstance = this._invincibilitySound.playLoop({
                        'volume': settings('SHIP_INVINCIBILITY_VOLUME', 1)
                    });
            } else if (this._invincibilitySoundInstance) {
                this._invincibilitySoundInstance.stop();
                this._invincibilitySoundInstance = null;
            }
        }
    };
    ShipEntity.prototype.explode = function() {
        if (!this.dead) {
            this.dead = true;
            var center = this.getCenter();
            if (this.explosionRadius) {
                this.game.addExplosion(center.x, center.y, this.explosionRadius, this.explosionDamage, this.game.PLAYER_TEAM);
                if (this.explosionSound)
                    this.explosionSound.play({
                        'volume': settings('SHIP_EXPLODE_VOLUME', 1)
                    });
            }
            if (this.powerUps && Math.random() <= this.powerUps.chance) {
                var powerUp = this.powerUps.choices[Math.floor(Math.random() * this.powerUps.choices.length)];
                powerUp.fx = (this.force.x + this.velocity.x) / 2;
                powerUp.fy = (this.force.y + this.velocity.y) / 2;
                this.game.makePowerUp(center.x, center.y, powerUp);
            }
        }
    };
    ShipEntity.prototype.onRemove = function() {
        this.stopShooting();
        if (this._invincibilitySoundInstance)
            this._invincibilitySoundInstance.stop();
    };
    ShipEntity.prototype.detonate = function() {
        if (!this.dead) {
            this.dead = true;
            if (this.explosionRadius) {
                var center = this.getCenter();
                this.game.addExplosion(center.x, center.y, this.explosionRadius, this.explosionDamage, this.game.ENEMY_TEAM);
                if (this.explosionSound)
                    this.explosionSound.play({
                        'volume': settings('SHIP_EXPLODE_VOLUME', 1)
                    });
            }
        }
    };
    ShipEntity.prototype.collidesWith = function(other) {
        if (!this.invincibleTime && other instanceof Projectile && other.team !== this.team) {
            this.regenerationDelay = 1500;
            this.health = numbers.clip(0, this.health + Math.min(0, this.shield - other.damage), this.maxHealth);
            this.shield = numbers.clip(0, this.shield - other.damage, this.maxShield);
            if (this.health > 0) {
                if (!this.hit.value) {
                    this.hit.begin = .9;
                    this.hit.change = -this.hit.begin;
                    this.hit.restart();
                }
            } else {
                this.hit.hasEnded = true;
                this.hit.value = .9;
                this.explode();
            }
        } else if (other === this.game.player)
            this.detonate();
    };
    ShipEntity.prototype.drawShield = function(context, x, y) {
        if (this.invincibleTime > 0)
            this.invincibleShieldSprite.draw(context, x, y);
        else if (this.shield >= 1 && this.maxShield >= 1) {
            var oldAlpha = context.globalAlpha;
            context.globalAlpha = this.shield / this.maxShield * context.globalAlpha;
            this.shieldSprite.draw(context, x, y);
            context.globalAlpha = oldAlpha;
        }
    };
    ShipEntity.prototype.drawEngines = function(context, scale, x, y) {
        for (var i = 0; i < this.engines.length; i++)
            this.engines[i].draw(context, scale, x, y);
    };
    ShipEntity.prototype.drawWeapons = function(context, scale, x, y) {
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].draw(context, scale, x, y);
    };
    ShipEntity.prototype.drawShip = function(context, x, y) {
        this.sprite.draw(context, x, y);
    };
    ShipEntity.prototype.drawHit = function(context, x, y) {
        if (this.hit.value) {
            var oldAlpha = context.globalAlpha;
            context.globalAlpha = this.hit.value * context.globalAlpha;
            this.hitSprite.draw(context, x, y);
            context.globalAlpha = oldAlpha;
        }
    };
    ShipEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        var px = -this.sprite.width / 2;
        var py = -this.sprite.height / 2;
        context.save();
        if (this.invincibleTime > 0)
            context.globalAlpha = (Math.floor(this.invincibleTime * .015) % 2) ? .4 : .8;
        context.translate(dx - px, dy - py);
        if (this.angle)
            context.rotate(numbers.radians(this.angle));
        this.drawShield(context, px, py);
        this.drawEngines(context, scale, px, py);
        this.drawShip(context, px, py);
        this.drawHit(context, px, py);
        context.restore();
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        Entity.prototype.draw.apply(this, arguments);
    };
    return ShipEntity;
});
define('skytte.entities.mine', ['settings', 'skytte.vector2', 'skytte.numbers', 'skytte.entities.ship'], function(settings, Vector2, numbers, ShipEntity) {
    function MineEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
        this.distanceSound = this.game.getResource(kwargs.distanceSound);
        this.detonateDamage = kwargs.detonateDamage;
        this.detonateRadius = kwargs.detonateRadius;
        this.angle = Math.random() * 360;
    }
    MineEntity.prototype = Object.create(ShipEntity.prototype);
    MineEntity.prototype.logic = function() {
        ShipEntity.prototype.logic.apply(this, arguments);
        if (this.game.player) {
            var playerCenter = this.game.player.getCenter();
            var mineCenter = this.getCenter();
            var distance = new Vector2(playerCenter).distanceTo(mineCenter);
            var volume = numbers.clip(0, (this.game.WORLD.WIDTH / 2 - distance) / (this.game.WORLD.WIDTH / 2), 1) * settings('MINE_APPROACH_VOLUME', 1);
            var pan = numbers.clip(-1, (mineCenter.x - playerCenter.x) / this.game.WORLD.WIDTH, 1);
        } else;
    };
    MineEntity.prototype.detonate = function() {
        if (!this.dead) {
            this.dead = true;
            var center = this.getCenter();
            this.game.addExplosion(center.x, center.y, this.detonateRadius, this.detonateDamage, this.game.ENEMY_TEAM);
            if (this.explosionSound)
                this.explosionSound.play({
                    'volume': settings('SHIP_EXPLODE_VOLUME', 1)
                });
        }
    };
    MineEntity.prototype.onRemove = function() {};
    return MineEntity;
});
define('skytte.entities.swarm', ['skytte.numbers', 'skytte.entity', 'skytte.entities.ship'], function(numbers, Entity, ShipEntity) {
    function SwarmEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
    }
    SwarmEntity.prototype = Object.create(ShipEntity.prototype);
    return SwarmEntity;
});
define('skytte.entities.teleporter', ['skytte.entity', 'skytte.entities.ship'], function(Entity, ShipEntity) {
    function TeleporterEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
    }
    TeleporterEntity.prototype = Object.create(ShipEntity.prototype);
    TeleporterEntity.prototype.drawShield = function(context, x, y) {
        if (this.shield > 1 && this.maxShield > 1) {
            context.globalAlpha = this.shield / this.maxShield * this.alpha;
            this.shieldSprite.draw(context, x, y);
            context.globalAlpha = this.alpha;
        }
    };
    TeleporterEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        context.save();
        this.drawShield(context, dx, dy);
        context.globalAlpha = Math.ceil(this.alpha * 10) % 2 ? .1 : 1;
        this.drawEngines(context, scale, this.position.x + x, this.position.y + y);
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        this.drawShip(context, dx, dy);
        this.drawHit(context, dx, dy);
        context.restore();
        Entity.prototype.draw.apply(this, arguments);
    };
    return TeleporterEntity;
});
define('skytte.entities.turret', ['skytte.entity', 'skytte.entities.ship'], function(Entity, ShipEntity) {
    function TurretEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
    }
    TurretEntity.prototype = Object.create(ShipEntity.prototype);
    TurretEntity.prototype.logic = function(timeDelta) {
        this.regenerationDelay -= timeDelta * 1000;
        if (this.regenerationDelay <= 0 && this.shieldPerSecond && this.maxShield)
            this.shield = Math.min(this.maxShield, this.shield + this.shieldPerSecond * timeDelta);
        if (this.regenerationDelay <= 0 && this.healthPerSecond && this.maxShield)
            this.health = Math.min(this.maxHealth, this.health + this.healthPerSecond * timeDelta);
        Entity.prototype.logic.apply(this, arguments);
        this.hit.logic(timeDelta);
        if (this.hit.hasEnded && this.health > 0) {
            this.hit.begin = this.hit.change = 0;
            this.hit.toEnd();
        }
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].logic(timeDelta);
    };
    TurretEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        context.save();
        if (this.invincibleTime > 0)
            context.globalAlpha = (Math.floor(this.invincibleTime * .015) % 2) ? .4 : .8;
        this.drawShield(context, dx, dy);
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        this.drawShip(context, dx, dy);
        this.drawHit(context, dx, dy);
        Entity.prototype.draw.apply(this, arguments);
        context.restore();
    };
    return TurretEntity;
});
define('skytte.entities.cart', ['skytte.entity', 'skytte.entities.turret'], function(Entity, TurretEntity) {
    function CartEntity(game, x, y, kwargs) {
        TurretEntity.apply(this, arguments);
        this.verticalSpeed = kwargs.verticalSpeed;
    }
    CartEntity.prototype = Object.create(TurretEntity.prototype);
    CartEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        this.drawShield(context, dx, dy);
        this.drawEngines(context, scale, this.position.x + x, this.position.y + y);
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        this.drawShip(context, dx, dy);
        this.drawHit(context, dx, dy);
        Entity.prototype.draw.apply(this, arguments);
    };
    return CartEntity;
});
define('skytte.entities.power_up', ['skytte.utils', 'skytte.numbers', 'skytte.easings', 'skytte.tween', 'skytte.vector2', 'skytte.entity'], function(utils, numbers, easings, Tween, Vector2, Entity) {
    function PowerUpEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'PowerUpEntity', x, y, kwargs]);
        utils._merge(this, kwargs);
        this.sprite = this.game.getResource(kwargs.sprite);
        if (kwargs.sound)
            this.sound = this.game.getResource(kwargs.sound);
        this.soundVolume = typeof kwargs.soundVolume !== 'undefined' ? kwargs.soundVolume : 1;
        this.angle = Math.random() * 360;
        this.collectAnim = null;
        this.collectible = true;
        this.speed = 0;
        this.maxSpeed = 350;
        this.accel = 100;
        this.distance = new Vector2();
        this._originalVelocity = new Vector2(this.velocity);
    }
    PowerUpEntity.prototype = Object.create(Entity.prototype);
    PowerUpEntity.prototype.collect = function() {
        this.collectAnim = new Tween(1, -1, 750, easings.exponentialOut);
        this.velocity.x = 0;
        this.velocity.y = -100;
        if (this.collectFunc)
            this.collectFunc.apply(this, [this.game]);
        if (this.score)
            this.game.addScoreLabel(this, this.game.addCombo(this.score));
        if (this.sound)
            this.sound.play({
                'volume': this.soundVolume
            });
        delete this.score;
    };
    PowerUpEntity.prototype.active = function(timeDelta) {
        if (this.activeFunc)
            this.activeFunc.apply(this, [this.game, timeDelta]);
    };
    PowerUpEntity.prototype.expired = function() {
        if (this.expiredFunc)
            this.expiredFunc.apply(this, [this.game]);
    };
    PowerUpEntity.prototype.collidesWith = function(other) {
        if (other === this.game.player && !this.collectAnim)
            this.game.collectPowerUp(this);
    };
    PowerUpEntity.prototype.logic = function(timeDelta) {
        if (this.collectAnim) {
            this.collectAnim.logic(timeDelta);
            if (this.collectAnim.hasEnded)
                this.dead = true;
        } else if (this.game.player) {
            this.distance.set(this.game.player.getCenter()).sub(this.getCenter());
            var length = this.distance.length();
            if (length <= 90)
                this.speed = this.maxSpeed;
            else
                this.speed = Math.max(this.speed - this.accel * timeDelta, 0);
            this.velocity.set(this._originalVelocity).add(this.distance.normalize().scale(this.speed));
            if (this.speed === 0) {
                this.angle += 90 * timeDelta;
                this.velocity.y = Math.cos(numbers.radians(this.angle)) * 10;
            }
        } else {
            this.angle += 90 * timeDelta;
            this.velocity.y = Math.cos(numbers.radians(this.angle)) * 10;
        }
        Entity.prototype.logic.apply(this, arguments);
        if (this.position.y + this.box.y < 0 && this.velocity.y + this.force.y <= 0) {
            this.position.y = -this.box.y;
            this.velocity.y = Math.abs(this.velocity.y);
            this.force.y = Math.abs(this.force.y / 2);
        } else if (this.position.y + this.box.y + this.box.height > this.game.WORLD.HEIGHT && this.velocity.y + this.force.y >= 0) {
            this.position.y = this.game.WORLD.HEIGHT - this.box.y - this.box.height;
            this.velocity.y = -Math.abs(this.velocity.y);
            this.force.y = -Math.abs(this.force.y / 2);
        }
    };
    PowerUpEntity.prototype.draw = function(context, scale, x, y) {
        context.save();
        context.translate(Math.floor(x + scale * (this.position.x + this.sprite.width / 2)), Math.floor(y + scale * (this.position.y + this.sprite.height / 2)));
        if (!this.collectAnim && this.angle)
            context.rotate(numbers.radians(this.velocity.y));
        if (this.collectAnim) {
            context.globalAlpha = easings.quarticOut(this.collectAnim.value);
            context.scale(2 - this.collectAnim.value, 2 - this.collectAnim.value);
        }
        this.sprite.draw(context, x + scale * -this.sprite.width / 2, y + scale * -this.sprite.height / 2);
        context.restore();
        Entity.prototype.draw.apply(this, arguments);
    };
    return PowerUpEntity;
});
define('skytte.entities.hud', ['skytte.numbers', 'skytte.easings', 'skytte.vector2', 'skytte.tween', 'skytte.entity'], function(numbers, easings, Vector2, Tween, Entity) {
    function displayWhenBlinking(time, total) {
        return total - time > 1500 || Math.floor(time * 0.01333333333333333) % 2;
    }

    function Weapon(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDWeapon', x, y, kwargs]);
        this.background = this.game.getResource(kwargs.background);
        this.level = this.game.getResource(kwargs.level);
        this.icons = this.game.getResource(kwargs.icons);
    }
    Weapon.prototype = Object.create(Entity.prototype);
    Weapon.INDEX_TO_SPRITE = {
        '1': 0,
        '2': 1,
        '3': 2,
        '5': 3,
        '0': 4,
        '4': 5
    };
    Weapon.prototype.draw = function(context, scale, x, y) {
        context.save();
        var levelX = (this.position.x + 7) * scale + x;
        var levelY = (this.position.y + 80) * scale + y;
        this.level.drawSprite(context, 0, 0, levelX, levelY);
        if (this.game.currentWeapon >= 0) {
            var levelWidth = Math.floor(this.level.width * this.game.weapons[this.game.currentWeapon].level / 3);
            if (levelWidth)
                context.drawImage(this.level.image, 0, this.level.height, levelWidth, this.level.height, Math.floor(levelX), Math.floor(levelY), levelWidth, this.level.height);
        }
        this.background.draw(context, this.position.x * scale + x, this.position.y * scale + y);
        if (this.game.currentWeapon >= 0)
            this.icons.drawSprite(context, Weapon.INDEX_TO_SPRITE[this.game.currentWeapon], 0, (this.position.x + 4) * scale + x, this.position.y * scale + y);
        context.restore();
    };

    function HealthBar(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDHealthBar', x, y, kwargs]);
        this.bars = this.game.getResource(kwargs.bars);
        this.background = this.game.getResource(kwargs.background);
        this.heartIcon = kwargs.heartIcon;
        this.shieldIcon = kwargs.shieldIcon;
        this.font = this.game.getResource(kwargs.font);
        this.toggleTime = 0;
        this.TOGGLE_EVERY = 6000;
    }
    HealthBar.prototype = Object.create(Entity.prototype);
    HealthBar.prototype.logic = function(timeDelta) {
        Entity.prototype.logic.apply(this, arguments);
        this.toggleTime += timeDelta * 1000;
        if (this.toggleTime >= this.TOGGLE_EVERY)
            this.toggleTime -= this.TOGGLE_EVERY;
    };
    HealthBar.prototype.draw = function(context, scale, x, y) {
        context.save();
        var healthX = (this.position.x + 56) * scale + x;
        var healthY = (this.position.y + 7) * scale + y;
        this.bars.drawSprite(context, 0, 0, healthX, healthY);
        var shieldX = (this.position.x + 62) * scale + x;
        var shieldY = (this.position.y + 37) * scale + y;
        this.bars.drawSprite(context, 0, 0, shieldX, shieldY);
        if (this.game.player) {
            var healthWidth = Math.floor(this.game.player.health / this.game.player.maxHealth * this.bars.width);
            if (healthWidth) {
                context.drawImage(this.bars.image, 0, 1 * this.bars.height, healthWidth, this.bars.height, Math.floor(healthX), Math.floor(healthY), healthWidth, this.bars.height);
                if (!this.game.player.shield) {
                    context.globalAlpha = this.game.player.hit.value;
                    context.fillStyle = '#fff';
                    context.fillRect(Math.floor(healthX), Math.floor(healthY), healthWidth, this.bars.height);
                    context.globalAlpha = 1;
                }
            }
            var shieldWidth = Math.floor(this.game.player.shield / this.game.player.maxShield * (this.bars.width * this.game.player.shieldLevel / 3));
            if (shieldWidth) {
                context.drawImage(this.bars.image, this.bars.width - shieldWidth, 2 * this.bars.height, shieldWidth, this.bars.height, Math.floor(shieldX + this.bars.width - shieldWidth), Math.floor(shieldY), shieldWidth, this.bars.height);
                context.globalAlpha = this.game.player.hit.value;
                context.fillStyle = '#fff';
                context.fillRect(Math.floor(shieldX + this.bars.width - shieldWidth), Math.floor(shieldY), shieldWidth, this.bars.height);
                context.globalAlpha = 1;
            }
        }
        this.background.draw(context, this.position.x * scale + x, this.position.y * scale + y);
        if (this.game.player) {
            context.globalAlpha = easings.exponentialInOut(easings.toggleShifted(this.toggleTime / this.TOGGLE_EVERY));
            this.font.drawText(context, String(this.game.player.shieldLevel), 3, (this.position.x + 270 - 53 + 25) * scale + x, (this.position.y + 13) * scale + y, 'center');
            context.globalAlpha = easings.exponentialInOut(easings.toggle(this.toggleTime / this.TOGGLE_EVERY));
        }
        this.shieldIcon.draw(context, (this.position.x + 270 - 53) * scale + x, this.position.y * scale + y);
        if (this.game.player) {
            context.globalAlpha = easings.exponentialInOut(easings.toggleShifted(this.toggleTime / this.TOGGLE_EVERY));
            this.font.drawText(context, String(this.game.lifes), 2, (this.position.x + 25) * scale + x, (this.position.y + 13) * scale + y, 'center');
            context.globalAlpha = easings.exponentialInOut(easings.toggle(this.toggleTime / this.TOGGLE_EVERY));
        }
        this.heartIcon.draw(context, this.position.x * scale + x, this.position.y * scale + y);
        context.restore();
    };

    function Score(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDScore', x, y, kwargs]);
        this.font = this.game.getResource(kwargs.font);
        this.icons = this.game.getResource(kwargs.icons);
        this.startScore = this.score = this.game.score;
        this.startCombo = this.combo = this.game.combo;
    }
    Score.prototype = Object.create(Entity.prototype);
    Score.prototype.logic = function(timeDelta) {
        if (this.game.combo < this.combo)
            this.combo = 0;
        if (this.combo === this.game.combo)
            this.startCombo = this.game.combo;
        if (this.score === this.game.score)
            this.startScore = this.game.score;
        this.score = Math.min(this.game.score, this.score + (this.game.score - this.startScore) * timeDelta);
        this.combo = Math.min(this.game.combo, this.combo + (this.game.combo - this.startCombo) * timeDelta);
    };
    Score.prototype.draw = function(context, scale, x, y) {
        x = Math.floor(this.position.x * scale + x);
        y = Math.floor(this.position.y * scale + y);
        var score = numbers.format(Math.round(this.score));
        var combo = numbers.format(Math.round(this.combo));
        var multiplier = numbers.format(this.game.multiplier);
        this.icons.drawSprite(context, 0, 0, x, y);
        x += this.icons.width + 5;
        this.font.drawText(context, score, 0, x, y + 13 * scale);
        x += this.font.textWidth(score) + 20 * scale;
        if (this.game.combo > 0 || this.game.multiplier > 1) {
            if (displayWhenBlinking(this.game.comboTime, this.game.COMBO_DELAY)) {
                this.icons.drawSprite(context, 2, 0, x, y);
                x += this.icons.width + 5;
                this.font.drawText(context, multiplier, 2, x, y + 13 * scale);
                x += this.font.textWidth(multiplier) + 20 * scale;
                this.icons.drawSprite(context, 1, 0, x, y);
                x += this.icons.width + 5;
                this.font.drawText(context, combo, 1, x, y + 13 * scale);
            }
        }
    };

    function PowerUp(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDPowerUp', x, y, kwargs]);
        this.background = this.game.getResource(kwargs.background);
        this.icons = this.game.getResource(kwargs.icons);
    }
    PowerUp.prototype = Object.create(Entity.prototype);
    PowerUp.prototype.draw = function(context, scale, x, y) {
        if (this.game.activePowerUp) {
            this.background.draw(context, this.position.x * scale + x, this.position.y * scale + y);
            if (displayWhenBlinking(this.game.activePowerUpTime, this.game.activePowerUp.duration))
                this.game.activePowerUp.sprite.draw(context, (this.position.x + 3) * scale + x, (this.position.y + 1) * scale + y);
        }
    };

    function LevelProgress(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDLevelProgress', x, y, kwargs]);
        this.sprite = this.game.getResource(kwargs.sprite);
        this.levelTime = 0;
    }
    LevelProgress.prototype = Object.create(Entity.prototype);
    LevelProgress.prototype.draw = function(context, scale, x, y) {
        if (this.game.level && this.game.level.duration) {
            context.save();
            if (this.game.player)
                this.levelTime = this.game.level.time;
            x = Math.floor(this.position.x * scale + x);
            y = Math.floor(this.position.y * scale + y);
            var iconWidth = 40;
            var sidePadding = 60;
            var progressWidth = this.sprite.width - sidePadding * 2 - iconWidth;
            var progress = Math.min(1, this.levelTime / (this.game.level.duration + 10000)) * progressWidth;
            context.drawImage(this.sprite.image, iconWidth, 0, this.sprite.width - iconWidth, this.sprite.height, x, y, this.sprite.width - iconWidth, this.sprite.height);
            context.drawImage(this.sprite.image, 0, 0, iconWidth, this.sprite.height, Math.floor(x - iconWidth / 2 + sidePadding + progress), y, iconWidth, this.sprite.height);
            context.restore();
        }
    };
    return {
        'Weapon': Weapon,
        'HealthBar': HealthBar,
        'Score': Score,
        'PowerUp': PowerUp,
        'LevelProgress': LevelProgress
    };
});
define('skytte.entities.label', ['skytte.numbers', 'skytte.easings', 'skytte.entity'], function(numbers, easings, Entity) {
    function LabelEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'LabelEntity', x, y, kwargs]);
        this.text = kwargs.text;
        this.font = this.game.getResource(kwargs.font);
        this.fontColor = kwargs.fontColor || 0;
        this.life = kwargs.life / 1000;
        this.time = 0;
    }
    LabelEntity.prototype = Object.create(Entity.prototype);
    LabelEntity.prototype.logic = function(timeDelta) {
        this.time += timeDelta;
        if (this.time >= this.life) {
            this.time = this.life;
            this.dead = true;
        }
    };
    LabelEntity.prototype.draw = function(context, scale, x, y) {
        context.save();
        var p = this.time / this.life;
        x = Math.floor(this.position.x * scale + x);
        y = Math.floor((this.position.y - p * 50) * scale - this.font.height + y);
        context.globalAlpha = 1 - easings.exponentialIn(p);
        this.font.drawText(context, String(this.text), this.fontColor, x, y, 'center');
        context.restore();
    };
    return LabelEntity;
});
define('skytte.ai.base', function() {
    function BaseAI(game, entity, kwargs) {
        this.game = game;
        this.entity = entity;
    }
    BaseAI.prototype.logic = function(timeDelta) {};
    return BaseAI;
});
define('skytte.ai.idle', ['skytte.numbers', 'skytte.ai.base', 'skytte.entities.turret'], function(numbers, BaseAI, TurretEntity) {
    function IdleAI(game, entity, kwargs) {
        BaseAI.apply(this, arguments);
        this.angle = Math.random() * 360;
        this.shooting = kwargs && kwargs.shooting;
    }
    IdleAI.prototype = Object.create(BaseAI.prototype);
    IdleAI.prototype.logic = function(timeDelta) {
        if (!(this.entity instanceof TurretEntity)) {
            this.angle += 135 * timeDelta;
            this.entity.velocity.x = 0;
            this.entity.velocity.y = Math.cos(numbers.radians(this.angle)) * 16;
        }
        if (!this.shooting)
            for (var i = 0; i < this.entity.weapons.length; i++)
                if (!this.entity.weapons[i].shooting)
                    this.entity.weapons[i].startShooting();
    };
    return IdleAI;
});
define('skytte.ai.move_left', ['skytte.ai.idle'], function(IdleAI) {
    function MoveLeftAI() {
        IdleAI.apply(this, arguments);
    }
    MoveLeftAI.prototype = Object.create(IdleAI.prototype);
    MoveLeftAI.prototype.logic = function(timeDelta) {
        IdleAI.prototype.logic.apply(this, arguments);
        this.entity.velocity.x = -this.entity.speed;
        if (this.entity.position.x + this.entity.sprite.width * 2 < 0)
            this.entity.dead = true;
    };
    return MoveLeftAI;
});
define('skytte.ai.wave', ['skytte.numbers', 'skytte.vector2', 'skytte.ai.base'], function(numbers, Vector2, BaseAI) {
    function WaveAI(game, entity, x, y, width, height, offset, rotateSpeed) {
        BaseAI.apply(this, [game, entity]);
        this.height = height;
        this.moveAngle = 0;
        this.rotateSpeed = rotateSpeed;
        this.delay = offset * width / this.entity.speed * 1000;
        this.entity.position.x = x;
        this.entity.position.y = y - this.entity.box.height / 2;
    }
    WaveAI.prototype = Object.create(BaseAI.prototype);
    WaveAI.prototype.logic = function(timeDelta) {
        if (this.delay > 0)
            this.delay -= timeDelta * 1000;
        else if (this.delay <= 0) {
            this.moveAngle += this.rotateSpeed * timeDelta;
            var dir = numbers.radians(this.moveAngle);
            this.entity.velocity.x = -this.entity.speed;
            this.entity.velocity.y = Math.cos(dir) * this.height / (180 / this.rotateSpeed) * Math.SQRT2;
            this.entity.angle = numbers.degrees(Math.atan2(this.entity.velocity.y, this.entity.velocity.x)) - 180;
        }
    };
    return WaveAI;
});
define('skytte.ai.kamikaze', ['skytte.vector2', 'skytte.ai.base'], function(Vector2, BaseAI) {
    function KamikazeAI(game, entity, target) {
        BaseAI.apply(this, [game, entity]);
        this.target = target;
    }
    KamikazeAI.prototype = Object.create(BaseAI.prototype);
    KamikazeAI.prototype.logic = function(timeDelta) {
        if (this.target && !this.target.dead)
            this.entity.velocity.set(this.target.getCenter()).sub(this.entity.getCenter()).normalize().scale(this.entity.speed);
        else {
            this.entity.velocity.x = -this.entity.speed;
            this.entity.velocity.y = 0;
            this.target = null;
        }
    };
    return KamikazeAI;
});
define('skytte.ai.teleporter', ['skytte.vector2', 'skytte.easings', 'skytte.tween', 'skytte.ai.base'], function(Vector2, easings, Tween, BaseAI) {
    function TeleporterAI(game, entity, kwargs) {
        BaseAI.apply(this, arguments);
        this.entity.alpha = 1;
        this.delay = kwargs.delay / 1000;
        this.teleportTime = kwargs.teleportTime;
        this.teleportLimit = 10;
        this.time = 0;
        this.show = null;
        this.hide = null;
    }
    TeleporterAI.prototype = Object.create(BaseAI.prototype);
    TeleporterAI.prototype.teleport = function() {
        this.hide = null;
        var worldW = this.game.WORLD.WIDTH;
        var worldH = this.game.WORLD.HEIGHT;
        var x = (worldW * .25) + Math.random() * (worldW * .7);
        var y = Math.random() * (worldH * .9 - this.entity.sprite.height);
        this.entity.position.x = x;
        this.entity.position.y = y;
        this.show = new Tween(0, 1, this.teleportTime, easings.linear);
        this.teleportLimit--;
    };
    TeleporterAI.prototype.logic = function(timeDelta) {
        if (this.hide) {
            this.hide.logic(timeDelta);
            this.entity.alpha = this.hide.value;
            if (this.hide.hasEnded)
                this.teleport();
        } else if (this.show) {
            this.show.logic(timeDelta);
            this.entity.alpha = this.show.value;
            if (this.show.hasEnded)
                this.show = null;
        } else if (this.teleportLimit > 0) {
            this.time += timeDelta;
            if (this.time >= this.delay) {
                this.time = 0;
                this.hide = new Tween(1, -1, this.teleportTime, easings.linear);
            }
        }
        this.entity.velocity.x = -this.entity.speed;
        for (var i = 0; i < this.entity.weapons.length; i++)
            if (!this.entity.weapons[i].shooting)
                this.entity.weapons[i].startShooting();
    };
    return TeleporterAI;
});
define('skytte.ai.follow', ['skytte.numbers', 'skytte.vector2', 'skytte.ai.base'], function(numbers, Vector2, BaseAI) {
    function FollowAI(game, entity, target) {
        BaseAI.apply(this, [game, entity]);
        this.target = target;
    }
    FollowAI.prototype = Object.create(BaseAI.prototype);
    FollowAI.prototype.logic = function(timeDelta) {
        if (this.target && !this.target.dead) {
            var heading = new Vector2(this.target.getCenter()).sub(this.entity.getCenter());
            var radius = new Vector2(heading).normalize().scale(200);
            var speed = numbers.clip(0, heading.length() - 200, this.entity.speed);
            this.entity.velocity.set(heading).sub(radius).normalize().scale(speed);
        } else
            this.entity.velocity.x = -this.entity.speed;
        for (var i = 0; i < this.entity.weapons.length; i++)
            if (!this.entity.weapons[i].shooting)
                this.entity.weapons[i].startShooting();
    };
    return FollowAI;
});
define('skytte.ai.cart', ['skytte.ai.base'], function(BaseAI) {
    function CartAI(game, entity, kwargs) {
        BaseAI.apply(this, arguments);
        this.direction = kwargs.direction || -1;
    }
    CartAI.prototype = Object.create(BaseAI.prototype);
    CartAI.prototype.logic = function(timeDelta) {
        var center = this.entity.getCenter();
        if ((center.y <= 0 && this.direction === -1) || (center.y >= this.game.WORLD.HEIGHT && this.direction === 1))
            this.direction *= -1;
        this.entity.velocity.y = this.entity.verticalSpeed * this.direction;
        this.entity.velocity.x = -this.entity.speed;
        for (var i = 0; i < this.entity.weapons.length; i++)
            if (!this.entity.weapons[i].shooting)
                this.entity.weapons[i].startShooting();
    };
    return CartAI;
});
define('skytte.keys', function() {
    return {
        'PAUSE': 19,
        'ESC': 27,
        'SPACE': 32,
        'ARROW_LEFT': 37,
        'ARROW_UP': 38,
        'ARROW_RIGHT': 39,
        'ARROW_DOWN': 40,
        'CHAR_1': 49,
        'CHAR_2': 50,
        'CHAR_3': 51,
        'CHAR_4': 52,
        'CHAR_5': 53,
        'CHAR_6': 54,
        'CHAR_P': 80
    };
});
define('skytte.level', ['skytte.utils'], function(utils) {
    function Level(game, kwargs) {
        this.game = game;
        this.events = utils.merge([], kwargs.events);
        this.recurring = [];
        this.time = 0;
        this.processTime = 0;
        this.PROCESS_EVERY = 50;
        this.duration = 0;
        this._signals = [];
        var i = this.events.length,
            event;
        while (--i >= 0) {
            event = this.events[i];
            if (event.at)
                this.duration = Math.max(event.at, this.duration);
            if (event.signal) {
                this.game[event.signal].connect(event.receiver);
                this._signals.push([event.signal, event.receiver]);
                this.events.splice(i, 1);
            }
        }
        this._processEventQueue();
    }
    Level.prototype.eventScenery = function(event) {
        this.game.makeScenery(event.config);
    };
    Level.prototype.eventHUD = function(event) {
        this.game.makeHUD();
    };
    Level.prototype.eventPlayerWeapons = function(event) {
        var args = [event.config].concat(event.args || []);
        this.game.makePlayerWeapons.apply(this.game, args);
    };
    Level.prototype.eventPlayerShip = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makePlayerShip.apply(this.game, args);
    };
    Level.prototype.eventChangeWeapon = function(event) {
        this.game.changeWeapon.apply(this.game, [event.weapon]);
    };
    Level.prototype.eventPowerUp = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makePowerUp.apply(this.game, args);
    };
    Level.prototype.eventHint = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeHint.apply(this.game, args);
    };
    Level.prototype.eventMine = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeMine.apply(this.game, args);
    };
    Level.prototype.eventAggressiveMine = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeAggressiveMine.apply(this.game, args);
    };
    Level.prototype.eventSwarm = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeSwarm.apply(this.game, args);
    };
    Level.prototype.eventSwarmUnit = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeSwarmUnit.apply(this.game, args);
    };
    Level.prototype.eventFighter = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeFighter.apply(this.game, args);
    };
    Level.prototype.eventTeleporter = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeTeleporter.apply(this.game, args);
    };
    Level.prototype.eventElectrician = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeElectrician.apply(this.game, args);
    };
    Level.prototype.eventTank = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeTank.apply(this.game, args);
    };
    Level.prototype.eventFrigate = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeFrigate.apply(this.game, args);
    };
    Level.prototype.eventLaserTurretUp = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeLaserTurretUp.apply(this.game, args);
    };
    Level.prototype.eventLaserTurretDown = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeLaserTurretDown.apply(this.game, args);
    };
    Level.prototype.eventFlakTurretUp = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeFlakTurretUp.apply(this.game, args);
    };
    Level.prototype.eventFlakTurretDown = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeFlakTurretDown.apply(this.game, args);
    };
    Level.prototype.eventCartTurret = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeCartTurret.apply(this.game, args);
    };
    Level.prototype.processEvent = function(event) {
        event = utils.merge({}, event);
        if (typeof event.x === 'undefined')
            event.x = this.game.WORLD.WIDTH;
        if (typeof event.y === 'undefined')
            event.y = this.game.WORLD.HEIGHT * Math.random();
        if (typeof event.type === 'string') {
            var method = 'event' + event.type;
            this[method](event);
        } else
            event.type.apply(event, [this.game, this]);
    };
    Level.prototype._processEventQueue = function() {
        var i = 0;
        while (i < this.events.length) {
            var event = this.events[i];
            if (this.time >= (event.at || 0)) {
                this.processEvent(event);
                this.events.splice(i, 1);
                if (typeof event.every !== 'undefined') {
                    event.time = 0;
                    this.recurring.push(event);
                }
            } else
                i += 1;
        }
    };
    Level.prototype.logic = function(timeDelta) {
        this.time += timeDelta * 1000;
        this.processTime += timeDelta * 1000;
        if (this.processTime >= this.PROCESS_EVERY && this.events.length) {
            for (var i = 0; i < this.recurring.length; i++) {
                var event = this.recurring[i];
                event.time += timeDelta * 1000;
                if (event.time >= event.every) {
                    this.processEvent(event);
                    event.time -= event.every;
                }
            }
            this._processEventQueue();
            this.processTime -= this.PROCESS_EVERY;
        }
    };
    Level.prototype.hasEnded = function() {
        for (var i = 0; i < this.events.length; i++)
            if (this.events[i].at)
                return false;
        return true;
    };
    Level.prototype.end = function() {
        for (var i = 0; i < this._signals.length; i++)
            this.game[this._signals[i][0]].disconnect(this._signals[i][1]);
        this._signals = [];
    };
    return Level;
});
define('skytte.game', function() {
    var settings = require('settings');
    var Signal = require('skytte.signal');
    var numbers = require('skytte.numbers');
    var collision = require('skytte.collision');
    var FogEntity = require('skytte.entities.fog');
    var ShipEntity = require('skytte.entities.ship');
    var LabelEntity = require('skytte.entities.label');
    var Explosion = require('skytte.particles.explosion');
    var KEYS = require('skytte.keys');
    var BackgroundEntity = require('skytte.entities.background');
    var SpriteEntity = require('skytte.entities.sprite');
    var MushroomEmitter = require('skytte.particles.mushroom');
    var hud = require('skytte.entities.hud');
    var PowerUpEntity = require('skytte.entities.power_up');
    var TurretEntity = require('skytte.entities.turret');
    var CartEntity = require('skytte.entities.cart');
    var MineEntity = require('skytte.entities.mine');
    var SwarmEntity = require('skytte.entities.swarm');
    var TeleporterEntity = require('skytte.entities.teleporter');
    var MoveLeftAI = require('skytte.ai.move_left');
    var KamikazeAI = require('skytte.ai.kamikaze');
    var TeleporterAI = require('skytte.ai.teleporter');
    var FollowAI = require('skytte.ai.follow');
    var WaveAI = require('skytte.ai.wave');
    var CartAI = require('skytte.ai.cart');
    var Level = require('skytte.level');

    function Game(canvas, scale, debug, data) {
        this.COMBO_DELAY = 2500;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.debug = debug;
        this.data = data;
        this.toLoad = this.loaded = 0;
        this.paused = true;
        this.autofire = true;
        this._enemyCount = 0;
        this.fps = this._frame = this._fpsTime = 0;
        this._currentTimestamp = this._prevTimestamp = 0;
        this.NEUTRAL_TEAM = 0;
        this.PLAYER_TEAM = 1;
        this.ENEMY_TEAM = 2;
        this.WORLD = {
            'WIDTH': this.canvas.width,
            'HEIGHT': this.canvas.height - 60,
            'FULL_HEIGHT': this.canvas.height,
            'SCALE': 1
        };
        this.SCREEN = {
            'WIDTH': this.canvas.width,
            'HEIGHT': this.canvas.height,
            'SCALE': scale
        };
        this.keys = {};
        this._clearKeyBuffer();
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.beforeDraw = this.afterDraw = null;
        this.beforeLogic = this.afterLogic = null;
        this._tickProxy = this._tick.bind(this);
        this._touchscreen = 'createTouch' in document;
        this.gamePaused = new Signal();
        this.gameResumed = new Signal();
        this.playerDied = new Signal();
        this.levelEnded = new Signal();
        this.resourceLoaded = new Signal();
        this.allResourcesLoaded = new Signal();
        this.newGame();
    }
    Game.prototype.getCurrentWeapon = function() {
        if (this.currentWeapon >= 0)
            return this.weapons[this.currentWeapon];
        return null;
    };
    Game.prototype._onResourceLoad = function() {
        this.loaded++;
        this.resourceLoaded.send(this);
        if (this.loaded === this.toLoad)
            this.allResourcesLoaded.send(this);
    };
    Game.prototype.load = function() {
        var resource;
        if (this.toLoad > 0 && this.loaded === this.toLoad) {
            this.allResourcesLoaded.send(this);
            return;
        }
        for (var name in this.data)
            if (this.data.hasOwnProperty(name)) {
                resource = this.data[name];
                if (!resource.hasLoaded) {
                    resource.loaded.connect(this._onResourceLoad.bind(this));
                    resource.load();
                    this.toLoad += 1;
                }
            }
        if (this.toLoad === 0)
            this.allResourcesLoaded.send(this);
    };
    Game.prototype.getResource = function(resource) {
        var parts = resource.split(' ');
        var name = parts[0];
        if (!(name in this.data))
            throw new Error('invalid resource name: "' + String(resource) + '"');
        if (parts.length === 1)
            return this.data[name];
        else if (parts.length === 2) {
            var pos = parts[1].split(',');
            var x = parseInt(pos[0], 10);
            var y = parseInt(pos[1], 10);
            return this.data[name].getSprite(x, y);
        } else
            throw new Error('invalid resource name: "' + String(resource) + '"');
    };
    Game.prototype.addBackground = function(entity) {
        this.backgrounds.push(entity);
    };
    Game.prototype.addForeground = function(entity) {
        this.foregrounds.push(entity);
    };
    Game.prototype.prependForeground = function(entity) {
        this.foregrounds.splice(0, 0, entity);
    };
    Game.prototype.prependEntity = function(entity, delay) {
        this._entitiesToAdd.push({
            'entity': entity,
            'delay': delay || 0,
            'where': 'prepend'
        });
    };
    Game.prototype.isEntityInGame = function(entity) {
        for (var i = 0; i < this.entities.length; i++)
            if (this.entities[i] === entity)
                return true;
        return false;
    };
    Game.prototype.addEntity = function(entity, delay) {
        this._entitiesToAdd.push({
            'entity': entity,
            'delay': delay || 0,
            'where': 'append'
        });
    };
    Game.prototype.addExplosion = function(x, y, radius, damage, team, delay) {
        this.shake = Math.min(6, this.shake + (radius + (damage || 0)) / 200);
        this.addEntity(new Explosion(this, x, y, {
            'radius': radius,
            'damage': damage,
            'team': team
        }), delay);
    };
    Game.prototype.addScoreLabel = function(killedEntity, score) {
        var center = killedEntity.getCenter();
        var label = new LabelEntity(this, center.x, center.y, {
            'font': 'fontSmall',
            'text': '+' + score,
            'life': 1000
        });
        this.foregrounds.splice(0, 0, label);
    }
    Game.prototype.addCombo = function(points) {
        points *= this.multiplier;
        this.combo += points;
        while (this.combo > Math.pow(this.multiplier, 2) * 250)
            this.multiplier += 1;
        this.comboTime = 0;
        return points;
    };
    Game.prototype.resetCombo = function() {
        this.score += this.combo;
        this.bestCombo = Math.max(this.combo, this.bestCombo);
        this.bestMultiplier = Math.max(this.multiplier, this.bestMultiplier);
        this.comboTime = this.combo = 0;
        this.multiplier = 1;
    };
    Game.prototype.makeScenery = function(scenery) {
        this.backgrounds = [];
        this.foregrounds = [];
        if (scenery.layer6)
            this.addBackground(new BackgroundEntity(this, scenery.layer6));
        if (scenery.layer5)
            this.addBackground(new BackgroundEntity(this, scenery.layer5));
        if (scenery.layer4)
            this.addBackground(new BackgroundEntity(this, scenery.layer4));
        if (scenery.layer3)
            this.addBackground(new BackgroundEntity(this, scenery.layer3));
        if (scenery.fog)
            for (var i = 0; i < 8; i++)
                this.addForeground(new FogEntity(this, scenery.fog));
        if (scenery.mushroom)
            for (var i = 0; i < (scenery.mushroom.count || 3); i++)
                this.addForeground(new MushroomEmitter(this, scenery.mushroom));
        if (scenery.layer2)
            this.addForeground(new BackgroundEntity(this, scenery.layer2));
        if (scenery.layer1)
            this.addForeground(new BackgroundEntity(this, scenery.layer1));
    };
    Game.prototype.makeHUD = function() {
        var x;
        var weaponsBackground = this.data.HUDWeaponsBackground;
        var weapon = new hud.Weapon(this, this.WORLD.WIDTH - 102 - 10 * this.SCREEN.SCALE, this.WORLD.HEIGHT - 103 + 50 * this.SCREEN.SCALE, {
            'background': 'HUDWeaponBackground',
            'level': 'HUDWeaponLevel',
            'icons': 'HUDWeapons'
        });
        this.addForeground(weapon);
        var iconsSpritesheet = this.data.HUDHealthIcons;
        var heartIcon = iconsSpritesheet.getSprite(0, 0);
        var shieldIcon = iconsSpritesheet.getSprite(1, 0);
        x = this.WORLD.WIDTH - 270 - 4;
        if (this._touchscreen)
            x -= 53 + 8;
        var health = new hud.HealthBar(this, x, 4, {
            'bars': 'HUDHealthBars',
            'background': 'HUDHealthBackground',
            'heartIcon': heartIcon,
            'shieldIcon': shieldIcon,
            'font': 'fontBig'
        });
        this.addForeground(health);
        var score = new hud.Score(this, 5, 5, {
            'font': 'fontBig',
            'icons': 'HUDScoreIcons'
        });
        this.addForeground(score);
        x = this.WORLD.WIDTH - 270 - 53 - 8 - 4;
        if (this._touchscreen)
            x -= 53 + 8;
        var powerUp = new hud.PowerUp(this, x, 5, {
            'background': 'HUDPowerUp',
            'icons': 'powerUps'
        });
        this.addForeground(powerUp);
        var levelProgress = new hud.LevelProgress(this, (this.WORLD.WIDTH - 480) / 2, this.WORLD.FULL_HEIGHT - 50, {
            'sprite': 'HUDLevelProgress'
        });
        this.addForeground(levelProgress);
        if (this._touchscreen)
            this.addForeground(new SpriteEntity(this, this.WORLD.WIDTH - 57, 4, {
                'sprite': 'HUDPause'
            }));
    };
    Game.prototype.makePlayerWeapons = function(config) {
        var plasma = require('skytte.weapons.plasma');
        var storm = require('skytte.weapons.storm');
        var laser = require('skytte.weapons.laser');
        var ray = require('skytte.weapons.ray');
        var rockets = require('skytte.weapons.rockets');
        var flak = require('skytte.weapons.flak');
        var electro = require('skytte.weapons.electro');
        var weapon, x = 31,
            y = 48;
        var weaponNames = ['PLASMA', 'STORM', 'RAY', 'ROCKETS', 'FLAK', 'ELECTRO'];
        var weaponConstructors = [plasma.PlasmaWeapon, storm.StormWeapon, ray.RayWeapon, rockets.RocketsWeapon, flak.FlakWeapon, electro.ElectroWeapon];
        this.allWeapons = [];
        for (var l = 1; l < 4; l++) {
            this.allWeapons.push([]);
            for (var n = 0; n < weaponNames.length; n++) {
                weapon = new(weaponConstructors[n])(this, this.player, x, y, config[weaponNames[n] + '_' + l]);
                this.allWeapons[l - 1].push(weapon);
            }
        }
        this.weapons = this.allWeapons[0];
        this.currentWeapon = -1;
        this.changeWeapon(0);
    };
    Game.prototype.makePlayerShip = function(x, y, config) {
        this.player = new ShipEntity(this, x, y, config);
        this.changeWeapon(this.currentWeapon);
        this.addEntity(this.player);
    };
    Game.prototype.makePowerUp = function(x, y, config) {
        this.addEntity(new PowerUpEntity(this, x - (config.box.x + config.box.width) / 2, y - (config.box.y + config.box.height) / 2, config));
    };
    Game.prototype.makeHint = function(x, y, config) {
        this.addBackground(new SpriteEntity(this, x, y, config));
    };
    Game.prototype.makeShip = function(ShipClass, shipArgs, AIClass, aiArgs) {
        var weapon;
        shipArgs.unshift(null, this);
        var ship = new(ShipClass.bind.apply(ShipClass, shipArgs));
        if (AIClass) {
            if (!aiArgs)
                aiArgs = [];
            aiArgs.unshift(null, this, ship);
            ship.ai = new(AIClass.bind.apply(AIClass, aiArgs));
        }
        return ship;
    };
    Game.prototype.makeMine = function(x, y, config) {
        this.addEntity(this.makeShip(MineEntity, [x, y, config], config.ai || MoveLeftAI));
    };
    Game.prototype.makeAggressiveMine = function(x, y, config) {
        this.addEntity(this.makeShip(MineEntity, [x, y, config], config.ai || KamikazeAI, [this.player]));
    };
    Game.prototype.makeSwarmUnit = function(x, y, config) {
        this.addEntity(this.makeShip(SwarmEntity, [x, y, config], config.ai));
    };
    Game.prototype.makeSwarm = function(x, y, config, width, height, count, rotateSpeed) {
        for (var i = 0; i < count; i++)
            this.addEntity(this.makeShip(SwarmEntity, [x, y, config], config.ai || WaveAI, [x, y, width, height, i / count, rotateSpeed]));
    };
    Game.prototype.makeFighter = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeTeleporter = function(x, y, config) {
        this.addEntity(this.makeShip(TeleporterEntity, [x, y, config], config.ai || TeleporterAI, config.aiArgs || [config.AI]));
    };
    Game.prototype.makeElectrician = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || FollowAI, config.aiArgs || [this.player]));
    };
    Game.prototype.makeTank = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeFrigate = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeLaserTurretUp = function(x, config) {
        var y = this.WORLD.HEIGHT - config.box.y - config.box.height + 40;
        this.addEntity(this.makeShip(TurretEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeLaserTurretDown = function(x, config) {
        this.addEntity(this.makeShip(TurretEntity, [x, 0, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeFlakTurretUp = function(x, config) {
        var y = this.WORLD.HEIGHT - config.box.y - config.box.height + 40;
        this.addEntity(this.makeShip(TurretEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeFlakTurretDown = function(x, config) {
        this.addEntity(this.makeShip(TurretEntity, [x, 0, config], config.ai || MoveLeftAI, config.aiArgs));
    };
    Game.prototype.makeCartTurret = function(x, y, config) {
        this.prependEntity(new SpriteEntity(this, x + 110, 0, {
            'sprite': 'cartTurretRail',
            'vx': -config.speed
        }));
        this.addEntity(this.makeShip(CartEntity, [x, y, config], config.ai || CartAI, config.aiArgs || [{
            'direction': -1
        }]));
    };
    Game.prototype.collectPowerUp = function(powerUp) {
        if (powerUp.duration) {
            if (this.activePowerUp)
                this.activePowerUp.expired();
            this.activePowerUp = powerUp;
            this.activePowerUpTime = 0;
        }
        powerUp.collect();
    };
    Game.prototype.expireActivePowerUp = function() {
        if (this.activePowerUp) {
            this.activePowerUp.expired();
            this.activePowerUp = null;
            this.activePowerUpTime = 0;
        }
    };
    Game.prototype.findClosest = function(x, y, entityClass, minDistance, conditionFunc) {
        var target, targetCenter, targetCenterY, closestTarget = null,
            closestDistance = Number.MAX_VALUE,
            distance;
        minDistance = minDistance || 0;
        for (var i = 0; i < this.entities.length; i++) {
            target = this.entities[i];
            if (!target.dead && target instanceof entityClass && (!conditionFunc || conditionFunc(target))) {
                targetCenter = target.getCenter();
                distance = Math.pow(targetCenter.x - x, 2) + Math.pow(targetCenter.y - y, 2);
                if (distance < closestDistance && distance > minDistance) {
                    closestDistance = distance;
                    closestTarget = target;
                }
            }
        }
        return {
            'target': closestTarget,
            'distance': Math.sqrt(closestDistance)
        };
    };
    Game.prototype.newGame = function() {
        if (this.level)
            this.level.end();
        this.player = null;
        this.backgrounds = [];
        this.foregrounds = [];
        this.entities = [];
        this.allWeapons = [];
        this.weapons = [];
        this.currentWeapon = -1;
        this.lifes = 3;
        this.score = 0;
        this.combo = this.bestCombo = 0;
        this.multiplier = this.bestMultiplier = 1;
        this.kills = 0;
        this.comboTime = 0;
        this.distance = 0;
        this.activePowerUp = null;
        this.activePowerUpTime = 0;
        this.shake = 0;
        this.level = null;
        this._entitiesToAdd = [];
    };
    Game.prototype.loadLevel = function(levelConfig) {
        if (this.level)
            this.level.end();
        this.score += this.combo;
        this.player = null;
        this.backgrounds = [];
        this.foregrounds = [];
        this.entities = [];
        this.combo = 0;
        this.multiplier = 1;
        this.comboTime = 0;
        this.activePowerUp = null;
        this.activePowerUpTime = 0;
        this.shake = 0;
        this.level = null;
        this._entitiesToAdd = [];
        this.level = new Level(this, levelConfig);
        if (!this._playerLowLifeSoundInstance)
            this._playerLowLifeSoundInstance = this.getResource('soundPlayerLowLife').getInstance();
        if (this.player && this.autofire)
            this.player.startShooting();
    };
    Game.prototype._clearKeyBuffer = function() {
        for (var name in KEYS)
            if (KEYS.hasOwnProperty(name))
                this.keys[KEYS[name]] = false;
    };
    Game.prototype.acquireInput = function() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    };
    Game.prototype.releaseInput = function() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        this._clearKeyBuffer();
    };
    Game.prototype.onKeyDown = function(event) {
        if (event.which in this.keys) {
            event.preventDefault();
            this.keys[event.which] = true;
        }
    };
    Game.prototype.onKeyUp = function(event) {
        if (event.which in this.keys)
            this.keys[event.which] = false;
    };
    Game.prototype.input = function() {
        if (!this.player)
            return;
        if (this.keys[KEYS.CHAR_P] || this.keys[KEYS.ESC] || this.keys[KEYS.PAUSE])
            this.pause();
        if (this.keys[KEYS.ARROW_UP])
            this.player.moveUp(.125);
        if (this.keys[KEYS.ARROW_DOWN])
            this.player.moveDown(.125);
        if (this.keys[KEYS.ARROW_LEFT])
            this.player.moveLeft(.125);
        if (this.keys[KEYS.ARROW_RIGHT])
            this.player.moveRight(.125);
        if (this.keys[KEYS.CHAR_1])
            this.changeWeapon(0);
        if (this.keys[KEYS.CHAR_2])
            this.changeWeapon(1);
        if (this.keys[KEYS.CHAR_3])
            this.changeWeapon(2);
        if (this.keys[KEYS.CHAR_4])
            this.changeWeapon(3);
        if (this.keys[KEYS.CHAR_5])
            this.changeWeapon(4);
        if (this.keys[KEYS.CHAR_6])
            this.changeWeapon(5);
    };
    Game.prototype.isPlayerShooting = function() {
        return this.player && this.player.hasWeapon() && this.player.weapons[0].shooting
    };
    Game.prototype.changeWeapon = function(index) {
        if (this.weapons[index] === this.player.weapons[0])
            return;
        var shooting = this.isPlayerShooting();
        if (shooting)
            this.player.stopShooting();
        if (this.currentWeapon !== -1)
            this.getResource('soundPlayerWeaponChange').play({
                'volume': settings('WEAPON_CHANGE_VOLUME', 1)
            });
        this.currentWeapon = index;
        var weapon = this.weapons[this.currentWeapon];
        this.player.weapons[0] = weapon;
        weapon.owner = this.player;
        if (shooting)
            this.player.startShooting();
    };
    Game.prototype.upgradeWeapon = function(index) {
        var weapon = this.weapons[index];
        if (weapon.level >= 3)
            return;
        var shooting = false;
        if (this.player.hasWeapon() && this.player.weapons[0] === weapon) {
            shooting = this.player.weapons[0].shooting;
            this.player.stopShooting();
        }
        this.weapons[index] = this.allWeapons[weapon.level][index];
        this.weapons[index].owner = this.player;
        if (this.player.weapons[0] === weapon) {
            this.player.weapons[0] = this.weapons[index];
            if (shooting)
                this.player.startShooting();
        }
    };
    Game.prototype.spawnQueuedEntities = function(timeDelta) {
        var i = this._entitiesToAdd.length,
            item;
        while (--i >= 0) {
            item = this._entitiesToAdd[i];
            item.delay -= timeDelta * 1000;
            if (item.delay <= 0) {
                if (item.where === 'prepend')
                    this.entities.splice(0, 0, item.entity);
                else
                    this.entities.push(item.entity);
                this._entitiesToAdd.splice(i, 1);
            }
        }
    };
    Game.prototype.checkCollisions = function() {
        var a, b, i, j, colliding, entityCount = this.entities.length;
        for (i = 0; i < entityCount - 1; i++) {
            a = this.entities[i];
            if (!a.dead)
                for (j = i + 1; j < entityCount; j++) {
                    b = this.entities[j];
                    if (!b.dead && (a.team !== b.team || ((a.collectible || b.collectible) && (a.team === b.team)))) {
                        colliding = false;
                        if (a.box && b.box && collision.testBoundingBoxes(a.position, a.box, b.position, b.box) && a.polygon && b.polygon)
                            colliding = collision.testPolygons(a.position, a.polygon, b.position, b.polygon);
                        if (colliding) {
                            a.collidesWith(b);
                            b.collidesWith(a);
                            if (a.dead)
                                break;
                        }
                    }
                }
        }
    };
    Game.prototype.logic = function(timeDelta) {
        var i, entity, points;
        if (this.beforeLogic)
            this.beforeLogic(this, timeDelta);
        if (this.level)
            this.level.logic(timeDelta);
        this.shake = Math.max(0, this.shake - 4 * timeDelta);
        if (this.activePowerUp) {
            this.activePowerUp.active(timeDelta);
            this.activePowerUpTime += timeDelta * 1000;
            if (this.activePowerUpTime >= this.activePowerUp.duration)
                this.expireActivePowerUp();
        }
        this.spawnQueuedEntities(timeDelta);
        this.checkCollisions();
        i = this.backgrounds.length;
        while (--i >= 0) {
            entity = this.backgrounds[i];
            if (!entity.dead)
                entity.logic(timeDelta);
            else
                this.backgrounds.splice(i, 1);
        }
        i = this.foregrounds.length;
        while (--i >= 0) {
            entity = this.foregrounds[i];
            if (!entity.dead)
                entity.logic(timeDelta);
            else
                this.foregrounds.splice(i, 1);
        }
        this._enemyCount = 0;
        i = this.entities.length;
        while (--i >= 0) {
            entity = this.entities[i];
            if (!entity.dead) {
                entity.logic(timeDelta);
                if (entity.team === this.ENEMY_TEAM || entity instanceof PowerUpEntity)
                    this._enemyCount += 1;
            } else {
                entity.onRemove();
                if (entity instanceof ShipEntity && entity.health <= 0 && entity.team !== this.PLAYER_TEAM) {
                    this.kills += 1;
                    if (entity.score)
                        this.addScoreLabel(entity, this.addCombo(entity.score));
                } else if (entity === this.player) {
                    this.playerDied.send(this);
                    this._playerLowLifeSoundInstance.stop();
                }
                this.entities.splice(i, 1);
            }
        }
        if (this.combo || this.multiplier > 1) {
            this.comboTime += timeDelta * 1000;
            if (this.comboTime >= this.COMBO_DELAY)
                this.resetCombo();
        }
        if (this.player && !this.player.dead && this.level) {
            this.distance += 80 * timeDelta;
            if (this.player.health / this.player.maxHealth <= .25) {
                if (this._playerLowLifeSoundInstance.playState !== createjs.Sound.PLAY_SUCCEEDED)
                    this._playerLowLifeSoundInstance.play({
                        'volume': settings('LOW_LIFE_VOLUME', 1),
                        'loop': -1
                    });
            } else
                this._playerLowLifeSoundInstance.stop();
        } else if (this._playerLowLifeSoundInstance)
            this._playerLowLifeSoundInstance.stop();
        if (this.level && this.level.hasEnded() && !this._enemyCount && this.player && !this.player.dead) {
            this.resetCombo();
            this.levelEnded.send(this);
        }
    };
    Game.prototype.draw = function() {
        if (this.beforeDraw)
            this.beforeDraw(this);
        var shakeX = (Math.random() - .5) * this.shake * 2 * this.SCREEN.SCALE;
        var shakeY = (Math.random() - .5) * this.shake * 2 * this.SCREEN.SCALE;
        for (i = 0; i < this.backgrounds.length; i++)
            this.backgrounds[i].draw(this.context, this.SCREEN.SCALE, shakeX * .75, shakeY * .75);
        for (var i = 0; i < this.entities.length; i++)
            this.entities[i].draw(this.context, this.SCREEN.SCALE, shakeX, shakeY);
        for (i = 0; i < this.foregrounds.length; i++)
            this.foregrounds[i].draw(this.context, this.SCREEN.SCALE, shakeX * -1.5, shakeY * -1.5);
        if (this.afterDraw)
            this.afterDraw(this);
    };
    Game.prototype._tick = function() {
        this._currentTimestamp = new Date();
        var milliseconds = this._currentTimestamp - this._prevTimestamp;
        this._prevTimestamp = this._currentTimestamp;
        var timeDelta = milliseconds / 1000 * settings('GAME_SPEED', 1);
        if (timeDelta < .2) {
            this.input();
            this.logic(timeDelta);
            this.draw(timeDelta);
        }
        this._frame += 1;
        this._fpsTime += milliseconds;
        if (this._fpsTime >= 1000) {
            this.fps = this._frame;
            this._fpsTime = this._frame = 0;
        }
        if (!this.paused)
            requestAnimationFrame(this._tickProxy);
    };
    Game.prototype.enableAutofire = function() {
        this.autofire = true;
        if (this.player && !this.isPlayerShooting())
            this.player.startShooting();
    };
    Game.prototype.disableAutofire = function() {
        this.autofire = false;
        if (this.player && this.isPlayerShooting())
            this.player.stopShooting();
    };
    Game.prototype.resume = function() {
        if (this.paused) {
            this.paused = false;
            this.acquireInput();
            this._currentTimestamp = this._prevTimestamp = new Date();
            this._tick();
            this.gameResumed.send(this);
        }
    };
    Game.prototype.pause = function() {
        this.paused = true;
        this.releaseInput();
        this.gamePaused.send(this);
    };
    Game.prototype.getPanForPosition = function(position, centerX) {
        if (typeof centerX === 'undefined')
            centerX = this.WORLD.WIDTH / 2;
        return numbers.clip(-1, (position.x - centerX) / this.WORLD.WIDTH * 2, 1);
    };
    return Game;
});
define('skytte.data.resources', function() {
    var jQuery = require('jquery');
    var Sprite = require('skytte.sprite');
    var spritesheet = require('skytte.spritesheet');
    var Spritesheet = spritesheet.Spritesheet;
    var SpriteList = require('skytte.sprite_list');
    var Sound = require('skytte.sound');
    var Font = require('skytte.font');
    var STATIC_URL = window.STATIC_URL || '';

    function sh(names) {
        var formats = ['wav', 'ogg', 'mp4'];
        var paths, variants = [];
        names = names.split(' ');
        for (var n = 0; n < names.length; n++) {
            paths = [];
            for (var f = 0; f < formats.length; f++)
                paths.push(STATIC_URL + 'sounds/' + names[n] + '.' + formats[f]);
            variants.push(paths.join('|'));
        }
        return variants.join(' ');
    }

    function ih(name) {
        return STATIC_URL + 'images/640/' + name + '.png';
    }
    return {
        'crustLayer2': new SpriteList(ih('background/crust/layer_2_segment_%i'), 5),
        'crustLayer3': new SpriteList(ih('background/crust/layer_3_segment_%i'), 5),
        'crustLayer4': new SpriteList(ih('background/crust/layer_4_segment_%i'), 5),
        'crustLayer5': new SpriteList(ih('background/crust/layer_5_segment_%i'), 4),
        'crustLayer6': new SpriteList(ih('background/crust/layer_6_segment_%i'), 5),
        'mantleLayer2': new SpriteList(ih('background/mantle/layer_2_segment_%i'), 5),
        'mantleLayer3': new SpriteList(ih('background/mantle/layer_3_segment_%i'), 5),
        'mantleLayer4': new SpriteList(ih('background/mantle/layer_4_segment_%i'), 5),
        'mantleLayer5': new SpriteList(ih('background/mantle/layer_5_segment_%i'), 4),
        'mantleLayer6': new SpriteList(ih('background/mantle/layer_6_segment_%i'), 5),
        'coreLayer2': new SpriteList(ih('background/core/layer_2_segment_%i'), 5),
        'coreLayer3': new SpriteList(ih('background/core/layer_3_segment_%i'), 5),
        'coreLayer4': new SpriteList(ih('background/core/layer_4_segment_%i'), 5),
        'coreLayer5': new SpriteList(ih('background/core/layer_5_segment_%i'), 3),
        'coreLayer6': new SpriteList(ih('background/core/layer_6_segment_%i'), 5),
        'layer1': new SpriteList(ih('background/layer_1_segment_%i'), 3),
        'mushrooms': new Spritesheet(ih('background/mushrooms'), 80, 180),
        'spores': new Spritesheet(ih('background/spores'), 17, 17),
        'fog': new Spritesheet(ih('background/fog'), 512, 256),
        'fire': new Spritesheet(ih('fire'), 32, 32),
        'playerWeapons': new Spritesheet(ih('weapons/player_weapons'), 80, 48),
        'enemyWeapons1': new Spritesheet(ih('weapons/enemy_weapons_1'), 96, 48),
        'enemyWeapons2': new Spritesheet(ih('weapons/enemy_weapons_2'), 96, 32),
        'enemyWeapons3': new Spritesheet(ih('weapons/enemy_weapons_3'), 64, 64),
        'enemyWeapons4': new Spritesheet(ih('weapons/enemy_weapons_4'), 32, 48),
        'enemyWeapons5': new Spritesheet(ih('weapons/enemy_weapons_5'), 48, 64),
        'turretCartPlasmaWeapon': new Spritesheet(ih('weapons/turret_plasma_left'), 128, 64),
        'rocket': new Sprite(ih('projectiles/rocket')),
        'plasma': new Spritesheet(ih('projectiles/plasma'), 64, 64),
        'laser': new Spritesheet(ih('projectiles/laser'), 48, 48),
        'flak': new Spritesheet(ih('projectiles/flak'), 14, 14),
        'electroHit': new Sprite(ih('projectiles/electro_hit')),
        'powerUps': new Spritesheet(ih('power_ups'), 48, 48),
        'mines': new Spritesheet(ih('enemies/mines'), 128, 128),
        'swarm': new Spritesheet(ih('enemies/swarm'), 96, 96),
        'fighter': new Spritesheet(ih('enemies/fighter'), 160, 128),
        'teleporter': new Spritesheet(ih('enemies/teleporter'), 128, 96),
        'electrician': new Spritesheet(ih('enemies/electrician'), 160, 128),
        'tank': new Spritesheet(ih('enemies/tank'), 160, 160),
        'frigate': new Spritesheet(ih('enemies/frigate'), 256, 192),
        'turrets': new Spritesheet(ih('enemies/turrets'), 160, 192),
        'cartTurret': new Spritesheet(ih('enemies/turret_3_left'), 192, 192),
        'cartTurretRail': new Sprite(ih('enemies/rail')),
        'player': new Spritesheet(ih('player'), 128, 128),
        'fontBig': new Font(ih('hud/font_big'), {
            'chars': '-x+0123456789 ',
            'colors': 4,
            'spacing': -3,
            'widths': {
                'x': 21,
                '+': 18,
                '0': 18,
                '1': 14,
                '2': 18,
                '3': 18,
                '4': 19,
                '5': 18,
                '6': 18,
                '7': 17,
                '8': 18,
                '9': 18,
                '-': 17,
                ' ': 8
            }
        }),
        'fontSmall': new Font(ih('hud/font_small'), {
            'chars': 'x+0123456789 ',
            'colors': 3,
            'spacing': -2,
            'widths': {
                'x': 14,
                '+': 12,
                '0': 12,
                '1': 10,
                '2': 12,
                '3': 12,
                '4': 12,
                '5': 12,
                '6': 12,
                '7': 11,
                '8': 12,
                '9': 12,
                ' ': 4
            }
        }),
        'HUDScoreIcons': new Spritesheet(ih('hud/score'), 53, 53),
        'HUDPowerUp': new Sprite(ih('hud/power_up')),
        'HUDWeapons': new Spritesheet(ih('hud/weapons'), 96, 96),
        'HUDWeaponBackground': new Sprite(ih('hud/weapon_background')),
        'HUDWeaponLevel': new Spritesheet(ih('hud/weapon_level'), 88, 16),
        'HUDHealthBars': new Spritesheet(ih('hud/health_bars'), 151, 10),
        'HUDHealthBackground': new Sprite(ih('hud/health_background')),
        'HUDHealthIcons': new Spritesheet(ih('hud/health_icons'), 53, 53),
        'HUDLevelProgress': new Sprite(ih('hud/level_progress')),
        'HUDPause': new Sprite(ih('hud/pause')),
        'hintMoving': new Sprite(ih('hint_moving')),
        'hintWeapons': new Sprite(ih('hint_weapons')),
        'hintTouchscreen': new Sprite(ih('hint_touchscreen')),
        'soundPowerUpCollect': new Sound(sh('Powerup_points'), 100),
        'soundPowerUpScoreMultiplier': new Sound(sh('Powerup_multiplier')),
        'soundPowerUpDamageMultiplier': new Sound(sh('Powerup_extra_firepower')),
        'soundPowerUpWeaponUpgrade': new Sound(sh('Powerup_weapon')),
        'soundPowerUpShieldUpgrade': new Sound(sh('Powerup_shield')),
        'soundPowerUpInvincibility': new Sound(sh('Powerup_immune')),
        'soundPowerUpRepair': new Sound(sh('Powerup_repair')),
        'soundPowerUpLife': new Sound(sh('Powerup_1up')),
        'soundPlayerWeaponChange': new Sound(sh('Weapon_change'), 200),
        'soundPlayerExplosion': new Sound(sh('Ship_destroyed_respawn')),
        'soundPlayerLowLife': new Sound(sh('Warning_life')),
        'soundPlayerInvincibility': new Sound(sh('Shield_on_loop')),
        'soundPlayerPlasma': new Sound(sh('Fire1')),
        'soundPlayerStorm': new Sound(sh('Fire_triple2')),
        'soundPlayerFlak': new Sound(sh('Fire_flac')),
        'soundPlayerRay': new Sound(sh('Fire_ray')),
        'soundPlayerRocket': new Sound(sh('Fire_rocket_launch')),
        'soundPlayerElectro': new Sound(sh('Fire_electric')),
        'soundEnemyPlasma': new Sound(sh('Enemy_plasma'), 75),
        'soundEnemyLaser': new Sound(sh('Enemy_laser'), 75),
        'soundEnemyFlak': new Sound(sh('Enemy_flac Enemy_flac_alt1 Enemy_flac_alt2'), 75),
        'soundEnemyElectro': new Sound(sh('Enemy_ray_electric')),
        'soundRocketFlying': new Sound(sh('rocket_fly')),
        'soundExplosionSmall': new Sound(sh('Explosion_small Explosion_small1 Explosion_small2 Explosion_small3'), 75),
        'soundExplosionMedium': new Sound(sh('Explosion_medium Explosion_medium1 Explosion_medium2'), 75),
        'soundExplosionBig': new Sound(sh('Explosion_big'), 75),
        'soundMineAlarm': new Sound(sh('mine_approach_loop')),
        'soundShipTeleport': new Sound(sh('Enemy_teleport'), 75),
    };
});
define('skytte.data.backgrounds', ['skytte.entities.background'], function(BackgroundEntity) {
    var RED_MUSHROOM = {
        'particle': {
            'sprite': 'spores 0,0'
        },
        'sprites': ['mushrooms 0,0', 'mushrooms 1,0', 'mushrooms 2,0', 'mushrooms 3,0'],
    };
    var GREEN_MUSHROOM = {
        'particle': {
            'sprite': 'spores 0,1'
        },
        'sprites': ['mushrooms 0,1', 'mushrooms 1,1', 'mushrooms 2,1', 'mushrooms 3,1'],
    };
    var WHITE_FOG = {
        'sprite': 'fog 0,0'
    };
    var RED_FOG = {
        'sprite': 'fog 0,1'
    };
    var CRUST = {
        'layer6': {
            'spriteList': 'crustLayer6',
            'speed': 20,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer5': {
            'spriteList': 'crustLayer5',
            'speed': 30,
            'align': BackgroundEntity.ALIGN_TOP,
            'chance': .75
        },
        'layer4': {
            'spriteList': 'crustLayer4',
            'speed': 40,
            'align': BackgroundEntity.ALIGN_BOTTOM
        },
        'layer3': {
            'spriteList': 'crustLayer3',
            'speed': 80,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer2': {
            'spriteList': 'crustLayer2',
            'speed': 160,
            'align': BackgroundEntity.ALIGN_BOTTOM
        },
        'layer1': {
            'spriteList': 'layer1',
            'speed': 320,
            'align': BackgroundEntity.ALIGN_BOTTOM,
            'chance': .2
        },
        'mushroom': RED_MUSHROOM,
        'fog': WHITE_FOG
    };
    var MANTLE = {
        'layer6': {
            'spriteList': 'mantleLayer6',
            'speed': 20,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer5': {
            'spriteList': 'mantleLayer5',
            'speed': 30,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer4': {
            'spriteList': 'mantleLayer4',
            'speed': 40,
            'align': BackgroundEntity.ALIGN_BOTTOM
        },
        'layer3': {
            'spriteList': 'mantleLayer3',
            'speed': 80,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer2': {
            'spriteList': 'mantleLayer2',
            'speed': 160,
            'align': BackgroundEntity.ALIGN_BOTTOM
        },
        'layer1': {
            'spriteList': 'layer1',
            'speed': 320,
            'align': BackgroundEntity.ALIGN_BOTTOM,
            'chance': .2
        },
        'mushroom': GREEN_MUSHROOM
    };
    var CORE = {
        'layer6': {
            'spriteList': 'coreLayer6',
            'speed': 20,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer5': {
            'spriteList': 'coreLayer5',
            'speed': 30,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer4': {
            'spriteList': 'coreLayer4',
            'speed': 40,
            'align': BackgroundEntity.ALIGN_BOTTOM
        },
        'layer3': {
            'spriteList': 'coreLayer3',
            'speed': 80,
            'align': BackgroundEntity.ALIGN_TOP
        },
        'layer2': {
            'spriteList': 'coreLayer2',
            'speed': 160,
            'align': BackgroundEntity.ALIGN_BOTTOM
        },
        'layer1': {
            'spriteList': 'layer1',
            'speed': 320,
            'align': BackgroundEntity.ALIGN_BOTTOM,
            'chance': .2
        },
        'fog': RED_FOG
    };
    return {
        'CRUST': CRUST,
        'MANTLE': MANTLE,
        'CORE': CORE,
        'RED_MUSHROOM': RED_MUSHROOM,
        'GREEN_MUSHROOM': GREEN_MUSHROOM,
        'WHITE_FOG': WHITE_FOG,
    };
});
define('skytte.data.weapons', function() {
    var settings = require('settings');
    var Polygon = require('skytte.polygon');
    var plasma = require('skytte.weapons.plasma');
    var laser = require('skytte.weapons.laser');
    var flak = require('skytte.weapons.flak');
    var electro = require('skytte.weapons.electro');
    var PLAYER_WEAPONS = {
        'PLASMA_1': {
            'barrelOffset': [63, 24],
            'level': 1,
            'rateOfFire': 1,
            'damage': 50,
            'fireSound': 'soundPlayerPlasma',
            'fireSoundVolume': settings('PLAYER_PLASMA_VOLUME', 1),
            'projectileSprite': 'plasma 0,0',
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'playerWeapons 2,0',
            'hitSprite': 'playerWeapons 2,1'
        },
        'PLASMA_2': {
            'barrelOffset': [63, 24],
            'level': 2,
            'rateOfFire': 1.5,
            'damage': 85,
            'fireSound': 'soundPlayerPlasma',
            'fireSoundVolume': settings('PLAYER_PLASMA_VOLUME', 1),
            'projectileSprite': 'plasma 1,0',
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'playerWeapons 2,0',
            'hitSprite': 'playerWeapons 2,1'
        },
        'PLASMA_3': {
            'barrelOffset': [63, 24],
            'level': 3,
            'rateOfFire': 2,
            'damage': 120,
            'fireSound': 'soundPlayerPlasma',
            'fireSoundVolume': settings('PLAYER_PLASMA_VOLUME', 1),
            'projectileSprite': 'plasma 2,0',
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'playerWeapons 2,0',
            'hitSprite': 'playerWeapons 2,1'
        },
        'STORM_1': {
            'barrelOffset': [69, 23],
            'level': 1,
            'rateOfFire': 3,
            'damage': 20,
            'projectileSpread': 80,
            'projectileCount': 3,
            'fireSound': 'soundPlayerStorm',
            'fireSoundVolume': settings('PLAYER_STORM_VOLUME', 1),
            'projectileSprite': 'laser 0,0',
            'sprite': 'playerWeapons 0,0',
            'hitSprite': 'playerWeapons 0,1'
        },
        'STORM_2': {
            'barrelOffset': [69, 23],
            'level': 2,
            'rateOfFire': 3,
            'damage': 20,
            'projectileSpread': 160,
            'projectileCount': 5,
            'fireSound': 'soundPlayerStorm',
            'fireSoundVolume': settings('PLAYER_STORM_VOLUME', 1),
            'projectileSprite': 'laser 1,0',
            'sprite': 'playerWeapons 0,0',
            'hitSprite': 'playerWeapons 0,1'
        },
        'STORM_3': {
            'barrelOffset': [69, 23],
            'level': 3,
            'rateOfFire': 3,
            'damage': 20,
            'projectileSpread': 240,
            'projectileCount': 7,
            'fireSound': 'soundPlayerStorm',
            'fireSoundVolume': settings('PLAYER_STORM_VOLUME', 1),
            'projectileSprite': 'laser 2,0',
            'sprite': 'playerWeapons 0,0',
            'hitSprite': 'playerWeapons 0,1'
        },
        'RAY_1': {
            'barrelOffset': [65, 24],
            'level': 1,
            'damage': 100,
            'fireSound': 'soundPlayerRay',
            'fireSoundVolume': settings('PLAYER_RAY_VOLUME', 1),
            'beamColor': 'rgba(138, 255, 62, .2)',
            'sprite': 'playerWeapons 3,0',
            'hitSprite': 'playerWeapons 3,1'
        },
        'RAY_2': {
            'barrelOffset': [65, 24],
            'level': 2,
            'damage': 150,
            'fireSound': 'soundPlayerRay',
            'fireSoundVolume': settings('PLAYER_RAY_VOLUME', 1),
            'beamColor': 'rgba(233, 179, 73, .2)',
            'sprite': 'playerWeapons 3,0',
            'hitSprite': 'playerWeapons 3,1'
        },
        'RAY_3': {
            'barrelOffset': [65, 24],
            'level': 3,
            'damage': 200,
            'fireSound': 'soundPlayerRay',
            'fireSoundVolume': settings('PLAYER_RAY_VOLUME', 1),
            'beamColor': 'rgba(206, 43, 44, .2)',
            'sprite': 'playerWeapons 3,0',
            'hitSprite': 'playerWeapons 3,1'
        },
        'ROCKETS_1': {
            'barrelOffset': [62, 24],
            'level': 1,
            'rateOfFire': .75,
            'damage': 80,
            'fireSound': 'soundPlayerRocket',
            'fireSoundVolume': settings('PLAYER_ROCKETS_VOLUME', 1),
            'rocketFlyingSound': 'soundRocketFlying',
            'rocketExplodeSound': 'soundExplosionMedium',
            'projectileSprite': 'rocket',
            'sprite': 'playerWeapons 4,0',
            'hitSprite': 'playerWeapons 4,1'
        },
        'ROCKETS_2': {
            'barrelOffset': [62, 24],
            'level': 2,
            'rateOfFire': 1,
            'damage': 80,
            'fireSound': 'soundPlayerRocket',
            'fireSoundVolume': settings('PLAYER_ROCKETS_VOLUME', 1),
            'rocketFlyingSound': 'soundRocketFlying',
            'rocketExplodeSound': 'soundExplosionMedium',
            'projectileSprite': 'rocket',
            'sprite': 'playerWeapons 4,0',
            'hitSprite': 'playerWeapons 4,1'
        },
        'ROCKETS_3': {
            'barrelOffset': [62, 24],
            'level': 3,
            'rateOfFire': 1.25,
            'damage': 80,
            'fireSound': 'soundPlayerRocket',
            'fireSoundVolume': settings('PLAYER_ROCKETS_VOLUME', 1),
            'rocketFlyingSound': 'soundRocketFlying',
            'rocketExplodeSound': 'soundExplosionMedium',
            'projectileSprite': 'rocket',
            'sprite': 'playerWeapons 4,0',
            'hitSprite': 'playerWeapons 4,1'
        },
        'FLAK_1': {
            'barrelOffset': [68, 24],
            'level': 1,
            'rateOfFire': 1,
            'damage': 30,
            'fireSound': 'soundPlayerFlak',
            'fireSoundVolume': settings('PLAYER_FLAK_VOLUME', 1),
            'projectileSprite': 'flak 0,0',
            'sprite': 'playerWeapons 1,0',
            'hitSprite': 'playerWeapons 1,1'
        },
        'FLAK_2': {
            'barrelOffset': [68, 24],
            'level': 2,
            'rateOfFire': 1.25,
            'damage': 40,
            'fireSound': 'soundPlayerFlak',
            'fireSoundVolume': settings('PLAYER_FLAK_VOLUME', 1),
            'projectileSprite': 'flak 1,0',
            'sprite': 'playerWeapons 1,0',
            'hitSprite': 'playerWeapons 1,1'
        },
        'FLAK_3': {
            'barrelOffset': [68, 24],
            'level': 3,
            'rateOfFire': 1.5,
            'damage': 50,
            'fireSound': 'soundPlayerFlak',
            'fireSoundVolume': settings('PLAYER_FLAK_VOLUME', 1),
            'projectileSprite': 'flak 2,0',
            'sprite': 'playerWeapons 1,0',
            'hitSprite': 'playerWeapons 1,1'
        },
        'ELECTRO_1': {
            'barrelOffset': [67, 24],
            'level': 1,
            'rayCount': 1,
            'radius': 240,
            'damage': 100,
            'fireSound': 'soundPlayerElectro',
            'fireSoundVolume': settings('PLAYER_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(138, 255, 62, .2)',
            'projectileHitSprite': 'electroHit',
            'sprite': 'playerWeapons 5,0',
            'hitSprite': 'playerWeapons 5,1'
        },
        'ELECTRO_2': {
            'barrelOffset': [67, 24],
            'level': 2,
            'rayCount': 2,
            'radius': 280,
            'damage': 120,
            'fireSound': 'soundPlayerElectro',
            'fireSoundVolume': settings('PLAYER_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(233, 179, 73, .2)',
            'projectileHitSprite': 'electroHit',
            'sprite': 'playerWeapons 5,0',
            'hitSprite': 'playerWeapons 5,1'
        },
        'ELECTRO_3': {
            'barrelOffset': [67, 24],
            'level': 3,
            'rayCount': 3,
            'radius': 320,
            'damage': 140,
            'fireSound': 'soundPlayerElectro',
            'fireSoundVolume': settings('PLAYER_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(206, 43, 44, .2)',
            'projectileHitSprite': 'electroHit',
            'sprite': 'playerWeapons 5,0',
            'hitSprite': 'playerWeapons 5,1'
        }
    };
    var ENEMY_WEAPONS = {
        'LASER1': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [5, 15],
            'rateOfFire': 1,
            'damage': 50,
            'direction': 180,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-15,-5 15,-5 15,5 -15,5'),
            'projectileSpeed': 300,
            'sprite': 'enemyWeapons2 0,0',
            'hitSprite': 'enemyWeapons2 0,1',
            'projectileSprite': 'laser 2,0'
        },
        'LASER2': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [6, 15],
            'rateOfFire': 1,
            'damage': 50,
            'direction': 180,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-15,-5 15,-5 15,5 -15,5'),
            'projectileSpeed': 300,
            'sprite': 'enemyWeapons2 1,0',
            'hitSprite': 'enemyWeapons2 1,1',
            'projectileSprite': 'laser 2,0'
        },
        'ELECTRO': {
            'cls': electro.ElectroWeapon,
            'barrelOffset': [23, 20],
            'rayCount': 1,
            'damage': 40,
            'radius': 250,
            'fireSound': 'soundEnemyElectro',
            'fireSoundVolume': settings('ENEMY_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(206, 43, 44, .2)',
            'sprite': 'enemyWeapons1 0,0',
            'hitSprite': 'enemyWeapons1 0,1',
            'projectileHitSprite': 'electroHit'
        },
        'PLASMA1': {
            'cls': plasma.PlasmaWeapon,
            'barrelOffset': [7, 21],
            'rateOfFire': .75,
            'damage': 25,
            'direction': 180,
            'fireSound': 'soundEnemyPlasma',
            'fireSoundVolume': settings('ENEMY_PLASMA_VOLUME', 1),
            'sprite': 'enemyWeapons1 2,0',
            'hitSprite': 'enemyWeapons1 2,1',
            'projectileExplodeSound': 'soundExplosionSmall',
            'projectileSprite': 'plasma 2,0'
        },
        'PLASMA2': {
            'cls': plasma.PlasmaWeapon,
            'barrelOffset': [6, 24],
            'rateOfFire': .25,
            'damage': 50,
            'direction': 180,
            'fireSound': 'soundEnemyPlasma',
            'fireSoundVolume': settings('ENEMY_PLASMA_VOLUME', 1),
            'sprite': 'enemyWeapons1 3,0',
            'hitSprite': 'enemyWeapons1 3,1',
            'projectileExplodeSound': 'soundExplosionSmall',
            'projectileSprite': 'plasma 2,0'
        },
        'FLAK': {
            'cls': flak.FlakWeapon,
            'barrelOffset': [0, 18],
            'rateOfFire': .75,
            'damage': 8,
            'direction': 180,
            'projectileSpeedX': -80,
            'fireSound': 'soundEnemyFlak',
            'fireSoundVolume': settings('ENEMY_FLAK_VOLUME', 1),
            'sprite': 'enemyWeapons1 1,0',
            'hitSprite': 'enemyWeapons1 1,1',
            'projectileSprite': 'flak 2,0)'
        },
        'TURRET_LASER_UP': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [16, 0],
            'rateOfFire': 1,
            'damage': 20,
            'direction': 270,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-5,-15 5,-15 5,15 -5,15'),
            'projectileSpeedX': -80,
            'projectileSpeedY': -300,
            'sprite': 'enemyWeapons4 1,0',
            'hitSprite': 'enemyWeapons4 1,1',
            'projectileSprite': 'laser 5,0'
        },
        'TURRET_LASER_DOWN': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [16, 48],
            'rateOfFire': 1,
            'damage': 20,
            'direction': 90,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-5,-15 5,-15 5,15 -5,15'),
            'projectileSpeedX': -80,
            'projectileSpeedY': 300,
            'sprite': 'enemyWeapons4 0,0',
            'hitSprite': 'enemyWeapons4 0,1',
            'projectileSprite': 'laser 5,0'
        },
        'TURRET_FLAK_UP': {
            'cls': flak.FlakWeapon,
            'barrelOffset': [32, 0],
            'rateOfFire': 1,
            'damage': 8,
            'direction': 270,
            'projectileSpeedX': -80,
            'fireSound': 'soundEnemyFlak',
            'fireSoundVolume': settings('ENEMY_FLAK_VOLUME', 1),
            'sprite': 'enemyWeapons3 1,0',
            'hitSprite': 'enemyWeapons3 1,1',
            'projectileSprite': 'flak 2,0'
        },
        'TURRET_FLAK_DOWN': {
            'cls': flak.FlakWeapon,
            'barrelOffset': [32, 64],
            'rateOfFire': 1,
            'damage': 8,
            'direction': 90,
            'projectileSpeedX': -80,
            'fireSound': 'soundEnemyFlak',
            'fireSoundVolume': settings('ENEMY_FLAK_VOLUME', 1),
            'sprite': 'enemyWeapons3 0,0',
            'hitSprite': 'enemyWeapons3 0,1',
            'projectileSprite': 'flak 2,0'
        },
        'TURRET_PLASMA': {
            'cls': plasma.PlasmaWeapon,
            'barrelOffset': [10, 32],
            'rateOfFire': .75,
            'damage': 75,
            'direction': 180,
            'fireSound': 'soundEnemyPlasma',
            'fireSoundVolume': settings('ENEMY_PLASMA_VOLUME', 1),
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'turretCartPlasmaWeapon 0,0',
            'hitSprite': 'turretCartPlasmaWeapon 0,1',
            'projectileSprite': 'plasma 2,0'
        }
    };
    return {
        'PLAYER_WEAPONS': PLAYER_WEAPONS,
        'ENEMY_WEAPONS': ENEMY_WEAPONS
    };
});
define('skytte.data.powerups', ['settings', 'skytte.bounding_box', 'skytte.entities.ship'], function(settings, BoundingBox, ShipEntity) {
    function multiplyWeaponsDamage(game, multiplier) {
        var weapon;
        for (var l = 0; l < game.allWeapons.length; l++)
            for (var i = 0; i < game.allWeapons[l].length; i++) {
                weapon = game.allWeapons[l][i];
                if (typeof weapon._originalDamage === 'undefined')
                    weapon._originalDamage = weapon.damage;
                weapon.damage *= multiplier;
            }
    }

    function restoreWeaponsDamage(game) {
        var weapon;
        for (var l = 0; l < game.allWeapons.length; l++)
            for (var i = 0; i < game.allWeapons[l].length; i++) {
                weapon = game.allWeapons[l][i];
                if (typeof weapon._originalDamage !== 'undefined') {
                    weapon.damage = weapon._originalDamage;
                    delete weapon._originalDamage;
                }
            }
    }
    var PLAYER_TEAM = 1;
    var ENEMY_TEAM = 2;
    var POWERUP_BOX = BoundingBox.fromString('12,12 24,24');
    var POWERUP_MASS = 40;
    var POWERUP_SCORE_1 = {
        'sprite': 'powerUps 8,0',
        'sound': 'soundPowerUpCollect',
        'soundVolume': settings('POWERUP_SCORE_VOLUME', 1),
        'score': 50,
        'vx': -80,
        'box': POWERUP_BOX,
        'mass': POWERUP_MASS,
        'team': PLAYER_TEAM
    };
    var POWERUP_SCORE_2 = {
        'sprite': 'powerUps 9,0',
        'sound': 'soundPowerUpCollect',
        'soundVolume': settings('POWERUP_SCORE_VOLUME', 1),
        'score': 150,
        'vx': -80,
        'box': POWERUP_BOX,
        'mass': POWERUP_MASS,
        'team': PLAYER_TEAM
    };
    var POWERUP_SCORE_3 = {
        'sprite': 'powerUps 10,0',
        'sound': 'soundPowerUpCollect',
        'soundVolume': settings('POWERUP_SCORE_VOLUME', 1),
        'score': 500,
        'vx': -80,
        'box': POWERUP_BOX,
        'mass': POWERUP_MASS,
        'team': PLAYER_TEAM
    };
    var POWERUP_REPAIR = {
        'sound': 'soundPowerUpRepair',
        'soundVolume': settings('POWERUP_REPAIR_VOLUME', 1),
        'sprite': 'powerUps 11,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game, powerUp) {
            game.player.health = game.player.maxHealth;
            game.player.shield = game.player.maxShield;
        }
    };
    var POWERUP_SCORE_MULTIPLIER_X2 = {
        'sound': 'soundPowerUpScoreMultiplier',
        'soundVolume': settings('POWERUP_SCORE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 12,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.multiplier += 2;
        },
        'activeFunc': function(game, timeDelta) {
            game.comboTime = 0;
        }
    };
    var POWERUP_SCORE_MULTIPLIER_X3 = {
        'sound': 'soundPowerUpScoreMultiplier',
        'soundVolume': settings('POWERUP_SCORE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 13,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.multiplier += 3;
        },
        'activeFunc': function(game, timeDelta) {
            game.comboTime = 0;
        }
    };
    var POWERUP_SCORE_MULTIPLIER_X4 = {
        'sound': 'soundPowerUpScoreMultiplier',
        'soundVolume': settings('POWERUP_SCORE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 14,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.multiplier += 4;
        },
        'activeFunc': function(game, timeDelta) {
            game.comboTime = 0;
        }
    };
    var POWERUP_DAMAGE_MULTIPLIER_X2 = {
        'sound': 'soundPowerUpDamageMultiplier',
        'soundVolume': settings('POWERUP_DAMAGE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 15,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            multiplyWeaponsDamage(game, 2);
        },
        'expiredFunc': restoreWeaponsDamage
    };
    var POWERUP_DAMAGE_MULTIPLIER_X3 = {
        'sound': 'soundPowerUpDamageMultiplier',
        'soundVolume': settings('POWERUP_DAMAGE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 16,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            multiplyWeaponsDamage(game, 3);
        },
        'expiredFunc': restoreWeaponsDamage
    };
    var POWERUP_DAMAGE_MULTIPLIER_X4 = {
        'sound': 'soundPowerUpDamageMultiplier',
        'soundVolume': settings('POWERUP_DAMAGE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 17,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            multiplyWeaponsDamage(game, 4);
        },
        'expiredFunc': restoreWeaponsDamage
    };
    var POWERUP_LIFE = {
        'sound': 'soundPowerUpLife',
        'soundVolume': settings('POWERUP_LIFE_VOLUME', 1),
        'sprite': 'powerUps 1,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.lifes += 1;
        }
    };
    var POWERUP_INVINCIBILITY = {
        'sound': 'soundPowerUpInvincibility',
        'soundVolume': settings('POWERUP_INVINCIBILITY_VOLUME', 1),
        'sprite': 'powerUps 4,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 25000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.player.invincibleTime += 20000;
        }
    };
    var POWERUP_KILL_ALL = {
        'sprite': 'powerUps 5,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            var entity;
            for (var i = 0; i < game.entities.length; i++) {
                entity = game.entities[i];
                if (entity instanceof ShipEntity && entity.team === game.ENEMY_TEAM) {
                    entity.health = 0;
                    entity.explode();
                }
            }
        }
    };
    var POWERUP_SHIELD_UPGRADE = {
        'sound': 'soundPowerUpShieldUpgrade',
        'soundVolume': settings('POWERUP_SHIELD_UPGRADE_VOLUME', 1),
        'sprite': 'powerUps 3,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            if (game.player.shieldLevel < 3) {
                game.player.shieldLevel++;
                game.player.shield = game.player.maxShield += 500;
            }
        }
    };
    var POWERUP_WEAPON_UPGRADE = {
        'sound': 'soundPowerUpWeaponUpgrade',
        'soundVolume': settings('POWERUP_WEAPON_UPGRADE_VOLUME', 1),
        'sprite': 'powerUps 2,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            if (game.getCurrentWeapon().level < 3)
                game.upgradeWeapon(game.currentWeapon);
            else {
                for (var i = 0; i < game.weapons.length; i++)
                    if (game.weapons[i].level < 3) {
                        game.upgradeWeapon(i);
                        return
                    }
                game.makePowerUp(this.position.x, this.position.y, POWERUP_SCORE_3);
                this.dead = true;
            }
        }
    };
    var POWERUP_RANDOM = {
        'sprite': 'powerUps 0,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'choices': [POWERUP_SCORE_3, POWERUP_SCORE_MULTIPLIER_X4, POWERUP_DAMAGE_MULTIPLIER_X4, POWERUP_LIFE, POWERUP_INVINCIBILITY, POWERUP_KILL_ALL, POWERUP_SHIELD_UPGRADE, POWERUP_WEAPON_UPGRADE],
        'collectFunc': function(game) {
            var powerUpConfig = this.choices[Math.floor(Math.random() * this.choices.length)];
            game.makePowerUp(this.position.x, this.position.y, powerUpConfig);
            this.dead = true;
        }
    };
    return {
        'POWERUP_SCORE_1': POWERUP_SCORE_1,
        'POWERUP_SCORE_2': POWERUP_SCORE_2,
        'POWERUP_SCORE_3': POWERUP_SCORE_3,
        'POWERUP_REPAIR': POWERUP_REPAIR,
        'POWERUP_SCORE_MULTIPLIER_X2': POWERUP_SCORE_MULTIPLIER_X2,
        'POWERUP_SCORE_MULTIPLIER_X3': POWERUP_SCORE_MULTIPLIER_X3,
        'POWERUP_SCORE_MULTIPLIER_X4': POWERUP_SCORE_MULTIPLIER_X4,
        'POWERUP_DAMAGE_MULTIPLIER_X2': POWERUP_DAMAGE_MULTIPLIER_X2,
        'POWERUP_DAMAGE_MULTIPLIER_X3': POWERUP_DAMAGE_MULTIPLIER_X3,
        'POWERUP_DAMAGE_MULTIPLIER_X4': POWERUP_DAMAGE_MULTIPLIER_X4,
        'POWERUP_LIFE': POWERUP_LIFE,
        'POWERUP_INVINCIBILITY': POWERUP_INVINCIBILITY,
        'POWERUP_KILL_ALL': POWERUP_KILL_ALL,
        'POWERUP_SHIELD_UPGRADE': POWERUP_SHIELD_UPGRADE,
        'POWERUP_WEAPON_UPGRADE': POWERUP_WEAPON_UPGRADE,
        'POWERUP_RANDOM': POWERUP_RANDOM
    };
});
define('skytte.data.ships', function() {
    var BoundingBox = require('skytte.bounding_box');
    var Polygon = require('skytte.polygon');
    var weapons = require('skytte.data.weapons');
    var powerups = require('skytte.data.powerups');
    var PLAYER_TEAM = 1;
    var ENEMY_TEAM = 2;
    var PLAYER_FIRE_WHITE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 180,
            'directionSpread': 5,
            'speed': 30,
            'life': 500,
            'sprite': 'fire 2,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * .5;
            }
        }
    };
    var PLAYER_FIRE_ORANGE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 180,
            'directionSpread': 10,
            'speed': 30,
            'life': 1000,
            'sprite': 'fire 1,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1.25;
            }
        }
    };
    var PLAYER_FIRE_RED = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 180,
            'directionSpread': 15,
            'speed': 30,
            'life': 1500,
            'sprite': 'fire 0,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 2.25;
            }
        }
    };
    var MEDIUM_ENEMY_FIRE_WHITE = {
        'spawnSpeed': 10,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 30,
            'life': 400,
            'sprite': 'fire 2,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * .75;
                this.velocity.y *= .7;
            }
        }
    };
    var MEDIUM_ENEMY_FIRE_ORANGE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 30,
            'life': 800,
            'sprite': 'fire 1,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1.5;
                this.velocity.y *= .8;
            }
        }
    };
    var MEDIUM_ENEMY_FIRE_RED = {
        'spawnSpeed': 20,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 35,
            'life': 1200,
            'sprite': 'fire 0,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 2;
                this.velocity.y *= .85;
            }
        }
    };
    var BIG_ENEMY_FIRE_WHITE = {
        'spawnSpeed': 10,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 40,
            'life': 500,
            'sprite': 'fire 2,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1;
                this.velocity.y *= .8;
            }
        }
    };
    var BIG_ENEMY_FIRE_ORANGE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 40,
            'life': 1000,
            'sprite': 'fire 1,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1.75;
                this.velocity.y *= .85;
            }
        }
    };
    var BIG_ENEMY_FIRE_RED = {
        'spawnSpeed': 20,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 45,
            'life': 1500,
            'sprite': 'fire 0,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 3;
                this.velocity.y *= .9;
            }
        }
    };
    var PLAYER_SHIP = {
        'shieldSprite': 'player 0,0',
        'sprite': 'player 0,1',
        'hitSprite': 'player 0,2',
        'invincibleShieldSprite': 'player 0,3',
        'team': PLAYER_TEAM,
        'speed': 300,
        'mass': 750,
        'health': 500,
        'shield': 250,
        'shieldPerSecond': 5,
        'healthPerSecond': 2,
        'explosionRadius': 250,
        'explosionDamage': 100,
        'explosionSound': 'soundPlayerExplosion',
        'polygon': Polygon.fromString('40,23 55,23 88,47 99,75 89,92 61,99 48,99 36,49'),
        'engines': [{
            'x': 32,
            'y': 50,
            'emitter': PLAYER_FIRE_RED
        }, {
            'x': 33,
            'y': 50,
            'emitter': PLAYER_FIRE_ORANGE
        }, {
            'x': 35,
            'y': 50,
            'emitter': PLAYER_FIRE_WHITE
        }, ]
    };
    var MINE = {
        'distanceSound': 'soundMineAlarm',
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'mines 0,0',
        'sprite': 'mines 0,1',
        'hitSprite': 'mines 0,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'mass': 75,
        'health': 100,
        'shield': 0,
        'score': 5,
        'explosionDamage': 5,
        'explosionRadius': 100,
        'detonateDamage': 50,
        'detonateRadius': 100,
        'box': BoundingBox.fromString('38,36 52,54'),
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_1],
        }
    };
    var AGGRESSIVE_MINE = {
        'distanceSound': 'soundMineAlarm',
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'mines 0,0',
        'sprite': 'mines 1,1',
        'hitSprite': 'mines 0,2',
        'team': ENEMY_TEAM,
        'speed': 140,
        'mass': 75,
        'health': 100,
        'shield': 50,
        'score': 10,
        'explosionDamage': 5,
        'explosionRadius': 100,
        'detonateDamage': 50,
        'detonateRadius': 100,
        'box': BoundingBox.fromString('38,36 52,54'),
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_2],
        }
    };
    var SWARM = {
        'explosionSound': 'soundExplosionSmall',
        'shieldSprite': 'swarm 0,0',
        'sprite': 'swarm 0,1',
        'hitSprite': 'swarm 0,2',
        'team': ENEMY_TEAM,
        'speed': 150,
        'mass': 50,
        'health': 15,
        'shield': 0,
        'score': 2,
        'explosionDamage': .25,
        'explosionRadius': 100,
        'box': BoundingBox.fromString('22,27 43,43'),
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_1],
        }
    };
    var FIGHTER = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'fighter 0,0',
        'sprite': 'fighter 0,1',
        'hitSprite': 'fighter 0,2',
        'team': ENEMY_TEAM,
        'speed': 140,
        'mass': 200,
        'health': 100,
        'shield': 25,
        'score': 75,
        'explosionDamage': 50,
        'explosionRadius': 100,
        'polygon': Polygon.fromString('69,30 122,23 126,85 107,88 35,88 30,70 49,45'),
        'engines': [{
            'x': 132,
            'y': 78,
            'emitter': MEDIUM_ENEMY_FIRE_RED
        }, {
            'x': 129,
            'y': 78,
            'emitter': MEDIUM_ENEMY_FIRE_ORANGE
        }, {
            'x': 127,
            'y': 78,
            'emitter': MEDIUM_ENEMY_FIRE_WHITE
        }],
        'weapons': [{
            'x': 51,
            'y': 19,
            'weapon': weapons.ENEMY_WEAPONS.LASER1
        }],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_1, powerups.POWERUP_SCORE_MULTIPLIER_X2],
        }
    };
    var TELEPORTER = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'teleporter 0,0',
        'sprite': 'teleporter 0,1',
        'hitSprite': 'teleporter 0,2',
        'team': ENEMY_TEAM,
        'speed': 140,
        'mass': 200,
        'health': 200,
        'shield': 50,
        'score': 100,
        'explosionDamage': 50,
        'explosionRadius': 100,
        'polygon': Polygon.fromString('80,26 92,27 100,52 102,70 93,80 56,81 18,74 25,46'),
        'engines': [{
            'x': 109,
            'y': 60,
            'emitter': MEDIUM_ENEMY_FIRE_RED
        }, {
            'x': 106,
            'y': 60,
            'emitter': MEDIUM_ENEMY_FIRE_ORANGE
        }, {
            'x': 104,
            'y': 60,
            'emitter': MEDIUM_ENEMY_FIRE_WHITE
        }],
        'weapons': [{
            'x': 13,
            'y': 57,
            'weapon': weapons.ENEMY_WEAPONS.LASER2
        }],
        'AI': {
            'delay': 2000,
            'teleportTime': 1000
        },
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X3],
        }
    };
    var ELECTRICIAN = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'electrician 0,0',
        'sprite': 'electrician 0,1',
        'hitSprite': 'electrician 0,2',
        'team': ENEMY_TEAM,
        'speed': 250,
        'mass': 200,
        'health': 500,
        'shield': 250,
        'score': 100,
        'explosionDamage': 50,
        'explosionRadius': 100,
        'polygon': Polygon.fromString('72,27 111,49 130,73 131,90 85,109 41,94 28,57 47,35'),
        'engines': [{
            'x': 138,
            'y': 83,
            'emitter': MEDIUM_ENEMY_FIRE_RED
        }, {
            'x': 135,
            'y': 83,
            'emitter': MEDIUM_ENEMY_FIRE_ORANGE
        }, {
            'x': 133,
            'y': 83,
            'emitter': MEDIUM_ENEMY_FIRE_WHITE
        }],
        'weapons': [{
            'x': 21,
            'y': 73,
            'weapon': weapons.ENEMY_WEAPONS.ELECTRO
        }],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X3],
        }
    };
    var TANK = {
        'explosionSound': 'soundExplosionBig',
        'shieldSprite': 'tank 0,0',
        'sprite': 'tank 0,1',
        'hitSprite': 'tank 0,2',
        'team': ENEMY_TEAM,
        'speed': 90,
        'mass': 400,
        'health': 1000,
        'shield': 350,
        'score': 200,
        'explosionDamage': 150,
        'explosionRadius': 150,
        'polygon': Polygon.fromString('71,23 121,37 133,48 133,67 124,129 37,137 16,124 20,76 27,46 45,29'),
        'engines': [{
            'x': 131,
            'y': 123,
            'emitter': MEDIUM_ENEMY_FIRE_RED
        }, {
            'x': 128,
            'y': 123,
            'emitter': MEDIUM_ENEMY_FIRE_ORANGE
        }, {
            'x': 126,
            'y': 123,
            'emitter': MEDIUM_ENEMY_FIRE_WHITE
        }],
        'weapons': [{
            'x': -4,
            'y': 91,
            'weapon': weapons.ENEMY_WEAPONS.PLASMA1
        }],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_3, powerups.POWERUP_SCORE_MULTIPLIER_X4, powerups.POWERUP_DAMAGE_MULTIPLIER_X3],
        }
    };
    var FRIGATE = {
        'explosionSound': 'soundExplosionBig',
        'shieldSprite': 'frigate 0,0',
        'sprite': 'frigate 0,1',
        'hitSprite': 'frigate 0,2',
        'team': ENEMY_TEAM,
        'speed': 90,
        'mass': 700,
        'health': 1500,
        'shield': 500,
        'score': 300,
        'explosionDamage': 200,
        'explosionRadius': 200,
        'polygon': Polygon.fromString('98,6 146,5 218,28 219,78 210,142 140,186 82,187 38,138 19,101 49,43'),
        'engines': [{
            'x': 221,
            'y': 128,
            'emitter': BIG_ENEMY_FIRE_RED
        }, {
            'x': 218,
            'y': 128,
            'emitter': BIG_ENEMY_FIRE_ORANGE
        }, {
            'x': 216,
            'y': 128,
            'emitter': BIG_ENEMY_FIRE_WHITE
        }],
        'weapons': [{
            'x': 67,
            'y': -10,
            'weapon': weapons.ENEMY_WEAPONS.PLASMA2
        }, {
            'x': 70,
            'y': 154,
            'weapon': weapons.ENEMY_WEAPONS.PLASMA2
        }, {
            'x': 9,
            'y': 87,
            'weapon': weapons.ENEMY_WEAPONS.FLAK
        }],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_MULTIPLIER_X4, powerups.POWERUP_DAMAGE_MULTIPLIER_X4, powerups.POWERUP_INVINCIBILITY],
        }
    };
    var LASER_TURRET_UP = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 3,0',
        'sprite': 'turrets 3,1',
        'hitSprite': 'turrets 3,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 500,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,50 42,140'),
        'weapons': [{
            'x': 63,
            'y': 54,
            'weapon': weapons.ENEMY_WEAPONS.TURRET_LASER_UP
        }],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X2, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var LASER_TURRET_DOWN = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 2,0',
        'sprite': 'turrets 2,1',
        'hitSprite': 'turrets 2,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 500,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,0 42,140'),
        'weapons': [{
            'x': 63,
            'y': 88,
            'weapon': weapons.ENEMY_WEAPONS.TURRET_LASER_DOWN
        }],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X2, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var FLAK_TURRET_UP = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 1,0',
        'sprite': 'turrets 1,1',
        'hitSprite': 'turrets 1,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 700,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,54 42,136'),
        'weapons': [{
            'x': 47,
            'y': 55,
            'weapon': weapons.ENEMY_WEAPONS.TURRET_FLAK_UP
        }],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_3, powerups.POWERUP_SCORE_MULTIPLIER_X3, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var FLAK_TURRET_DOWN = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 0,0',
        'sprite': 'turrets 0,1',
        'hitSprite': 'turrets 0,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 700,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,0 42,136'),
        'weapons': [{
            'x': 47,
            'y': 73,
            'weapon': weapons.ENEMY_WEAPONS.TURRET_FLAK_DOWN
        }],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_3, powerups.POWERUP_SCORE_MULTIPLIER_X3, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var CART_TURRET = {
        'explosionSound': 'soundExplosionBig',
        'shieldSprite': 'cartTurret 0,0',
        'sprite': 'cartTurret 0,1',
        'hitSprite': 'cartTurret 0,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'verticalSpeed': 100,
        'health': 1100,
        'shield': 0,
        'mass': 100000,
        'score': 100,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('32,70 124,60'),
        'weapons': [{
            'x': 24,
            'y': 67,
            'weapon': weapons.ENEMY_WEAPONS.TURRET_PLASMA
        }],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_MULTIPLIER_X4, powerups.POWERUP_DAMAGE_MULTIPLIER_X4],
        }
    };
    return {
        'PLAYER_SHIP': PLAYER_SHIP,
        'MINE': MINE,
        'AGGRESSIVE_MINE': AGGRESSIVE_MINE,
        'SWARM': SWARM,
        'FIGHTER': FIGHTER,
        'TELEPORTER': TELEPORTER,
        'ELECTRICIAN': ELECTRICIAN,
        'TANK': TANK,
        'FRIGATE': FRIGATE,
        'LASER_TURRET_UP': LASER_TURRET_UP,
        'LASER_TURRET_DOWN': LASER_TURRET_DOWN,
        'FLAK_TURRET_UP': FLAK_TURRET_UP,
        'FLAK_TURRET_DOWN': FLAK_TURRET_DOWN,
        'CART_TURRET': CART_TURRET,
    };
});
define('skytte.data.levels', function() {
    var utils = require('skytte.utils');
    var LabelEntity = require('skytte.entities.label');
    var backgrounds = require('skytte.data.backgrounds');
    var weapons = require('skytte.data.weapons');
    var powerups = require('skytte.data.powerups');
    var ships = require('skytte.data.ships');
    var HINT_MOVING = {
        'sprite': 'hintMoving',
        'vx': -80
    };
    var HINT_SHOOTING = {
        'sprite': 'hintShooting',
        'vx': -80
    };
    var HINT_TOUCHSCREEN = {
        'sprite': 'hintTouchscreen',
        'vx': -80
    };
    var HINT_WEAPONS = {
        'sprite': 'hintWeapons',
        'vx': -80
    };
    var LEVEL_1_CHOICES = [{
        'type': 'Swarm',
        'config': ships.SWARM,
        'args': [640, 80, 10, 170],
        'difficulty': 20
    }, {
        'type': 'Fighter',
        'config': ships.FIGHTER,
        'difficulty': 30
    }, ];
    var LEVEL_2_CHOICES = [{
        'type': 'Swarm',
        'config': ships.SWARM,
        'args': [640, 160, 10, 170],
        'difficulty': 15
    }, {
        'type': 'Fighter',
        'config': ships.FIGHTER,
        'difficulty': 30
    }, {
        'type': 'LaserTurretUp',
        'config': ships.LASER_TURRET_UP,
        'difficulty': 30
    }, {
        'type': 'LaserTurretDown',
        'config': ships.LASER_TURRET_DOWN,
        'difficulty': 30
    }, {
        'type': 'Teleporter',
        'config': ships.TELEPORTER,
        'difficulty': 45
    }];
    var LEVEL_3_CHOICES = [{
        'type': 'Swarm',
        'config': ships.SWARM,
        'args': [640, 320, 15, 170],
        'difficulty': 15
    }, {
        'type': 'Fighter',
        'config': ships.FIGHTER,
        'difficulty': 30
    }, {
        'type': 'Teleporter',
        'config': ships.TELEPORTER,
        'difficulty': 45
    }, {
        'type': 'Tank',
        'config': ships.TANK,
        'difficulty': 100
    }, {
        'type': 'LaserTurretUp',
        'config': ships.LASER_TURRET_UP,
        'difficulty': 30
    }, {
        'type': 'LaserTurretDown',
        'config': ships.LASER_TURRET_DOWN,
        'difficulty': 30
    }];
    var LEVEL_4_CHOICES = [{
        'type': 'Swarm',
        'config': ships.SWARM,
        'args': [640, 320, 15, 170],
        'difficulty': 15
    }, {
        'type': 'Fighter',
        'config': ships.FIGHTER,
        'difficulty': 30
    }, {
        'type': 'Teleporter',
        'config': ships.TELEPORTER,
        'difficulty': 45
    }, {
        'type': 'Electrician',
        'config': ships.ELECTRICIAN,
        'difficulty': 60
    }, {
        'type': 'Tank',
        'config': ships.TANK,
        'difficulty': 100
    }, {
        'type': 'LaserTurretUp',
        'config': ships.LASER_TURRET_UP,
        'difficulty': 30
    }, {
        'type': 'LaserTurretDown',
        'config': ships.LASER_TURRET_DOWN,
        'difficulty': 30
    }];
    var LEVEL_5_CHOICES = [{
        'type': 'Swarm',
        'y': 0,
        'config': ships.SWARM,
        'args': [640, 320, 15, 170],
        'difficulty': 10
    }, {
        'type': 'Fighter',
        'config': ships.FIGHTER,
        'difficulty': 10
    }, {
        'type': 'Teleporter',
        'config': ships.TELEPORTER,
        'difficulty': 15
    }, {
        'type': 'Electrician',
        'config': ships.ELECTRICIAN,
        'difficulty': 15
    }, {
        'type': 'Tank',
        'config': ships.TANK,
        'difficulty': 35
    }, {
        'type': 'Frigate',
        'config': ships.FRIGATE,
        'difficulty': 50
    }, {
        'type': 'LaserTurretUp',
        'config': ships.LASER_TURRET_UP,
        'difficulty': 15
    }, {
        'type': 'LaserTurretDown',
        'config': ships.LASER_TURRET_DOWN,
        'difficulty': 15
    }, {
        'type': 'FlakTurretUp',
        'config': ships.FLAK_TURRET_UP,
        'difficulty': 25
    }, {
        'type': 'FlakTurretDown',
        'config': ships.FLAK_TURRET_DOWN,
        'difficulty': 25
    }, {
        'type': 'CartTurret',
        'config': ships.CART_TURRET,
        'difficulty': 40
    }];
    var LEVEL_6_CHOICES = [{
        'type': 'Swarm',
        'y': 0,
        'config': ships.SWARM,
        'args': [640, 320, 15, 170],
        'difficulty': 10
    }, {
        'type': 'Fighter',
        'config': ships.FIGHTER,
        'difficulty': 10
    }, {
        'type': 'Teleporter',
        'config': ships.TELEPORTER,
        'difficulty': 15
    }, {
        'type': 'Electrician',
        'config': ships.ELECTRICIAN,
        'difficulty': 15
    }, {
        'type': 'Tank',
        'config': ships.TANK,
        'difficulty': 35
    }, {
        'type': 'Frigate',
        'config': ships.FRIGATE,
        'difficulty': 50
    }, {
        'type': 'LaserTurretUp',
        'config': ships.LASER_TURRET_UP,
        'difficulty': 15
    }, {
        'type': 'LaserTurretDown',
        'config': ships.LASER_TURRET_DOWN,
        'difficulty': 15
    }, {
        'type': 'FlakTurretUp',
        'config': ships.FLAK_TURRET_UP,
        'difficulty': 25
    }, {
        'type': 'FlakTurretDown',
        'config': ships.FLAK_TURRET_DOWN,
        'difficulty': 25
    }, {
        'type': 'CartTurret',
        'config': ships.CART_TURRET,
        'difficulty': 40
    }];

    function respawnPlayer(game, level) {
        game.expireActivePowerUp();
        var center = game.player.getCenter();
        var label = new LabelEntity(game, center.x, center.y, {
            'font': 'fontBig',
            'text': '-1',
            'life': 3500,
            'fontColor': 2
        });
        game.prependForeground(label);
        if (game.lifes > 0) {
            game.lifes -= 1;
            game.makePlayerShip(game.player.position.x, game.player.position.y, ships.PLAYER_SHIP);
            game.player.invincibleTime += 5000;
            if (game.currentWeapon >= 0) {
                game.changeWeapon(game.currentWeapon);
                if (game.autofire)
                    game.player.startShooting();
            }
        } else {
            game.resetCombo();
            game.player = null;
        }
    }

    function randomEnemies(time, difficulty, interval, choices) {
        var choice, events = [];
        while (difficulty > 0) {
            choice = choices[Math.floor(Math.random() * choices.length)];
            events.push(utils.merge({
                'at': time
            }, choice));
            time += interval;
            difficulty -= choice.difficulty;
        }
        return events;
    }

    function smartPowerUp(game) {
        if (!game.level.events.length || !game.player)
            return;
        var x = game.WORLD.WIDTH,
            y = Math.random() * game.WORLD.HEIGHT;
        var r = Math.random();
        if (game.player.health <= game.player.maxHealth / 2 && game.player.shield <= game.player.maxShield) {
            if (game.lifes === 0)
                game.makePowerUp(x, y, powerups.POWERUP_LIFE);
            else
                game.makePowerUp(x, y, powerups.POWERUP_REPAIR);
        } else if (game._enemyCount > 35)
            game.makePowerUp(x, y, powerups.POWERUP_KILL_ALL);
        else {
            if (r < .025 && game.player.shieldLevel < 3)
                game.makePowerUp(x, y, powerups.POWERUP_SHIELD_UPGRADE);
            else if (r < .6)
                game.makePowerUp(x, y, powerups.POWERUP_WEAPON_UPGRADE);
            else if (r < .7)
                game.makePowerUp(x, y, powerups.POWERUP_INVINCIBILITY);
            else if (r < .8)
                game.makePowerUp(x, y, powerups.POWERUP_RANDOM);
        }
    }

    function generateLevel(n, scenery, choices, difficulty, segmentCount) {
        var segments = [{
            'type': 'Scenery',
            'config': scenery
        }, {
            'type': 'HUD'
        }, {
            'type': 'PlayerShip',
            'x': 100,
            'y': 100,
            'config': ships.PLAYER_SHIP
        }, {
            'signal': 'playerDied',
            'receiver': respawnPlayer
        }];
        if (n === 1) {
            segments.push({
                'type': 'PlayerWeapons',
                'config': weapons.PLAYER_WEAPONS
            });
            if ('createTouch' in document)
                segments.push({
                    'at': 3000,
                    'type': 'Hint',
                    'y': 200,
                    'config': HINT_TOUCHSCREEN
                });
            else
                segments = segments.concat([{
                    'at': 1000,
                    'type': 'Hint',
                    'y': 280,
                    'config': HINT_MOVING
                }, {
                    'at': 8000,
                    'type': 'Hint',
                    'y': 420,
                    'config': HINT_WEAPONS
                }]);
            segments = segments.concat([{
                'at': 90000,
                'type': 'PowerUp',
                'config': powerups.POWERUP_WEAPON_UPGRADE
            }, {
                'at': 20000,
                'every': 1500,
                'type': 'Mine',
                'config': ships.MINE
            }]);
        } else
            segments = segments.concat([{
                'at': 25000,
                'every': 25000,
                'type': smartPowerUp
            }, {
                'at': 5000,
                'every': Math.max(500, 1500 - (n - 1) * 100),
                'type': 'Mine',
                'config': ships.MINE
            }, {
                'at': 5000,
                'every': Math.max(1000, 4000 - (n - 1) * 100),
                'type': 'AggressiveMine',
                'config': ships.AGGRESSIVE_MINE
            }, ]);
        if (choices && choices.length) {
            var time = n === 1 ? 40000 : 3000;
            for (var i = 1; i < segmentCount + 1; i++) {
                segments = segments.concat(randomEnemies(time, difficulty * 10 + difficulty * i * i, 2500 - Math.min(2000, i * i * 5), choices));
                time = segments[segments.length - 1].at + 2000;
            }
        }
        return {
            'events': segments
        };
    }

    function generateGame() {
        return [generateLevel(1, backgrounds.CRUST, LEVEL_1_CHOICES, 1, 12), generateLevel(2, backgrounds.CRUST, LEVEL_2_CHOICES, 3, 12), generateLevel(3, backgrounds.MANTLE, LEVEL_3_CHOICES, 4, 12), generateLevel(4, backgrounds.MANTLE, LEVEL_4_CHOICES, 5, 12), generateLevel(4, backgrounds.CORE, LEVEL_5_CHOICES, 6, 12), generateLevel(5, backgrounds.CORE, LEVEL_6_CHOICES, 7, 12)];
    }
    return {
        'generateGame': generateGame,
        'generateLevel': generateLevel,
        'respawnPlayer': respawnPlayer,
        'randomEnemies': randomEnemies
    };
});
define('skytte.main', ['jquery', 'settings', 'skytte.numbers', 'skytte.level', 'skytte.game', 'skytte.data.levels', 'skytte.data.resources'], function(jQuery, settings, numbers, Level, Game, levels, RESOURCES) {
    createjs.Sound.defaultInterruptBehavior = createjs.Sound.INTERRUPT_LATE;
    var screen = document.getElementById('screen');
    var game = new Game(screen, 1, settings('DEBUG', false), RESOURCES);
    var gameLevels = null;
    var currentLevel = -1;
    var highscore = loadHighscore('skytte.highscore');
    var audio = JSON.parse(localStorage.getItem('skytte.audio'));
    var music = JSON.parse(localStorage.getItem('skytte.music'));
    var musicTrack = document.getElementById('music');
    if (audio !== true && audio !== false)
        audio = true;
    if (music !== true && music !== false)
        music = true;
    jQuery('@toggle-audio').toggleClass('active', audio);
    jQuery('@toggle-music').toggleClass('active', music);
    musicTrack.volume = settings('MUSIC_VOLUME', 1);
    if (music)
        musicTrack.play();
    var menu = jQuery('.game>.menu');
    var mainMenu = jQuery('@menu-main');
    var loadingMenu = jQuery('@menu-loading');
    var pauseMenu = jQuery('@menu-pause');
    var restartMenu = jQuery('@menu-restart');
    var gameSummaryMenu = jQuery('@menu-game-summary');
    var levelSummaryMenu = jQuery('@menu-level-summary');
    updateStatsTables();
    mainMenu.show();
    mainMenu.find('@new-game').focus();
    loadingMenu.find('@play-game').hide();
    game.resume();
    game.releaseInput();

    function loadHighscore(keyName) {
        var localScore = JSON.parse(localStorage.getItem(keyName) || '{}');
        return {
            'score': parseInt(localScore.score, 10) || 0,
            'bestCombo': parseInt(localScore.bestCombo, 10) || 0,
            'bestMultiplier': parseInt(localScore.bestMultiplier, 10) || 1,
            'kills': parseInt(localScore.kills, 10) || 0,
            'distance': parseInt(localScore.distance, 10) || 0
        };
    }

    function saveHighscore(keyName, highscore) {
        localStorage.setItem(keyName, JSON.stringify(highscore));
    }

    function showMenuScreen(menuScreen) {
        game.releaseInput();
        menu.show().children().hide();
        menuScreen.show();
        menuScreen.find('a.button:first').focus();
        if (game.paused)
            createjs.Sound.setMute(true);
    }

    function hideMenuScreen() {
        game.acquireInput();
        menu.hide().children().hide();
        menu.find('a').blur();
        createjs.Sound.setMute(!audio);
    }

    function newGame() {
        gameLevels = levels.generateGame();
        currentLevel = -1;
        game.allResourcesLoaded.connect(onGameLoad);
        showMenuScreen(loadingMenu);
        game.load();
    }

    function onGameLoad() {
        loadingMenu.find('@play-game').show();
        loadingMenu.find('.progress').hide();
    }

    function playGame() {
        game.newGame();
        nextLevel();
        jQuery(screen).show();
        createjs.Sound.setMute(!audio);
        if (game.paused)
            game.resume();
    }

    function pauseGame() {
        game.pause();
        showMenuScreen(pauseMenu);
    }

    function resumeGame() {
        hideMenuScreen();
        game.resume();
    }

    function nextLevel() {
        if (currentLevel < gameLevels.length - 1) {
            currentLevel += 1;
            game.loadLevel(gameLevels[currentLevel]);
            hideMenuScreen();
            game.enableAutofire();
        }
    }

    function updateStatsTables() {
        jQuery('@player-score-game').text(numbers.format(game.score + game.combo));
        jQuery('@player-best-combo-game').text(numbers.format(game.bestCombo));
        jQuery('@player-best-multiplier-game').text(numbers.format(game.bestMultiplier));
        jQuery('@player-kill-count-game').text(numbers.format(game.kills));
        jQuery('@player-distance-game').text(numbers.format(Math.ceil(game.distance / 2000)));
        jQuery('@player-score-best').text(numbers.format(highscore.score));
        jQuery('@player-best-combo-best').text(numbers.format(highscore.bestCombo));
        jQuery('@player-best-multiplier-best').text(numbers.format(highscore.bestMultiplier));
        jQuery('@player-kill-count-best').text(numbers.format(highscore.kills));
        jQuery('@player-distance-best').text(numbers.format(Math.ceil(highscore.distance / 2000)));
    }

    function onLevelEnd() {
        game.disableAutofire();
        game.level.end();
        game.level = null;
        game.player.health = game.player.maxHealth;
        game.player.shield = game.player.maxShield;
        if (currentLevel === gameLevels.length - 1) {
            game.score += game.lifes * 50000;
            gameSummaryMenu.find('h1').text('Mission Complete');
        } else
            levelSummaryMenu.find('@level').text(currentLevel + 1);
        updateStatsTables();
        updateHighscore();
        saveHighscore('skytte.highscore', highscore);
        showMenuScreen(currentLevel < gameLevels.length - 1 ? levelSummaryMenu : gameSummaryMenu);
    }

    function updateHighscore() {
        highscore.score = Math.max(highscore.score, game.score + game.combo);
        highscore.bestCombo = Math.max(highscore.bestCombo, game.bestCombo);
        highscore.bestMultiplier = Math.max(highscore.bestMultiplier, game.bestMultiplier);
        highscore.kills = Math.max(highscore.kills, game.kills);
        highscore.distance = Math.max(highscore.distance, game.distance);
    }

    function onPlayerDied() {
        if (game.lifes === 0 || !game.player) {
            gameSummaryMenu.find('h1').text('Game Over');
            updateStatsTables();
            updateHighscore();
            saveHighscore('skytte.highscore', highscore);
            showMenuScreen(gameSummaryMenu);
        }
    }
    game.gamePaused.connect(function() {
        showMenuScreen(pauseMenu);
    });
    game.levelEnded.connect(onLevelEnd);
    game.playerDied.connect(onPlayerDied);
    game.afterDraw = function(game) {
        if (game.debug) {
            var text = 'FPS: ' + game.fps + '    Kills: ' + game.kills + '    Entities: ' + game.entities.length + '    Score: ' + game.score + '    Combo: ' + game.combo + '    Multiplier: ' + game.multiplier + '    Distance: ' + (game.distance / 2000).toFixed(1) + ' kilometers';
            game.context.font = '700 13px/16px sans-serif';
            game.context.fillStyle = '#000';
            game.context.fillText(text, 7, game.SCREEN.HEIGHT - 9);
            game.context.fillStyle = '#fff';
            game.context.fillText(text, 6, game.SCREEN.HEIGHT - 10);
        }
    };
    game.resourceLoaded.connect(function() {
        var percent = Math.round(game.loaded / game.toLoad * 100) + '%';
        jQuery('@load-progress').text(percent);
        jQuery('@load-progress-bar').width(percent);
    });
    menu.find('a').click(function(event) {
        event.preventDefault();
    });
    jQuery('@new-game').click(newGame);
    jQuery('@resume-game').click(resumeGame);
    jQuery('@play-game').click(playGame);
    jQuery('@next-level').click(nextLevel);
    jQuery('@restart-game').click(function() {
        showMenuScreen(restartMenu);
    });
    jQuery('@cancel-game-restart').click(function() {
        showMenuScreen(pauseMenu);
    });
    jQuery('@toggle-audio').click(function(event) {
        audio = !audio;
        jQuery('@toggle-audio').toggleClass('active', audio);
        localStorage.setItem('skytte.audio', JSON.stringify(audio));
    });
    jQuery('@toggle-music').click(function(event) {
        music = !music;
        jQuery('@toggle-music').toggleClass('active', music);
        localStorage.setItem('skytte.music', JSON.stringify(music));
        if (music)
            musicTrack.play();
        else
            musicTrack.pause();
    });
    var touchD = 10;
    var touchMoveId = null;
    var touchMoveStart = null;
    var touchTapId = null;
    var touchTapStart = null;

    function enableTouch() {
        screen.addEventListener('touchstart', onTouchStart, false);
        screen.addEventListener('touchmove', onTouchMove, false);
        screen.addEventListener('touchend', onTouchEnd, false);
    }

    function onTouchStart(event) {
        event.preventDefault();
        var touch = event.changedTouches[0];
        if (touchMoveId === null) {
            touchMoveId = touch.identifier;
            touchMoveStart = {
                'x': touch.pageX,
                'y': touch.pageY
            };
        }
        if (touchTapId === null) {
            touchTapId = touch.identifier;
            touchTapStart = {
                'x': touch.pageX,
                'y': touch.pageY
            };
        }
    }

    function onTouchMove(event) {
        event.preventDefault();
        if (touchMoveId !== null) {
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                if (touch.identifier === touchMoveId) {
                    var touchX = touch.pageX - touchMoveStart.x;
                    var touchY = touch.pageY - touchMoveStart.y;
                    if (touchY > 0)
                        game.player.moveDown(Math.min(1, Math.abs(touchY) / touchD));
                    else if (touchY < 0)
                        game.player.moveUp(Math.min(1, Math.abs(touchY) / touchD));
                    if (touchX > 0)
                        game.player.moveRight(Math.min(1, Math.abs(touchX) / touchD));
                    else if (touchX < 0)
                        game.player.moveLeft(Math.min(1, Math.abs(touchX) / touchD));
                    touchMoveStart = {
                        'x': touch.pageX,
                        'y': touch.pageY
                    };
                    break;
                }
            }
        }
        if (touchTapId !== null)
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                if (touch.identifier === touchTapId)
                    if (Math.abs(touch.pageX - touchTapStart.x) > 4 || Math.abs(touch.pageY - touchTapStart.y) > 4)
                        touchTapId = null;
            }
    }

    function onTouchEnd(event) {
        event.preventDefault();
        if (touchMoveId !== null)
            for (var i = 0; i < event.changedTouches.length; i++)
                if (event.changedTouches[i].identifier === touchMoveId) {
                    touchMoveStart = touchMoveId = null;
                    break;
                }
        if (touchTapId !== null) {
            var offset = jQuery(screen).offset();
            if (touchTapStart.x - offset.left > game.context.canvas.width - 53 && touchTapStart.y - offset.top < 53)
                pauseGame();
            else
                game.changeWeapon((game.currentWeapon + 1) % game.weapons.length);
            touchTapStart = touchTapId = null;
        }
    }
    if ('createTouch' in document)
        enableTouch();
    else
        jQuery(screen).click(pauseGame);
    return game;
});
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA\u002D199341\u002D25', 'www.merixstudio.pl');
ga('send', 'pageview');
var adroll_adv_id = "CFCPY26PMFCADFKYG4GAB6";
var adroll_pix_id = "WMPOTXOZMFHHHJZHAHA7I5";
(function() {
    var oldonload = window.onload;
    window.onload = function() {
        __adroll_loaded = true;
        var scr = document.createElement("script");
        var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
        scr.setAttribute('async', 'true');
        scr.type = "text/javascript";
        scr.src = host + "/j/roundtrip.js";
        ((document.getElementsByTagName('head') || [null])[0] || document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
        if (oldonload) {
            oldonload()
        }
    };
}());