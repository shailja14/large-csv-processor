import { Worker } from 'worker_threads'
import WorkerPoolOptionsInterface from './interface/WorkerOptions'
import WorkerPoolInterface from './interface/WorkerPool'
class WorkerPool implements WorkerPoolInterface {

    private idleWorker: Array<number>
    private resolvers: Map<number, any>
    private backlog: { id: number, data: any }[] = []
    private taskIdCounter: number
    private terminating: boolean
    private workers: Map<number, Worker>

    constructor(){
        this.resolvers = new Map<number, boolean>()
        this.taskIdCounter = 0
        this.terminating = false
    }
    processData = (data: any) => {            
              if (this.terminating) return new Error('Workerpool is terminating')
              this.taskIdCounter += 1
              this.backlog.push({ id: this.taskIdCounter, data })
              this.resolvers.set(this.taskIdCounter, false)
              this.runNext()    
    }
    // async terminate(): Promise<void> {
    //   this.terminating = true
    //   await new Promise(r => {
    //     setInterval(() => this.idleWorker.length == this.workers.size ? r() : null, 10)
    //   })
    //   console.log('all workers empty')
    //   await Promise.all(
    //     Array.from(this.workers.values()).map(v => v.terminate)
    //   )
    // }

    runNext = () => {
        if (this.backlog.length == 0 || this.idleWorker.length == 0) return
        const msg = this.backlog.shift()
        // const task = {...msg, redis: this.redis.toString()}
        // console.log(task)
        const worker = this.idleWorker.shift()
        // console.log(`scheduling ${msg.id} on ${worker}`)
        this.workers.get(worker).postMessage(msg)
        this.runNext()
      }
    createWorkerpool = (options: WorkerPoolOptionsInterface) => {
        this.workers = new Map(Array.from({ length: options.workers }).map<[number, Worker]>(() => {
          const worker = new Worker('./dist/worker.js')
          return [worker.threadId, worker]
        }))
        this.idleWorker = Array.from(this.workers.keys())
        
        // Todo: Explain below functionality

        this.workers.forEach((worker, index) => {
            worker.on('message', data => {
              const { id, result } = data
              if(result !== 'err'){
                this.resolvers.delete(id)
              }
              if (this.resolvers.size === 0){
                console.log('All Files Processed')
                //call terminate
              }
              this.idleWorker.push(index)
              this.runNext()
            })
          })
        return{
          processData : this.processData
        }
    }
}

export default WorkerPool