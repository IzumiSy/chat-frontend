(function() {
  'use strict';

  // --------------------
  //  Partial components
  // --------------------
  var _partials = {
    header: null,
    sidebar: null,
    message_view: null,
    message_input: null
  };

  // -----------------
  //  Page components
  // -----------------
  var _pages = {
    root: null,
    entrance: null,
    error: null
  };

  module.exports = {
    pages: _pages,
    partials: _partials
  };
})();
