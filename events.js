function Events() {
    this._listeners = {}
    this._listening = []
}

Events.prototype = {
    on: on
  , off: off
  , once: once
  , listenTo: listenTo
  , stopListening: stopListening
  , trigger: trigger
  , _listeners: {}
  , _listening: []
}

function on(name, cb) {
    this._listeners[name] = this._listeners[name] || []
    this._listeners[name].push(cb)

    return this
}

function off(name, cb) {

    if (name && cb) {
        this._listeners[name] = this._listeners[name] || []
        var index = this._listeners[name].indexOf
        this._listeners[name].splice(index, 1)
    }
    else if (name) {
        this._listeners[name] = []
    }
    else {
        this._listeners = {}
    }

    return this
}

function once(name, cb) {
    var self = this
    var wrapped = function() {
        cb()
        self.off(name, wrapped)
    }
    this.on(name, wrapped)

    return this
}

function listenTo(emitter, name, cb) {
    this._listening.push({ emitter: emitter, name: name, cb: cb })
    emitter.on(name, cb)

    return this
}

function stopListening(emitter, name, cb) {
    var remove = []
    for (var i = 0; i < this._listening.length; i++) {
        var matchesEmitter = true
        if (emitter) {
            matchesEmitter = this._listening[i].emitter === emitter
        }
        var matchesName = true
        if (name) {
            matchesName = this._listening[i].name === name
        }
        var matchesCb = true
        if (cb) {
            matchesCb = this._listening[i].cb === cb
        }

        if (matchesEmitter && matchesName && matchesCb) {
            remove.push({ index: i, def: this._listening[i] })
        }
    }

    for (var i = 0; i < remove.length; i++) {
        this._listening.splice(remove[i].index, 1)
        this.off(remove[i].def.name, remove[i].def.cb)
    }

    return this
}

function trigger(name) {
    this._listeners[name] = this._listeners[name] || []
    var args = Array.prototype.slice.call(arguments, 1)
    for (var i = 0; i < this._listeners[name].length; i++) {
        this._listeners[name][i].apply(null, args)
    }

    return this
}

module.exports = Events