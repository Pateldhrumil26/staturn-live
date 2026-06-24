import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  const { category, status, search, featured } = req.query;

  try {
    const query: any = {};

    // Filter by active status for public, or specified status
    if (status) {
      query.status = status;
    } else {
      // By default, only show active products
      // Admin dashboard will query explicitly with status if it needs both
      query.status = 'Active';
    }

    if (featured) {
      query.featured = featured === 'true';
    }

    // Filter by Category (slug or id)
    if (category) {
      if (category.toString().match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category.toString() });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // If category slug is not found, return empty results
          return res.json({ success: true, data: [] });
        }
      }
    }

    // Filter by Search (name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search.toString(), $options: 'i' } },
        { description: { $regex: search.toString(), $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get product by ID/slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };

    const product = await Product.findOne(query).populate('category', 'name slug');

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, category, specifications, status, featured, images } = req.body;

  try {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: 'Category not found' });
    }

    // Handle specifications JSON string if sent via form-data
    let specsList = [];
    if (specifications) {
      try {
        specsList = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid specifications JSON format' });
      }
    }

    // Handle images uploaded via Multer
    let imgUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imgUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
    } else if (images) {
      // If manually sending image paths as an array
      imgUrls = typeof images === 'string' ? JSON.parse(images) : images;
    }

    const product = await Product.create({
      name,
      description,
      category,
      specifications: specsList,
      images: imgUrls,
      status: status || 'Active',
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, category, specifications, status, featured, images } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (category) {
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
          return res.status(400).json({ success: false, message: 'Category not found' });
        }
        product.category = category;
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.status = status || product.status;
      
      if (featured !== undefined) {
        product.featured = featured === 'true' || featured === true;
      }

      if (specifications) {
        try {
          product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid specifications JSON format' });
        }
      }

      // Handle new image files
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const newImgUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
        product.images = [...product.images, ...newImgUrls];
      } else if (images !== undefined) {
        // If updating the existing images array explicitly
        product.images = typeof images === 'string' ? JSON.parse(images) : images;
      }

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ success: true, message: 'Product removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
