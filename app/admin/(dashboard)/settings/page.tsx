import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Site settings</h1>
        <p className="text-sm text-neutral-500">
          Your name, tagline, and the links shown in the footer.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
