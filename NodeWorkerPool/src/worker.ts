import { parentPort, threadId } from "worker_threads"
import RedisClient from './Redis'

class Worker {
  private redis
  constructor(redis){
    this.redis = redis
  }
  public processMsg = () => {
    parentPort.on('message', (msg) => {
      const { id, data } = msg
      
      this.redis.sendMsg(JSON.stringify(data), (err, res) => {
        let result = null
        if(err) {
          result = { id, result: 'err' }
        } else {
          result = { id, result: res }
        }
        parentPort.postMessage(result)
      })
    })
  }
}

new Worker(new RedisClient()).processMsg()