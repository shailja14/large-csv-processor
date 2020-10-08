import mongoose from 'mongoose';

class Database {

    private uri

    public constructor(uri) {
        this.uri = uri
    }

    public connect() {
        mongoose.connect(this.uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }, (err) => {
            if (err) {
                console.log(`DB Error: ${err.message}`)
            } else {
                console.log('Connected to DB')
            }
        });
    }
}

export default Database
