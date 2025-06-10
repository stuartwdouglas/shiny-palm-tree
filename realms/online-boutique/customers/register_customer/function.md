# Register Customer Function

## Description
Creates a new customer account in the system.

## Inputs
- email: string (required) - Customer email address
- password: string (required) - Account password
- first_name: string (required) - Customer first name
- last_name: string (required) - Customer last name
- phone: string (optional) - Contact phone number
- marketing_consent: boolean (optional) - Marketing communications opt-in

## Outputs
- customer_id: string - Unique customer identifier
- status: string - Registration status
- verification_token: string - Email verification token
- welcome_email_status: string - Welcome email status

## Events Generated
- CUSTOMER_REGISTERED
- VERIFICATION_EMAIL_SENT
- WELCOME_EMAIL_SENT
- PROFILE_CREATED