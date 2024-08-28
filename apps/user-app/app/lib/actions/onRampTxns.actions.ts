"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const createOnRampTxn = async (amount: number, provider: string) => {
  const token = Math.random().toString(); //In real world this token should come from the bank server
  const session = await getServerSession(authOptions);
  const userId = Number(session.user.id);
  if (!userId) {
    return {
      message: "User not logged in",
    };
  }
  try {
    await prisma.onRampTransaction.create({
      data: {
        status: "Processing",
        startTime: new Date(),
        amount,
        provider,
        userId: userId,
        token,
      },
    });
    return {
      message: "Transaction added",
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Something went wrong",
    };
  }
};
