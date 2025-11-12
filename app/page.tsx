import Header from "@/components/header";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (<>
    <Header />
    <div className="flex min-h-auto w-full items-center justify-center p-6 md:p-10 my-24">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  </>);
}
