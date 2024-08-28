"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const createP2PTransfer = async (phone: string, amount: number) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }
  const recipient = await prisma.user.findUnique({
    where: {
      number: phone,
    },
  });
  if (!recipient) {
    return "No recipient found";
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * from "Balance" WHERE "userId" = ${Number(userId)} FOR UPDATE`;
      const sender = await tx.balance.findUnique({
        where: {
          userId: Number(userId),
        },
      });
      console.log("before promise");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("after promise");

      if (!sender || sender.amount < amount) {
        throw new Error("Insufficient balance");
      }

      await tx.balance.update({
        where: {
          userId: recipient.id,
        },
        data: {
          amount: {
            increment: amount,
          },
        },
      });

      await tx.balance.update({
        where: {
          userId: Number(userId),
        },
        data: {
          amount: {
            decrement: Number(amount),
          },
        },
      });
    });

    return "Transfer successful";
  } catch (error) {
    console.log(error);
    return "Something went wrong";
  }
};
