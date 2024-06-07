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

exports.getAll = () => {
    return readData();
};

exports.create = (customer) => {
    const customers = readData();
    customer.id = uuidv4();
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

