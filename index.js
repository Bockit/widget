
var Events = require('./events')
var select = require('selector/functional')
var inherits = require('inherits')
var remove = require('browser-tools/manipulate/remove')
var on = require('browser-tools/events/on')
var off = require('browser-tools/events/off')

inherits(Widget, Events)
function Widget(options) {
    Events.call(this)

    this.el = options.el
    this.$ = select(el)
    this._delegated = []
    this.delegateEvents(this.events)
}

Widget.prototype = {
    delegateEvents: delegateEvents
  , undelegateEvents: undelegateEvents
  , remove: remove
  , _delegated: []
}

var eventSplitter = /([^\s]+)\s(.*)/
function delegateEvents(events) {
    this.undelegateEvents()
    if (events) {
        for (var k in events) {
            var matched = k.match(eventSplitter)
            var fn = events[k]
            if (typeof fn === 'string') {
                fn = this[fn]
            }
            this.$(on, matched[1], matched[2], fn)
            this.delegated.push([matched[1], matched[2], fn])
        }
    }
    return this
}

function undelegateEvents() {
    for (var i = 0; i < this.delegated.length; i++) {
        this.$(off, this.delegated[i][0], this.delegated[i][1],
            this.delegated[i][2])
    }

    this.delegated = []
    return this
}

function remove() {
    this.undelegateEvents()
        .off()
        .stopListening()
        .$(remove)
}

module.exports = Widget