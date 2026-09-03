import { Metadata } from 'next';
import { PROJECT_NAME } from '@/src/constants';

export const metadata: Metadata = {
  title: `Login - ${PROJECT_NAME}`,
  description: `Sign in to your ${PROJECT_NAME} account`,
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
