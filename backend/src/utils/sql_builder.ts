export class SQLBuilder {
    private selects: string[] = [];
    private joins: string[] = [];
    private wheres: string[] = [];
    private orders: string[] = [];
    private groups: string[] = [];
    private havings: string[] = [];
    private pagination = '';
    constructor(private readonly tableName: string) { }

    addSelect(value: string) {
        this.selects.push(value);
        return this;
    }

    addJoin(value: string) {
        this.joins.push(value);
        return this;
    }

    addWhere(value: string) {
        this.wheres.push(value);
        return this;
    }

    addGroup(value: string) {
        this.groups.push(value);
        return this;
    }

    addOrder(value: string) {
        this.orders.push(value);
        return this;
    }

    addPagination(value: string) {
        this.pagination = value || 'LIMIT :limit OFFSET :offset';
        return this;
    }

    addLimit(value: string) {
        this.pagination = value || 'LIMIT :limit';
        return this;
    }

    oneRow() {
        this.addLimit('LIMIT 1');
        return this;
    }

    addHaving(value: string) {
        this.havings.push(value);
        return this;
    }

    buildQuery(): string {
        let
            select = '',
            join = '',
            where = '',
            order = '',
            group = '',
            having = '';
        
        if (this.selects.length) select = this.selects.filter(Boolean).join(', ');
        if (this.joins.length) join = this.joins.filter(Boolean).join(' ');
        if (this.wheres.length) where = `WHERE ${this.wheres.filter(Boolean).join(' AND ')}`;
        if (this.orders.length) order = `ORDER BY ${this.orders.filter(Boolean).join(', ')}`;
        if (this.groups.length) group = `GROUP BY ${this.groups.filter(Boolean).join(', ')}`;
        if (this.havings.length) having = `HAVING ${this.havings.filter(Boolean).join(' AND ')}`;

        return `
            SELECT
                ${select ?? '*'}
            FROM
                ${this.tableName}
            ${join}
            ${where}
            ${group}
            ${having}
            ${order}
            ${this.pagination};
        `.replace(/\s+/ig, ' ').trim();
    }
}
