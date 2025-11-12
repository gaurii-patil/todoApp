To-Do Full-Stack App (EJS + Express + MongoDB + Bootstrap)
==========================================================

How to run:
1. Install Node.js and MongoDB.
2. In the project folder, run `npm install`.
3. Start MongoDB locally or set MONGODB_URI to a cloud MongoDB Atlas URI.
4. Run `npm start` and open http://localhost:3000.

Notes:
- Views are in /views (index.ejs using Bootstrap CDN + custom CSS).
- Static assets in /public (style.css).
- Server renders tasks server-side; forms submit POST requests to add/toggle/delete tasks.