<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
 
  
</head>
<body>

  <h1>🦷 OralVis</h1>
  <p>
    OralVis is a full-stack web application for oral health diagnostics and case management.  
    It includes a <b>React frontend</b> and a <b>Node.js/Express backend</b> with MongoDB.  
  </p>

  <h2>📂 Project Structure</h2>
  <pre>
oralvis-frontend/   → React.js frontend
oralvis-backend/    → Node.js + Express backend
  </pre>

  <h2>🚀 Features</h2>
  <ul>
    <li>Patient submissions & case management</li>
    <li>PDF generation for reports</li>
    <li>Secure backend API with MongoDB</li>
    <li>Responsive React frontend</li>
  </ul>

  <h2>⚙️ Installation</h2>

  <h3>1️⃣ Clone the repository</h3>
  <pre>
git clone https://github.com/&lt;your-username&gt;/OralVis.git
cd OralVis
  </pre>

  <h3>2️⃣ Backend Setup</h3>
  <pre>
cd oralvis-backend
npm install
npm start
  </pre>

  <h3>3️⃣ Frontend Setup</h3>
  <pre>
cd oralvis-frontend
npm install
npm start
  </pre>
  <h1>Environment Variables</h1>
    <p>
      Create a <code>.env</code> file in both <code>oralvis-backend/</code> and <code>oralvis-frontend/</code>.
      Put the values below (replace placeholders with your real secrets / connection strings).
    </p>

    <div class="note">
      <strong>Important:</strong>
      Never commit .env files to GitHub. Add them to <code>.gitignore</code> and store secrets in a secure vault (AWS Secrets Manager, GitHub Actions secrets, or similar).
    </div>

    <h2>Backend <code>.env</code> (place in <code>oralvis-backend/.env</code>)</h2>
    <pre>
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:5000

# If using AWS S3 (optional)
USE_S3=false
AWS_BUCKET_NAME=your_bucket
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
    </pre>

    <h2>Frontend <code>.env</code> (place in <code>oralvis-frontend/.env</code>)</h2>
    <pre>
REACT_APP_API_URL=http://localhost:5000
    </pre>

    <h2>Quick usage notes</h2>
    <ul>
      <li>After creating or changing a backend <code>.env</code>, restart the backend server so changes take effect.</li>
      <li>For React, environment variables must start with <code>REACT_APP_</code> and you must restart the dev server after adding them.</li>
      <li>In production, prefer using environment-specific configuration (e.g., AWS Secrets Manager, GitHub Secrets, or CI/CD environment variables) instead of committing .env files.</li>
    </ul>

  <h2>☁️ AWS Deployment Guide</h2>

  <h3>Backend (Node.js + Express)</h3>
  <ol>
    <li>Go to <a href="https://aws.amazon.com/ec2/" target="_blank">AWS EC2</a> and launch an Ubuntu instance.</li>
    <li>SSH into the instance and install Node.js, npm, and MongoDB (or connect to <b>AWS Atlas</b>).</li>
    <li>Clone your repo inside the server:
      <pre>git clone https://github.com/&lt;your-username&gt;/OralVis.git</pre>
    </li>
    <li>Navigate to <code>oralvis-backend</code>, install dependencies and run with:
      <pre>npm install && npm start</pre>
    </li>
    <li>Use <code>pm2</code> or <code>systemd</code> to keep your backend running in production.</li>
    <li>Configure security group to allow inbound traffic on your API port (e.g., 5000).</li>
  </ol>

  <h3>Frontend (React)</h3>
  <ol>
    <li>Build your frontend:
      <pre>
cd oralvis-frontend
npm run build
      </pre>
    </li>
    <li>Upload the <code>build/</code> folder to <b>AWS S3</b> and enable static website hosting.</li>
    <li>Or, serve via <b>AWS Amplify</b> (direct GitHub integration for auto-deploy).</li>
    <li>Configure CloudFront CDN for better performance.</li>
  </ol>

  <div class="highlight">
    ✅ Recommended: Use <b>AWS Amplify</b> for frontend and <b>AWS EC2 + MongoDB Atlas</b> for backend.
  </div>

  <h2>🛠 Tech Stack</h2>
  <ul>
    <li><b>Frontend:</b> React, Tailwind CSS / CSS Modules</li>
    <li><b>Backend:</b> Node.js, Express, Multer, Path</li>
    <li><b>Database:</b> MongoDB (Local or Atlas)</li>
    <li><b>Hosting:</b> AWS EC2, AWS Amplify, AWS S3, CloudFront</li>
  </ul>

  <h2>📌 Usage</h2>
  <ol>
    <li>Start backend (<code>npm start</code> in <code>oralvis-backend</code>).</li>
    <li>Start frontend (<code>npm start</code> in <code>oralvis-frontend</code>).</li>
    <li>Open browser at <b>http://localhost:3000</b>.</li>
  </ol>

  <h2>🤝 Contributing</h2>
  <p>
    Contributions are welcome!  
    Fork the repo → Create a branch → Submit a Pull Request.
  </p>

  <h2>📄 License</h2>
  <p>This project is licensed under the <b>MIT License</b>.</p>

</body>
</html>
