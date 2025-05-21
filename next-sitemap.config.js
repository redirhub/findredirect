module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://findredirect.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/zh*',
    '/fr*',
    '/de*',
    '/es*',
    '/it*',
    '/pt*',
    '/ja*',
    '/ko*',
  ],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
