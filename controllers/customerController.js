const customerModel = require('../models/customerModel');

exports.getAllCustomers = (req, res) => {
    const customers = customerModel.getAll();
    res.json(customers);
};

exports.createCustomer = (req, res) => {
    const newCustomer = req.body;
    const createdCustomer = customerModel.create(newCustomer);
    res.status(201).json(createdCustomer);
};

exports.getCustomerById = (req, res) => {
    const customerId = req.params.id;
    const customer = customerModel.getById(customerId);
    if (customer) {
        res.json(customer);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
};

exports.updateCustomer = (req, res) => {
    const customerId = req.params.id;
    const updatedData = req.body;
    const updatedCustomer = customerModel.update(customerId, updatedData);
    if (updatedCustomer) {
        res.json(updatedCustomer);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
};

exports.deleteCustomer = (req, res) => {
    const customerId = req.params.id;
    const isDeleted = customerModel.delete(customerId);
    if (isDeleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
};

exports.deleteAllCustomers = (req, res) => {
    const isDeleted = customerModel.deleteAll();
    if (isDeleted) {
        res.status(204).send();
    } else {
        res.status(500).json({ message: 'Failed to delete all customers' });
    }
};

