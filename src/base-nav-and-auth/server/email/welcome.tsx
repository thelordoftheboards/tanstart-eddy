import { Text } from '@react-email/components';
import { render } from '@react-email/render';
import { Layout } from './layout';

const Welcome = ({ username }: { username: string }) => (
  <Layout preview="Welcome to our app!">
    <Text className="font-bold text-2xl text-gray-800">Welcome to our app!</Text>
    <Text className="text-gray-600">Hi {username},</Text>
    <Text className="text-gray-600">Thank you for joining us. We're excited to have you on board!</Text>
    <Text className="mt-6 text-gray-600">
      If you have any questions or need assistance, feel free to contact our support team.
    </Text>
  </Layout>
);

export const generateWelcome = async (username: string): Promise<{ html: string; text: string }> => {
  const html = await render(<Welcome username={username} />, { pretty: true });
  const text = await render(<Welcome username={username} />, { plainText: true });

  return { html, text };
};
