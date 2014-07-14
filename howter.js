// @prepros-prepend howter.context.js
// @prepros-prepend howter.route.js

/*jslint ass: true, forin: true, plusplus: true, regexp: true */
(function (global) {

    'use strict';

    var h = global.Howter || {},
        currentPrefix = '',
        routes = {},
        routesCount = 0;

    // Ember.js inspired root URL
    // (http://emberjs.com/guides/routing/#toc_specifying-a-root-url).
    h.rootURL = h.rootURL || '';

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
        var oldPrefix = currentPrefix;

        currentPrefix += prefix;

        callback.call(this);

        currentPrefix = oldPrefix;

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

        for (i in paths) {
            if (paths[i].constructor === String) {
                paths[i] = h.rootURL + currentPrefix + paths[i];
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