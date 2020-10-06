import RSMQ from 'rsmq-worker'
import Record from '../model/Record'

class Worker {
    private worker: RSMQ

    constructor(queue, host, port){
        this.worker = new RSMQ(queue,{
            host: host,
            port: port,
        });
    }

    public startWorker() {
        this.worker.on('message', (msg, next, id) => {
            console.log('Msg')
            Record.create(JSON.parse(msg))
            next()
        })
        this.worker.on('error', function( err, msg ){
            console.log( "ERROR", err, msg.id );
        });
        this.worker.on('exceeded', function( msg ){
            console.log( "EXCEEDED", msg.id );
        });
        this.worker.on('timeout', function( msg ){
            console.log( "TIMEOUT", msg.id, msg.rc );
        });
       
        this.worker.start();
    }
}

export default Worker