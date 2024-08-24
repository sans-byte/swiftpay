import { PrismaClient } from "@repo/db/client";
export default async function Home() {
  const client = new PrismaClient();
  return <div className="text-2xl">Hi there</div>;
}
