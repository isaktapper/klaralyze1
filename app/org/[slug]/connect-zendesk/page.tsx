import { supabase } from '@/lib/supabase'
import ConnectZendeskForm from './connect-zendesk-form'

export async function generateStaticParams() {
  // Fetch all organization slugs from the database
  const { data: organizations } = await supabase
    .from('organizations')
    .select('slug')

  // Return an array of params for each organization
  return organizations?.map((org) => ({
    slug: org.slug,
  })) || []
}

export default function ConnectZendeskPage({ params }: { params: { slug: string } }) {
  return <ConnectZendeskForm slug={params.slug} />
} 