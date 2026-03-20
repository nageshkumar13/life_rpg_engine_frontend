import { EmptyState } from "@/components/EmptyState";

interface QueryErrorStateProps {
  title?: string;
  error: unknown;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "The page could not load data from the local API.";
}

export function QueryErrorState({ title = "Could not load data", error }: QueryErrorStateProps) {
  return (
    <EmptyState
      title={title}
      description={`${getErrorMessage(error)} Check that the backend is running and that the dev server proxy is pointed at the local API.`}
    />
  );
}
