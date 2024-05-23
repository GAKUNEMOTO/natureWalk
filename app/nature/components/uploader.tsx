import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { uploadFile } from '@/actions/upload';

export default function Uploader() {
    const form = useForm();


    return (
        <Form {...form} >
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>画像</FormLabel>
                        <FormControl>
                            <Input placeholder="画像" type='file' {...field}   />
                        </FormControl>
                        <FormDescription>
                            最大15文字まで
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </Form>
    )
}
