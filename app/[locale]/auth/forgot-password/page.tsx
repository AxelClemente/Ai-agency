import ForgotPassword from '../components/forgotPassword'
import AuthLayout from '../components/authLayout'

export default function ForgotPasswordPage() {
  const headerText = {
    title: "Forgot the password?",
    subtitle: "The confirmation code usually arrives in 50 sec"
  }

  return (
    <AuthLayout headerText={headerText}>
      <ForgotPassword />
    </AuthLayout>
  )
}