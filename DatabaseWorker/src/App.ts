import DBConnector from './connections/Database';
import RSMQ from 'rsmq-worker'
import Worker from './connections/RSMQWorker';

class App {

    private db: DBConnector
    private worker: RSMQ
    constructor() {
        this.db = new DBConnector(process.env.DB_URI || 'mongodb://localhost/testdb')
        this.worker = new Worker(process.env.REDIS_Queue || 'test', process.env.REDIS_IP || '127.0.0.1', process.env.REDIS_PORT || 6379)
    }

    public run() {
        this.db.connect()
        this.worker.startWorker()

    }
}

export default App;