const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dataPath = path.join(__dirname, '../data/customers.json');

function readData() {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
}

function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

exports.getAll = (offset, limit, search, sortBy, sortOrder) => {
    // Read data from file
    let customers = readData();
    
    // Apply search filter
    if (search) {
        customers = customers.filter(customer =>
            Object.values(customer).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
            )
        );
    }

    // Apply sorting
    customers.sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'createdOn') {
            return sortOrder === 'asc' ? new Date(a.createdOn) - new Date(b.createdOn) : new Date(b.createdOn) - new Date(a.createdOn);
        }
        return 0;
    });

    // Apply pagination
    const totalCount = customers.length;
   // console.log(">>>", offset, limit, Number(offset) + Number(limit) )
    customers = customers.slice(offset, Number(offset) + Number(limit));

    // Return customers and total count
    return { customers, totalCount };
};

exports.create = (customer) => {
    const customers = readData();
    customer.id = uuidv4();
    customer.createdOn = new Date().toISOString(); // Add createdOn field with current time
    customers.push(customer);
    writeData(customers);
    return customer;
};


exports.getById = (id) => {
    const customers = readData();
    return customers.find(customer => customer.id === id);
};

exports.update = (id, updatedData) => {
    const customers = readData();
    const index = customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
        const updatedCustomer = { ...customers[index], ...updatedData };
        customers[index] = updatedCustomer;
        writeData(customers);
        return updatedCustomer;
    }
    return null;
};

exports.delete = (id) => {
    let customers = readData();
    const initialLength = customers.length;
    customers = customers.filter(customer => customer.id !== id);
    if (customers.length < initialLength) {
        writeData(customers);
        return true;
    }
    return false;
};

exports.deleteAll = () => {
    try {
        writeData([]);
        return true;
    } catch (error) {
        console.error('Failed to delete all customers:', error);
        return false;
    }
};

