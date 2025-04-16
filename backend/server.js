const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const details_schema = require("./models/schema");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

mongoose.connect("mongodb://localhost:27017/all_details", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(8000, () => {
      console.log("Server running on port 8000");
    });
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });


app.post('/getTransactionHistory', async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      const newTransaction = new details_schema({
        Amount: req.body.Amount,
        Description: req.body.Description,
        date: req.body.date,
        category: req.body.category 
      });
      const savedTransaction = await newTransaction.save();
      console.log("Saved Transaction:", savedTransaction);
      return res.json({ message: "Transaction added successfully.", savedTransaction });
    } catch (err) {
      console.error("Error saving to DB:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
app.get("/getAllTransaction", async (req, res) => {
    try {
        const transactions = await details_schema.find({});
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

app.post('/showData', async (req, res) => {
  try {
    const info = await details_schema.find({});
    res.json(info);
  } catch (err) {
    console.log("Error fetching");
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/deleteTransaction/:id', async (req, res) => {
  const transactionId = req.params.id;
  try {
    const deletedTransaction = await details_schema.findByIdAndDelete(transactionId);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully', deletedTransaction });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updateTransaction/:id', async (req, res) => {
    const transactionId = req.params.id;
    try {
      const updatedTransaction = await details_schema.findByIdAndUpdate(
        transactionId,
        {
          Amount: req.body.Amount,
          Description: req.body.Description,
          date: req.body.date,
          category: req.body.category 
        },
        { new: true }
      );
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({ message: 'Transaction updated successfully', updatedTransaction });
    } catch (err) {
      console.error('Error updating transaction:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });