# Registration Form Update Tasks

## Tasks to Complete
- [x] Update src/lib/validations/auth.ts: Add country_id and verification_method to registerSchema
- [x] Update src/components/RegisterModal.tsx: Add country_id and verification_method fields to formData state
- [x] Update src/components/RegisterModal.tsx: Add UI elements for country selection and verification method selection
- [x] Update src/components/RegisterModal.tsx: Import countries list and handle form changes
- [x] Update src/pages/Register.tsx: Add country_id and verification_method fields to formData state and UI
- [x] Update src/pages/Register.tsx: Import countries list and handle form changes
- [x] Test the updated registration form for correct submission with new fields
- [x] Verify API integration and ensure no errors remain

# User Profile API Tasks

## Tasks to Complete
- [x] Add updateUser method to AuthContext and AuthProvider
- [x] Update ProfilePage to use updateUser instead of window.location.reload()
- [x] Update API endpoints to include user ID in URLs to resolve "User not found" error
- [x] Make profile update, picture upload/delete, location update, and name update functional without page reload
- [x] Verify all profile API endpoints work correctly
