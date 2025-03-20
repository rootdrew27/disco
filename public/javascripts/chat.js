navigator.getUserMedia(
    {video: true, audio: true},
    stream => {
        const localVideo = document.getElementById('localVideo');
        if (localVideo){
            localVideo.srcObject = stream;
        }
    },
    error => {
        console.warn(error.message);
    }
)

const socket = io();


