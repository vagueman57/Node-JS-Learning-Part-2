//readable -> use for read
//writable -> write to a file
//duplex -> can be used for both read and write (TCP socket)
//transform -> zlib steams

const fs = require("fs"); // For file system operations (reading/writing files)
const zlib = require("zlib"); // compression gzip
const crypto = require("crypto"); // For cryptographic functions (encryption)
const { Transform } = require("stream"); // The base class for creating custom transform streams
 
class EncryptStream extends Transform {
  constructor(key, vector) {
    super(); // Must call the parent Transform class constructor
    this.key = key; // The 32-byte encryption key for AES-256
    this.vector = vector; // The 16-byte initialization vector
  }

  // This method is called for every chunk of data that passes through the stream
  _transform(chunk, encoding, callback) {
    // Create a cipher instance to perform the encryption
    const cipher = crypto.createCipheriv("aes-256-cbc", this.key, this.vector);

    // Encrypt the chunk. .update() handles the main part and .final() handles any remaining bytes.
    const encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);

    // 'push' the modified (encrypted) chunk out to the next stream in the pipe.
    this.push(encrypted);

    // 'callback' tells the stream that we're done processing this chunk and are ready for the next one.
    callback();
  }
}

const key = crypto.randomBytes(32);
const vector = crypto.randomBytes(16);

const readableStream = fs.createReadStream("input.txt");

//new gzip object to compress the stream of data
const gzipStream = zlib.createGzip();

const encryptStream = new EncryptStream(key, vector);

const writableStream = fs.createWriteStream("output.txt.gz.enc");

//read -> compress -> encrypt -> write
readableStream.pipe(gzipStream).pipe(encryptStream).pipe(writableStream);

console.log("Streaming -> compressing -> writing data"); 