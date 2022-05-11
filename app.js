import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import sessions from 'express-session'

import msIdExpress from 'microsoft-identity-express'

const appSettings = {
	appCredentials: {
    	clientId:  "93ccd193-7da4-483e-955c-5946385f2c2b",
    	tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret:  "lo28Q~W1gVp261rOm.-joXC_fng~Xmzqco7LKccg"
	},
	authRoutes: {
    	redirect: "https://www.nooneknowswhattheyredoing.me/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
    	error: "/error", // the wrapper will redirect to this route in case of any error.
    	unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
	}
};

import models from './models.js'
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
//import apiRouter from './routes/api/v1/apiv1.js'
//import apiV2Router from './routes/api/v2/apiv2.js'
import apiV3Router from './routes/api/v3/apiv3.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// has to be after cookie because sessions are created after a cookie is created (cookie is what handles/delivers session key)
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "deeznutssdkjfh938ry39374we8ur2h083ouhfdsouf",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	// makes a models step
	req.models = models
	next()
  })

app.get('/signin',
	msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
	msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', async function (req, res) {
  res.send("There was a server error")
})

app.get('/unauthorized', async function (req, res) {
  res.send("Permission denied")
})

app.use('/', indexRouter);
app.use('/users', usersRouter)
//app.use('/api/v1', apiRouter)
//app.use('/api/v2', apiV2Router)
app.use('/api/v3', apiV3Router)

export default app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
