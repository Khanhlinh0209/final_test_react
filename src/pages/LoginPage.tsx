import { isAxiosError } from "axios";
import { useState, type SubmitEvent } from "react";
import { useAuth } from "../hooks/useAuth";

type LoginPageProps = {
  onLoginSuccess?: () => void;
};

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password.trim());
      onLoginSuccess?.();
    } catch (err) {
      if (!import.meta.env.VITE_API_BASE_URL) {
        setError("Missing VITE_API_BASE_URL. Create .env (not .env.example) then restart npm run dev.");
      } else if (isAxiosError(err)) {
        const status = err.response?.status;
        setError(
          status
            ? `Login request failed (HTTP ${status}). Check /login/1 endpoint and CORS.`
            : "Cannot reach MockAPI. Check VITE_API_BASE_URL and internet connection.",
        );
      } else {
        setError("Login failed. Email must match mockapi and password is 123456.");
      }
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>Login</h1>
      <form id="login-form" className="form" onSubmit={(event) => void handleLogin(event)}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="test@gmail.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="123456"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
