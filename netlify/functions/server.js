// This file is used to handle server-side rendering in Netlify Functions
// It's a fallback in case the @netlify/plugin-nextjs doesn't work correctly

exports.handler = async (event, context) => {
  // Log the request for debugging
  console.log('Request path:', event.path);
  console.log('Request method:', event.httpMethod);
  
  // Return a simple response for API routes
  if (event.path.startsWith('/api/')) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'API route handled by Netlify Function',
        path: event.path,
      }),
    };
  }
  
  // For other routes, redirect to the index page
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>GDC CRM</title>
          <script>
            // Redirect to the home page
            window.location.href = '/';
          </script>
        </head>
        <body>
          <p>Redirecting to home page...</p>
        </body>
      </html>
    `,
  };
};
