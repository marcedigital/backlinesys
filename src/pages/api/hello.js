
export default function handler(req, res) {
  // Get the HTTP method used in the request
  const method = req.method;
  
  // Handle different HTTP methods
  switch (method) {
    case 'GET':
      // Return a simple greeting message
      res.status(200).json({ message: 'Hello World!', method: 'GET' });
      break;
    case 'POST':
      // Process POST request data and return it
      const data = req.body || {};
      res.status(200).json({ 
        message: 'Data received successfully!', 
        method: 'POST',
        data 
      });
      break;
    default:
      // Handle any other HTTP method
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ 
        message: `Method ${method} Not Allowed`,
        allowedMethods: ['GET', 'POST'] 
      });
      break;
  }
}
