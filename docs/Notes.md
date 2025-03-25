# Notes

## Resources
- https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/
    - Links to Authentication Setup Tool (Auth0)
- https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/ (Simple Video chat demo)


## WebRTC and Socket Process

1. First user joins room.
2. Second user joins room.
    - Event is triggered on server and received by First user.
    - First user creates PeerConnection object
        - PeerConnection has "icecandidate" eventlistener set
    - First user sets up local streams
3. First user makes offer (call) to Second user.
4. Second user recieves "call-made" event.
    - Setups PeerConnection and local streams
5. Second user emits "make-answer"
6. First user sets Remote Description with answer.
7. Importantly, ICE candidates are shared during this process (via events)

## Auth

- Method: Local
- Login/Logout setup

## Sessions



## TODO
- [ ] Review TypeScript
    - [ ] Convert app.js and db.js to typescript
- [ ] Set up testing
    - Tests module
- [ ] Review (and improve) Sessions (Create a branch!!!)
- [ ] Add login support via Google (and Twitter?)

### Future
- [ ] Learn and apply React
- [ ] Improve streaming (Janus?)
- [ ] Security
- [ ] Create official database

