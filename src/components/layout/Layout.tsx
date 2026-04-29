import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F9FBFF]">
      {/* Mobile Floating Menu Button (Top Left) */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shadow-xl border-white/50 bg-white/70 backdrop-blur-md hover:bg-primary/10 text-primary">
                  <Menu className="h-6 w-6" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-72 bg-transparent border-none">
            <Sidebar className="border-none" onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed inset-y-0 left-0 z-40">
        <Sidebar className="h-full" />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen relative">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-secondary/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
        
        <main className="flex-1 p-6 md:p-12 relative z-10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
