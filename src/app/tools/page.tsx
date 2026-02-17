import { Suspense } from "react";
import ToolPage from "./_components/ToolsPage";

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <ToolPage />
      </Suspense>
    </div>
  );
}
