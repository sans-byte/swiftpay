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

      await tx.p2pTransfer.create({
        data: {
          amount,
          timestamp: new Date(),
          fromUserId: Number(userId),
          toUserId: recipient.id,
        },
      });
    });
    return "Transfer successful";
  } catch (error) {
    console.log(error);
    return "Something went wrong";
  }
};
