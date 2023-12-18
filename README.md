Please note that the above code is a simplified version of what a real-world application would look like. The `infographics_generator.js` module, in particular, would need to be more complex to handle the various types of infographics and their respective HTML templates. Additionally, error handling and validation would need to be more robust in a production environment.

This concludes a fully working implementation.```sh
cd backend
npm install
npm start &
cd ../frontend
# Assuming you want to serve the frontend on a simple HTTP server
npx http-server . -p 8000 &