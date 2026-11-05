import LoginForm from "./_components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4">
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}
