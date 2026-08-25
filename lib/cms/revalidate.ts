import { revalidatePath } from "next/cache";

export function revalidatePublicSite(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/projects/${slug}`);
  } else {
    revalidatePath("/projects", "layout");
  }
}
