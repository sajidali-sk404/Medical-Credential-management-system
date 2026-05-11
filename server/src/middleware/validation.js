// src/middleware/validate.js

// ── Auth validators ────────────────────────────────────────────────
export const validateRegister = (req, res, next) => {
  const { name, email, password, company_name } = req.body
  const errors = []

  if (!name?.trim())
    errors.push("Name is required")
  else if (name.trim().length < 2)
    errors.push("Name must be at least 2 characters")
  else if (name.trim().length > 100)
    errors.push("Name must be under 100 characters")

  if (!email?.trim())
    errors.push("Email is required")
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Invalid email format")

  if (!password)
    errors.push("Password is required")
  else if (password.length < 8)
    errors.push("Password must be at least 8 characters")
  else if (!/[A-Za-z]/.test(password))
    errors.push("Password must contain at least one letter")
  else if (!/[0-9]/.test(password))
    errors.push("Password must contain at least one number")

  if (!company_name?.trim())
    errors.push("Company name is required")
  else if (company_name.trim().length < 2)
    errors.push("Company name must be at least 2 characters")

  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = []

  if (!email?.trim())   errors.push("Email is required")
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Invalid email format")

  if (!password)        errors.push("Password is required")

  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}

// ── Request validators ─────────────────────────────────────────────
const VALID_SPECIALTIES = [
  "Cardiology", "Radiology", "Pediatrics", "Surgery",
  "Neurology", "Oncology", "Orthopedics", "Dermatology",
  "Hematology", "Psychiatry", "Ophthalmology", "Urology",
  "Gynecology", "Endocrinology", "Nephrology", "Pulmonology",
]

export const validateRequest = (req, res, next) => {
  const { provider_name, specialty, notes } = req.body
  const errors = []

  if (!provider_name?.trim())
    errors.push("Provider name is required")
  else if (provider_name.trim().length < 3)
    errors.push("Provider name must be at least 3 characters")
  else if (provider_name.trim().length > 100)
    errors.push("Provider name must be under 100 characters")
  else if (!/^[a-zA-Z\s.\-']+$/.test(provider_name.trim()))
    errors.push("Provider name can only contain letters, spaces, dots, hyphens")

  if (!specialty?.trim())
    errors.push("Specialty is required")
  else if (!VALID_SPECIALTIES.includes(specialty.trim()))
    errors.push(`Specialty must be one of: ${VALID_SPECIALTIES.join(", ")}`)

  if (notes && notes.length > 1000)
    errors.push("Notes must be under 1000 characters")

  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}

// ── Status update validator ────────────────────────────────────────
const VALID_STATUSES = ["pending", "in_review", "approved", "rejected"]

export const validateStatusUpdate = (req, res, next) => {
  const { status, note } = req.body
  const errors = []

  if (!status)
    errors.push("Status is required")
  else if (!VALID_STATUSES.includes(status))
    errors.push(`Status must be one of: ${VALID_STATUSES.join(", ")}`)

  if (note && note.length > 500)
    errors.push("Note must be under 500 characters")

  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}

// ── Support ticket validator ───────────────────────────────────────
export const validateTicket = (req, res, next) => {
  const { subject, message } = req.body
  const errors = []

  if (!subject?.trim())
    errors.push("Subject is required")
  else if (subject.trim().length < 5)
    errors.push("Subject must be at least 5 characters")
  else if (subject.trim().length > 200)
    errors.push("Subject must be under 200 characters")

  if (!message?.trim())
    errors.push("Message is required")
  else if (message.trim().length < 10)
    errors.push("Message must be at least 10 characters")
  else if (message.trim().length > 2000)
    errors.push("Message must be under 2000 characters")

  if (errors.length) return res.status(400).json({ message: errors[0], errors })
  next()
}

// ── Resolve ticket validator ───────────────────────────────────────
export const validateResolve = (req, res, next) => {
  const { resolution_note } = req.body

  if (resolution_note && resolution_note.length > 500)
    return res.status(400).json({ message: "Resolution note must be under 500 characters" })

  next()
}

// ── MongoDB ObjectId validator ─────────────────────────────────────
export const validateObjectId = (req, res, next) => {
  const id = req.params.id || req.params.docId
  if (id && !/^[a-f\d]{24}$/i.test(id)) {
    return res.status(400).json({ message: "Invalid ID format" })
  }
  next()
}