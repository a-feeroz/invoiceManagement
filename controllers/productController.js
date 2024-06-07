const productModel = require('../models/productModel');

exports.getAllProducts = (req, res) => {
    const products = productModel.getAll();
    res.json(products);
};

exports.createProduct = (req, res) => {
    const newProduct = req.body;
    const createdProduct = productModel.create(newProduct);
    res.status(201).json(createdProduct);
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    const product = productModel.getById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;
    const updatedProduct = productModel.update(productId, updatedData);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    const isDeleted = productModel.delete(productId);
    if (isDeleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.deleteAllProducts = (req, res) => {
    const isDeleted = productModel.deleteAll();
    if (isDeleted) {
        res.status(204).send();
    } else {
        res.status(500).json({ message: 'Failed to delete all products' });
    }
};

