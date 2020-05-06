// new Promise((resolve, reject) => {

// }).then(() => {}, () => {})
// .catch(error => console.log(error))
// 初步编写，异步部分基本完成
// class Promise {
//     constructor (excutor) {
//         this.callbacks = []
//         let resolve = (data) => {
//             this.state = 'resolved'
//             for (let callback of this.callbacks) {
//                 callback(data)
//             }
//         }
//         let reject = (data) => {
//             this.state = 'reject'
//         }
//         excutor(resolve, reject)
//     }
//     then (resolve, reject) {
//         this.callbacks.push(resolve)
//         return this
//     }
// }

// 测试一
// console.log('同步开始')

// let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('ok')
//     },3000)
// }).then(res => {
//     console.log(res)
// }).then(res => {
//     console.log(res + 'two')
// })

// console.log('同步结束')

// 测试二
// 如果是同步代码则有问题

// console.log('同步开始')
// let p = new Promise((resolve, reject) => {
//     resolve('ok')
// }).then(res => {
//     console.log(res) 
// })
// console.log('异步开始')



