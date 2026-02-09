# Fix Email Null Constraint Violation in Registration

## Tasks
- [x] Update Zod schemas in `src/lib/validations/auth.ts` to require email in both mobile and email contact schemas
- [x] Modify `src/components/Register/StepContact.tsx` to always display and require the email field
- [x] Update validation logic in `StepContact.tsx` to always check for email
- [x] Adjust `src/pages/Register.tsx` to ensure email is always included in form data
- [x] Update `src/components/Register/StepReview.tsx` to always display the email field
- [x] Test the changes to ensure registration works without null email errors
