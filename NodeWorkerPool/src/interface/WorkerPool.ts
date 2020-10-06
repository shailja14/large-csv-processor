interface WorkerPool {
    processData<data, result>(d: data )
    // terminate(): Promise<void>
  }

export default WorkerPool