# Folder Structure

notes-backend/
│── src/
│   ├── config/         # Mongo connection, env setup
│   ├── controllers/    # Business logic for routes
│   ├── models/         # Mongoose models (User, Note)
│   ├── routes/         # Express route files
│   ├── middlewares/    # Auth, validation, error handling
│   ├── utils/          # Helpers (token generation, etc.)
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
│
│── tests/              # Jest + Supertest
│── .env                # Environment variables
│── package.json
│── README.md
