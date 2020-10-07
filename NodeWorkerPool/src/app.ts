import WorkerPool from './WorkerPool'
import os from'os'
import fs from 'fs'
import RedisClient from './Redis'
import csvParser from 'csv-parser'

class App {
    workerPool: WorkerPool
    redis: RedisClient
    constructor(){
        this.redis = new RedisClient()
        this.workerPool = new WorkerPool()
    }
    
    run = () => {
        console.log(os.cpus().length)
        this.redis.createQueue()
        const pool = this.workerPool.createWorkerpool({ workers: os.cpus().length })
        fs.createReadStream('./data.csv')
                        .on('error', (err) => {
                            console.log('Error', err)
                        })
                        .pipe(csvParser())
                        .on('data', (row) => {
                            pool.processData(row)
                        })
                        .on('end', () => {
                            console.log('END')
                        })
    }
    
}

export default App