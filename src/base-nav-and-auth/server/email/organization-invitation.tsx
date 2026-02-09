import { Button, Text } from '@react-email/components';
import { render } from '@react-email/render';
import { Layout } from './layout';

const OrganizationInvitation = ({
  email,
  organization_name,
  url,
  role,
}: {
  email: string;
  organization_name: string;
  url: string;
  role: string;
}) => (
  <Layout preview="Invitation to join organization">
    <Text className="font-bold text-2xl text-gray-800">Join {organization_name}</Text>
    <Text className="text-gray-600">Hi {email},</Text>
    <Text className="text-gray-600">Please click the button below to join the organization as {role}:</Text>
    <Button className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white" href={url}>
      Join {organization_name}
    </Button>
  </Layout>
);

export const generateOrganizationInvitation = async ({
  email,
  organization_name,
  url,
  role,
}: {
  email: string;
  organization_name: string;
  url: string;
  role: string;
}): Promise<{ html: string; text: string }> => {
  const html = await render(
    <OrganizationInvitation email={email} organization_name={organization_name} role={role} url={url} />,
    {
      pretty: true,
    }
  );
  const text = await render(
    <OrganizationInvitation email={email} organization_name={organization_name} role={role} url={url} />,
    {
      plainText: true,
    }
  );

  return { html, text };
};
