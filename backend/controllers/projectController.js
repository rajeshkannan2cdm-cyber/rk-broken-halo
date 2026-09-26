const Project = require('../models/Project');
const mongoose = require('mongoose');

// Default initial portfolio projects for RK Broken Halo
const defaultProjects = [
  {
    _id: '679500000000000000000001',
    title: 'ANIME EDIT',
    category: 'Anime Edit',
    description: 'High-octane anime sequence synchronized with heavy beat timing, seamless velocity transitions, and cinematic color grading.',
    thumbnail: 'assets/anime-edit.jpg',
    video: 'https://youtube.com/@rk._brokenhalo',
    tools: ['CapCut', 'Alight Motion'],
    tags: ['ANIME', 'BEAT SYNC'],
    style: 'Velocity · Color Grading · Impact Effects',
    featured: true,
    order: 1
  },
  {
    _id: '679500000000000000000002',
    title: 'MOVIE EDIT',
    category: 'Movie Edit',
    description: 'Dramatic film narrative with immersive audio sound design, cinematic slow-motion curves, and atmospheric color grading.',
    thumbnail: 'assets/movie-edit.jpg',
    video: 'https://youtube.com/@rk._brokenhalo',
    tools: ['CapCut', 'PicsArt'],
    tags: ['MOVIES', 'DRAMATIC'],
    style: 'Cinematic Transitions · Color · Slow-Mo',
    featured: true,
    order: 2
  },
  {
    _id: '679500000000000000000003',
    title: 'CINEMATIC EDIT',
    category: 'Cinematic Edit',
    description: 'Dynamic camera movement, speed ramping, custom visual effects, and music-driven editing flow.',
    thumbnail: 'assets/cinematic-edit.jpg',
    video: 'https://youtube.com/@rk._brokenhalo',
    tools: ['CapCut', 'Alight Motion', 'PicsArt'],
    tags: ['CINEMATIC', 'SPEED RAMP'],
    style: 'Motion Effects · VFX · Color Grading',
    featured: true,
    order: 3
  },
  {
    _id: '679500000000000000000004',
    title: 'SHORT-FORM EDIT',
    category: 'Short-Form Edit',
    description: 'Fast-paced vertical videos optimized for YouTube Shorts, TikTok, and Instagram Reels with powerful opening hooks.',
    thumbnail: 'assets/shorts-edit.jpg',
    video: 'https://youtube.com/@rk._brokenhalo',
    tools: ['CapCut'],
    tags: ['SHORTS', 'REELS'],
    style: 'Vertical · Fast Paced · Beat Sync',
    featured: true,
    order: 4
  }
];

/**
 * Helper to ensure default projects exist in MongoDB if database is empty
 */
const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const count = await Project.countDocuments();
      if (count === 0) {
        console.log('📦 Database is empty. Auto-seeding default RK Broken Halo projects...');
        const seedData = defaultProjects.map(({ _id, ...rest }) => rest);
        await Project.insertMany(seedData);
        console.log('✅ Successfully seeded default projects!');
      }
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err.message);
  }
};

/**
 * @desc    Get all editing projects
 * @route   GET /api/projects
 * @access  Public
 */
const getAllProjects = async (req, res) => {
  try {
    // If MongoDB is not connected, return friendly fallback data
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ [Projects] MongoDB disconnected. Serving default project data.');
      return res.status(200).json({
        success: true,
        count: defaultProjects.length,
        dataSource: 'offline-cache',
        data: defaultProjects
      });
    }

    // Auto-seed if database is empty
    await autoSeedIfEmpty();

    const projects = await Project.find().sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      dataSource: 'mongodb',
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects from database.'
    });
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Project ID parameter is required.'
      });
    }

    // If MongoDB is not connected, search default cache
    if (mongoose.connection.readyState !== 1) {
      const fallbackProject = defaultProjects.find(p => p._id === id || p.order === Number(id));
      if (!fallbackProject) {
        return res.status(404).json({
          success: false,
          message: `Project not found with ID: ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        dataSource: 'offline-cache',
        data: fallbackProject
      });
    }

    // Check if valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid project ID format: "${id}". Must be a 24-character hex string.`
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      dataSource: 'mongodb',
      data: project
    });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving project.'
    });
  }
};

/**
 * @desc    Seed or reset default projects
 * @route   POST /api/projects/seed
 * @access  Public (Development tool)
 */
const seedProjects = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is disconnected. Cannot seed projects into database.'
      });
    }

    await Project.deleteMany({});
    const seedData = defaultProjects.map(({ _id, ...rest }) => rest);
    const created = await Project.insertMany(seedData);

    return res.status(201).json({
      success: true,
      message: 'Projects seeded successfully!',
      count: created.length,
      data: created
    });
  } catch (error) {
    console.error('Error seeding projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed projects: ' + error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  seedProjects
};
