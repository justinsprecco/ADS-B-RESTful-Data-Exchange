const { Readable, Writable } = require("stream")

const adminQueue = new Readable({
   objectMode: true,
   read()
   {}, // The broker shouldn't ever have to read from queue
})

const adminQueueOut = new Writable({
   objectMode: true,
   write()
   {},
})

adminQueue.pipe(adminQueueOut)

module.exports = { adminQueue, adminQueueOut }
