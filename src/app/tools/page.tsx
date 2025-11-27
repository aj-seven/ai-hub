import { Suspense } from "react";
import ToolPage from "./_components/ToolsPage";

export default function ToolsPage() {
  return (
    <Suspense>
      <ToolPage />
    </Suspense>
  );
}
