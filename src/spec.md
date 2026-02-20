# Specification

## Summary
**Goal:** Add password-protected login for Management role during profile setup.

**Planned changes:**
- Add password input field in ProfileSetupModal when Management role is selected
- Validate password matches '*#Sindoor@2025' before allowing profile creation
- Display error message for incorrect password
- Prevent Management profile creation without correct password

**User-visible outcome:** Users selecting the Management role during profile setup must enter the correct password '*#Sindoor@2025' to complete their profile. Student and Marketer roles remain unchanged and do not require a password.
