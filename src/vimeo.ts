/** source/controllers/posts.ts */
import AWS, { S3 } from "aws-sdk";
require('dotenv').config();

let Vimeo = require("vimeo").Vimeo;
let http = require("https");
let fs = require("fs");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


async function downloadFile(url: string, targetFile: string) {
  return await new Promise((resolve, reject) => {
    http
      .get(url, (response: any) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadFile(response.headers.location, targetFile);
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(targetFile).on("finish", async () => {
          await uploadToS3(targetFile)
        });

        response.pipe(fileWriter);
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
}

async function uploadToS3(fileName: string) {
  let S3 = require('aws-sdk/clients/s3');
  const fileContent = fs.readFileSync(fileName);
  const putObject: S3.Types.PutObjectRequest ={
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME ?? 'whatever default',
    Key: 'webinar/' + fileName,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: "video/mp4"
  }
  console.log('fileObject', putObject)
  
  return await new Promise((resolve, reject) => {
    s3.upload(putObject , (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
      fs.rmSync(fileName, {
        force: true,
      });
    });
  });
}

// getting all posts
async function getPosts (url: String) {
  let client = new Vimeo(
    process.env.VIMEO_CLIENT_ID,
    process.env.VIMEO_CLIENT_SECRET,
    process.env.VIMEO_CLIENT_ACCESS_TOKEN
  );
  await new Promise((rs, rj) => {
    client.request(
      {
        path: url,
        method: "GET",
      },
      async function (error: any, body: any, _statusCode: any, _headers: any) {
        if (error) {
          rj(error);
        } else {
          let paging = body.paging
          if (paging.next != null) {
            body.data.forEach(async (val: any) => {
              let download = val.download.find((item: any) => item.rendition === '1080p');
              if(download) {
                await downloadFile(download.link, val.name + ".mp4")
              }
            })
            return
            // if (body.page == 3) {
            //   return
            // }
            // await getPosts(paging.next)
          } else{
            console.log('Finished');
          }
          
        }
      }
    );
  });
};

const getVideos = async () => {
  await getPosts("/me/videos?&page=1&per_page=5")
}

getVideos()