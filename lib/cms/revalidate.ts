import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePublicSite(slug?: string) {
  revalidateTag("cms", "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/projects/${slug}`);
  } else {
    revalidatePath("/projects", "layout");
  }
}
