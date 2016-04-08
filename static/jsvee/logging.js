(function ($) {
  'use strict';

  if (window.JSVEE === undefined) {
    return;
  }

  JSVEE.beforeEachStep(function (instr) {

    var currentLine = this.area.find('.jsvee-code-area').attr('data-line');

    if (typeof this.llogging === "undefined") {
      this.llogging = { lines : [], line : currentLine };
    }

  });

  JSVEE.afterEachStep(true, function (instr) {

    var currentLine = this.area.find('.jsvee-code-area').attr('data-line');

    if (window.ACOS && (this.llogging.line != currentLine || this.hasEnded())) {

      try {
        // ACOS.sendEvent("line", this.llogging.line);
        this.llogging.lines.push(this.llogging.line);
      } catch (e) {
        // NOP
      }

    }

    this.llogging.line = currentLine;

  });

  // ************************

  JSVEE.afterInitialization(function () {

    this.logging = {};
    this.logging.startTime = Date.now();
    this.logging.log = [];
    this.logging.logCounter = 0;
    this.logging.logSentCounter = 0;
    this.logging.logId = parseInt(Math.random() * 100000);

    var that = this;

    if (window.exerciseLog && window.exerciseLog.log.length > 0) {
          this.logging.log = window.exerciseLog.log[window.exerciseLog.log.length - 1].animationLog;
    }
    
    this.logging.appendToLog = function (action, parameter) {
      that.logging.log.push([ (Date.now() - that.logging.startTime) / 1000.0, action, parameter ]);
    };

    this.logging.sendLog = function () {

      if (window.ACOS && that.logging.logCounter > that.logging.logSentCounter) {
        try {

          if (window.submitExerciseLog) {
            window.submitExerciseLog();
          }

        } catch (e) {
          // NOP
        }

      }

    };

    window.setInterval(this.logging.sendLog, 20000);

    this.area.find('.jsvee-undo').click(function (e) {
      e.preventDefault();
      that.logging.log.push([ (Date.now() - that.logging.startTime) / 1000.0, "undo", that.state.stepNumber ]);
      that.logging.logCounter++;
    });

    this.area.find('.jsvee-begin').click(function (e) {
      e.preventDefault();
      that.logging.log.push([ (Date.now() - that.logging.startTime) / 1000.0, "begin", that.state.stepNumber ]);
      that.logging.logCounter++;
    });

    this.area.find('.jsvee-redo').click(function (e) {
      e.preventDefault();
      that.logging.log.push([ (Date.now() - that.logging.startTime) / 1000.0, "redo", that.state.stepNumber ]);
      that.logging.logCounter++;
    });

  });

  JSVEE.beforeEachStep(function () {
    this.logging.log.push([ (Date.now() - this.logging.startTime) / 1000.0, "step", this.state.stepNumber ]);
    this.logging.logCounter++;
  });

  JSVEE.afterEachStep(true, function (instr) {
  
    this.logging.log.push([ (Date.now() - this.logging.startTime) / 1000.0, "instr", instr ? instr[0] : '' ]);
    
    if (window.exerciseLog) {
      window.exerciseLog.current++;
    }

    if (this.hasEnded()) {
      this.logging.log.push([ (Date.now() - this.logging.startTime) / 1000.0, "end" ]);
      if (window.exerciseLog) {
        window.exerciseLog.current++;
      }

      if (window.ACOS && ACOS.sendEvent) {
        // ACOS.sendEvent('grade', {points: 1, max_points: 1});
        this.logging.sendLog();
      }      
    }    
    
  });

}(jQuery));