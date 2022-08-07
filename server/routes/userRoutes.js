const router = require('express').Router();
const passport = require('passport');
const {logged, notLogged} = require('../middleware/authMiddleware')
const User = require('../models/User')
const Message = require('../models/Message')
const NumberComp = require('../models/Number');
const upload = require('../controller/multer')


const Link = process.env.FRONTEND_URL + '/';
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser( function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/comp', logged, async (req,res)=>{
    try {
        const user = await NumberComp.findOne({otag: 'feruz'});
        if(!user){
            await NumberComp.create({otag: 'feruz'})
        }
        await NumberComp.findOneAndUpdate({ otag: 'feruz' }, {$set: { number: req.body.comp }})
        return res.json()
    } catch (error) {
        console.error(error)
        return res.status(500).json()
    }
})

router.get('/tap/:username', async (req, res) => {
    
    try {
        
        const {username} = req.params;
        const user = await User.findOne({ username: username });
        return res.json(user)
    } catch (error) {
        return res.status(500).json()
    }
});

// -------------------------
// Check if user logged in



router.get('/auth', async (req, res) => {
    if(req.isAuthenticated()){
        try {
            res.status(200).json(req.user);            
        } catch (error) {
            return res.status(500).send('Something wrong went!')    
        }
    }
    else{
        return res.status(200).json({
            isAuth: false
        });
    }
});

// register user
router.post('/register', async (req, res) => {
    await User.register( {
        username: req.body.username, 
        fullName: req.body.fullName
    }, req.body.password, async (err,user)=>{
       
        if(err){
            res.status(400).json(err);
        }
        else{
            return res.status(200).json();     
        }
    });
});

// ?
router.patch('/verify' , notLogged, async (req, res) => {

    try {
        const user = await User.findOne({_id: id, token: passwordResetToken, createToken: { $gt: Date.now() } });
        if(!user) return res.status(404).json({message: 'Token is invalid or has expired'})
        user.createToken = undefined;
        user.token = undefined;
        user.status = true;
        await user.save()
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json(error)
    }
});

// login 
router.get('/login_success', (req, res) => {
    return res.status(200).json(
        req.user
    );
});

router.get('/login_error', (req, res) => {
    return res.status(401).json({message:"Invalid email or password"}) 	
});

router.post("/login", passport.authenticate("local"
, { successRedirect: '/api/v1/users/login_success',
failureRedirect: '/api/v1/users/login_error' 
}
) , function (req, res) {

});

router.patch('/change', logged, async  (req, res) => {
    const {oldPassword, newPassword} = req.body;
    try {
        const user = await User.findById(req.user._id)
        await user.changePassword(oldPassword, newPassword, err=>{
            // console.error(err)
            if(err) {
                if(err.name === 'IncorrectPasswordError'){
                    res.status(400).json({ success: false, message: 'Incorrect password' }); // Return error
                }else {
                    res.status(400).json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                }
            }else {
             res.json({ success: true, message: 'Your password has been changed successfully' });
            }
        })
    } catch (error) {
        return res.status(500).json({message: 'Something wrong went!'})
    }
});

router.delete('/delete', logged, async (req, res) => {
    const id = req.user._id;
    req.logout();
    await User.findByIdAndDelete(id, (err)=>{
        if(err) return res.status(400).json(err);
        else return res.status(200).json();
    })
});


router.post('/picture',logged, upload.single('file') , async (req, res) => {
    try {
        const file = req.file.path;
        await User.updateOne({ _id: req.user._id, }, { $set: { photo: file } })
        return res.json()
    } catch (error) {
        return res.status(500).json(error);
    }
});

// logout
router.get('/logout',logged, (req, res) => {
    
    req.logout();
    res.status(200).json({success: true});
});

router.post('/message', notLogged, async (req,res)=>{
    try {
        await Message.create(req.body);
        return res.json()
    } catch (error) {
        return res.status(500).json()
    }
})

router.post('/update', logged, async (req,res)=>{
    try {
        await User.findByIdAndUpdate( req.user._id, {$set: req.body} );
        return res.json()
    } catch (error) {
        return res.status(500).json()
    }
})

router.get('/all', logged, async (req,res)=>{
    try {
        if(req.user.role !== 'admin'){
            return res.status(403).json({message: 'Foridden'})
        }
        const users = await User.find( { role: {$ne: 'admin'} } );
        return res.json(users)
    } catch (error) {
        console.error(error)
        return res.status(500).json()
    }
})
router.post('/forgot_confirm', notLogged, async (req, res) => {

    const {username, newPassword} = req.body;


    try {
       const found = await User.findOne( { username }  );
       if(!found) return res.status(404).json({message: "You must confirm new token again!"});

       await found.setPassword(newPassword, async function(err, user){
        if(!err) await user.save();
       } );
       await found.save()
       return res.status(200).json({message:"Successfully updated!"});
   } catch (error) {
       return res.status(500).json({message: "Something was happy. Try again!"});
   }
});

module.exports = router;