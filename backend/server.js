const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();

require('./config/database');
const express = require('express');

// Auth
const verifyToken = require('./middleware/verify-token');

// Controllers
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profile.js');
const adminRouter = require('./controllers/admin');
const MLineFashionRouter = require('./controllers/MLineFashion.js');
const contactUsController = require('./controllers/contactUs');
const favoritesRouter = require('./controllers/favorites.js');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profile', verifyToken, profilesRouter);
app.use("/contactUs", contactUsController);
app.use('/MLineFashion', MLineFashionRouter);
app.use('/admin', adminRouter);
app.use('/favorites', favoritesRouter);



app.listen(PORT, () => {
  console.log('The express app is ready!');
});
