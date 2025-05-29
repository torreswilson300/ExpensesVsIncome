import express from 'express';
import {getTransactionsByUserId, 
        createTransaction, 
        deleteTransaction, 
        getTransactionSummary} from '../controllers/transactionsController.js'; // Import the controller function for transactions

const router = express.Router(); //use to route requests to specific endpoints

// Define routes for transactions
router.get('/:userId', getTransactionsByUserId); // Route to get transactions for a specific user ID
router.post('/', createTransaction); // Route to create a new transaction
router.delete('/:id', deleteTransaction); // Route to delete a transaction by ID
router.get('/summary/:userId', getTransactionSummary); // Route to get transaction summary for a specific user ID

export default router;