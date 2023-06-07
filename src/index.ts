const log4js = require('./logger').init();

async function main() {
  console.log('Hello, world!');
  return;
}


function shutdown(code?: number) {
  return process.exit(code);
}


// Launch
main().then(() => {
  shutdown();
}).catch(err => {
  log4js.error(err.message);
  shutdown(1);
})

// Signal
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGQUIT', shutdown);