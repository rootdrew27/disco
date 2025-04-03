const URL = 'http://localhost:3000';
var peers = {};
const iceConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
const constraints = { video: true, audio: true };
const socket = io(URL, { autoConnect: false });

function setupPeerConnection(sid) {
  let pc = new RTCPeerConnection(iceConfig);
  peers[sid] = pc;
  pc.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', { to: sid, candidate: event.candidate });
    }
  });
  pc.addEventListener('signalingstatechange', () => {
    console.log('PeerConn signal state changed to: ' + pc.signalingState);
  });
  pc.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById('remoteVideo');
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  };
  return pc;
}

window.onload = async () => {
  const localStream = await setupLocal(constraints);

  // Handle join-room event
  socket.on('user-joined-room', async (sid) => {
    console.log('Socket ' + sid + ' has joined room');
    let peerConnection = setupPeerConnection(sid);
    setUpStreams(peerConnection, localStream);
    await makeOffer(sid);
  });

  // Handle call-made event
  socket.on('call-made', async (data) => {
    let sid = data.from;
    let offer = data.offer;
    let pc = setupPeerConnection(sid);
    setUpStreams(pc, localStream);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit('make-answer', { to: sid, answer: answer });
  });

  // Handle answer-made event
  socket.on('answer-made', async (data) => {
    let answer = data.answer;
    let sid = data.from;
    let pc = peers[sid];
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', async (data) => {
    const pc = peers[data.from];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  });

  // Catch all incoming events for Debugging Purposes
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
  // Catch all outgoing events for Debugging Purposes
  socket.onAnyOutgoing((eventName, ...args) => {
    console.log('Outgoing', eventName, args);
  });
  socket.connect();
};

async function setupLocal(constraints) {
  let localStream = await navigator.mediaDevices.getUserMedia(constraints);
  const localVideoBox = document.querySelector('#localVideo');
  localVideoBox.srcObject = localStream;
  return localStream;
}

async function makeOffer(sid) {
  let pc = peers[sid];
  const offer = await pc.createOffer();
  await pc.setLocalDescription(new RTCSessionDescription(offer));
  socket.emit('offer', { to: sid, offer: offer });
}

function setUpStreams(pc, localStream) {
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
}

// if (sessionId) {
//   console.log("Session ID:", sessionId);
//   const sessionLink = `${window.location.origin}/disco/${sessionId}`;
//   const sessionLinkElement = document.getElementById("sessionLink");
//   if (sessionLinkElement) {
//     sessionLinkElement.textContent = `Session Link: ${sessionLink}`;
//     sessionLinkElement.style.display = "block";
//   }
// }
