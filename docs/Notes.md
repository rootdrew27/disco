# Notes

## Resources
- https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/
    - Links to Authentication Setup Tool (Auth0)
- https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/ (Simple Video chat demo)


## Express

- "\[Express\] is essentially a series of middleware function calls."

### Routes

- Routes have two components: the path and the handler(s).
- Parameters may be specified in route names, e.g. `'home/:userid'` specifies userid as a parameter.
- Request parameters are accessible via the `req.params` dictionary.


### Middleware

- **Refs**: [Express Docs](https://expressjs.com/en/guide/using-middleware.html)

- Functions that have access to the request `req`, the response `res`, and the `next` middleware function.
- Middleware functions **must** call the `next` middleware function or end the request-response cycle.


#### Application Level
- Middleware can be bound to a route with `app.use('/route/here', midWareFunc)`, or to all routes with `app.use(midWareFunc)`.

#### Route Level

- Middleware may also be bound at the router level with `router.use()` in the same manner as the application level.
- Middlware Examples: Application Level, Router Level, Error Handling, Builtins, Third-party. 
- A router's middleware may be skipped with `next('route)`: control is passed back out of the router instance.

#### Error Handling

- These middleware **always** have (and are identified by) 4 arguments: e.g. `const myErrorHandler(err, req, res, next) { next(err); }`.
- If you pass anything to the next() function (except the string 'route'), Express regards the current request as being an error and will skip any remaining non-error handling routing and middleware functions.
- Note that the default error handler can get triggered if you call next() with an error in your code more than once, even if custom error handling middleware is in place.

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




