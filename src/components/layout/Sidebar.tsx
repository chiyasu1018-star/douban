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
    <div className={cn("pb-12 h-full border-r bg-card", className)}>
      <div className="space-y-4 py-4">
        <div className="px-6 py-2 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
            豆
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight text-emerald-700 font-mono italic">Douban Insight</span>
            <span className="text-[10px] font-black text-emerald-600 tracking-tighter uppercase whitespace-nowrap">豆瓣洞察</span>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onItemClick}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-700",
                  location.pathname === item.href
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
