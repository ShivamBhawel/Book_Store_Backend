const router = require("express").Router();
const Book = require('../models/book');
const User = require("../models/user");
const {authenticateToken} = require('./userAuth');

router.post('/add-book' , authenticateToken ,async (req,res) => {

    try{
         const {id} = req.headers;
         const user = await User.findById(id);
         if(user.role != "admin"){
            res.status(400).json({message:"Only Admin can add book!"});
         }
         const book = new Book(req.body);
         await book.save();
         res.status(200).json({massage:"Book added successfully"});
    }catch(err){
   res.status(500).json({message:"Internal server Error!" , err});
    } 
});


//update book
router.put('/update-book', authenticateToken, async (req, res) => {
  try {
    const bookid = req.headers.bookid; 
    const data = req.body;

    await Book.findByIdAndUpdate(bookid, data); 
    
    res.status(200).json({ message: "Book Updated successfully" });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Internal server Error!" });
  }
});


//delete book
router.delete('/delete-book', authenticateToken, async (req, res) => {
  try {
    const bookid = req.headers.bookid; 
    
    await Book.findByIdAndDelete(bookid); 
    
    res.status(200).json({ message: "Book Delete successfully" });
  } catch (err) {
   
    res.status(500).json({ message: "Internal server Error!" });
  }
});


//get all book 
router.get('/get-all-books',async (req,res) => {
    try{
         const books = await Book.find().sort({createdAt:-1});
         return res.json(
            {
                status:"Success",
                data:books,
            }
         );
    }catch(err){
       res.status(500).json({ message: "Internal server Error!" });
    }
});

//get recent added books limit 4
router.get("/get-recent-books",async (req,res) => {
  try{
      const books = await Book.find().sort({crtedAt:-1}).limit(4);
      return res.json({
        status:"Success",
        data:books,
      });
  }catch(err){

      return res.status(500).json({
        message:"server Error !"
      });
  }
});


//GET BOOK BY ID 
router.get('/get-book-by-id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({
      status: "Success",
      data: book
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server Error!" });
  }
});

module.exports = router;

