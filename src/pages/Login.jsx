import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { ROUTES } from "../utils/constants";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!supabase) {
      alert("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
    else navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-[#f0fdf4] to-white p-6">
      <div className="w-full max-w-[380px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm">
            <Leaf className="h-7 w-7" strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-center text-xl font-semibold text-[#111827]">Welcome back</h2>
        <p className="mt-1 text-center text-sm text-[#6b7280]">Sign in to RentMate</p>
        <div className="mt-6 flex flex-col gap-4">
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <Button type="button" onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-xs text-[#6b7280]">
          New here?{" "}
          <Link to={ROUTES.SIGNUP} className="font-medium text-green-600 hover:text-green-700">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
