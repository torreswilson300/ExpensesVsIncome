import { sql } from '../config/db.js'; // Import the SQL connection



export async function getTransactionsByUserId(req, res) {
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
} //Controller function to get transactions by user ID
export async function createTransaction(req, res){
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


} //Controller function to create a new transaction
export async function deleteTransaction(req, res) {
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
} //Controller function to delete a transaction by ID
export async function getTransactionSummary(req, res) {
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
}