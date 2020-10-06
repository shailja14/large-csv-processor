import RedisSMQ from 'rsmq'

class RedisClient {
    private rsmq: RedisSMQ

    public constructor() {
        this.rsmq = new RedisSMQ({
            host: process.env.REDIS_IP || '127.0.0.1',
            port: 6379
        });
    }

    public async createQueue() {
            this.rsmq.createQueue({qname: process.env.QUEUENAME || 'test'}, (err) => {
                if (err) {
                     if (err.name !== "queueExists") {
                         console.error(err);
                         return;
                     } else {
                         console.log("The queue exists.");
                     }
                }
                console.log("queue created");
             });
    }

    public sendMsg(msg, callback) {
        this.rsmq.sendMessage({
            qname: process.env.QUEUENAME || 'test',
            message: msg,
            delay: 0
       }, callback);
    }
}

export default RedisClient;
