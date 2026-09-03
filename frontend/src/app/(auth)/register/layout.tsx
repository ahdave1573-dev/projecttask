import { Metadata } from 'next';
import { PROJECT_NAME } from '@/src/constants';

export const metadata: Metadata = {
  title: `Register - ${PROJECT_NAME}`,
  description: `Create a new account on ${PROJECT_NAME}`,
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
