(function() {
  'use strict';

  angular
    .module('dbaq.ionTimer', [])
    .directive('ionTimer', ['$interval', function ($interval) {

    /**
     * default options
     */
    var defaultsOpts = {
        autoStart: true, //if true, the timer will start automatically, false otherwise
        progressCircle: {
          strokeColor: '#45ccce', //the color of the progress circle
          strokeWidth: 8, //the width of the progress circle
          backgroundColor: '#eaeaea', //the background color of the progress circle
          radius: 100, // radius of the circle, since the circle is responsive, this option can be override in order to make the circle fit in its parent. The radius to stroke ratio won't change.
          rounded: true, // true to use `round` for the stroke-line-cap properties, false to use `butt`
          clockwise: false //
        },
        text: {
            color: '#45ccce',
            size: '50px'
        }
    };

    /**
     * renders both components and applies the default CSS
     * everything can be override by using the CSS classes
     * inspired by: https://github.com/crisbeto/angular-svg-round-progressbar
     */
    var renderComponents = function(element, svg, ring, background, text, options){
        var strokeLineCap    = options.progressCircle.rounded ? 'round': 'butt';
        var radius           = parseInt(options.progressCircle.radius);
        var diameter         = radius * 2;
        var backgroundSize   = radius - (options.progressCircle.strokeWidth / 2);

        svg.css({'width': '100%', 'height': '100%'});
        svg[0].setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
        ring.css({'stroke': options.progressCircle.strokeColor, 'stroke-width': parseInt(options.progressCircle.strokeWidth), 'stroke-linecap': strokeLineCap});
        if (!options.progressCircle.clockwise) {
            ring.attr('transform', 'scale(-1, 1) translate('+ (-diameter) +' 0)');
        }
        
        background.attr({'cx': radius, 'cy': radius, 'r': backgroundSize >= 0 ? backgroundSize : 0});
        background.css({'stroke': options.progressCircle.backgroundColor, 'stroke-width': parseInt(options.progressCircle.strokeWidth)});
        
        text.css({'position': 'absolute', 'width': '100%', 'text-align': 'center', 'top': '50%', 'left': '0', 'color': options.text.color});
        text.css({'margin-top': '-' + ((parseInt(options.text.size)/2)+4) + 'px', 'height': options.text.size, 'line-height': options.text.size, 'font-size': options.text.size});
    };

    // credit to http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    // inspired by: https://github.com/crisbeto/angular-svg-round-progressbar
    var updateState = function(ring, val, total, options) {
        var polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        };

        var R           = options.progressCircle.radius - (options.progressCircle.strokeWidth / 2);
        var size        = options.progressCircle.radius * 2;
        var value       = val >= total ? total - 0.00001 : val;
        var type        = 359.9999;
        var perc        = total === 0 ? 0 : (value / total) * type;
        var x           = size/2;
        var start       = polarToCartesian(x, x, R, perc); // in this case x and y are the same
        var end         = polarToCartesian(x, x, R, 0);
        var arcSweep    = (perc <= 180 ? '0' : '1');
        var d           = ['M', start.x, start.y, 'A', R, R, 0, arcSweep, 0, end.x, end.y].join(' ');

        return ring.attr('d', d);
    };

    /**
     * updates the text component
     * we update it only every seconds to save some computation
     * minutes and seconds are always displayed
     * hours are displayed only if needed
     */
    var updateText = function(text, val, max, force) {
        if (force || val % 1000 == 0) {
            var secondsRemaining = (max - val) / 1000;
            var hours   = Math.floor(secondsRemaining / 3600);
            var minutes = Math.floor((secondsRemaining - (hours * 3600)) / 60);
            var seconds = Math.floor(secondsRemaining - (hours * 3600) - (minutes * 60));

            text.html((hours ? hours + ' ' : '') + (hours && minutes < 10 ? '0' : '') + minutes + ' ' + (seconds < 10 ? '0' : '') + seconds);
        }
    };

    /**
     * cancel an interval promise if defined
     */
    var cancelIntervalPromise = function(intervalPromise) {
        if (intervalPromise) {
            $interval.cancel(intervalPromise);
        }
    };

    /**
     * updates both components (circle + text)
     * if the currentValue is 0, we set the circle value to 0.1% so it can be visible
     */
    var updateComponents = function(ring, text, max, currentValue, options, force) {
        updateState(ring, (currentValue ? currentValue : (max * 0.001)), max, options);
        updateText(text, currentValue, max, force);
    };

    return angular.extend({
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            duration: '=',
            opts: '='
        },
        template:[
            '<div class="ion-timer-wrapper" style="position:relative;">',
                '<div class="ion-timer-txt"></div>',
                '<svg class="ion-timer-svg" xmlns="http://www.w3.org/2000/svg">',
                    '<circle fill="none"/>',
                    '<path fill="none"/>',
                    '<g ng-transclude></g>',
                '</svg>',
            '</div>'
        ].join('\n'),
        link: function(scope, element){
            if (parseInt(scope.duration) === 0) {
                console.error('the `duration` parameter must be defined');
                return;
            }

            //DOM element
            var text            = element.find('div').eq(0);
            var svg             = element.find('svg').eq(0);
            var ring            = svg.find('path').eq(0);
            var background      = svg.find('circle').eq(0);

            //options and controls
            scope.opts          = scope.opts || {};
            var options         = angular.merge({}, defaultsOpts, scope.opts);
            var events          = options.events;
            scope.opts.controls = scope.opts.controls || {};

            //internal options
            var refreshInterval = 50; // in ms
            var max             = scope.duration * 1000; // use milliseconds
            var current         = 0;
            var intervalPromise = null;

            //status
            var status          = 'STOPPED';

            ////init the circle and the text
            renderComponents(element, svg, ring, background, text, options);
            updateComponents(ring, text, max, current, options);

            // called only when current >= max
            var onComplete = function() {
                cancelIntervalPromise(intervalPromise);
                status = 'STOPPED';
                if (events && events.onComplete && typeof events.onComplete === 'function') {
                    events.onComplete();
                }
            }

            // set an interval every `refreshInterval`
            // we update the UI components (circle + text)
            // the text component is updated every seconds only
            // if we reached the end of the timer, we cancel the interval and call onComplete if defined
            scope.opts.controls.start = function() {
                if (status === 'STARTED') {
                    console.error('the timer is already started, you cannot start it again.');
                    return;
                }
                if (current >= max) {
                    onComplete();
                    return;
                }

                status = 'STARTED';
                intervalPromise = $interval(function() {
                    current += refreshInterval;
                    updateComponents(ring, text, max, current, options);
                    if (current >= max) {
                        onComplete();
                        return;
                    }
                }, refreshInterval);

                //call the onStart function if defined by the developer
                if (events && events.onStart && typeof events.onStart === 'function') {
                    events.onStart();
                }
            };
            
            scope.opts.controls.pause = function() {
                cancelIntervalPromise(intervalPromise);
                status = 'PAUSED';
                //call the onPause function if defined by the developer
                if (events && events.onPause && typeof events.onPause === 'function') {
                    events.onPause(current / 1000);
                }
            };
            
            scope.opts.controls.stop = function() {
                cancelIntervalPromise(intervalPromise);
                status = 'STOPPED';
                //call the onStop function if defined by the developer
                if (events && events.onStop && typeof events.onStop === 'function') {
                    events.onStop(current / 1000);
                }
                current = 0;
                updateComponents(ring, text, max, current, options);
            };
            
            scope.opts.controls.status = function() {
                return status;
            };

            // starts the timer if the autoStart options is true
            if (options.autoStart) {
                scope.opts.controls.start();
            }

            // make sure to clean the interval on destroy
            scope.$on('$destroy', function() {
                cancelIntervalPromise(intervalPromise);
            });

            // watch the seconds value to update if needed or style
            scope.$watch('duration', function(newValue, oldValue){
                if (newValue !== oldValue) {
                    max = scope.duration * 1000; // use milliseconds
                    updateComponents(ring, text, max, current, options, true);
                }
            });
            
            // watch the options to update the style if needed 
            scope.$watchCollection('opts', function(newValue, oldValue){
                if (newValue !== oldValue) {
                    options = angular.merge({}, defaultsOpts, newValue);
                    renderComponents(element, svg, ring, background, text, options);
                    updateComponents(ring, text, max, current, options);
                }
            });
        }
    });
  }]);

})();