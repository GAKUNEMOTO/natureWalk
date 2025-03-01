'use server';
import { createClient } from "@/utils/supabase/server";

// Upload file using standard upload
export async function uploadFile(formData: FormData) {
    const image = formData.get('nature') as File;


    if (!image) {
        throw new Error('No file selected for upload');
    }

    const supabase = createClient();
    const filePath = `nature_img/${image.name}`;

    const { error } = await supabase.storage
        .from('nature')
        .upload(filePath, image)

        if(error) {
            alert("Error 発生");
        }
}
