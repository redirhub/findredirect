export default function corsMiddleware(handler) {
    return async (req, res) => {
        const { method, headers } = req;

        // Define a whitelist of allowed origins
        const whitelist = [
            'urlredirectservice.com',
            'redirhub.com',
        ];

        // Function to check if origin is in whitelist
        function isOriginAllowed(origin) {
            return whitelist.some((allowedOrigin) => {
                return origin.includes(allowedOrigin);
            });
        }

        // Set CORS headers dynamically based on request origin
        if (method === 'OPTIONS') {
            const requestOrigin = headers.origin || headers.referer || ''; // Get request origin from headers

            if (isOriginAllowed(requestOrigin)) {
                res.setHeader('Access-Control-Allow-Origin', requestOrigin);
            } else {
                res.setHeader('Access-Control-Allow-Origin', ''); // Disallow if not in whitelist
            }

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            return res.status(200).end(); // OPTIONS request handled
        }

        // For non-OPTIONS requests, proceed to the handler
        return handler(req, res);
    };
}
