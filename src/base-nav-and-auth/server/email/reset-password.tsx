import { Button, Text } from '@react-email/components';
import { render } from '@react-email/render';
import { Layout } from './layout';

const ResetPassword = ({ resetLink, username }: { resetLink: string; username: string }) => (
  <Layout preview="Reset your password">
    <Text className="font-bold text-2xl text-gray-800">Reset Your Password</Text>
    <Text className="text-gray-600">Hi {username},</Text>
    <Text className="text-gray-600">Click the button below to reset your password:</Text>
    <Button className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white" href={resetLink}>
      Reset Password
    </Button>
    <Text className="mt-6 text-gray-500 text-sm">
      If you didn't request a password reset, you can safely ignore this email.
    </Text>
  </Layout>
);

export const generateResetPassword = async ({
  resetLink,
  username,
}: {
  resetLink: string;
  username: string;
}): Promise<{ html: string; text: string }> => {
  const html = await render(<ResetPassword resetLink={resetLink} username={username} />, { pretty: true });
  const text = await render(<ResetPassword resetLink={resetLink} username={username} />, { plainText: true });

  return { html, text };
};
