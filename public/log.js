// log.js
class WriteAheadLog545 {
    constructor() {
      this.log = [];
    }
  
    // Add a message to the log
    addMessage(sender, receiver, fullMessage) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        sender,
        receiver,
        fullMessage,
      };
      this.log.push(logEntry);
    }
  
    // Get the entire log
    getLog() {
      return this.log;
    }
  }
  const writeAheadLog545 = new WriteAheadLog545();

  