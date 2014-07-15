/*jslint ass: true, forin: true, plusplus: true, regexp: true */
(function (global) {

    'use strict';

    var h = global.Howter || {};

    h.Route = function (paths, callback) {

        var i,
            paramNames = [],

            // Modified version of a Sammy (http://sammyjs.org) snippet.
            parsePath = function (path) {

                var nameMatcher = /\/:([^\/]+)/g,
                    wildcardMatcher = /\/\*$/,
                    match;

                if (path.constructor === RegExp) {
                    return path;
                }

                nameMatcher.lastIndex = 0;

                while ((match = nameMatcher.exec(path)) !== null) {
                    paramNames.push(match[1]);
                }

                path = path.replace(nameMatcher, '\/([^\/]+)');

                // A wildcard is a '/*' sequence in the end of the path.
                // Inspired by Sammy.js (http://sammyjs.org/docs/routes).
                if (wildcardMatcher.test(path)) {
                    path = path.replace(wildcardMatcher, '(\/.*)?');

                    paramNames.push('splat');
                } else {
                    // Trailing slashes are not meaningful.
                    path = path.replace(/\/$/, '');
                }

                return new RegExp('^' + path + '$');

            };

        this.paths = [];

        for (i in paths) {
           this.paths.push(parsePath(paths[i]));
        }

        this.callback = callback;

        // This function gives full access to change any aspects of the route.
        // It is very handy to wrap callbacks.
        this.extend = function (extension) {
            extension.call(this, this);
        };

        // Checks the path against each route's path.
        // It stops on the first match, so the callback is only executed once.
        this.test = function (path) {
            var i, matches, context;

            for (i in this.paths) {
                if ((matches = path.match(this.paths[i])) !== null) {
                    // Remove the entire input from the matches.
                    matches.shift();

                    // Create the context.
                    context = new h.Context(matches, paramNames);

                    // Call the function passing context as arguments.
                    this.callback.call(context, context);

                    // Ensures that the callback is only applied once.
                    break;
                }
            }
        };

    };

    // Export.
    global.Howter = h;

}(this));