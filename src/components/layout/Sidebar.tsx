import { Users, Settings, Search, Cloud } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Search, label: "查成分", href: "/" },
  { icon: Cloud, label: "视奸词云", href: "/word-cloud" },
  { icon: Users, label: "视奸名单", href: "/users" },
  { icon: Settings, label: "设置", href: "/settings" },
];

export function Sidebar({ className, onItemClick }: { className?: string, onItemClick?: () => void }) {
  const location = useLocation();

  return (
    <div className={cn("pb-12 h-full bg-transparent p-4", className)}>
      <div className="space-y-6 py-4 glass-panel rounded-[2rem] h-full shadow-none">
        <div className="px-6 py-4 flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-primary/20">
            博
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-lg leading-none tracking-tight text-secondary">WEIBO</span>
            <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase whitespace-nowrap opacity-80">INSIGHT</span>
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onItemClick}
                className={cn(
                  "group flex items-center rounded-2xl px-4 py-3 text-sm font-black transition-all duration-300",
                  location.pathname === item.href
                    ? "bg-primary text-white shadow-lg shadow-primary/30 -translate-x-1"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110", location.pathname === item.href ? "text-white" : "text-muted-foreground")} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
