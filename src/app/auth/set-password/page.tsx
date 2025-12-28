'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SetPasswordPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth/reset-password');
    }, [router]);
  return <></>
}