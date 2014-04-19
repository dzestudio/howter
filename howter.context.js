/*jslint ass: true, forin: true, plusplus: true, regexp: true */
(function (global) {

    'use strict';

    var h = global.Howter || {};

    h.Context = function (matches, paramNames) {

        var i;

        this.path = matches.input;
        this.params = {};

        for (i = 0; i < matches.length; i++) {
            this.params[paramNames[i] || i] = matches[i];
        }

    };

    // Export.
    global.Howter = h;

}(this));