import React, { useState } from "react";
// BUG FIX: `motion` was used throughout this file but never imported.
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import apiClient from "../api/client.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = { fullName: "", email: "", message: "" };

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (form.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

const fieldClasses = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-2.5 text-base shadow-sm outline-none transition focus:ring-4 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
  }`;

export default function ContactUs() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");

    try {
      const { data } = await apiClient.post("/api/contact", form);

      if (data?.success) {
        setStatus("success");
        setSuccessMessage(
          data.message || "Your message has been sent successfully!"
        );
        setForm(INITIAL_FORM);
      } else {
        setStatus("error");
        setErrors(data?.errors || {});
        setServerError(data?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      const backendErrors = err?.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
      }
      setServerError(
        err?.response?.data?.message ||
          "Couldn't reach the server. Please try again later."
      );
    }
  }

  function handleSendAnother() {
    setStatus("idle");
    setSuccessMessage("");
    setServerError("");
    setErrors({});
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto"
    >
      <Link
        to="/"
        className="inline-block text-sm text-brand-600 hover:text-brand-700 mb-4"
      >
        &larr; Back to home
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-brand-800 mb-2">
        Contact Us
      </h1>
      <p className="text-slate-500 mb-6">
        Have a question or feedback? Send us a message and we&apos;ll get
        back to you.
      </p>

      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md overflow-hidden">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-8 h-8 text-brand-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </motion.div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Message Sent!
              </h2>
              <p className="text-slate-500 mb-6">{successMessage}</p>
              <button
                type="button"
                onClick={handleSendAnother}
                className="rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={fieldClasses(Boolean(errors.fullName))}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={fieldClasses(Boolean(errors.email))}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className={`${fieldClasses(Boolean(errors.message))} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {serverError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {serverError}
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors shadow-sm"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
    </div>
  );
}
