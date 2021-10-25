/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licnses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// import dat from 'dat.gui';
// import Stats from 'stats.js';
// import * as posenet from '../src';

// import { drawKeypoints, drawSkeleton } from './demo_util';

const canvasSize = 400;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}
/**
 * Feeds an image to posenet to estimate poses - this is where the magic happens.
 * This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime_camera(camera_video, net) {
  const canvas = document.getElementById('camera-output');
  const ctx = canvas.getContext('2d');
  const flipHorizontal = true; // since images are being fed from a webcam

  showVideo =  true;
  showSkeleton = true;
  showPoints = true;

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  async function poseDetectionFrame_camera() {

  // Scale an image down to a certain factor. Too large of an image will slow down
  // the GPU
    const imageScaleFactor = 0.5;
    const outputStride = 16;
    let poses = [];
    const minPoseConfidence = 0.1;
    const minPartConfidence = 0.5;
    const pose = await net.estimateSinglePose(camera_video, imageScaleFactor, flipHorizontal, outputStride);
    poses.push(pose);
    
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvasSize, 0);
      ctx.drawImage(camera_video, 0, 0, canvasSize, canvasSize);
      ctx.restore();
    }

    const scale = canvasSize / camera_video.width;

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
          if (showPoints) {
            drawKeypoints(keypoints, minPartConfidence, ctx, scale);
          }
          if (showSkeleton) {
            drawSkeleton(keypoints, minPartConfidence, ctx, scale);
          }
      }
    });
    requestAnimationFrame(poseDetectionFrame_camera);
  }
  poseDetectionFrame_camera();
}

function detectPoseInRealTime_model(model_video, net) {
  const canvas = document.getElementById('model-output');
  const ctx = canvas.getContext('2d');
  const flipHorizontal = false;

  showVideo =  true;
  showSkeleton = true;
  showPoints = true;

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  async function poseDetectionFrame_model() {

    // Scale an image down to a certain factor. Too large of an image will slow down
    // the GPU
    const imageScaleFactor = 0.5;
    const outputStride = 16;
    let poses = [];
    const minPoseConfidence = 0.1;
    const minPartConfidence = 0.5;
    const pose = await net.estimateSinglePose(model_video, imageScaleFactor, flipHorizontal, outputStride);
    poses.push(pose);

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (showVideo) {
      ctx.save();
      ctx.translate(-canvasSize, 0);
      ctx.drawImage(model_video, 0, 0, canvasSize, canvasSize);
      ctx.restore();
    }

    const scale = canvasSize / model_video.width;

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
          if (showPoints) {
            drawKeypoints(keypoints, minPartConfidence, ctx, scale);
          }
          if (showSkeleton) {
            drawSkeleton(keypoints, minPartConfidence, ctx, scale);
          }
      }
    });
    requestAnimationFrame(poseDetectionFrame_model);
  }
  poseDetectionFrame_model();
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading available
 * camera devices, and setting off the detectPoseInRealTime function.
 */

async function bindPage() {
  // Load the PoseNet model weights for version 1.01
  const net = await posenet.load();

  document.getElementById('model').style.display = 'block';
  document.getElementById('camera').style.display = 'block';

  let model_video;
  let camera_video;

  try {
    model_video = await load_modelVideo();
    camera_video = await load_cameraVideo();
  } catch (e) {
    throw e;
  }
  detectPoseInRealTime_model(model_video, net);

  detectPoseInRealTime_camera(camera_video, net);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

bindPage();

