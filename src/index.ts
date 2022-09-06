import AWS, { S3 } from "aws-sdk";
require('dotenv').config();

const Vimeo = require("vimeo").Vimeo;
const http = require("https");
const fs = require("fs");
const download = require('download');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_CLIENT_ACCESS_TOKEN
);

async function uploadToS3(fileName: string) {
  const fileContent = fs.readFileSync(fileName);
  const putObject: S3.Types.PutObjectRequest ={
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME ?? 'whatever default',
    Key: 'webinar/' + fileName,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: "video/mp4"
  }
  console.log('fileObject', putObject)
  await new Promise((resolve, reject) => {
    s3.upload(putObject , async (err: any, data: any) => {
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

const getVideo = async (videoId: string) => {
  console.log("Download an video")
  await new Promise((rs, rj) => {
    client.request(
      {
        path: "/me/videos/" + videoId,
        method: "GET",
      },
      async function (error: any, body: any, _statusCode: any, _headers: any) {
        let url = body.download.reduce((max: any, obj: any) => (max.width > obj.width) ? max : obj).link;
        (async () => {
          let targetFile = body.name + '.mp4'
          download(url).pipe(fs.createWriteStream(targetFile).on("finish", async() => {
            await uploadToS3(targetFile)
            console.log("Download complete")
          }));
        })();
      }
    );
  })
}

const getVideos = async (url: string) => {
  console.log("Download multiple video")
  await new Promise((rs, rj) => {
    client.request(
      {
        path: url,
        method: "GET",
      },
      async function (error: any, body: any, _statusCode: any, _headers: any) {
        (async () => {
          let paging = body.paging
          let item = body.data[0]
          if (item.download.length > 0) {
            let url = item.download.reduce((max: any, obj: any) => (max.width > obj.width) ? max : obj).link;
            let targetFile = item.name + '.mp4'
            download(url).pipe(fs.createWriteStream(targetFile).on("finish", async() => {
              await uploadToS3(targetFile)
              if (paging.next !== null) {
                console.log(paging.next)
                await getVideos(paging.next)
              } else {
                console.log("download complete")
              }
            }));
          } else {
            if (paging.next !== null) await getVideos(paging.next)
          }
        })();
      }
    );
  })
}

const handleVideo = async () => {
  if (process.env.VIMEO_ID) {
    await getVideo(process.env.VIMEO_ID)
  } else {
    await getVideos("/me/videos?&page=1&per_page=1")
  }
}

handleVideo()
