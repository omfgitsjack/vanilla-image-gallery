import "babel-polyfill";

import express from 'express';
let app = express();

import bodyParser from 'body-parser';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'));

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import session from 'express-session';
app.use(session({
    secret: 'keyboard cat',
    cookie: { secure: true, sameSite: true },
    resave: false,
    saveUninitialized: true,
}));

import multer from 'multer';
let upload = multer({ dest: 'uploads/' });

import expressValidator from 'express-validator';
app.use(expressValidator({
    customValidators: {
        fail: value => false
    }
}));

// Routers enable a much cleaner way of defining nested routes
let authRouter = express.Router({ mergeParams:true }),
    userRouter = express.Router({ mergeParams:true }),
    galleryRouter = express.Router({ mergeParams:true }),
    imageRouter = express.Router({ mergeParams: true }),
    messageRouter = express.Router({ mergeParams: true });

let requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(403).json({ success: false, message: "User must be logged in." })
    }
}

// Root Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/images', requireAuth, imageRouter);

import * as AuthController from './server/AuthController';
authRouter.get('/signout', requireAuth, AuthController.signout);
authRouter.post('/signin', AuthController.signinValidator, AuthController.signin);

import * as UserController from './server/UserController';
userRouter.post('/', AuthController.signinValidator, UserController.create);
userRouter.get('/', requireAuth, UserController.readAll);

import * as ImageController from './server/ImageController';
imageRouter.post('/', upload.single('imageFile'), ImageController.createValidator, ImageController.create);
imageRouter.get('/:imageId', ImageController.read);
imageRouter.get('/:imageId/picture', ImageController.readPicture);
imageRouter.delete('/:imageId', ImageController.remove);
imageRouter.use('/:imageId/messages', messageRouter); // reroute all message specific calls to message router

import * as MessageController from './server/MessageController';
messageRouter.post('/', MessageController.createValidator, MessageController.create);
messageRouter.get('/', MessageController.get);
messageRouter.delete('/:messageId', MessageController.remove);

let fs = require('fs')
let privateKey = fs.readFileSync('server.key');
let certificate = fs.readFileSync('server.crt');
let config = {
    key: privateKey,
    cert: certificate
};

let https = require("https")
https.createServer(config, app).listen(3000, function () {
    console.log('HTTPS on port 3000');
});