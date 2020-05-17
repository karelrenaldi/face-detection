const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext("2d");

const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext("2d");

const faceDetector = new FaceDetector();

const SIZE = 15;
const SCALE = 1.2;

async function populateVideo(){
  const stream  = await navigator.mediaDevices.getUserMedia({
    video: {width: 700, height:500},
  });
  video.srcObject = stream;
  await video.play();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect(){
  const faces = await faceDetector.detect(video);
  console.log(faces.length)
  faces.forEach(drawFace);
  faces.forEach(censor);
  requestAnimationFrame(detect);
}

function drawFace(face){
  const { width, height, top, left } = face.boundingBox;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = '#ffc600';
  ctx.lineWidth = 2;
  ctx.strokeRect(left,top,width*SCALE,height*SCALE);
}

function censor({boundingBox : face}){
  faceCtx.imageSmoothingEnabled = false;
  faceCtx.clearRect(0,0,faceCanvas.width,faceCanvas.height);
  faceCtx.drawImage(
    // 5 source arguments
    video,// the source come from
    face.x,
    face.y,
    face.width,
    face.height,
    //4 draw args
    face.x,
    face.y,
    SIZE,
    SIZE,
  )
  const width = face.width * SCALE;
  const height = face.height * SCALE;
  faceCtx.drawImage(
    //source
    faceCanvas,
    face.x,
    face.y,
    SIZE,
    SIZE,
    //draw
    face.x,
    face.y,
    width,
    height,
  )
}

populateVideo().then(detect);