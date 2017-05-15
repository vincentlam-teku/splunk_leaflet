require.config({
    paths: {
        "app": "../app",
        "tween": "../app/Leaflets/Tween",
        "three": "../app/Leaflets/three.min",
        "detector": "../app/Leaflets/Detector",
        "globe": "../app/Leaflets/globe"
    },
    shims: {
        "tween": {
            "exports": "TWEEN"
        },
        "three": {
            "exports": "THREE"
        },
        "detector": {
            "exports": "Detector"
        },
        "globe": {
            "deps": ["three"],
            "exports": "DAT"
        }
    }
});

//require.config({
//    paths: {
//        "app": "../app",
//    }
//});

require(['splunkjs/mvc/simplexml/ready!'], function(){
    require(['splunkjs/ready!'], function(){
        // The splunkjs/ready loader script will automatically instantiate all elements
        // declared in the dashboard's HTML.
    });
});
