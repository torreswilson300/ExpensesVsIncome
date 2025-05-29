import express from 'express'; // Import the express module to create a web server  
import dotenv from 'dotenv'; //Import dotenv to manage environment variables
import {sql} from './config/db.js'; // Import the sql const from the db.js file

//reads the .env file and makes the variables available in process.env  
dotenv.config();

// Create an instance of an Express application
const app = express();
// Set the port to the value from the environment variable (.env) or default to 5001
const PORT = process.env.PORT || 5001;

app.use(express.json()); // Middleware to parse JSON request bodies

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
app.get("/", (req, res) => {
    res.send('Welcome to the Transactions API'); // Respond with a welcome message
});
app.get('/api/transactions/:userId', async (req, res) => {
try {
    const { userId } = req.params; // Extract user ID from the request parameters
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC   
    `
  
    // Fetch transactions for the specified user ID from the database
   
    
    res.status(200).json(transactions); // Respond with the list of transactions
    
} catch (error) {  
    console.log('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
    
}
})
app.post('/api/transactions', async (req, res) => {
    //title, amount, category, user_id
    try {
        // Destructure the required fields from the request body
        const{title, amount, category, user_id} = req.body;
        // Validate that all required fields are present
        if (!title || amount === undefined || !category || !user_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Insert the new transaction into the database
        const transaction =
        await sql`INSERT INTO transactions (user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `
        console.log("Transaction created:", transaction[0]);
        res.status(201).json(transaction[0]); // Respond with the created transaction
    } catch (error) {
        console.log ("Error in creating transaction:", error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
});
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const {id} = req.params; // Extract transaction ID from the request parameters
        if(isNaN(parseInt(id))){
            return res.status(400).json({ error: 'Invalid transaction ID' }); // If ID is not a number, respond with 400
        }
        const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `
        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' }); // If no transaction is found, respond with 404
        }
        res.status(200).json({ message: 'Transaction deleted successfully', transaction: result[0] }); // Respond with success message and deleted transaction details
    } catch (error) {   
        console.log('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
})
app.get('/api/transactions/summary/:userId', async (req, res) =>{
    try {
        const {userId} = req.params; // Extract user ID from the request parameters
        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions 
        WHERE user_id = ${userId}
        ` // Fetch the transaction summary for the specified user ID
        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) AS income FROM transactions 
        WHERE user_id = ${userId} AND amount > 0
        ` // Calculate total income for the user
        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount),0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        ` // Calculate total expenses for the user
        res.status(200).json({
            balance: balanceResult[0].balance || 0, // Return the balance(from table), defaulting to 0 if null
            income: incomeResult[0].income || 0, // Return total income(from table), defaulting to 0 if null
            expense: expenseResult[0].expense || 0 // Return total expenses(from table), defaulting to 0 if null
        });
        
    } catch (error) {
        console.log('Error fetching transaction summary:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
})



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