const minute = 60_000;

export const queryKeys = {
  catalog: {
    list: (filters = {}) => ["catalog", "list", filters],
    detail: (productId) => ["catalog", "detail", productId],
    categories: () => ["catalog", "categories"],
  },
  orders: {
    list: () => ["orders", "list"],
    detail: (orderId) => ["orders", "detail", orderId],
  },
  profile: { current: () => ["profile", "current"] },
  fitCheck: { profile: () => ["fit-check", "profile"], history: () => ["fit-check", "history"] },
  payment: { methods: () => ["payment", "methods"], handoff: (orderId) => ["payment", "handoff", orderId] },
  delivery: {
    detail: (orderId) => ["delivery", "detail", orderId],
    events: (orderId) => ["delivery", "events", orderId],
    preferences: (orderId) => ["delivery", "preferences", orderId],
  },
};

export const cachePolicy = {
  catalog: { staleTime: 2 * minute, gcTime: 20 * minute },
  categories: { staleTime: 15 * minute, gcTime: 60 * minute },
  orders: { staleTime: 45 * 1000, gcTime: 15 * minute },
  profile: { staleTime: 5 * minute, gcTime: 30 * minute, retry: false },
  fitProfile: { staleTime: 3 * minute, gcTime: 20 * minute, retry: false },
  fitHistory: { staleTime: 60 * 1000, gcTime: 20 * minute, retry: false },
  payment: { staleTime: 30 * 1000, gcTime: 10 * minute, retry: 1 },
  delivery: { staleTime: 30 * 1000, gcTime: 15 * minute, retry: 1 },
  deliveryEvents: { staleTime: 15 * 1000, gcTime: 15 * minute, retry: 1 },
};

export const queryClientDefaults = {
  queries: { staleTime: minute, gcTime: 15 * minute, retry: 1, refetchOnWindowFocus: false, refetchOnReconnect: true },
  mutations: { retry: 0 },
};
