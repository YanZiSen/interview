var PENDING = 0
var FULLFILLED = 1
var REJECTED = 2

function Promise (fn) {
    var state = PENDING
    var value = null
    var reason = null
    var handlers = []
    function fullfill (result) {
        state = FULLFILLED
        value = result
        this.handlers.forEach(handle)
        this.handlers = null
    }
    function reject (result) {
        state = REJECTED
        reason = result 
        this.handlers.forEach(handle)
        this.handlers = null
    }
    function resolve (result) {
        try {
            let then = getThen(result)
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
        if (value && (t === 'boject' || t === 'object')) {
            let then = value.then
            if (typeof then === 'function') {
                return then
            }   
        }
        return null
    }

    function doResolve (fn, fullfill, reject) {
        let done = false
        try {
            fn((value) => {
                if (done) { return }
                done = true
                fullfill(value)
            }, (reason) => {
                if (done) { return }
                done = true
                reject(reason)
            })
        } catch (reason) {
            if (done) { return }
            done = true
            reject(reason)
        }
    }
    function handle (handler) {
        if (state === PENDING) {
            handlers.push(handler)
        }
        if (state === FULLFILLED && typeof handler.onFullfilled === 'function') {
            handler.onFullfilled(value)
        }
        if (state === REJECTED && typeof handler.onReject === 'function') {
            handler.onReject(value)
        }
    }
    function done (onFullfilled, onReject) {
        setTimeout(() => {
            handle({
                onFullfilled,
                onReject
            })
        }, 0)
    }
    // doREsolve(fn, fullfill, reject)
    doResolve(fn, resolve, reject)

    this.then = function (onFullfilled, onReject) {
        let self = this
        // return new Promise 方便链式调用
        return new Promise((resolve, reject) => {
            // 上一个Promise完成调用
            return self.done(function (result) {
                if (typeof onFullfilled === 'function') {
                    try {
                        resolve(onFullfilled(result))
                    } catch (ex) {
                        reject(ex)
                    }
                } else {
                    return resolve(result)
                }
            }, function (reason) {
                if (typeof onReject === 'function') {
                    try {
                        reject(onReject(result))
                    } catch (ex) {
                        reject(onReject(ex))
                    } 
                } else {
                    return reject(error)
                }
            })
        })
    }
}

new Promise((resolve, reject) => {
    setTimeout(() => {
        doSomethind()
        resolve(10)
    },0)
})
