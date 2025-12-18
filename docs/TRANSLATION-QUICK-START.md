# Background Translation - Quick Start

## What Changed?

Translations now run in the background using Vercel Queue! 🎉

### Before
- Click button → Wait 2-3 minutes → Translations complete
- UI blocked during translation
- Timeout risk for long articles

### After
- Click button → Job queued instantly → Continue working
- Automatic translation on publish/save
- Translations appear in ~1 minute
- Built-in deduplication prevents duplicate jobs

## Quick Setup (5 minutes)

### 1. Add Environment Variable

```bash
# Add to .env and Vercel
SANITY_WEBHOOK_SECRET=your-random-secret-here
```

Generate a secret:
```bash
openssl rand -hex 32
```

### 2. Deploy to Vercel

```bash
git add .
git commit -m "Add background translation"
git push
```

### 3. Enable Vercel Queue

**Requires Vercel Pro Plan ($20/month)**

1. Vercel Dashboard → Your Project
2. Storage → Create Database → Queue
3. Name: `translate-article`
4. Click Create

### 4. Setup Sanity Webhook

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Your Project → API → Webhooks
3. Create webhook:
   - **URL:** `https://your-domain.com/api/webhooks/sanity`
   - **Dataset:** `production`
   - **Trigger:** Create, Update (not Delete)
   - **Filter:** `_type == "post" && locale == "en"`
   - **Secret:** (same as SANITY_WEBHOOK_SECRET)

### 5. Test It!

**Manual test:**
1. Open Sanity Studio
2. Edit an English article
3. Click "Auto-Translate"
4. Should see "Translation job started! 🎉"
5. Wait 30-60 seconds and refresh

**Automatic test:**
1. Create new English article
2. Publish it
3. Wait 30-60 seconds
4. Translations appear automatically!

## Files Modified

- ✅ `src/pages/api/queue/translate.js` - NEW: Queue consumer
- ✅ `src/pages/api/webhooks/sanity.js` - NEW: Webhook handler
- ✅ `src/pages/api/blog/translate.js` - Updated: Now enqueues jobs
- ✅ `src/sanity/plugins/languageSwitcher.jsx` - Updated: Shows background status
- ✅ `package.json` - Added: @vercel/functions

## Troubleshooting

**Button doesn't work:**
- Check Vercel Queue is created
- Check environment variables are set
- View function logs in Vercel

**Webhook doesn't trigger:**
- Verify webhook URL is correct
- Check webhook secret matches env variable
- View webhook delivery history in Sanity

**Need more help?**
See full documentation: `docs/BACKGROUND-TRANSLATION-SETUP.md`

## Cost

- Vercel Pro: $20/month (required for Queue)
- OpenAI API: ~$0.006 per article × 8 languages
- Total: ~$20-25/month

## Revert to Synchronous (if needed)

If you need to revert to the old synchronous behavior:
1. `git revert HEAD` (or specific commit)
2. Or keep button but remove webhook
