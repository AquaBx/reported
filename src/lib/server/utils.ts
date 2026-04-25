export function parseMultilangForm(formData: FormData, languages: any[], fields: string[]) {
    const result: Record<string, Record<string, string>> = {};
    
    fields.forEach(field => {
        result[field] = {};
        languages.forEach(lang => {
            result[field][lang.code] = formData.get(`${field}_${lang.code}`) as string;
        });
    });
    
    return result;
}
