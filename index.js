// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
    projectId: "teak-territory-340316",
    keyFilename:"./Assets/teak-territory-340316-7c71b8b6f3f9.json"
});


// Makes an authenticated API request.
async function listBuckets() {
  try {
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}

listBuckets().then(() =>{

    // create cors access
    
    
    configureBucketCors().catch(console.error);


    //getBucketMetadata().catch(console.error);
});

//#region Check All the CORS

async function getBucketMetadata() {
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // The ID of your GCS bucket
    // const bucketName = 'your-unique-bucket-name';
  
    // Get Bucket Metadata
    const [metadata] = await storage.bucket(bucketName).getMetadata();
  
    for (const [key, value] of Object.entries(metadata)) {
      console.log(`${key}: ${JSON.stringify(value)}`);
    }
  }

//#endregion


//#region Create CORS access
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
 const bucketName = 'highstreet_server_test';

// The origin for this CORS config to allow requests from
const origin = 'https://v6p9d9t4.ssl.hwcdn.net';

// The response header to share across origins
const responseHeader = 'application/x-www-form-urlencoded';

// The maximum amount of time the browser can make requests before it must
// repeat preflighted requests
const maxAgeSeconds = 3600;

// The name of the method
// See the HttpMethod documentation for other HTTP methods available:
// https://cloud.google.com/appengine/docs/standard/java/javadoc/com/google/appengine/api/urlfetch/HTTPMethod
const method = 'GET';

async function configureBucketCors() {
  await storage.bucket(bucketName).setCorsConfiguration([
    {
      maxAgeSeconds,
      method: [method],
      origin: [origin],
      responseHeader: [responseHeader],
    },
  ]);

  console.log(`Bucket ${bucketName} was updated with a CORS config
      to allow ${method} requests from ${origin} sharing 
      ${responseHeader} responses across origins`);
}

//#endregion