import { createFileRoute } from "@tanstack/react-router";
import { ChatWorkspace } from "@/components/mms/ChatWorkspace";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <ChatWorkspace />;
}
