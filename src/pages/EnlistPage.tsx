import { EnlistForm } from '../components/shop/EnlistForm'
import { PageHeader } from '../components/ui/FormSection'

export default function EnlistPage() {
  return (
    <div className="ios-screen flex h-full flex-col overflow-y-auto">
      <PageHeader
        title="Enlist"
        subtitle="Post a local job listing for your shop."
      />
      <div className="flex-1 pb-8">
        <EnlistForm />
      </div>
    </div>
  )
}
