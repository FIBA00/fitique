/* Lavender Lookbook registration: a restrained, clear form that introduces the personal boutique promise without clutter. */
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

// ! internal imports
import Brand from "../../../components/brand.jsx";
import { authService } from "../api/auth.api.js";
import { useSessionStore } from "../hooks/useSession.js";
import { usePageMeta } from "../../../hooks/usePageMeta.js";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your name."),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function Register() {
  usePageMeta(
    "Create account",
    "Create a Fitique account for a more personal boutique experience.",
  );
  const navigate = useNavigate();
  const setUser = useSessionStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user);
      navigate("/profile");
    },
  });

  return (
    <main className="grid min-h-screen bg-fitique-ivory lg:grid-cols-[1.1fr_.9fr]">
      <section className="flex items-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Brand />
          <p className="eyebrow mt-12 text-fitique-brown">
            A little more personal
          </p>
          <h1 className="serif mt-3 text-5xl tracking-[-.04em] text-fitique-plum">
            Make room for your style.
          </h1>
          <p className="mt-3 text-sm leading-6 text-fitique-ink/65">
            Create your Fitique profile to keep pieces close, track delivery,
            and save your fit preferences.
          </p>
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="mt-8 grid gap-5"
          >
            <label>
              <span className="field-label">Your name</span>
              <input
                className="field-input"
                {...register("name")}
                autoComplete="name"
              />
              {errors.name && (
                <p className="field-error">{errors.name.message}</p>
              )}
            </label>
            <label>
              <span className="field-label">Email address</span>
              <input
                className="field-input"
                type="email"
                {...register("email")}
                autoComplete="email"
              />
              {errors.email && (
                <p className="field-error">{errors.email.message}</p>
              )}
            </label>
            <label>
              <span className="field-label">Password</span>
              <input
                className="field-input"
                type="password"
                {...register("password")}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="field-error">{errors.password.message}</p>
              )}
            </label>
            <label>
              <span className="field-label">Confirm password</span>
              <input
                className="field-input"
                type="password"
                {...register("confirmPassword")}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword.message}</p>
              )}
            </label>
            {mutation.isError && (
              <p
                role="alert"
                className="border border-[#ddb6b6] bg-[#fbebeb] p-3 text-sm text-[#893838]"
              >
                We could not create your account. Please try again.
              </p>
            )}
            <button
              disabled={mutation.isPending}
              className="plum-button focus-ring mt-2 w-full disabled:opacity-60"
            >
              {mutation.isPending ? "Creating your account…" : "Create account"}
              <ArrowRight size={15} />
            </button>
          </form>
          <p className="mt-7 text-sm text-fitique-ink/65">
            Already have an account?{" "}
            <Link
              to="/login"
              className="focus-ring font-extrabold text-fitique-plum hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
      <section className="hidden bg-fitique-lilac/55 p-12 lg:flex lg:flex-col lg:justify-end">
        <div className="max-w-sm">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-fitique-plum text-white">
            <Sparkles size={20} />
          </span>
          <p className="serif mt-6 text-5xl leading-none text-fitique-plum">
            A boutique that learns your rhythm.
          </p>
          <p className="mt-5 text-sm leading-7 text-fitique-ink/70">
            Save the pieces that move you and keep optional fit notes in one
            calm, private place.
          </p>
        </div>
      </section>
    </main>
  );
}
