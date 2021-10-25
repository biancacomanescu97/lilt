function cosineSim(model_keypointsArray, camera_keypointsArray){
  var dotproduct=0;
  var mA=0;
  var mB=0;
  for (i = 0; i < model_keypointsArray.length; i++){
      dotproduct += (model_keypointsArray[i] * camera_keypointsArray[i]);
      mA += (model_keypointsArray[i] * model_keypointsArray[i]);
      mB += (camera_keypointsArray[i] * camera_keypointsArray[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = (dotproduct)/((mA)*(mB))
  return similarity;
}

function cosineDistance(poseVector1, poseVector2) {
  let similarity = cosineSim(poseVector1, poseVector2);
  let dist = 2 * (1 - similarity);
  return Math.sqrt(dist);
} 

/**34-float array of keypoints' positions*/
function positionArray(keypoints){
  var keypointArray = new Array();
    sortByKey(keypoints,'part');
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      keypointArray.push(keypoint.position.x, keypoint.position.y);
    }
    return keypointArray;
} 

/**Normalize the array using L2-Normalization*/
function L2normalization(array){
  var normalizedArray = new Array();
  var powArray = new Array();
  for(let i = 0; i < array.length; i++){
    powArray.push(Math.pow(array[i],2));
  }
  var sum = powArray.reduce((x, y) => x + y);
  var norm = Math.sqrt(sum);
  for(let i = 0; i < array.length; i++){
    normalizedArray.push(array[i]/norm);
  }
  return normalizedArray;
}

/**Normalize the array using L2-Normalization - TESTING */
function test(array){
  var powArray = new Array();
  for(let i = 0; i < array.length; i++){
    powArray.push(Math.pow(array[i],2));
  }
  var sum = powArray.reduce((x, y) => x + y);
  return sum;
}

/**Sort the array using any key*/
function sortByKey(array, key){
  return array.sort(function(a, b) {
    var x = a[key]; 
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

