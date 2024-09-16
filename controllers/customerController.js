
const checkCustomer = require('../models/customerModel');




// *------------------------------------------------------
// * Logic for checking and showing customer in realtime
// *------------------------------------------------------


// Endpoint to check if a customer exists based on Aadhaar number
const checkCustomerExists = async (req, res) => {
    try {
        const { c_id } = req.params;
        // const customerExist = await checkCustomer.exists({ c_id }); // Check if customer exists by Aadhaar number

        // if (customerExist) {
        //     // return res.json({ exists: true }); // Customer exists
        //     return res.status(400).json({ message: "Customer Already Exists!" });
        // } else {
        //     return res.json({ exists: false }); // Customer does not exist
        // }


        // Fetch customer details based on Aadhaar number
        const customerExist = await checkCustomer.findOne({ c_id });


        if (customerExist) {
            // If the customer exists, return their details
            // console.log("data from db",customerExist);
            return res.json({ exists: true, customerDetails: customerExist });

        } else {
            return res.json({ exists: false }); // Customer does not exist
        }

    } catch (error) {
        console.error("Error checking customer existence:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};









// *--------------------------------
// * Logic for adding New Customer
// *---------------------------------

const Customer = require('../models/customerModel'); // Import the Customer model

const AddCustomer = async (req, res, next) => {
    try {
        // Extract customer data from request body
        const { adrNumber, c_id, name, gender, relation, relationshipName, banksLinked, mobileNo, dob, address, addedBy, jcNo } = req.body;
        //  const addedBy = req.user._id; // Get the ID of the logged-in staff member


        // Get the current date and time
        const currentDate = new Date();



        // Check if customer with the same c_id already exists
        const customerExist = await Customer.findOne({ c_id });

        if (customerExist) {

            return res.status(400).json({ message: "Customer Already Exists!" });

        }


        // Create a new customer object using the Customer model
        const newCustomer = new Customer({
            adrNumber,
            c_id,
            name,
            gender,
            relation,
            relationshipName,
            banksLinked,
            mobileNo,
            dob,
            address,
            addedBy,
            jcNo,
            addedAt: currentDate

        });

        // Save the new customer object to the database
        const savedCustomer = await Customer.create(newCustomer);


        res.status(201).json({ message: "Customer Added Successfully" }); // Respond with the saved customer data with token
    } catch (error) {
        // console.error(error);
        // res.status(500).json({ message: 'Server Error Customer add nahi hora' });

        next(error);
    }
};







// *---------------------------------
// * Logic for Customer list
// *---------------------------------

// Define endpoint for fetching customers
// app.get('/api/customers', async (req, res) => {
const customers = async (req, res) => {
    try {
        const customers = await Customer.find();
        
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// *--------------------------------
// * Logic for updating a customer
// *---------------------------------

const updateCustomer = async (req, res, next) => {
    try {
        const { c_id } = req.params;
        const { adrNumber, name, gender, relation, relationshipName, banksLinked, mobileNo, dob, address, addedBy, jcNo } = req.body;

        // Check if the customer exists
        const customer = await Customer.findOne({ c_id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Update the customer with new data
        customer.adrNumber = adrNumber || customer.adrNumber;
        customer.name = name || customer.name;
        customer.gender = gender || customer.gender;
        customer.relation = relation || customer.relation;
        customer.relationshipName = relationshipName || customer.relationshipName;
        customer.banksLinked = banksLinked || customer.banksLinked;
        customer.mobileNo = mobileNo || customer.mobileNo;
        customer.dob = dob || customer.dob;
        customer.address = address || customer.address;
        customer.addedBy = addedBy || customer.addedBy;
        customer.jcNo = jcNo || customer.jcNo;

        // Save the updated customer
        const updatedCustomer = await customer.save();

        res.json({ message: "Customer Updated Successfully", updatedCustomer });
    } catch (error) {
        // console.error('Error updating customer:', error);
        // res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
};



// *--------------------------------
// * Logic for deleting a customer
// *---------------------------------
const deleteCustomer = async (req, res, next) => {
    try {
        const { c_id } = req.params;

        // Check if the customer exists
        const customer = await Customer.findOne({ c_id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // If the customer exists, delete it
        await Customer.deleteOne({ c_id });

        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        // console.error('Error deleting customer:', error);
        // res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
};

// Get customer details along with transactions
const getCustomerWithTransactions = async (req, res) => {
    try {
        const { c_id } = req.params;

        // Fetch customer details along with transactions
        const customer = await Customer.findOne({ c_id })
            .populate('transactions')  // Populate the transactions field
            .exec();

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer with transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = {getCustomerWithTransactions, AddCustomer, customers, checkCustomerExists, deleteCustomer, updateCustomer };
