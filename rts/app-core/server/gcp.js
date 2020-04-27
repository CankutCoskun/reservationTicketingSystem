
//REF:https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876

const bucketName = 'rts-event-images';
const filename = 'photo.jpg';
const key = 'cs308-rts-af8045b0ad06.json';
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({keyFilename: key});

gc = {}


async function uploadFile() {
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filename, {
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

  console.log(`${filename} uploaded to ${bucketName}.`);
}

//uploadFile().catch(console.error);

// get public url for file
var getPublicThumbnailUrlForItem = file_name => {
  return `https://storage.googleapis.com/${bucketName}/${file_name}`
}


const srcFilename = 'photo.jpg';
const destFilename = './files/photo.jpg';

async function downloadFile() {
  const options = {
    destination: destFilename,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(srcFilename).download(options);

  console.log(
    `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
  );
}

async function getMetadata() {
  // Gets the metadata for the file
  const [metadata] = await storage
    .bucket(bucketName)
    .file(filename)
    .getMetadata();

  console.log(`File: ${metadata.name}`);
  console.log(`Bucket: ${metadata.bucket}`);
  console.log(`Storage class: ${metadata.storageClass}`);
  console.log(`Self link: ${metadata.selfLink}`);
  console.log(`ID: ${metadata.id}`);
  console.log(`Size: ${metadata.size}`);
  console.log(`Metadata: ${metadata.metadata}`);
}

getMetadata().catch(console.error);