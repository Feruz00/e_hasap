require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const socketio = require('socket.io');
const path = require('path')
const http = require('http');


const app = express();

mongoose.connect(
process.env.MONGO_URL
    , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const User = require('./models/User');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave: false
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/users',require('./routes/userRoutes'));
app.use('/api/v1/otag',require('./routes/otag'));

// app.use('/api/v1/friends', require('./routes/friendRoutes') );
// app.use('/api/v1/conversations', require('./routes/conversationRoutes'));
// app.use('/api/v1/posts/', require('./routes/postRoutes') )
// app.use('/api/v1/notifications/', require('./routes/notificationRoutes') )

const server = http.createServer(app);

app.post('/', async (req, res) => {
    if(!req.isAuthenticated()) return res.status(403).json({ message: "Forbidden" });
    const {tapmaly} = req.body;

    try {
        const found = await User.find( {$and: [ { _id: { $not: {$eq: req.user.id} } }, 
            { $or:[ { username: { $regex: `${tapmaly}`, $options: 'i' }},
                    { firstName: { $regex: `${tapmaly}`, $options: 'i' }},
                    { lastName: { $regex: `${tapmaly}`, $options: 'i' }} 
        ] } ]  }   );
        
        return res.status(200).json(found);
    } catch (error) {
        return res.status(500).json({message: "Sorry somenthing went wrong!"});
    }

});
app.post('/get', async (req, res) => {
    const {username} = req.body;
    try {
        const found = await User.findOne({username: username});
        if(!found) return res.status(404).json({message: "Not Found"})
        return res.status(200).json(found);
    } catch (error) {
        return res.status(500).json(error)
    }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, ()=>{
    console.log(`Server started on ${PORT}`);
});