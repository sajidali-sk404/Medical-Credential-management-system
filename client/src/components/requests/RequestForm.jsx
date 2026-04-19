"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

const SPECIALTIES = [
  "Cardiology","Radiology","Pediatrics","Surgery",
  "Neurology","Oncology","Orthopedics","Dermatology",
];

const ALLOWED_TYPES = ["application/pdf","image/jpeg","image/png","image/webp"];
const MAX_SIZE_MB = 10;

export function RequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    provider_name: "",
    specialty: "",
    notes: "",
  });

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    const valid = [];
    const errors = [];

    picked.forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: invalid type`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name}: >10MB`);
      } else valid.push(file);
    });

    if (errors.length) {
      setError(errors.join(" • "));
      return;
    }

    setError("");
    setFiles(prev => [...prev, ...valid]);
    e.target.value = "";
  };

  const removeFile = (index) =>
    setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: newRequest } = await api.post("/api/requests", form);

      if (files.length > 0) {
        await Promise.all(
          files.map(file => {
            const formData = new FormData();
            formData.append("document", file);
            return api.post(
              `/api/requests/${newRequest._id}/documents`,
              formData
            );
          })
        );
      }

      router.push(`/dashboard/requests/${newRequest._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* Progress */}
      <div className="flex justify-between text-xs">
        {["Provider","Notes","Documents","Review"].map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`h-7 w-7 flex items-center justify-center rounded-full text-xs font-medium
              ${step >= i+1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {step > i+1 ? "✓" : i+1}
            </div>
            <span className={step === i+1 ? "text-foreground font-medium" : "text-muted-foreground"}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-base font-semibold">Provider Information</h2>

              <Input
                placeholder="Dr. Bilal Raza"
                value={form.provider_name}
                onChange={update("provider_name")}
              />

              <select
                value={form.specialty}
                onChange={update("specialty")}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="">Select specialty</option>
                {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
              </select>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <Button
                className="w-full"
                onClick={() => {
                  if (!form.provider_name || !form.specialty) {
                    setError("Fill required fields");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
              >
                Continue →
              </Button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-base font-semibold">Additional Notes</h2>

              <textarea
                value={form.notes}
                onChange={update("notes")}
                rows={4}
                placeholder="Optional notes..."
                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
              />

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue →</Button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-base font-semibold">Upload Documents</h2>

              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted transition">
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs text-muted-foreground">PDF, JPG, PNG (max 10MB)</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {files.map((file, i) => (
                <div key={i} className="flex justify-between items-center border rounded-md px-3 py-2 text-sm">
                  <span className="truncate">{file.name}</span>
                  <button onClick={() => removeFile(i)}>✕</button>
                </div>
              ))}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Continue →</Button>
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <h2 className="text-base font-semibold">Review</h2>

              <div className="text-sm space-y-2">
                <p><strong>Provider:</strong> {form.provider_name}</p>
                <p><strong>Specialty:</strong> {form.specialty}</p>
                <p><strong>Notes:</strong> {form.notes || "—"}</p>
                <p><strong>Files:</strong> {files.length}</p>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}