/* eslint-disable indent */
const BUCKET_NAME = 'rts-files';
const KEY = 'cs308-rts-af8045b0ad06.json';
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({ keyFilename: KEY });

var gc = {};


gc.uploadFile = async function (filepath) {
  // Uploads a local file to the bucket
  await storage.bucket(BUCKET_NAME).upload(filepath, {
    // eslint-disable-next-line indent
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${filepath} uploaded to ${BUCKET_NAME}.`);
};

gc.downloadFile = async function (srcFilename, destFilename) {
  const options = {
    destination: destFilename,
  };

  // Downloads the file
  await storage.bucket(BUCKET_NAME).file(srcFilename).download(options);

  console.log(
    `gs://${BUCKET_NAME}/${srcFilename} downloaded to ${destFilename}.`
  );
};

gc.getMetadata = async function (filename) {
  // Gets the metadata for the file
  const [metadata] = await storage
    .bucket(BUCKET_NAME)
    .file(filename)
    .getMetadata();

  console.log(`File: ${metadata.name}`);
  console.log(`Bucket: ${metadata.bucket}`);
  console.log(`Storage class: ${metadata.storageClass}`);
  console.log(`Self link: ${metadata.selfLink}`);
  console.log(`Media link (Download URL): ${metadata.mediaLink}`);
  console.log(`ID: ${metadata.id}`);
  console.log(`Size: ${metadata.size}`);
};

// get public url for file
gc.getPublicUrlForItem = (filename) => {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`
};

module.exports = gc;
