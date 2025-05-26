let video;
let facemesh, handpose;
let facePredictions = [];
let handPredictions = [];
let gesture = "";

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, () => {});
  facemesh.on('predict', results => {
    facePredictions = results;
  });

  handpose = ml5.handpose(video, () => {});
  handpose.on('predict', results => {
    handPredictions = results;
  });
}

function draw() {
  image(video, 0, 0, width, height);

  // 臉部偵測，鼻子處畫圓
  if (facePredictions.length > 0) {
    const keypoints = facePredictions[0].scaledMesh;
    // 通常第4點是鼻尖
    const [x, y] = keypoints[4];
    noFill();
    stroke(0, 0, 255);
    strokeWeight(4);
    ellipse(x, y, 50, 50);
  }

  // 手勢辨識
  if (handPredictions.length > 0) {
    const landmarks = handPredictions[0].landmarks;
    gesture = recognizeGesture(landmarks);

    fill(0, 255, 0);
    noStroke();
    textSize(32);
    text(gesture, 20, 40);
  }
}

// 簡單判斷剪刀石頭布
function recognizeGesture(landmarks) {
  // 指尖座標
  const tips = [8, 12, 16, 20].map(i => landmarks[i][1]);
  const base = landmarks[0][1];
  let extended = tips.map(y => y < base - 40);

  if (extended[0] && extended[1] && !extended[2] && !extended[3]) return "剪刀";
  if (extended.every(e => e)) return "布";
  if (extended.every(e => !e)) return "石頭";
  return "";
}
