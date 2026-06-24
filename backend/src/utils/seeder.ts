import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Project } from '../models/Project.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/led-portfolio';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('Database connected.');

    // Clear existing data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Project.deleteMany({});

    // 1. Create Default Users
    console.log('Seeding Users...');
    // Note: User model has a pre-save hook that hashes password automatically.
    const adminUser = await User.create({
      name: 'RentaLite Admin',
      email: 'admin@rentalite.com',
      password: 'adminpassword',
      role: 'Admin',
      phone: '+91 99999 88888',
      companyName: 'RentaLite Official',
    });

    const regularUser = await User.create({
      name: 'RentaLite User',
      email: 'user@rentalite.com',
      password: 'userpassword',
      role: 'User',
      phone: '+91 88888 77777',
      companyName: 'Lumina Architects',
    });

    console.log('Users seeded.');

    // 2. Create Categories
    console.log('Seeding Categories...');
    const categoriesData = [
      { name: 'COB Lights', description: 'Chip-on-Board high intensity architectural spot and downlights.', image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Cylinder Lights', description: 'Stylish surface-mounted ceiling cylindrical light fixtures.', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400' },
      { name: 'Downlights', description: 'Recessed energy-efficient ceiling downlights for homes and commercial interiors.', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400' },
      { name: 'Track Lights', description: 'Directional lighting fixtures mounted on a continuous track system.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Surface Lights', description: 'Sleek ceiling surface-mounted panel and grid lighting.', image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Panel Lights', description: 'Flat, ultra-thin LED panels providing uniform glare-free lighting.', image: 'https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&q=80&w=400' },
      { name: 'Strip Lights', description: 'Flexible LED ribbons for ambient cove and architectural accent lighting.', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=400' },
      { name: 'Power Supplies', description: 'Constant voltage DC transformers and drivers for stable LED systems.', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400' },
    ];

    const categoriesMap: any = {};
    for (const cat of categoriesData) {
      const createdCat = await Category.create(cat);
      categoriesMap[cat.name] = createdCat._id;
    }
    console.log('Categories seeded.');

    // 3. Create Products
    console.log('Seeding Products...');
    const productsData = [
      // Cylinder Lights
      {
        name: 'GLOW',
        description: 'Sleek architectural cylinder light. Designed for highlighting specific spaces with high-end ceiling surface mounting. Durable aluminum build with premium thermal management.',
        category: categoriesMap['Cylinder Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'Wattage', value: '12W / 18W / 24W' },
          { key: 'Color Temperature (CCT)', value: '3000K (Warm White) / 4000K (Cool White)' },
          { key: 'Body Color', value: 'Matte Black / Architectural White' },
          { key: 'Luminous Flux', value: '110 Lm/W' },
          { key: 'Input Voltage', value: 'AC 90-285V' },
          { key: 'CRI', value: '>90' },
          { key: 'Mounting Type', value: 'Surface Mounted' },
        ],
      },
      // Power Supplies
      {
        name: 'BELTON 12V',
        description: 'High performance constant voltage power supply. Built with short circuit and overload protection, guaranteeing safe and long-lasting strip light installations.',
        category: categoriesMap['Power Supplies'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'Output Voltage', value: '12V DC' },
          { key: 'Output Current', value: '5A / 10A / 20A / 30A' },
          { key: 'Wattage Range', value: '60W - 360W' },
          { key: 'IP Rating', value: 'IP20 (Indoor) / IP67 (Outdoor)' },
          { key: 'Material', value: 'Perforated Aluminum Alloy Case' },
          { key: 'Efficiency', value: '>88%' },
        ],
      },
      // Strip Lights
      {
        name: 'NEBULA 240L - 10MM',
        description: 'Ultra-bright flexible LED strip light. Features 240 high-efficiency LEDs per meter. Excellent for commercial styling, kitchen counters, and under-cabinet glow integrations.',
        category: categoriesMap['Strip Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'LED Density', value: '240 LEDs/Meter' },
          { key: 'Strip Width', value: '10mm' },
          { key: 'Operating Voltage', value: '12V / 24V DC' },
          { key: 'Power Consumption', value: '18W/Meter' },
          { key: 'Color Options', value: 'Warm White, Neutral White, Cool White' },
          { key: 'Lumen Output', value: '120 Lm/W' },
          { key: 'Roll Length', value: '5 Meters' },
        ],
      },
      {
        name: 'NEBULA 180L - 5MM',
        description: 'Slimline architectural LED strip light with 180 LEDs per meter and an ultra-thin 5mm profile. Perfect for thin recessed profile channels and subtle accent details.',
        category: categoriesMap['Strip Lights'],
        featured: false,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'LED Density', value: '180 LEDs/Meter' },
          { key: 'Strip Width', value: '5mm (Slim)' },
          { key: 'Operating Voltage', value: '12V DC' },
          { key: 'Power Consumption', value: '14.4W/Meter' },
          { key: 'Lumen Output', value: '110 Lm/W' },
        ],
      },
      {
        name: 'TROIKA 180L - 5MM',
        description: 'Elite strip lighting solution with premium quality phosphor coating for uniform color consistency. Built with gold-plated FPC for superior electrical conductivity.',
        category: categoriesMap['Strip Lights'],
        featured: false,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'LED Density', value: '180 LEDs/Meter' },
          { key: 'Strip Width', value: '5mm' },
          { key: 'Operating Voltage', value: '24V DC' },
          { key: 'CRI', value: '>93' },
          { key: 'Warranty', value: '3 Years' },
        ],
      },
      {
        name: 'TROIKA 60L RGB - 10MM',
        description: 'Dynamic color-changing flexible strip light. Creates millions of color tones. Ideal for luxury residential coves, lounge setups, bars, and gaming setups.',
        category: categoriesMap['Strip Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'LED Density', value: '60 LEDs/Meter' },
          { key: 'Strip Width', value: '10mm' },
          { key: 'Color Type', value: 'RGB (Multi-color)' },
          { key: 'Control Support', value: 'Remote / DMX / WiFi App controllers' },
          { key: 'Voltage', value: '12V DC' },
        ],
      },
      {
        name: 'TROIKA 240L 3IN1 - 10MM',
        description: 'Variable tunable white LED strip light. Allows adjusting color temp smoothly from Warm White to Cool White. Best-selling solution for human-centric circadian lighting.',
        category: categoriesMap['Strip Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'LED Density', value: '240 LEDs/Meter' },
          { key: 'Feature', value: '3-in-1 Tunable White (CCT)' },
          { key: 'CCT Range', value: '3000K to 6500K' },
          { key: 'Width', value: '10mm' },
          { key: 'Voltage', value: '24V DC' },
        ],
      },
      {
        name: 'TROIKA 480L - 8MM',
        description: 'Ultra-dense cob-style uniform strip light. Features an astonishing 480 LEDs per meter, creating a seamless, dot-less beam of linear light even without diffusers.',
        category: categoriesMap['Strip Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'LED Density', value: '480 LEDs/Meter' },
          { key: 'Seamless Effect', value: 'Dot-free continuous light' },
          { key: 'Width', value: '8mm' },
          { key: 'Operating Voltage', value: '24V DC' },
          { key: 'Power Consumption', value: '15W/Meter' },
        ],
      },
      // COB Lights
      {
        name: 'VORTEX HIGH CRI COB',
        description: 'High intensity directional spot fixture. Designed with advanced Chip-on-Board LED technology, providing deep anti-glare reflector rings and stunning architectural spot highlighting.',
        category: categoriesMap['COB Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'Wattage', value: '7W / 12W / 15W / 20W' },
          { key: 'CRI', value: '>95 (High Fidelity)' },
          { key: 'Beam Angle', value: '15° / 24° / 36°' },
          { key: 'Body Material', value: 'Die-cast Aluminum' },
          { key: 'Adjustable Angle', value: '30° Tilt, 350° Rotation' },
        ],
      },
      // Downlights
      {
        name: 'AERO RECESSED DOWNLIGHT',
        description: 'Super slim recessed panel downlight with integrated driver. Offers wide flood illumination, glare-free optical diffusers, and quick clip-in installers.',
        category: categoriesMap['Downlights'],
        featured: false,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'Wattage', value: '9W / 12W / 15W' },
          { key: 'Lumens', value: '900 Lm - 1500 Lm' },
          { key: 'Shape', value: 'Round / Square' },
          { key: 'Cutout Size', value: '3 inch / 4 inch / 6 inch' },
          { key: 'IP Rating', value: 'IP44 (Suitable for bathrooms)' },
        ],
      },
      // Track Lights
      {
        name: 'FOCUS ZOOM TRACK LIGHT',
        description: 'Industrial and showroom track spot. Adjustable track adaptors enable easy rotation, and variable zoom lens provides customizable beam shaping from sharp spots to soft washes.',
        category: categoriesMap['Track Lights'],
        featured: true,
        status: 'Active',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=500'],
        specifications: [
          { key: 'Wattage', value: '30W' },
          { key: 'Track System', value: '2-Wire / 3-Wire / 4-Wire' },
          { key: 'Zoom Range', value: '15° to 60° Adjustable' },
          { key: 'CRI', value: '>90' },
          { key: 'Body Color', value: 'Textured Black / Textured White' },
        ],
      },
    ];

    for (const prod of productsData) {
      await Product.create(prod);
    }
    console.log('Products seeded.');

    // 4. Create Projects
    console.log('Seeding Projects...');
    const projectsData = [
      {
        title: 'Luxuria Heights Residency',
        description: 'Bespoke residential lighting design incorporating troika tunable white strip lights and recessed vortex COB fixtures to highlight premium wall accents and linear ceiling shapes.',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600',
        location: 'Mumbai, Maharashtra',
        year: '2025',
        client: 'Luxuria Builders Group',
      },
      {
        title: 'TechCorp Innovation HQ',
        description: 'Modern workspace lighting featuring glare-free panel grids, task downlighting, and blue/amber decorative cove lighting to boost employee efficiency and aesthetic visual appeal.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
        location: 'Bengaluru, Karnataka',
        year: '2024',
        client: 'TechCorp International',
      },
      {
        title: 'Aura Premium Showroom',
        description: 'High-end retail fashion showroom setup utilizing Focus Zoom track lighting systems to draw attention to seasonal designer displays and product collections.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600',
        location: 'Delhi NCR',
        year: '2025',
        client: 'Aura Couture Ltd',
      },
      {
        title: 'Hotel Grand Mercure Lobby',
        description: 'Grand lobby ambient illumination project using heavy duty Belton drivers powering 240L high intensity warm strip light modules behind customized copper panels.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
        location: 'Goa, India',
        year: '2024',
        client: 'Mercure Hospitality Group',
      },
    ];

    for (const proj of projectsData) {
      await Project.create(proj);
    }
    console.log('Projects seeded successfully.');

    console.log('Database Seeding Complete!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
