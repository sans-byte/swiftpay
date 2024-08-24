import { PrismaClient } from "@repo/db/client";

export default async function Home() {
  const client = new PrismaClient();

  const res = await client.user.findMany();

  console.log(res);
  return <div className="text-2xl">Hi there</div>;
}
