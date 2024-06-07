const invoiceModel = require('../models/invoiceModel');

exports.getAllInvoices = (req, res) => {
    const invoices = invoiceModel.getAll();
    res.json(invoices);
};

exports.createInvoice = (req, res) => {
    const newInvoice = req.body;
    const createdInvoice = invoiceModel.create(newInvoice);
    res.status(201).json(createdInvoice);
};

exports.getInvoiceById = (req, res) => {
    const invoiceId = req.params.id;
    const invoice = invoiceModel.getById(invoiceId);
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404).json({ message: 'Invoice not found' });
    }
};

exports.updateInvoice = (req, res) => {
    const invoiceId = req.params.id;
    const updatedData = req.body;
    const updatedInvoice = invoiceModel.update(invoiceId, updatedData);
    if (updatedInvoice) {
        res.json(updatedInvoice);
    } else {
        res.status(404).json({ message: 'Invoice not found' });
    }
};

exports.deleteInvoice = (req, res) => {
    const invoiceId = req.params.id;
    const isDeleted = invoiceModel.delete(invoiceId);
    if (isDeleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Invoice not found' });
    }
};

exports.deleteAllInvoices = (req, res) => {
    const isDeleted = invoiceModel.deleteAll();
    if (isDeleted) {
        res.status(204).send();
    } else {
        res.status(500).json({ message: 'Failed to delete all invoices' });
    }
};
