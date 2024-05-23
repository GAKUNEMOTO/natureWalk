import { formSchema } from "@/app/nature/components/nature-post-form";
import { z } from "zod";

export type FormData = z.infer<typeof formSchema>;