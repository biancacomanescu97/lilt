var camera_video = document.getElementById('camera-video');
var model_video = document.getElementById('model-video');

async function compare(){
    var fps = 50;
    var interval = 100000 / fps;

    const flipHorizontal = true;
    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const net = await posenet.load();

    var model_keypointsArray = [];
    var camera_keypointsArray = [];
    var similarity_array = [];
        
    setTimeout(async function(){
        requestAnimationFrame(compare);
        const camera_pose = await net.estimateSinglePose(camera_video, imageScaleFactor, flipHorizontal, outputStride);  
        if (camera_pose.score >= 0.1) {
            camera_keypointsArray = (positionArray(camera_pose.keypoints));
            console.log(camera_keypointsArray);
        }
        const model_pose = await net.estimateSinglePose(model_video, imageScaleFactor, flipHorizontal, outputStride);
        if (model_pose.score >= 0.1){
            model_keypointsArray = (positionArray(model_pose.keypoints));
            console.log(model_keypointsArray);
        }         
        var similarity = 1-cosineDistance(camera_keypointsArray, model_keypointsArray);
        var sim = Math.floor(similarity*100);
        console.log("Similarity: "+sim+"%");
        
    }, interval); 
    $(model_video).on('pause', function (e){
        console.log("pause");
    });
}
compare();