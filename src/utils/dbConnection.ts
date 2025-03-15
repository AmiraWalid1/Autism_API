import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

async function dbConnection() {
    const dbUri = config.get<string>('dbUri');

    try {
        await mongoose.connect(dbUri);
        log.info('Connected to DB');
    } catch(err) {
        log.error(err, "Cannot connect to DB");
        process.exit(1);
    }
     
}

export default dbConnection;