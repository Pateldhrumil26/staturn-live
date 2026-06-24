import { Request, Response } from 'express';
import { Category } from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get category by ID/slug
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };

    const category = await Category.findOne(query);

    if (category) {
      res.json({ success: true, data: category });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response) => {
  const { name, description, image } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    // Check if there is an uploaded file
    let imagePath = image || '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create({
      name,
      description: description || '',
      image: imagePath,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
  const { name, description, image } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.description = description !== undefined ? description : category.description;
      
      if (req.file) {
        category.image = `/uploads/${req.file.filename}`;
      } else if (image !== undefined) {
        category.image = image;
      }

      const updatedCategory = await category.save();
      res.json({ success: true, data: updatedCategory });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ success: true, message: 'Category removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
