import { Button, Text } from '@react-email/components';
import { render } from '@react-email/render';
import { Layout } from './layout';

const VerifyEmail = ({ url, username }: { url: string; username: string }) => (
  <Layout preview="Verify your email address">
    <Text className="font-bold text-2xl text-gray-800">Verify your email</Text>
    <Text className="text-gray-600">Hi {username},</Text>
    <Text className="text-gray-600">Please click the button below to verify your email address:</Text>
    <Button className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white" href={url}>
      Verify Email
    </Button>
  </Layout>
);

export const generateVerifyEmail = async ({
  url,
  username,
}: {
  url: string;
  username: string;
}): Promise<{ html: string; text: string }> => {
  const html = await render(<VerifyEmail url={url} username={username} />, { pretty: true });
  const text = await render(<VerifyEmail url={url} username={username} />, { plainText: true });

  return { html, text };
};
