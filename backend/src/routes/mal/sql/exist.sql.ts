export function exist(sql: string) {
    return `SELECT EXISTS (${sql.slice(0, -1)}) AS exist;` as const;
}
