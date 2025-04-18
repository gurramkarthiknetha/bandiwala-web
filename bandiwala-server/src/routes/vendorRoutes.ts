import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import Vendor from '../models/vendor';
import Product from '../models/products';

const VendorRouter = express.Router();

// Get all vendors
VendorRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error });
  }
});

// Get vendor by ID
VendorRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor', error });
  }
});

// Create vendor
VendorRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newVendor = new Vendor(req.body);
    const savedVendor = await newVendor.save();
    const { password, ...vendorWithoutPassword } = savedVendor.toObject();
    res.status(201).json(vendorWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: 'Error creating vendor', error });
  }
});

// Update vendor
VendorRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating vendor', error });
  }
});

// Update vendor profile
VendorRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating vendor', error });
  }
});

// Delete vendor
VendorRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vendor', error });
  }
});

// Get vendors by city
VendorRouter.get('/city/:cityName', async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find({ 
      'location.city': req.params.cityName 
    }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors by city', error });
  }
});

// Get vendor's products
VendorRouter.get('/:id/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ vendorId: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Add new product
VendorRouter.post('/:id/products', async (req: Request, res: Response) => {
  try {
    const newProduct = new Product({
      ...req.body,
      vendorId: req.params.id
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

export default VendorRouter;