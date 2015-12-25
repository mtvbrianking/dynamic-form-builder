/*
    Two-Way binding with jQuery and Object.observe
    Author: Garrett
    
 
    *********** Notice *************
    You will need to be using a browser that
    supports Object.observe currently
    the only browser to do so is
    Chrome Canary V 29+
    
    You need to turn on Experimental JavaScript
    in chrome://flags
    
    ***********************************
    How to use it
    ***********************************
    To use this you would create one Object
    this object will house all of the keys
    you're going to want bound to a(n) element(s)
    on the page. In my example I have firstName
    and lastName. Then you would use the
    data-bind attribute on the element setting
    it's value equal to the key in the Object.
    You will need to run jQuery.bindings([bindings object]);
    It'll traverse the DOM and kick everything off for you.
 */

/* The Plugin */

;
(function($, window, undefined) {

  var pluginName = 'bindings';

  function Plugin(bindings) {
    this.bindings = bindings;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function() {
    var self = this;

    $('[data-bind]').each(function() {
      var 
        $this = $(this),
        key = $this.attr('data-bind'),
        hasVal = $this.is('select, options, input, textarea'),
        keyup = $this.is('input, textarea');

      $this[hasVal ? 'val' : 'html'](self.bindings[key]);

      // Bind our Element to change the object

      $this.on('keyup.bindings change.bindings', function() {
        self.bindings[key] = hasVal ? $this.val() : $this.html();
        $.trigger('bindings.' + key);
      });

      // Bind our Object to change the element
      Object.observe(self.bindings, function(obj) {
        self.observer($this, obj, key);
      });

    });

  };

  Plugin.prototype.observer = function(ele, obj, key) {
    var $elem = ele.jquery === undefined ? $(ele) : ele;

    $elem[$elem.is('select, option, input, textarea') ? 'val' : 'html'](obj[0].object[key]);
    $.trigger('bindings.' + key);
  };

  $[pluginName] = function(bindings) {
    if (!$.data(this, 'plugin_' + pluginName)) {
      $.data(this, 'plugin_' + pluginName, new Plugin(bindings));
    }
  };

}(jQuery, window));

if (Object.hasOwnProperty('observe')) {
  
  var binds = {
    firstName: 'John',
    lastName: 'Doe',
    age: 22,
    color: 'Blue'
  };

  $(function() {
    $.bindings(binds);
  });

} else {
  alert('Sorry your browser does not support Object.observe!');
}