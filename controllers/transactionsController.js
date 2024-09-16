// controllers/transactionController.js
const Transaction = require('../models/transactionsModel');
const Customer = require('../models/customerModel');

// Create a new transaction
exports.createTransaction = async (req, res, next) => {
    try {
        const transaction = new Transaction(req.body);
        const savedTransaction = await transaction.save();


        // Update the customer’s transactions array
        const updatedCustomer = await Customer.findOneAndUpdate(
            { c_id: transaction.customerId },  // Use c_id to find the customer
            { $push: { transactions: savedTransaction._id } },
            { new: true }  // Optionally return the updated customer
        );

        // if (!updatedCustomer) {
        //     // Handle case where customer was not found
        //     return res.status(404).json({ message: 'Customer not found' });
        // }

        // Log to check updated customer
        //    console.log('Updated Customer:', updatedCustomer);

        res.status(201).json(savedTransaction);
    } catch (error) {
        // res.status(400).json({ message: error.message });
        next(error);
    }
};

// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        // console.log("txns",transactions);

        res.status(200).json(transactions);
    } catch (error) {
        // res.status(500).json({ message: error.message });
        next(error);
    }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        // res.status(500).json({ message: error.message });
        next(error);
    }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res, next) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        // res.status(400).json({ message: error.message });
        next(error);
    }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res, next) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        // Update the customer’s transactions array
        await Customer.findOneAndUpdate(
            { c_id: deletedTransaction.customerId },
            { $pull: { transactions: deletedTransaction._id } }
        );
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        // res.status(500).json({ message: error.message });
        next(error);
    }
};
