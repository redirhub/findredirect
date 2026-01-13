/**
 * Import Page to Sanity
 *
 * Usage:
 *   node scripts/import-page.js import-pages/301-redirect-checker.json
 *
 * This script imports a page JSON file into your Sanity dataset.
 */

// Load environment variables
require('dotenv').config();

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // You need to set this in .env
  useCdn: false,
});

// Generate unique key for Sanity array items
function generateKey() {
  return Math.random().toString(36).substring(2, 15);
}

// Recursively add _key to all array items and objects
function addKeysToArrays(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          _key: generateKey(),
          ...addKeysToArrays(item)
        };
      }
      return item;
    });
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = addKeysToArrays(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function importToolPage(jsonFilePath) {
  try {
    // Read the JSON file
    const fullPath = path.join(process.cwd(), jsonFilePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`);
      process.exit(1);
    }

    const jsonContent = fs.readFileSync(fullPath, 'utf-8');
    let pageData = JSON.parse(jsonContent);

    // Add _key properties to all array items
    pageData = addKeysToArrays(pageData);

    console.log(`📄 Importing page: ${pageData.title}`);
    console.log(`🔗 Slug: ${pageData.slug.current}`);

    // Check if a page with this slug already exists
    const existingQuery = `*[_type == "page" && slug.current == $slug && locale == $locale][0]`;
    const existing = await client.fetch(existingQuery, {
      slug: pageData.slug.current,
      locale: pageData.locale || 'en',
    });

    if (existing) {
      console.log(`⚠️  A page with slug "${pageData.slug.current}" already exists.`);
      console.log(`📝 Document ID: ${existing._id}`);
      console.log(`🔄 Updating existing page...`);

      // Update existing document
      const result = await client
        .patch(existing._id)
        .set(pageData)
        .commit();

      console.log(`✅ Page updated successfully!`);
      console.log(`📝 Document ID: ${result._id}`);
    } else {
      // Create new document
      const result = await client.create(pageData);

      console.log(`✅ Page created successfully!`);
      console.log(`📝 Document ID: ${result._id}`);
    }

    console.log(`\n🌐 Preview URL: http://localhost:3000/${pageData.slug.current}`);
    console.log(`🎨 Edit in Sanity: http://localhost:3000/studio/desk/page;${pageData.slug.current}`);

  } catch (error) {
    console.error('❌ Error importing page:', error.message);

    if (error.message.includes('token')) {
      console.log('\n💡 Tip: Make sure SANITY_API_TOKEN is set in your .env file');
      console.log('   Get a token from: https://sanity.io/manage');
    }

    process.exit(1);
  }
}

// Get file path from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node scripts/import-page.js <json-file-path>');
  console.log('Example: node scripts/import-page.js import-pages/301-redirect-checker.json');
  process.exit(1);
}

importToolPage(args[0]);
