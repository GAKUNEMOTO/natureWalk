
import { formSchema } from "@/schema/schema";
import { z } from "zod";

export type FormData = z.infer<typeof formSchema>;