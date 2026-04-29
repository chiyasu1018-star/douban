import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    UserPlus,
    Trash2,
    Target,
    LayoutGrid,
    Eye,
    ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WatchedUser {
    id: string;
    name: string;
    addedDate: string;
    avatar: string;
    tag: string;
}

export default function UserList() {
  const navigate = useNavigate();
  const [targetId, setTargetId] = useState("");
  const [watchlist, setWatchlist] = useState<WatchedUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 加载本地存储的名单
  useEffect(() => {
    const saved = localStorage.getItem("weibo_watchlist");
    if (saved) {
        setWatchlist(JSON.parse(saved));
    }
  }, []);

  // 保存名单到本地
  const saveWatchlist = (newList: WatchedUser[]) => {
    setWatchlist(newList);
    localStorage.setItem("weibo_watchlist", JSON.stringify(newList));
  };

  const addTarget = () => {
    if (!targetId.trim()) return;
    
    const newUser: WatchedUser = {
        id: targetId.startsWith("@") ? targetId : `@${targetId}`,
        name: targetId,
        addedDate: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?u=${targetId}`,
        tag: "待穿透"
    };

    saveWatchlist([newUser, ...watchlist]);
    setTargetId("");
  };

  const removeTarget = (id: string) => {
    const newList = watchlist.filter(u => u.id !== id);
    saveWatchlist(newList);
  };

  const updateTag = (id: string, newTag: string) => {
    const newList = watchlist.map(u => u.id === id ? { ...u, tag: newTag } : u);
    saveWatchlist(newList);
  };

  const filteredList = watchlist.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startAnalysis = (id: string) => {
    navigate("/"); // 返回首页搜索框会自动带入或引导用户输入，或者直接传递 state
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
                <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-secondary font-heading">
                Shadow <span className="text-primary italic">Matrix</span>
            </h1>
        </div>
        <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-[0.3em] ml-12">监控名单 · 静态追踪矩阵</p>
      </div>

      {/* 添加监控栏 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-8 flex gap-2 glass-panel p-1.5 rounded-[1.5rem]">
            <div className="relative flex-1">
                <UserPlus className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/40" />
                <Input 
                    placeholder="录入微博 UID / 昵称..." 
                    className="pl-10 h-11 border-none bg-transparent focus-visible:ring-0 font-bold"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTarget()}
                />
            </div>
            <Button className="h-11 px-8 bg-primary hover:bg-secondary text-white font-black rounded-xl transition-all" onClick={addTarget}>
                加入
            </Button>
        </div>
        <div className="sm:col-span-4 relative glass-panel p-1.5 rounded-[1.5rem]">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/40" />
            <Input 
                placeholder="搜索名单..." 
                className="pl-10 h-11 border-none bg-transparent focus-visible:ring-0 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-[2.5rem] border border-muted/50 bg-white shadow-2xl shadow-primary/5 overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-muted/30 border-none">
              <TableHead className="text-secondary font-black py-6 pl-8 uppercase text-[10px] tracking-widest">Target Entity</TableHead>
              <TableHead className="text-secondary font-black uppercase text-[10px] tracking-widest">UID</TableHead>
              <TableHead className="text-secondary font-black hidden sm:table-cell uppercase text-[10px] tracking-widest">Capture Date</TableHead>
              <TableHead className="text-secondary font-black uppercase text-[10px] tracking-widest">Markers</TableHead>
              <TableHead className="text-right text-secondary font-black pr-8 uppercase text-[10px] tracking-widest">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.length > 0 ? (
                filteredList.map((user, idx) => (
                    <motion.tr 
                        key={user.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="hover:bg-primary/[0.02] border-b border-muted/20 transition-colors group"
                    >
                      <TableCell className="py-5 pl-8">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-heading font-black text-secondary text-sm group-hover:text-primary transition-colors">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded-lg text-muted-foreground font-black tracking-tighter">
                            {user.id}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-black text-[10px] uppercase hidden sm:table-cell opacity-40 group-hover:opacity-100 transition-opacity">
                        {user.addedDate}
                      </TableCell>
                      <TableCell>
                        <Input 
                            value={user.tag} 
                            onChange={(e) => updateTag(user.id, e.target.value)}
                            className="h-8 w-32 bg-transparent border-transparent hover:border-primary/20 focus:bg-white focus:border-primary transition-all text-[10px] font-black text-primary placeholder:opacity-20"
                            placeholder="Add markers..."
                        />
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-primary/20 text-primary font-black hover:bg-primary hover:text-white transition-all h-9 px-4 rounded-xl text-[10px] uppercase tracking-widest"
                                onClick={() => navigate('/', { state: { autoSearchId: user.name } })}
                            >
                                <Target className="h-3 w-3 mr-2" />
                                穿透
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-300 hover:text-red-500 hover:bg-red-50 h-9 w-9 rounded-xl transition-colors"
                                onClick={() => removeTarget(user.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-8 bg-muted/30 rounded-[2.5rem]">
                                <LayoutGrid className="h-12 w-12 text-muted-foreground/20" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-heading font-black text-secondary tracking-[0.2em] uppercase opacity-30">Matrix is Empty</h3>
                                <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">录入 ID，构建监控节点</p>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-4 p-6 glass-panel rounded-[2rem] border-white/50"
      >
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/5 text-secondary/40 shrink-0">
            <Eye className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest leading-loose">
            <span className="text-primary italic mr-2">Secured:</span> 
            <span className="text-secondary/40">Data resides in Local Storage only. Analysis is ephemeral and restricted for research.</span>
        </div>
      </motion.div>
    </div>
  );
}
