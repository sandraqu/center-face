const { basename, join } = require('path');
const { promises: fs } = require('fs');
const faceapi = require('@vladmandic/face-api');
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');

faceapi.env.monkeyPatch({ Canvas, createCanvas, Image, ImageData });

const downloadImage = async (url, folderPath) => {
    const blob = await (await fetch(url)).blob();
    const buffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(buffer)
    const filename = join(folderPath, new URL(url).pathname.split('/').pop());
    await fs.writeFile(filename, uint8Array);
    return filename;
};

const findFaceLocation = async (filePath) => {
  const image = await loadImage(filePath);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(join(__dirname, './face-api.js/weights'));
  const detections = await faceapi
    .detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 }));
  if (!detections) return null;
  const { box, imageDims } = detections;
  return {
    x: box._x,
    y: box._y,
    width: box._width,
    height: box._height,
    imageDimensions: { width: imageDims._width, height: imageDims._height },
  };
};

const saveImageLocally = async (url) => {
  const filePath = await downloadImage(url, 'src/assets/images');
  const faceData = await findFaceLocation(filePath);
  if (faceData) faceData.name = new URL(url).pathname.split('/').pop();
  return faceData;
};

(async () => {
  const imageUris = [
    'https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg',
    'https://cdn.vox-cdn.com/uploads/chorus_image/image/71467431/Team0.0.jpg',
    'https://static.vecteezy.com/system/resources/previews/008/347/409/large_2x/doodle-faces-on-color-spots-hand-drawn-people-faces-icons-with-emotions-vector.jpg',
    // 'https://www.second-sense.org/wp-content/uploads/2022/02/Face-Blindness-Group-Image-2048x1536.jpg'
  ];
  const facesData = [];
  for (const imageUri of imageUris) {
    const faceData = await saveImageLocally(imageUri);
    if (faceData) facesData.push(faceData);
  }
  await fs.writeFile('src/facesData.js', `module.exports = ${JSON.stringify(facesData, null, 2)}`);
})();
