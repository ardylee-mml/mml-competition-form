import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            <div className="mb-8">
              <Image
                src="/images/metaminding-logo.png"
                alt="MetaMinding Lab Logo"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold mb-6">
              Application Period Has Ended
            </h1>
            <p className="text-lg mb-6">
              Thank you for your interest in the MML Roblox Game and Development
              Competition. The application period has now closed.
            </p>
            <p className="text-lg mb-8">
              For all details about the competition and future updates, please
              join our Discord server.
            </p>
            <Button
              asChild
              className="bg-[#5865F2] hover:bg-[#4752C4] flex items-center gap-2"
            >
              <Link href="https://discord.gg/TF7GXpkt" target="_blank">
                <Image
                  src="/images/Discord-logo.png"
                  alt="Discord Logo"
                  width={24}
                  height={24}
                  className="inline-block"
                />
                Join MetaMinding Lab Discord
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
