import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "회원가입 | rental house" };

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
