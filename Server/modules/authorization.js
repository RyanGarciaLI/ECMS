var path = require('path')

global.serviceCaches = {}
// global authentication function
global.serviceAuthFunc = null;


function Invocation(serviceName, actionName, serviceModule, originFunc) {
    return function() {
        let originArgs = arguments;
        return function(req, res, next) {
            if (global.serviceAuthFunc) {
                global.serviceAuthFunc(req, res, serviceName, actionName, function(pass){
                    if (pass) {
                        originFunc.apply(serviceModule, originArgs)
                    } else {
                        res.sendResult(null, 401, "Failed to authenticate")
                    }
                })
            } else {
                res.sendResult(null, 401, "Failed to authenticate")
            }
        }
    }
}

// get service object
module.exports.getService = function(serviceName) {
    if (global.serviceCaches[serviceName]){
        return global.serviceCaches[serviceName]
    }

    let servicePath = path.join(process.cwd(), "services", serviceName)
    let serviceModule = require(servicePath)
    if (!serviceModule){
        console.log("[GetService] " + servicePath + " can't be found")
        return null
    }

    // load a new service
    global.serviceCaches[serviceName] = {}
    console.log("[GetService] Intercept Service => %s", serviceName)
    for (actionName in serviceModule) {
        if (serviceModule && serviceModule[actionName] && typeof(serviceModule[actionName]) == "function"){
            let originFunc = serviceModule[actionName]
            global.serviceCaches[serviceName][actionName] = Invocation(serviceName, actionName, serviceModule, originFunc)
            console.log("[GetService] Action => %s", actionName)
        }
    }

    return global.serviceCaches[serviceName]
}

module.exports.setAuthFunc = function(authFunc){
    global.serviceAuthFunc = authFunc
}