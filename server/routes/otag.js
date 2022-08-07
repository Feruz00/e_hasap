const router = require('express').Router();
const {logged} = require('../middleware/authMiddleware')
const Otag = require('../models/Otag')
const NumberComp = require('../models/Number')
const Message = require('../models/Message')
// doretmek
router.post('/', logged, async (req, res) => {
    const { name,
        description,
        compNumber,
        dereje} = req.body;
    try{
        await Otag.create({
            name,
        description,
        compNumber,
        dereje,
        bellik: req.user._id
        } )
        return res.json()
    }
    catch (error){
        return res.status(500).send()
    }
});
// acitveleri almak
router.get( '/', logged, async (req, res)=>{
    try {
        const found = await Otag.find({ active: true }).sort('-start');
        return res.json(found)
    } catch (error) {
        return res.status(500).send()
    }
})
router.post('/all', logged, async (req,res)=>{
    try {
        const {start, finish,  name} = req.body;
        const found = await Otag.find({ $and: [
            {active: false},
            {start:{$gte:start}},
            {finish: {$lte: finish}},
            {name:  { $regex: `${name}`, $options: 'i' } }
        ] }).populate('bellik')
        return res.json(found)
    } catch (error) {
        console.error(error)
        return res.status(500).send()
    }
})
// upd
router.put( '/upd', logged, async (req, res)=>{
    try {
        const found = await Otag.findByIdAndUpdate(req.body.id, {$set: { active: false, finish: Date.now() }});
        return res.json()
    } catch (error) {
        return res.status(500).send()
    }
})

// comp san
router.get( '/laptop', logged, async (req, res)=>{
    try {
        const found = await NumberComp.findOne({ otag: 'feruz' });
        const comp = found.number;
        return res.json(comp)
    } catch (error) {
        console.error(error)
        return res.status(500).send()
    }
})

// messages
router.get('/messages', logged, async (req, res) => {
    
    if(req.user.role !== 'admin') return res.status(403).json({message: "You cannot get data"})
    try {
        
        const found = await Message.find({ unread: false });
        return res.json(found)

    } catch (error) {
        console.error(error)
        return res.status(500).send()
    }
});

// read message
router.put('/messages', logged, async (req,res)=>{
    if(req.user.role !== 'admin') return res.status(403).json({message: "You cannot get data"})
    try {
        
        await Message.updateMany({ unread: false }, { $set:{ unread: true}});
        return res.json()

    } catch (error) {
        console.error(error)
        return res.status(500).send()
    }
})

module.exports = router;