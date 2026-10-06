import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminClientsApi, type Client } from "../../api/admin-clients.ts";
import { errorMessage } from "../../api/http.ts";
import { useAuth } from "../../auth/auth-context.ts";
import PageHeader from "../../components/app/PageHeader.tsx";
import MediaLibrary from "../../components/media/MediaLibrary.tsx";
import FormAlert from "../../components/ui/FormAlert.tsx";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput.tsx";

export default function MediaLibraryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN";
  const [searchParams, setSearchParams] = useSearchParams();
  const clientId = isAdmin ? (searchParams.get("clientId") ?? "") : "";
  const [clients, setClients] = useState<Client[] | null>(null);
  const [clientsError, setClientsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    adminClientsApi
      .list({ pageSize: 100 })
      .then((result) => !cancelled && setClients(result.items))
      .catch((err: unknown) => !cancelled && setClientsError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const clientOptions: SelectOption<string>[] = [
    { value: "", label: clients ? "All clients" : "Loading clients…" },
    ...(clients ?? []).map((client) => ({ value: client.id, label: client.businessName })),
  ];

  return (
    <div className="px-6 py-8 sm:px-8">
      <PageHeader
        title={isAdmin ? "Media" : "Media library"}
        description={
          isAdmin
            ? "Files uploaded by every client. Choose a client to upload or organise their files."
            : "Images, videos and documents for your websites. Add them to any page from the editor."
        }
        actions={
          isAdmin && (
            <SelectInput
              ariaLabel="Client"
              value={clientId}
              onChange={(value) => setSearchParams(value ? { clientId: value } : {})}
              options={clientOptions}
              className="w-64"
            />
          )
        }
      />
      {clientsError && (
        <div className="mt-4 max-w-2xl">
          <FormAlert status="danger">{clientsError}</FormAlert>
        </div>
      )}
      <div className="mt-6">
        <MediaLibrary key={clientId} clientId={clientId || undefined} requiresClient={isAdmin} />
      </div>
    </div>
  );
}
