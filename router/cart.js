const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

router.put("/add-to-cart" , authenticateToken , async (req,res) => {
    try{
           const {bookid ,  id}  = req.headers;
           const userdata = await User.findById(id);
           const isBookinCart = userdata.cart.includes(bookid);
           if(isBookinCart){
            return res.json({
                status:"success",
                message:"Book is already in cart",
            });
           
           }
            await User.findByIdAndUpdate(id,{
                $push:{cart:bookid},
            });
            return res.json({
                status:"Success",
                message:"Book added to cart",
            })
            
    }catch(err){
  
         res.status(500).json({message:"Internal server error!"});
    }
});

router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;
        const id = req.headers.id;  // assuming req.user is set by the token middleware

        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid },
        });

        return res.json({
            status: "Success",
            message: "Book removed from cart",
        });

    } catch (err) {
        res.status(500).json({ message: "Internal server error!", err });
    }
});

router.get('/get-user-cart',authenticateToken,async(req,res) => {

    try{
                const id = req.headers.id;                  //don't know how populate work
                const userdata = await User.findById(id).populate("cart");
                const cart = userdata.cart.reverse();
                return res.json({
                    status:"Success",
                    data:cart,
                })
    }catch(err){
                   res.status(500).json({message:"Internal server error",err});

    }
})

module.exports = router;