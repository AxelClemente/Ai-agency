import Location from '../components/location'
import AuthLayout from '../components/authLayout'

export default function LocationPage() {
  const headerText = {
    title: "Choose your city",
    subtitle: "You can change it at any time on the home page"
  }

  return (
    <AuthLayout headerText={headerText}>
      <Location />
    </AuthLayout>
  )
}