import { redirect } from "next/navigation";

export default function PaymentReturnResultPage() {
  redirect("/pago/resultado?status=error");
}