$(function () {

  window.exerciseLog = { log : [], logId : parseInt(Math.random() * 100000), startTime : Date.now(), lastSent : 0,
    current : 0 };

  window.submitExerciseLog = function () {
    if (window.exerciseLog.lastSent < window.exerciseLog.current && window.ACOS && window.ACOS.sendEvent) {
      window.exerciseLog.lastSent = window.exerciseLog.current;      
      ACOS.sendEvent('log', { animationId : window.exerciseId, logId : window.exerciseLog.logId, log : JSON.stringify(window.exerciseLog.log) });
    }
  };

  window.setInterval(window.submitExerciseLog, 20000);

  var exerciseName = $('input[name="exercise"]').val();
  var isJSVEE = JSVEE.animations[exerciseName] !== undefined;

  if (isJSVEE) {
    $('<div></div>').addClass('jsvee-animation').attr('data-id', exerciseName).appendTo('#exercise-content');
  }
  
  if (isJSVEE) {

    window.exerciseType = 'JSVEE';
    var logItem = { type : 'jsvee', timestamp : Date.now(), animationLog : [] };
    window.exerciseLog.log.push(logItem);

    $('.jsvee-animation').each(function () {
      var id = $(this).data('id');
      if (id) {
        new JSVEE.ui(id, this);
      }
    });
  } else {
    window.exerciseType = 'js-parsons';
    Parsons.initializeExercise(exerciseName);
  }

});