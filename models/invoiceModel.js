const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const invoiceDataPath = path.join(__dirname, '../data/invoices.json');
const lineItemsDataPath = path.join(__dirname, '../data/invoice_line_items.json');

function readData(filePath) {
    const jsonData = fs.readFileSync(filePath);
    return JSON.parse(jsonData);
}

function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

exports.getAll = (offset, limit, search, sortBy, sortOrder) => {
    // Read data from file
    let invoices = readData(invoiceDataPath);
    
    // Apply search filter
    if (search) {
        invoices = invoices.filter(invoice =>
            Object.values(invoice).some(value => {
                if(typeof value === 'string') return value.toLowerCase().includes(search.toLowerCase())
                else if(typeof value === 'number') return value.toString().includes(search.toString())
            })
        );
    }

    // Apply sorting
    invoices.sort((a, b) => {
        if (sortBy === 'totalAmount') {
            const amountA = parseFloat(a.totalAmount);
            const amountB = parseFloat(b.totalAmount);
            return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
        } else if (sortBy === 'created_at') {
            return sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

    // Apply pagination
    const totalCount = invoices.length;
    invoices = invoices.slice(offset, offset + limit);

    // Return invoices and total count
    return { invoices, totalCount };
};

exports.create = (invoice) => {
    const invoices = readData(invoiceDataPath);
    const lineItems = readData(lineItemsDataPath);

    invoice.invoice_id = uuidv4();
    invoice.created_at = new Date().toISOString();
    invoice.updated_at = new Date().toISOString();

    const { line_items, ...invoiceData } = invoice;

    // invoiceData.total_amount = line_items.reduce((total, item) => total + item.amount, 0);

    invoices.push(invoiceData);
    writeData(invoiceDataPath, invoices);

    line_items.forEach(item => {
        item.line_item_id = uuidv4();
        item.invoice_id = invoice.invoice_id;
        item.created_at = new Date().toISOString();
        item.updated_at = new Date().toISOString();
        lineItems.push(item);
    });
    writeData(lineItemsDataPath, lineItems);

    return { ...invoiceData, line_items };
};

exports.getById = (id) => {
    const invoices = readData(invoiceDataPath);
    const invoice = invoices.find(invoice => invoice.invoice_id === id);

    if (invoice) {
        const lineItems = readData(lineItemsDataPath);
        const invoiceLineItems = lineItems.filter(item => item.invoice_id === id);
        return { ...invoice, line_items: invoiceLineItems };
    }
    return null;
};

exports.update = (id, updatedData) => {
    const invoices = readData(invoiceDataPath);
    const lineItems = readData(lineItemsDataPath);
    const index = invoices.findIndex(invoice => invoice.invoice_id === id);

    if (index !== -1) {
        updatedData.updated_at = new Date().toISOString();

        const { line_items, ...invoiceData } = updatedData;
        invoiceData.total_amount = line_items.reduce((total, item) => total + item.amount, 0);

        invoices[index] = { ...invoices[index], ...invoiceData };
        writeData(invoiceDataPath, invoices);

        // Remove old line items
        let updatedLineItems = lineItems.filter(item => item.invoice_id !== id);

        // Add updated line items
        line_items.forEach(item => {
            item.line_item_id = uuidv4();
            item.invoice_id = id;
            item.created_at = new Date().toISOString();
            item.updated_at = new Date().toISOString();
            updatedLineItems.push(item);
        });

        writeData(lineItemsDataPath, updatedLineItems);

        return { ...invoiceData, line_items };
    }
    return null;
};

exports.delete = (id) => {
    const invoices = readData(invoiceDataPath);
    const lineItems = readData(lineItemsDataPath);
    const initialLength = invoices.length;

    const filteredInvoices = invoices.filter(invoice => invoice.invoice_id !== id);
    const filteredLineItems = lineItems.filter(item => item.invoice_id !== id);

    if (filteredInvoices.length < initialLength) {
        writeData(invoiceDataPath, filteredInvoices);
        writeData(lineItemsDataPath, filteredLineItems);
        return true;
    }
    return false;
};

exports.deleteAll = () => {
    try {
        writeData(invoiceDataPath, []);
        writeData(lineItemsDataPath, []);
        return true;
    } catch (error) {
        console.error('Failed to delete all invoices:', error);
        return false;
    }
};
