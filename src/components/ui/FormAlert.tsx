import { Alert } from "@heroui/react";
import type { ReactNode } from "react";

type FormAlertProps = {
  status: "danger" | "success" | "warning";
  title?: string;
  children: ReactNode;
};

export default function FormAlert({ status, title, children }: FormAlertProps) {
  return (
    <Alert status={status} role={status === "danger" ? "alert" : "status"}>
      <Alert.Indicator />
      <Alert.Content>
        {title && <Alert.Title>{title}</Alert.Title>}
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
