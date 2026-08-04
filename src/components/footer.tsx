import { MainNav } from "~/components/main-nav";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 flex justify-center border-t">
      <div className="h-16 w-full max-w-3xl px-4 sm:px-6">
        <MainNav />
      </div>
    </footer>
  );
}
