Below is an example of how to create an Express server.

**Folder Structure:**

```bash
project/
app.js
package.json
models/
user.js
product.js
controllers/
userController.js
productController.js
services/
userService.js
productService.js
middlewares/
authMiddleware.js
uploadMiddleware.js
routes/
userRoutes.js
productRoutes.js
config/
database.js
server.js
utils/
logger.js
index.js
```

**app.js:**

```javascript
// Import required modules
const express = require('express');
const logger = require('./utils/logger');
const config = require('./config/database');

// Create an Express application
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route prefix
const prefix = '/api/v1';

// Routes
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/products`, productRoutes);

// Start server
const port = 3000;
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
```

**models/user.js:**

```javascript
// Define user model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

**controllers/userController.js:**

```javascript
// Import user model
const User = require('../models/user');

// Define user controller
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve users' });
        }
    }

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create user' });
        }
    }
}

module.exports = UserController;
```

**routes/userRoutes.js:**

```javascript
// Import user controller
const UserController = require('../controllers/userController');

// Define user routes
const router = require('express').Router();

router.get('/', UserController.getAllUsers);
router.post('/', UserController.createUser);

module.exports = router;
```

**package.json:**

```json
{
    "name": "temp-server",
    "version": "1.0.0",
    "main": "app.js",
    "scripts": {
        "start": "node app.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "dependencies": {
        "express": "^4.21.2",
        "mongoose": "^6.3.0"
    }
}
```

**server.js:**

```javascript
// Import required modules
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./config/database');

// Connect to MongoDB
mongoose.connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true });

// Define server
const app = require('./app.js');

// Start server
const port = 3000;
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
```

To start the server, run the following command:

```bash
npm start
```

Now, you can access the server at `http://localhost:3000/api/v1/users` and `http://localhost:3000/api/v1/products`.