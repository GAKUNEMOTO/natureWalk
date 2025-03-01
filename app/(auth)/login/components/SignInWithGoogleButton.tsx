"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-action";
import { FaGoogle } from "react-icons/fa";

import React from "react";

const SignInWithGoogleButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle();
      }}
    >
    <FaGoogle className="mr-2" />
      Login with Google
    </Button>
  );
};

export default SignInWithGoogleButton;