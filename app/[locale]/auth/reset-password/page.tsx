'use client'
import ResetPassword from '../components/resetPassword'
import AuthLayout from '../components/authLayout'

export default function ResetPasswordPage() {
  const headerText = {
    title: "Reset Password",
    subtitle: "Please enter your new password"
  }

  return (
    <AuthLayout headerText={headerText}>
      <ResetPassword />
    </AuthLayout>
  )
}