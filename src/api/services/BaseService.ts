export class BaseService {

  public getSortOrder(order: string, defaultOrder: 'ASC' | 'DESC' = 'ASC'): 'ASC' | 'DESC' {

    if (!order) {
      return defaultOrder;
    }

    switch (order.toUpperCase()) {
      case 'ASC': {
        return 'ASC';
      }

      case 'DESC': {
        return 'DESC';
      }

      default: {
        return defaultOrder;
      }
    }
  }

  public getSortField(field: string, fields: string[], defaultField: string): string {
    return fields.indexOf(field) !== -1 ? field : defaultField;
  }
}
