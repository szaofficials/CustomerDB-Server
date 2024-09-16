const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const AddCustomerSchema = require("../validators/authValidator");
const validate = require("../middlewares/validateMiddleware");
const authMiddleware= require("../middlewares/authMiddleware");
const customerController = require('../controllers/customerController');
const transactionController = require('../controllers/transactionsController');

// router.get('/', (req, res) => {
//     res
//         .status(200)
//         .send('Hello, This is the server page by router page!'); // Respond with "Hello, world!" for requests to the root URL
// });


router.route("/").get(authController.home);


// customers list
router.route("/customers").get(customerController.customers);
router.route("/customers/:c_id").get(customerController.getCustomerWithTransactions);


router.put('/updateCustomer/:c_id', customerController.updateCustomer);

 // Route for deleting a customer
router.route("/deleteCustomer/:c_id").delete(customerController.deleteCustomer);


router.route("/checkCustomerExists/:c_id").get(customerController.checkCustomerExists);



router.route("/AddCustomer").post(
    validate(AddCustomerSchema),
    customerController.AddCustomer
);




router.route("/login").post(authController.login);







// this route is for creating users


// post
router.route("/adduser").post(authController.adduser);


// get
router.route("/user").get(authMiddleware, authController.user);
























// Route to create a new transaction
router.post('/addtransaction', transactionController.createTransaction);

// Route to get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Route to get a single transaction by ID
router.get('/transactions/:id', transactionController.getTransactionById);

// Route to update a transaction by ID
router.put('/transactions/:id', transactionController.updateTransaction);

// Route to delete a transaction by ID
router.delete('/transactions/:id', transactionController.deleteTransaction);

module.exports = router;