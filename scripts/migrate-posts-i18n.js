/**
 * Migration Script: Add i18n fields to existing blog posts
 * 
 * This script adds the `locale` and `baseSlug` fields to all existing
 * blog posts that don't have them yet.
 * 
 * Run: node scripts/migrate-posts-i18n.js
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migratePosts() {
  console.log('🚀 Starting blog post i18n migration...\n');

  try {
    // Fetch all posts without locale field
    const posts = await client.fetch(`*[_type == "post" && !defined(locale)]{
      _id,
      title,
      slug
    }`);

    if (posts.length === 0) {
      console.log('✅ No posts to migrate. All posts already have i18n fields.');
      return;
    }

    console.log(`📝 Found ${posts.length} posts to migrate:\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      try {
        const baseSlug = post.slug?.current;

        if (!baseSlug) {
          console.error(`❌ Skipping ${post._id}: No slug found`);
          errorCount++;
          continue;
        }

        // Update post with i18n fields
        await client
          .patch(post._id)
          .set({
            locale: 'en', // All existing posts are English by default
            baseSlug: baseSlug,
          })
          .commit();

        console.log(`✓ Migrated: "${post.title}" → baseSlug: ${baseSlug}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${post._id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${posts.length}`);
    console.log('\n🎉 Migration complete!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Verify environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID not found in environment');
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Error: SANITY_API_TOKEN not found in environment');
  process.exit(1);
}

// Run migration
migratePosts().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

