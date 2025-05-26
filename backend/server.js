import express from 'express'; // Import the express module to create a web server  
import dotenv from 'dotenv'; //Import dotenv to manage environment variables
import {sql} from './config/db.js'; // Import the sql const from the db.js file

//reads the .env file and makes the variables available in process.env  
dotenv.config();

// Create an instance of an Express application
const app = express();
// Set the port to the value from the environment variable (.env) or default to 5001
const PORT = process.env.PORT || 5001;

async function connectToDatabase() {
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY, 
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log('Database connection established successfully');
        
    }catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code 
    }
}

//DECIMAL(10,2) allows for 10 digits in total, with 2 digits after the decimal point, 999999999.99 (8 digits before the decimal point and 2 after)

app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
}
);


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