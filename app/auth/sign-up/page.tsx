import Header from "@/components/header";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (<>
    <Header />
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        { 0 && <SignUpForm /> }
      </div>
    </div>
  </>);
}
