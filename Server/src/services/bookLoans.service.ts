

import { Prisma } from "@prisma/client";
import express from "express";
import { prisma } from "../utils/PrismaClient"
import { v4 as uuidv4 } from 'uuid';

// DEFINE TYPES
interface BookLoan extends Prisma.book_loansUncheckedCreateInput {
}

// DEFINE GET ALL BORROWERS ROUTE
export const getAllBookLoans = async (
    req: express.Request,
    res: express.Response
) => {
    const onlyMeta: Boolean = Boolean(req.query["onlyMeta"])

    if (onlyMeta == true) {
        console.log("[server] Getting Loans Meta")
        return res.json({ "Amount": await prisma.book_loans.count() })
    }

    console.log("[server] Getting all Loans")
    return res.json(await prisma.book_loans.findMany());
};

// DEFINE GET BORROWER
export const getBookLoan = async (
    req: express.Request,
    res: express.Response
) => {
    const { loan_id } = req.params;
    const book_loan = await prisma.book_loans.findUnique({
        where: {
            loan_id: loan_id,
        },
    });

    if (book_loan) {
        console.log("[server] Retrieved Book Loan " + loan_id);
        return res.json(book_loan);
    }
    else {
        console.log("[server] Could not retrieve Book Loan" + loan_id)
        return res.status(400).json(loan_id);
    }
};

/*
model book_loans {
  loan_id  String   @id @db.VarChar
  isbn     String   @db.VarChar
  card_id  String   @db.VarChar
  date_out DateTime @db.Date
  due_date DateTime @db.Date
  date_in  DateTime @db.Date
  borrower borrower @relation(fields: [card_id], references: [card_id], onDelete: NoAction, onUpdate: NoAction)
  book     book     @relation(fields: [isbn], references: [isbn], onDelete: NoAction, onUpdate: NoAction)
  fines    fines?
}
*/
// DEFINE GET BORROWER
export const createBookLoan = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const loan_id: string = uuidv4();

        // GET QUERY PARAMS
        const isbn: string = req.body['isbn'];
        const card_id: string = req.body['card_id'];
        const date_out: Date = new Date(req.body['date_out']);
        const due_date: Date = new Date(req.body['due_date']);
        const date_in: Date = new Date()


        const bookLoan: BookLoan = {
            loan_id: loan_id,
            isbn: isbn,
            card_id: card_id,
            date_out: date_out,
            due_date: due_date,
            date_in: date_in
        }

        // CREATE IN DATABASE
        const bookLoanCreate = await prisma.book_loans.create({
            data: bookLoan
        });


        if (bookLoanCreate) {
            console.log('[server] Created a new Book Loan ' + loan_id)
            return res.json(bookLoanCreate);
        } else {
            return res.status(404).json({ "Success": "Failure", "Message": "Book Loan could not be created." })
        }

    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(409).json({ message: err.message });
        }
    }
};


// DELETE BOOK 
export const deleteBookLoan = async (req: express.Request, res: express.Response) => {
    // GET fine FROM PARAMS
    const { loan_id } = req.params

    // DELETE fine
    const deletingBookLoan = await prisma.book_loans.delete({ where: { loan_id: loan_id } })

    if (deletingBookLoan) {
        return res.json(deletingBookLoan)
    } else {
        return res.status(400).json({ "Success": "Failure", "Message": "Fine could not be deleted due to non existent resource." })
    }
}

// UPDATE fine
export const updateBookLoan = async (req: express.Request, res: express.Response) => {
    // GET fine FROM PARAMS
    const { loan_id } = req.params

    // GET DATA FROM ISBN
    const data = req.body

    // UPDATE
    const updatingBookLoan = await prisma.book_loans.update({ where: { loan_id: loan_id }, data: data })

    // ERROR HANDLING
    if (updatingBookLoan) {
        return res.json(updatingBookLoan)
    } else {
        return res.status(400).json({ "Success": "Failure", "Message": "Could not update fine for some reason" })
    }
}



