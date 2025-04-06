import ConnectZendeskForm from './connect-zendesk-form'

export default function ConnectZendeskPage({ params }: { params: { slug: string } }) {
  return <ConnectZendeskForm slug={params.slug} />
} 