var Events = require('events').EventEmitter
var StateTransitionSystem = require('state-transition-system')
var select = require('selector/functional')
var inherits = require('inherits')
var remove = require('browser-tools/manipulate/remove')
var propagate = require('propagate')

inherits(Widget, Events)
function Widget(options) {
    Events.call(this)

    this.el = options.el
    this.$ = select(el)
    this._stateMachine = new StateTransitionSystem(this.transitions || {})
    this._stateMachineProp = propagate(this._stateMachine, this)

    if (this.transitions) {
      this._addTransitions(this.transitions)
    }
}

Widget.prototype = {
  , remove: remove
  , become: become
  , _addTransitions: addTransitions
  , _stateMachine: {}
  , _stateMachineProp: {}
}

function become(state) {
    this._stateMachine.become(state)
}

function remove() {
    this._stateMachineProp.end()
    this._stateMachine.release()
    this.removeAllListeners()
        .$(remove)
}

function addTransitions(transitions) {
    var self = this
    for (var key in transitions) {
        var rules = key.split(' ')
        var fns = transition[key]
        if (typeof fns === 'string') {
            fns = fns.split(' ')
        }

        fns = fns.map(function(fn) {
            if (typeof fn === 'string') {
                fn = self[fn].bind(self)
            }
            return fn
        })

        for (var i = 0; i < fns.length; i++) {
            self._stateMachine.addTransition(rules[0], rules[1], fns[i])
        }
    }
}

module.exports = Widget