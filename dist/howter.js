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

        for (i = 0; i < paths.length; i++) {
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

            for (i = 0; i < this.paths.length; i++) {
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



/*jslint ass: true, forin: true, plusplus: true, regexp: true */
(function (global) {

    'use strict';

    var h = global.Howter || {},
        routes = {},
        routesCount = 0;

    // Ember.js inspired root
    // (http://emberjs.com/guides/routing/#toc_specifying-a-root-url).
    h.root = h.root || '';

    // Dispatch a path.
    h.dispatch = function (path) {
        var name;

        // Trailing slashes are not meaningful.
        path = path.replace(/\/$/, '');

        for (name in routes) {
            routes[name].test(path);
        }

        return this;
    };

    // Laravel inspired route prefixing
    // (http://laravel.com/docs/routing#route-prefixing).
    h.prefix = function (prefix, callback) {
        var oldRoot = this.root;

        this.root += prefix;

        callback.call(this);

        this.root = oldRoot;

        return this;
    };

    // Get a route or set a new one.
    h.route = function (paths, callback, name) {

        var i;

        // Getter...
        if (callback === undefined) {
            name = paths;

            return routes[name];
        }

        // ... or setter.
        if (paths.constructor !== Array) {
            paths = [paths];
        }

        for (i = 0; i < paths.length; i++) {
            if (paths[i].constructor === String) {
                paths[i] = this.root + paths[i];
            }
        }

        name = name || routesCount;
        routes[name] = new h.Route(paths, callback);

        routesCount++;

        return this;

    };

    // Export.
    global.Howter = h;

}(this));