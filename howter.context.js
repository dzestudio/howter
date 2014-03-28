/*jslint ass: true, forin: true, plusplus: true, regexp: true */
(function (global) {

    'use strict';

    var h = global.Howter || {};

    h.Context = function (matches, paramNames) {

        var i;

        this.path = matches.input;
        this.params = {};

        // Remove the entire input from the matches.
        matches.shift();

        for (i = 0; i < matches.length; i++) {
            this.params[paramNames[i] || i] = matches[i];
        }

    };

    // Export.
    global.Howter = h;

}(this));