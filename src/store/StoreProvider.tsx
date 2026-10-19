"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/types";

type Filter = "all" | "men" | "women";

interface StoreCtx {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty" | "key">) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);
const STORAGE_KEY = "nova-stride-cart";

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: Omit<CartItem, "qty" | "key"> }
  | { type: "qty"; key: string; qty: number }
  | { type: "remove"; key: string };

function reducer(state: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case "hydrate": return a.items;
    case "add": {
      const key = `${a.item.productId}:${a.item.color}`;
      const found = state.find((i) => i.key === key);
      if (found) return state.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...state, { ...a.item, key, qty: 1 }];
    }
    case "qty": return state.map((i) => (i.key === a.key ? { ...i, qty: a.qty } : i)).filter((i) => i.qty > 0);
    case "remove": return state.filter((i) => i.key !== a.key);
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const hydrated = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "qty" | "key">) => {
    dispatch({ type: "add", item });
    notify(`${item.name} added to bag`);
  }, [notify]);

  const value = useMemo<StoreCtx>(() => ({
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.qty * i.price, 0),
    addItem,
    setQty: (key, qty) => dispatch({ type: "qty", key, qty }),
    removeItem: (key) => dispatch({ type: "remove", key }),
    cartOpen, setCartOpen, quickView, setQuickView, filter, setFilter, toast, notify,
  }), [items, addItem, cartOpen, quickView, filter, toast, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
