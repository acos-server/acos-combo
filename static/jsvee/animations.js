(function ($) {
  'use strict';

  if (window.JSVEE === undefined) {
    return;
  }

  JSVEE.animations = {};

  /**
   * Returns the requested animation.
   * 
   * @param id The unique id of the animation
   * @memberOf JSVEE.animations
   */
  JSVEE.animations.getAnimation = function (id) {

    if (JSVEE.animations.hasOwnProperty(id)) {
      return JSVEE.animations[id];
    }

    return null;

  };  

  // Load all animations
  $(function () {

    $('.jsvee-animation-all, .jsvee-animation[data-id="ae_all"]').each(function () {

      var that = $(this);

      $.each(JSVEE.animations, function (key, value) {

        if (key.substring(0, 2) == "ae") {
          that.append($('<p></p>').text(key));
          that.append($('<div></div>').addClass('jsvee-animation').attr('data-id', key));

          // console.log(key);
          // console.log(value.lines.join('\n'));
          // console.log("******");

          var lines = [];

          $.each(value.init, function () {

            if (this[0] == 'setLine') {
              if (lines.indexOf(this[1]) < 0) {
                lines.push(this[1]);
              }
            }

          });

          $.each(value.steps, function () {
            if (this[0] == 'setLine' || this[0].substring(0, 4) == 'jump') {
              if (lines.indexOf(this[1]) < 0) {
                lines.push(this[1]);
              }
            }

          });

          that.append($('<p></p>').text("Lines: " + lines.join(", ")));

          that.append($('<hr/>'));
        }

      });

    });

    $('.jsvee-animation').each(function () {
      var id = $(this).data('id');
      if (id) {
        new JSVEE.ui(id, this);
      }
    });

  });

}(jQuery));