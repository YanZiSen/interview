const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED' 
class Promise {
    constructor (excutor) {
        this.value = void 0
        this.reason = void 0
        this.state = PENDING
        this.successCallbacks = []
        this.errorCallbacks = []
        let resolve = (value) => {
            this.state = FULLFILLED
            this.value = value
            this.successCallbacks.forEach(cb => cb())
        }
        let reject = (reason) => {
            this.state = REJECTED
            this.reason = reason
            this.errorCallbacks.forEach(cb => cb())
        }
        try {
            excutor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then (onFullFilled, onRejected) {
        // 如果返回的是promise, 那么then也就是返回的该promise, 后面的then的回调也是被该promise收集
        let x = onFullFilled()
        if (x!== null && (typeof x === 'object' || typeof x === 'function')) {

        } else {
            return this
        }
        if (this.state === PENDING) {
            this.successCallbacks.push(() => {
                onFullFilled(this.value)
            })
            this.errorCallbacks.push(() => {
                onRejected(this.value)
            })
        }
    }
}