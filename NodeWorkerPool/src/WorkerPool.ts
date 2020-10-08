import { Worker } from 'worker_threads'
import WorkerPoolOptionsInterface from './interface/WorkerOptions'
import WorkerPoolInterface from './interface/WorkerPool'
class WorkerPool implements WorkerPoolInterface {

    private idleWorker: Array<number>
    private resolvers: Map<number, any>
    private backlog: { id: number, data: any }[] = []
    private taskIdCounter: number
    private workers: Map<number, Worker>

    constructor(){
        this.resolvers = new Map<number, boolean>()
        this.taskIdCounter = 0
    }
    processData = (data: any) => {
              this.taskIdCounter += 1
              this.backlog.push({ id: this.taskIdCounter, data })
              this.resolvers.set(this.taskIdCounter, false)
              this.runNext()    
    }
    runNext = () => {
        if (this.backlog.length == 0 || this.idleWorker.length == 0) return
        const msg = this.backlog.shift()
        const worker = this.idleWorker.shift()
        this.workers.get(worker).postMessage(msg)
        this.runNext()
      }
    createWorkerpool = (options: WorkerPoolOptionsInterface) => {
        this.workers = new Map(Array.from({ length: options.workers }).map<[number, Worker]>(() => {
          const worker = new Worker('./dist/worker.js')
          return [worker.threadId, worker]
        }))
        this.idleWorker = Array.from(this.workers.keys())

        this.workers.forEach((worker, index) => {
            worker.on('message', data => {
              const { id, result, threadId } = data
              if(result === 'err'){
                console.log(`Data Chunk with id ${id} on worker ${threadId} not processed.`)
              } else {
                this.resolvers.delete(id)
              }
              if (this.resolvers.size === 0){
                console.log('File has been processed successfully.')
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