import { Schema, model, Document } from 'mongoose';

class RecordSchema {
    static get schema() {
        const recordSchema = new Schema({
                policyID: String,
                statecode: String,
                county: String,
                eq_site_limit: String,
                hu_site_limit: String,
                fl_site_limit: String,
                fr_site_limit: String,
                tiv_2011: String,
                tiv_2012: String,
                eq_site_deductible: String,
                hu_site_deductible: String,
                fl_site_deductible: String,
                fr_site_deductible: String,
                point_latitude: String,
                point_longitude: String,
                line: String,
                construction: String,
                point_granularity: String
        });
        return recordSchema;
    }
}
const schema = model<Document>('Records', RecordSchema.schema);
export default schema;