const router = require('express').Router();
const User = require('../models/user');
const {authenticateToken} = require('./userAuth');

router.put("/add-book-to-favourite" , authenticateToken , async (req,res) => {
    try{
          const {bookid , id } = req.headers;
          const userData = await User.findById(id);
          const isbookfavourite = userData.favourites.includes(bookid);
          if(isbookfavourite){
            return res.status(200).json({
                message: "Book is already in faourites"
            });
          }
          await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
          return res.status(200).json({message:"Book added to favourites"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
});
router.put("/remove-book-from-favourite", authenticateToken, async (req, res) => {
  try {
    const id = req.headers.id;
    const bookid = req.headers.bookid;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove bookid from favourites array
    user.favourites.pull(bookid);
    await user.save();

    return res.status(200).json({ message: "Book removed from favourites" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});


router.get('/get-favourite-books',authenticateToken,async(req,res) => {

    try{
                const id = req.headers.id;                  //don't know how populate work
                const userdata = await User.findById(id).populate("favourites");
                 if (!userdata) {
                  return res.status(404).json({ message: "User not found" });
    }
                const favouriteBooks = userdata.favourites;
                return res.json({
                    status:"Success",
                    data:favouriteBooks,
                })
    }catch(err){
                   res.status(500).json({message:"Internal server error",err});
                   console.log(err);
            

    }
})
module.exports = router;