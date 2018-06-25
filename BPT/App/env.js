(function (window) {
    'use strict';
    var baseUrl = $("base").first().attr("href");

    window.__env = window.__env || {};

    // API url
    window.__env.apiUrl = 'http://localhost:23557/';

    // Base url
    window.__env.baseUrl = baseUrl;//'/';

    // Enable debug
    window.__env.debug = true;
}(this));