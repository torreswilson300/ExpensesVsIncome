import express from 'express'; // Import the express module to create a web server  
import dotenv from 'dotenv'; //Import dotenv to manage environment variables
import {sql} from './config/db.js'; // Import the sql const from the db.js file
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js'; // Import the transactions route
import {connectToDatabase} from './config/db.js'; // Import the function to connect to the database

//reads the .env file and makes the variables available in process.env  
dotenv.config();

// Create an instance of an Express application
const app = express();

//Middleware
app.use(rateLimiter)
app.use(express.json()); // Middleware to parse JSON request bodies
// Set the port to the value from the environment variable (.env) or default to 5001
const PORT = process.env.PORT || 5001;




//DECIMAL(10,2) allows for 10 digits in total, with 2 digits after the decimal point, 999999999.99 (8 digits before the decimal point and 2 after)
app.get("/", (req, res) => {
    res.send('Welcome to the Transactions API'); // Respond with a welcome message
});

app.use('/api/transactions', transactionsRoute); // Use the transactions route for any requests to /api/transactions


//initialize the database connection then start the server
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`, PORT);
    });
}
).catch((error) => {
    console.error('Failed to start the server:', error);
    process.exit(1); // Exit the process with an error code
}
);