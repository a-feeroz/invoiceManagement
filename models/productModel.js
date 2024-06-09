const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dataPath = path.join(__dirname, '../data/products.json');

function readData() {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
}

function writeData(data, ) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

exports.getAll = (offset, limit, search, sortBy, sortOrder) => {
    // Read data from file
    let products = readData();
    
    // Apply search filter
    if (search) {
        products = products.filter(product =>
            Object.values(product).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
            )
        );
    }

    // Apply sorting
    products.sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'createdOn') {
            return sortOrder === 'asc' ? new Date(a.createdOn) - new Date(b.createdOn) : new Date(b.createdOn) - new Date(a.createdOn);
        }
        return 0;
    });

    // Apply pagination
    const totalCount = products.length;
    products = products.slice(offset, offset + limit);

    // Return products and total count
    return { products, totalCount };
};

exports.create = (product) => {
    const products = readData();
    product.id = uuidv4();
    product.createdOn = new Date().toISOString(); // Add createdOn field with current time
    products.push(product);
    writeData(products);
    return product;
};


exports.getById = (id) => {
    const products = readData();
    return products.find(product => product.id === id);
};

exports.update = (id, updatedData) => {
    const products = readData();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        const updatedProduct = { ...products[index], ...updatedData };
        products[index] = updatedProduct;
        writeData(products);
        return updatedProduct;
    }
    return null;
};

exports.delete = (id) => {
    let products = readData();
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    if (products.length < initialLength) {
        writeData(products);
        return true;
    }
    return false;
};

exports.deleteAll = () => {
    try {
        writeData([]);
        return true;
    } catch (error) {
        console.error('Failed to delete all products:', error);
        return false;
    }
};
