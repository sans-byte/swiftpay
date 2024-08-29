"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/cardComponent";
import { TextInput } from "@repo/ui/textinput";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { createP2PTransfer } from "../../lib/actions/p2pTxns.actions";

export default function () {
  const session = useSession();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div>
      <div className="flex justify-center items-center w-[700px] h-[500px]">
        <Card title="P2P tansfer">
          <div className="w-full">
            <TextInput
              label={"Phone Number"}
              placeholder={"1234567890"}
              onChange={(phone: string) => {
                setPhone(phone);
              }}
            />
            <TextInput
              label={"Amount"}
              placeholder={"1000"}
              onChange={(amount: string) => {
                setAmount(amount);
              }}
            />

            <div className="flex justify-center pt-4">
              <Button
                onClick={async () => {
                  const res = await createP2PTransfer(
                    phone,
                    Number(amount) * 100
                  );
                  console.log(res);
                }}
              >
                Send Money
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
