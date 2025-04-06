import ConnectZendeskForm from './connect-zendesk-form'

export async function generateStaticParams() {
  // Return an empty array since we don't know the slugs at build time
  return []
}

export default function ConnectZendeskPage({ params }: { params: { slug: string } }) {
  return <ConnectZendeskForm slug={params.slug} />
} 