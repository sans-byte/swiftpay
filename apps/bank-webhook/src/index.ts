import express from "express";
import db from "@repo/db/client";
const app = express();
const PORT = 3002;

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.post("/hdfcWebhook", async (req, res) => {
  try {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
      token: string;
      userId: string;
      amount: string;
    } = {
      token: req.body.token,
      userId: req.body.userId,
      amount: req.body.amount,
    };
    // Update balance in db, add txn
    await db.$transaction([
      db.balance.update({
        where: { userId: Number(paymentInformation.userId) },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.json({
      message: "Captured",
    });
  } catch (error) {
    console.log(error);
    res.status(411).json({
      message: "error while processing webhook",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
