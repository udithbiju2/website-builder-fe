import { useEffect, useState, type FormEvent } from "react";
import { Button, Spinner } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth.ts";
import { ApiError, errorMessage } from "../../api/http.ts";
import { useAuth } from "../../auth/auth-context.ts";
import { homeForRole } from "../../auth/home-for-role.ts";
import { PASSWORD_HINT, validatePassword } from "../../auth/validation.ts";
import FormAlert from "../../components/ui/FormAlert.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import AuthCardLayout from "../../layouts/AuthCardLayout.tsx";

type LinkState =
  | { status: "checking" }
  | { status: "valid"; email: string; isInvite: boolean }
  | { status: "invalid"; message: string };

export default function ResetPasswordPage() {
  const token = useSearchParams()[0].get("token") ?? "";
  const navigate = useNavigate();
  const { setSessionUser } = useAuth();

  const [link, setLink] = useState<LinkState>({ status: "checking" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi
      .previewPasswordReset(token)
      .then(({ email, isInvite }) => !cancelled && setLink({ status: "valid", email, isInvite }))
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError && err.status === 400
            ? "This reset link is invalid or has expired."
            : errorMessage(err);
        setLink({ status: "invalid", message });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = {
      password: validatePassword(password),
      confirm: password === confirm ? undefined : "Passwords don't match",
    };
    setErrors(nextErrors);
    setError(null);
    if (nextErrors.password || nextErrors.confirm) return;

    setSubmitting(true);
    try {
      const { user } = await authApi.resetPassword(token, password);
      setSessionUser(user);
      navigate(homeForRole(user), { replace: true });
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors());
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (link.status === "checking") {
    return (
      <AuthCardLayout>
        <div className="grid place-items-center py-10">
          <Spinner aria-label="Checking reset link" />
        </div>
      </AuthCardLayout>
    );
  }

  if (link.status === "invalid") {
    return (
      <AuthCardLayout>
        <h1 className="text-xl font-semibold text-ink">Reset link unavailable</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-body">{link.message}</p>
        <Link to="/forgot-password" className={`${buttonVariants({ fullWidth: true })} mt-6`}>
          Request a new link
        </Link>
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {link.isInvite ? "Welcome" : "Step 3 · From email link"}
      </p>
      <h1 className="mt-2 text-xl font-semibold text-ink">
        {link.isInvite ? "Set your password" : "Set a new password"}
      </h1>
      <p className="mt-2 text-sm text-ink-body">
        {link.isInvite ? "Choose a password for " : "For "}
        <strong className="font-semibold text-ink">{link.email}</strong>
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
        <input type="email" name="email" autoComplete="username" value={link.email} readOnly hidden />
        <TextInput
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          description={PASSWORD_HINT}
          autoFocus
        />
        <TextInput
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
        />
        <Button type="submit" fullWidth isPending={submitting}>
          Save and log in
        </Button>
        {error && <FormAlert status="danger">{error}</FormAlert>}
      </form>
    </AuthCardLayout>
  );
}
