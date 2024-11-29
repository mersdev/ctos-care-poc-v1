import { Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { EncryptionService } from "../config/encryption.js";
import { Transaction } from "../models/transaction.js";

interface EncryptedData {
  encrypted_data: string;
  recipient_id: string;
}

export const TransactionController = {
  // Create Transaction
  createTransaction: async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionData: Transaction = req.body.transactionData;
      const recipientId = req.body.recipientId;
      const userId = req.user?.id;

      if (!userId || !recipientId) {
        res.status(400).json({ error: "User ID and recipient ID are required" });
        return;
      }

      // Encrypt transaction data with recipient's public key
      const encryptedTransaction = await EncryptionService.encrypt(transactionData, recipientId);

      const { data, error } = await supabase
        .from("transactions")
        .insert({ 
          encrypted_data: encryptedTransaction,
          sender_id: userId,
          recipient_id: recipientId
        })
        .select();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "Transaction creation failed" });
    }
  },

  // Read Transactions with Filtering
  getTransactions: async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, category, type } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      let query = supabase
        .from("transactions")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

      // Apply filters if provided
      if (startDate) {
        query = query.gte("created_at", startDate as string);
      }
      if (endDate) {
        query = query.lte("created_at", endDate as string);
      }
      if (category) {
        query = query.eq("category", category as string);
      }
      if (type) {
        query = query.eq("type", type as string);
      }

      const { data, error } = await query;

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // Decrypt transactions if user is recipient
      const decryptedTransactions = await Promise.all(
        data.map(async (transaction) => {
          if (transaction.recipient_id === userId) {
            const decryptedData = await EncryptionService.decrypt(
              transaction.encrypted_data,
              userId // Pass the user ID for decryption
            );
            return { ...transaction, decrypted_data: decryptedData };
          }
          return transaction;
        })
      );

      res.json(decryptedTransactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  },

  // Delete Transaction
  deleteTransaction: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("sender_id", userId);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  }
};
