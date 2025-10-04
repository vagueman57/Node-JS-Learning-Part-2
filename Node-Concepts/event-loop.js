const fs = require('fs');
const crypto = require('crypto');

console.log('1. script start');

setTimeout(() => {
  console.log('2. setTimeout 0s callback (timers phase)');
}, 0);

setTimeout(() => {
  console.log('3. setTimeout 0s callback (timers phase)');
}, 0);

setImmediate(() => {
  console.log('4. setImmediate callback (check phase)');
});

Promise.resolve().then(() => {
  console.log('5. Promise resolved (microtask queue)');
});

process.nextTick(() => {
  console.log('6. process.nextTick callback (microtask queue)');
});

fs.readFile(__filename, () => {
  console.log('7. file read operation (poll phase)');
});

crypto.pbkdf2('secret', 'salt', 1000, 64, 'sha512', (err, key) => {
  if(err) throw err;
  console.log('8. pbkdf2 operation completed (threadpool)');
});

console.log('9. script end');