GlobalConfig = {
    debug: false,
    combine: true,
    groups: {
        juju: {
            modules: {
                "reconnecting-websocket": {
                    fullpath: "assets/javascripts/reconnecting-websocket.js"
                },
                "juju-overview": {
                    fullpath: "views/overview.js"
                },
                "juju-status": {
                    fullpath: "views/status.js"
                },
                "juju-views":  {
                    use: ["juju-overview", "juju-status"]
                },
                "juju-models": {
                    requires: ["model", "model-list"],
                    fullpath: "models/models.js"
                },
                "juju-gui": { 
                    fullpath: "app.js",
                    requires: [
                        "juju-views", 
                        "juju-models"
                    ]
                }
            }
        }
    }
};

// Node compat for testing
if (typeof(exports) !== "undefined") {
    exports.GlobalConfig = GlobalConfig;    
}
