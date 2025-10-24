import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Image, X, UploadCloud, Check } from "lucide-react";

// Polished Site Settings UI
// - Tailwind CSS classes used for styling
// - Drag & drop + file picker for logo
// - Image preview with clear/remove
// - Inline field validation + nice buttons
// - Success / error toasts and subtle animations
// - Accessible labels and keyboard-friendly

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    site_name: "",
    site_address: "",
    email: "",
    phone: "",
    site_logo: null, // File object
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/site-settings")
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data ?? res.data ?? {};
        setForm((f) => ({
          ...f,
          site_name: data.site_name ?? "",
          site_address: data.site_address ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        }));
        if (data.site_logo) setLogoPreview(data.site_logo);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load settings. Please refresh.");
      })
      .finally(() => (mounted ? setLoading(false) : null));
    return () => (mounted = false);
  }, []);

  function handleFile(file) {
    if (!file) return;
    // Basic image size/type checks (client-side)
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB client side limit (informative)
      setError("Image too large — please use a file under 2MB.");
      return;
    }
    setForm((f) => ({ ...f, site_logo: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
    setError("");
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0] ?? null;
    handleFile(file);
  }

  function handleDrag(e) {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    setError("");
    if (!form.site_name.trim()) return "Site name is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email.";
    if (form.phone && !/^[\d+\-\s()]{6,20}$/.test(form.phone)) return "Invalid phone.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("site_name", form.site_name);
      fd.append("site_address", form.site_address);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      if (form.site_logo) fd.append("site_logo", form.site_logo);

      const res = await axios.post("/api/site-settings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data?.data ?? res.data ?? {};
      setSuccess("Settings saved successfully.");
      if (data.site_logo) setLogoPreview(data.site_logo);
      setForm((f) => ({ ...f, site_logo: null }));
      if (fileRef.current) fileRef.current.value = "";

      // Auto-hide success after 3s
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Failed to save settings.");
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function removeLogo() {
    setForm((f) => ({ ...f, site_logo: null }));
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Site Settings</h2>
            <p className="text-sm text-gray-500">Update site branding and contact details</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // quick preview action (optional)
                setSuccess("");
                setError("");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              Preview
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Toasts */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded">
                  <Check size={16} />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded">
                  <X size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">Fields marked with <span className="font-medium">*</span> are required</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Logo area */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>

              <div
                onDrop={handleDrop}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                className={`rounded-lg border-dashed border-2 p-3 flex flex-col items-center justify-center gap-3 min-h-[170px] transition-all ${
                  dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'
                }`}
                aria-label="Drop logo here"
              >
                {logoPreview ? (
                  <div className="w-full h-full flex flex-col items-center gap-3">
                    <div className="w-full h-36 rounded overflow-hidden bg-white border flex items-center justify-center">
                      <img src={logoPreview} alt="Logo preview" className="object-contain w-full h-full" />
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <label className="flex-1 text-sm text-gray-600">Uploaded logo preview</label>
                      <button type="button" onClick={removeLogo} className="px-3 py-1 text-sm rounded border">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <UploadCloud size={36} />
                    <div className="text-sm">Drag & drop an image here</div>
                    <div className="text-xs text-gray-400">or</div>
                    <div>
                      <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded bg-white border">
                        <input
                          ref={fileRef}
                          id="site_logo_input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <span className="text-sm">Choose file</span>
                      </label>
                    </div>
                    <div className="text-xs text-gray-400">PNG, JPG, SVG — Recommended 300×300 — max 2MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Fields */}
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Name <span className="text-red-500">*</span></label>
                <input
                  name="site_name"
                  value={form.site_name}
                  onChange={handleChange}
                  placeholder="Example: My Company"
                  className="mt-2 block w-full rounded-md p-3 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Site Address</label>
                <textarea
                  name="site_address"
                  value={form.site_address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Street, City, State, Country"
                  className="mt-2 block w-full rounded-md p-3 border"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="mt-2 block w-full rounded-md p-3 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="mt-2 block w-full rounded-md p-3 border"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
                    <span>Save Settings</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    axios
                      .get("/api/site-settings")
                      .then((res) => {
                        const data = res.data?.data ?? res.data ?? {};
                        setForm((f) => ({
                          ...f,
                          site_name: data.site_name ?? "",
                          site_address: data.site_address ?? "",
                          email: data.email ?? "",
                          phone: data.phone ?? "",
                          site_logo: null,
                        }));
                        setLogoPreview(data.site_logo ?? null);
                        if (fileRef.current) fileRef.current.value = "";
                        setError("");
                        setSuccess("");
                      })
                      .catch(() => setError("Failed to reload."))
                      .finally(() => setLoading(false));
                  }}
                  className="px-3 py-2 rounded-md border"
                >
                  Reset
                </button>

                <div className="ml-auto text-xs text-gray-400">Last saved: —</div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      <div className="mt-4 text-sm text-gray-500">Tip: You can paste an SVG or PNG directly as logo for sharper results.</div>
    </div>
  );
}
