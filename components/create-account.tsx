"use client";

import { api } from "@/lib/axios";
import { AccountCreateProps } from "@/lib/validators";
import { User } from "@clerk/nextjs/dist/types/server";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const CreateAccount: React.FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const action = async () => {
    try {
      const payload: AccountCreateProps = { id: user.id };
      const res = await api.post("/account/create", payload);

      if (res.status === 201) {
        setLoading(false);
        router.push("/dashboard");
      } else router.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    router.prefetch("/dashboard");
    (async () => await action())();
  });

  return (
    <Card className="p-5 items-center justify-center flex">
      <div className="flex gap-2 items-center justify-center text-xl font-semibold">
        {loading ? (
          <>
            <Loader2 className="w-8 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <CheckCircle className="text-emerald-500" />
            Account Created 🎊
          </>
        )}
      </div>
    </Card>
  );
};
