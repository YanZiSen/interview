// 参考PromiseA+  规范实现Promise
const PENDING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'
class Promise {
    status = PENDING
    value = '' 
    reason = ''
    onFullfills = []
    onRejects = []
    constructor (excutor) {
        function resolve (value) {
            this.status = 'fullfilled'
            this.value = value
            setTimeout(() => {
                this.onFullfills.forEach(success => {
                    try {
                        success(value)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
        }
        function reject (reason) {
            this.status = 'reject'
            this.reason = reason
            setTimeout(() => {
                this.onFullfills.forEach(f => f(reason))
            })
        }
        try {
            excutor(resolve, reject)
        } catch (e) {
            reject(reason)
        }
    }
    then (onFullfill, onReject) {
        let self = this
        let onFullfill = typeof onFullfill === 'function' ? onFullfill : function (x) { return x}
        let onReject = typeof onReject === 'function' ? onReject : function (x) { return x} 
        let promise
        switch (this.status) {
            case FULLFILLED:
                promise = new Promise((resolve, reject) => {
                    try {
                        let x = onFullfill(this.value)
                        resolvePromise(promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
                break;
            case REJECTED:
                promise = new Promise((resolve, reject) => {
                    try {
                        let x = onReject(this.reason)
                        resolvePromise(promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
                break;
            case PENDING:
                promise = new Promise((resolve, reject) => {
                    self.onFullfills.push(function (value) {
                        try {
                            let x = onFullfill(value)
                            resolvePromise(promise, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                    self.onRejects.push(function (reason) {
                        try {
                            let x = onReject(reason)
                            resolvePromise(promise, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            break;
        }
        return promise
    }
}

function resolvePromise (promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError(' x 不能与 promise 相等'))
    } else if (x instanceof Promise) {
        // x.then((val) => {
        //     resolve(val)
        // }, (reason) => {
        //     reject(reason)
        // })
        if (x.status === FULLFILLED) {
            resolve(x.value)
        } else if (x.status === REJECTED) {
            reject(x.reason)
        } else {
            x.then(y => {
                resolvePromise(promise, y, resolve, reject)
            }, reject)
        }
    } else if ((x !== null) && (typeof x === 'object' || (typeof x === 'function'))) {
        var excuted;
        try {
            var then = x.then
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (excuted) return
                    excuted = true
                    resolvePromise(promise, y, resolve, reject)
                }, function (e) {
                    if (excuted) return
                    excuted = true
                    reject(e) 
                })
            }
        } catch (e) {
            if (excuted) return;
            excuted = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}


function extend () {
    let target
    if (arguments.length = 1) {
        target = this
    }
    [].forEach.call(arguments, item => {
        for (var key in item) {
            target[key] = item[key]
        }
    })
}