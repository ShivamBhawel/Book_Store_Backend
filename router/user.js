const router = require("express").Router();
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
    const {authenticateToken} = require('./userAuth');
// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const data = req.body;

        // Check name length
        if (data.username.length < 3) {
            return res.status(400).json({ message: "Username should be greater than 3 characters" });
        }

        // Check if username exists
        const existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email exists
        const existingEmail = await User.findOne({ contect: data.contect });
        if (existingEmail) {
            return res.status(400).json({ message: "phone number already registered" });
        }

        // Check password
        if (data.password.length <= 5) {
            return res.status(400).json({ message: "Password should be greater than 5 characters" });
        }
        

        //hash password 
        const salt = await bcryptjs.genSalt(10);
        const haspass = await bcryptjs.hash(data.password , salt);
        // Save user
        data.password = haspass;
        const newUser = new User(data);
        const response = await newUser.save();

        res.status(200).json({ message: "Sign-up successful", user: response });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


//let's login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existuser = await User.findOne({ username });

        if (!existuser) {
            return res.status(400).json({ message: "invalid Username or password" });
        }

        const isMatch = await bcryptjs.compare(password, existuser.password);

        if (isMatch) {
            const paylod = [
                {name:existuser.username},
                {role:existuser.role},
            ];
            const token = jwt.sign({paylod},"1234",{expiresIn:"10d",})
            res.status(200).json({ 
                id:existuser.id,
                role:existuser.role,
                token:token,
             });
        } else {
            res.status(400).json({ message: "invalid Username or password" });
        }
    } catch (err) {
        
        res.status(500).json({ message: "internal server error" });
    }
});

//get user information 
router.get('/get-user-information',authenticateToken , async (req,res) => {
    try{

        const {id} = req.headers;
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);
    }catch(error){

         res.status(500).json({message:"Internal server error"});
    }
});


//update address 
router.put('/update-address' , authenticateToken , async (req,res) => {
    try{
        const {id} = req.headers;
        const {address} = req.body;
         await User.findByIdAndUpdate(id,{address:address});
         return res.status(200).json({message:"address updated successfully"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
})




module.exports = router;
