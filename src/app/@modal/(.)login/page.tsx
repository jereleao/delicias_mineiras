import LoginForm from "~/app/(auth)/login/_components/login-form";
import { Modal } from "~/app/@modal/modal";

export default async function PostModal() {
  return (
    <Modal>
      <LoginForm />
    </Modal>
  );
}
