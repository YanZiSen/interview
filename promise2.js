// const PENDING = 'PENDING'
// const FULLFILLED = 'FULLFILLED'
// const REJECT = 'REJECT'

class Promise {
    constructor (excutor) {
        this.state = PENDING
        this.value = void 0
        this.reason = void 0
        this.successCallbacks = []
        this.errorCallbacks = []
        const resolve = (data) => {
            this.state = FULLFILLED
            this.value = data
            this.successCallbacks.forEach(callback => {
                callback(data)
            })
        }
        const reject = (data) => {
            this.state = REJECT
            this.reason = data
            this.errorCallbacks.forEach(callback => {
                callback(this.reason)
            })
        }
        try {
            excutor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then (onFullFilled, onRejected) {
        if (this.state === PENDING) {
            this.successCallbacks.push(onFullFilled)
            this.errorCallbacks.push(onRejected)
        }
        if (this.state === REJECT) {
            onRejected(this.reason)
        }
        if (this.state === FULLFILLED) {
            onFullFilled(this.value)
        }
        return this
    }
}

// // test1 
// console.log('开始了')
// let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('ok')
//     }, 3000)
// }).then(res => {
//     console.log(res)
// })
// console.log('结束了')

// // test2
// console.log('开始了')
// let p = new Promise((resolve, reject) => {
//     resolve('ok')
// }).then(res => {
//     console.log(res)
// })
// console.log('结束了')

// test3 链式调用 现在还无法解决链式调用的问题，then的return this 就不能用了,因为后面的then是他最前面的Promise resolve 后的
// excutor 内部调用resolve()多次，事件会分发多次
console.log('开始了')
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok')
        resolve('ok')
        resolve('ok')
        resolve('ok')
    }, 3000)
}).then(res => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(res + 'two')
        },3000)
    })
}).then(res => {
    console.log(res)
})
console.log('结束了')
