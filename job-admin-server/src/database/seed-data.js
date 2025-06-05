const fs = require('fs');
const path = require('path');
const pool = require('./config');

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('📥 Reading cities.json...');
    const rawData = fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf-8');
    const cities = JSON.parse(rawData);

    console.log('🔄 Creating locations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    console.log('🧱 Creating jobs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
        job_type VARCHAR(50) CHECK (job_type IN ('FullTime', 'PartTime', 'Contract', 'Internship')) NOT NULL,
        salary_min INTEGER NOT NULL,
        salary_max INTEGER NOT NULL,
        description TEXT,
        deadline DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🚀 Inserting city names...');
    for (const { city } of cities) {
      await client.query(
        `INSERT INTO locations (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING`,
        [city]
      );
    }

    console.log('✅ Database seeded successfully.');
  } catch (err) {
    console.log('❌ Error seeding database:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDatabase();
