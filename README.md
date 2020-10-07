# large-csv-processor
Process a large CSV file (> 10 million records) in a distributed way. The primary server will pick up the file and it will spin up multiple workers to process the large file. It will split the big file into multiple batches and distribute those batches among different workers to process.
As the workers are processing each batch, they will be saving this data (each CSV record) to a database
# Challenge 
1. Creating workers will create a new node instance. This means that is a relative heavy task to create new workers. There is also the risk of creating too many workers and flooding the host system with processes. 
2. Create a process for the workers to be able to save data to the database without choking the database.
# Resource Pooling
1. This is where resource pooling comes in. We will create a certain amount of workers when we start our application and reuse those every time we want to run a task on another process. This pool of workers will be managed by the pool manager who accepts tasks and will assign them to an idle worker.
# REDIS QUEUE
2. We have used REDIS QUEUE to store the record, workers will publish record to the queue and another service will subscribe to the queue, retrive record and store to Database. 
# Requirements
Make sure you have 
  1. Node.js v10.5.0 or higher, If you’re using any version prior to 11.7.0, however, you need to enable it by using the --experimental-worker flag when invoking Node.js.
  2. MongoDB
# Quickstart
## Start the application

```
cd NodeWorkerPool
npm install && npm start
```
```
cd DatabaseWorker
npm install && npm start
```
