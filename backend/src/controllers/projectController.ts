import { Request, Response } from 'express';
import { Project } from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      res.json({ success: true, data: project });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: Request, res: Response) => {
  const { title, description, location, year, client, image } = req.body;

  try {
    let imagePath = image || '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const project = await Project.create({
      title,
      description: description || '',
      location: location || '',
      year: year || '',
      client: client || '',
      image: imagePath,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: Request, res: Response) => {
  const { title, description, location, year, client, image } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description !== undefined ? description : project.description;
      project.location = location !== undefined ? location : project.location;
      project.year = year !== undefined ? year : project.year;
      project.client = client !== undefined ? client : project.client;

      if (req.file) {
        project.image = `/uploads/${req.file.filename}`;
      } else if (image !== undefined) {
        project.image = image;
      }

      const updatedProject = await project.save();
      res.json({ success: true, data: updatedProject });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ success: true, message: 'Project removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
