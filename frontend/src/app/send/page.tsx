"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function PushTestPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const ADMIN_PASSWORD = "blast2026";

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setMessage("");
    } else {
      setMessage("Incorrect password.");
    }
  }

  async function sendNotification(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      setMessage("Title and message are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("user/push/send/", {
        title: title.trim(),
        body: body.trim(),
      });

      console.log(response.data);

      setMessage("Notification sent successfully.");

      setTitle("");
      setBody("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  }

  // Password screen
  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        >
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gray-500">
              BLAST 2026
            </p>

            <h1 className="text-2xl font-bold text-[#172c2a]">
              Push Notifications
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter the admin password to continue.
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#172c2a]"
          />

          {message && <p className="mt-3 text-sm text-red-500">{message}</p>}

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-[#172c2a] px-4 py-3 font-medium text-white transition hover:opacity-90"
          >
            Continue
          </button>

          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <a
              href="https://blastwwc.onrender.com/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#172c2a] transition hover:opacity-60"
            >
              Go to Dashboard →
            </a>
          </div>
        </form>
      </main>
    );
  }

  // Notification page
  return (
    <main className="min-h-screen bg-[#f7f4ed] px-6 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gray-500">
            BLAST 2026
          </p>

          <h1 className="text-3xl font-bold text-[#172c2a]">
            Send Push Notification
          </h1>

          <p className="mt-2 text-gray-500">
            Send a notification to all active subscribers.
          </p>
        </div>

        <form
          onSubmit={sendNotification}
          className="rounded-2xl bg-white p-6 shadow-xl"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Notification title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="BLAST 2026"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter your notification message..."
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#172c2a] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </main>
  );
}
