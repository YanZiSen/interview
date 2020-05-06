var PENDING = 0
var FULLFILLED = 1
var REJECTED = 2

function Promise (fn) {
    var state = PENDING
    var value = null
    var handlers = []
    function reject (error) {
        state = REJECTED
        value = error
    }
    function fullfill (result) {
        state = FULLFILLED
        value = result
    }
    function resolve (result) { 
        // 参数为一个普通值或者是一个Promise,如果是promise,则等待promise fullfilled
        // 一个promise 不会被另一个promise改变状态，所以我们使用resolve,而不是内部的fullfill方法
        // 这就是为什么我们要暴露这个方法
        try {
            var then = getThen(result)
            if (then) {
                doResolve(then.bind(result), fullfill, reject)
                return
            }
            fullfill(result)
        } catch (e) {
            reject(e)
        }
    }
    function getThen (value) {
        let t = typeof value
        if (value && (typeof value === 'object' || 'function')) {
            var then = value.then 
            if (typeof then === 'function') {
                return then 
            }
        }
        return null
    }
    function doResolve (fn, onFullfilled, onRejected) {
        var done = false
        try {
            return fn(function (value) {
                if (done) {
                    return
                }
                done = true
                onFullfilled(value)
            }, function (reason) {
                if (done) {
                    return
                }
                done = true
                onRejected(reason)
            })
        } catch (e) {
            if (done) {
                return 
            }
            done = true
            onRejected(e)
        }
    }
}