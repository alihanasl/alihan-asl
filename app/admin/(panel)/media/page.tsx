import { MediaManager } from "@/components/admin/media-manager";
import { AdminHeading } from "@/components/admin/page-header";

export default function MediaPage() {
  return (
    <div>
      <AdminHeading titleKey="media.title" />
      <MediaManager />
    </div>
  );
}
