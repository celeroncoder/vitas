"use client";

import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import React from "react";
import { Loader2, Mail } from "lucide-react";

export default function SendTest() {
  const [loading, setLoading] = React.useState(false);

  const action = async () => {
    setLoading(true);
    const res = await api.get(`/email/idcard/600`, {
      timeoutErrorMessage: "timeout",
      timeout: 100000,
    });
    console.log(res.status, res.data);
    setLoading(false);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <Button onClick={action} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        {loading ? "Please Wait" : "Send Test Email"}
      </Button>
    </div>
  );
}
