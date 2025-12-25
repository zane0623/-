/**
 * 分页工具函数
 */

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * 标准化分页参数
 */
export function normalizePaginationParams(
  params: PaginationParams,
  defaultPageSize: number = 20,
  maxPageSize: number = 100
): { page: number; pageSize: number; offset: number } {
  let page = Math.max(1, params.page || 1);
  let pageSize = params.pageSize || params.limit || defaultPageSize;
  
  // 限制最大页面大小
  pageSize = Math.min(Math.max(1, pageSize), maxPageSize);
  
  // 计算偏移量
  const offset = params.offset !== undefined 
    ? params.offset 
    : (page - 1) * pageSize;
  
  return { page, pageSize, offset };
}

/**
 * 创建分页结果
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * 游标分页参数
 */
export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}

/**
 * 游标分页结果
 */
export interface CursorPaginatedResult<T> {
  data: T[];
  pagination: {
    cursor: string | null;
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
  };
}

/**
 * 编码游标
 */
export function encodeCursor(value: string | number | Date): string {
  const timestamp = value instanceof Date ? value.toISOString() : String(value);
  return Buffer.from(timestamp).toString('base64');
}

/**
 * 解码游标
 */
export function decodeCursor(cursor: string): string {
  try {
    return Buffer.from(cursor, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

/**
 * 创建游标分页结果
 */
export function createCursorPaginatedResult<T>(
  data: T[],
  limit: number,
  getCursor: (item: T) => string,
  direction: 'forward' | 'backward' = 'forward'
): CursorPaginatedResult<T> {
  const hasMore = data.length > limit;
  
  // 移除多余的元素
  if (hasMore) {
    data = direction === 'forward' ? data.slice(0, limit) : data.slice(-limit);
  }
  
  const firstItem = data[0];
  const lastItem = data[data.length - 1];
  
  return {
    data,
    pagination: {
      cursor: firstItem ? getCursor(firstItem) : null,
      nextCursor: hasMore && lastItem ? getCursor(lastItem) : null,
      prevCursor: firstItem ? getCursor(firstItem) : null,
      hasMore,
    },
  };
}

/**
 * 滚动分页参数
 */
export interface ScrollPaginationParams {
  lastId?: string;
  limit?: number;
}

/**
 * 滚动分页结果
 */
export interface ScrollPaginatedResult<T> {
  data: T[];
  lastId: string | null;
  hasMore: boolean;
}

/**
 * 创建滚动分页结果
 */
export function createScrollPaginatedResult<T>(
  data: T[],
  limit: number,
  getId: (item: T) => string
): ScrollPaginatedResult<T> {
  const hasMore = data.length > limit;
  
  if (hasMore) {
    data = data.slice(0, limit);
  }
  
  const lastItem = data[data.length - 1];
  
  return {
    data,
    lastId: lastItem ? getId(lastItem) : null,
    hasMore,
  };
}

/**
 * 排序参数
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 解析排序参数
 */
export function parseSortParams(
  params: SortParams,
  allowedFields: string[],
  defaultField: string = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): { field: string; order: 'asc' | 'desc' } {
  let field = params.sortBy || defaultField;
  const order = params.sortOrder || defaultOrder;
  
  // 验证排序字段
  if (!allowedFields.includes(field)) {
    field = defaultField;
  }
  
  return { field, order };
}

/**
 * 过滤参数
 */
export interface FilterParams {
  [key: string]: unknown;
}

/**
 * 构建过滤条件（用于Prisma）
 */
export function buildFilterConditions(
  params: FilterParams,
  allowedFields: string[]
): Record<string, unknown> {
  const conditions: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (!allowedFields.includes(key) || value === undefined || value === null) {
      continue;
    }
    
    // 处理特殊查询操作符
    if (typeof value === 'string') {
      if (key.endsWith('_like')) {
        const field = key.replace('_like', '');
        conditions[field] = { contains: value, mode: 'insensitive' };
      } else if (key.endsWith('_gte')) {
        const field = key.replace('_gte', '');
        conditions[field] = { gte: value };
      } else if (key.endsWith('_lte')) {
        const field = key.replace('_lte', '');
        conditions[field] = { lte: value };
      } else if (key.endsWith('_in')) {
        const field = key.replace('_in', '');
        conditions[field] = { in: value.split(',') };
      } else {
        conditions[key] = value;
      }
    } else if (Array.isArray(value)) {
      conditions[key] = { in: value };
    } else {
      conditions[key] = value;
    }
  }
  
  return conditions;
}

/**
 * 搜索参数
 */
export interface SearchParams {
  q?: string;
  searchFields?: string[];
}

/**
 * 构建搜索条件（用于Prisma）
 */
export function buildSearchConditions(
  params: SearchParams,
  defaultFields: string[] = ['name', 'description']
): Record<string, unknown> | null {
  const { q, searchFields = defaultFields } = params;
  
  if (!q || !q.trim()) {
    return null;
  }
  
  const searchTerm = q.trim();
  
  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  };
}

/**
 * 合并查询条件
 */
export function mergeConditions(
  ...conditions: (Record<string, unknown> | null | undefined)[]
): Record<string, unknown> {
  const validConditions = conditions.filter(
    (c): c is Record<string, unknown> => c !== null && c !== undefined
  );
  
  if (validConditions.length === 0) {
    return {};
  }
  
  if (validConditions.length === 1) {
    return validConditions[0];
  }
  
  return {
    AND: validConditions,
  };
}

