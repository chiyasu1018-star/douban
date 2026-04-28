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
    const saved = localStorage.getItem("douban_watchlist");
    if (saved) {
        setWatchlist(JSON.parse(saved));
    }
  }, []);

  // 保存名单到本地
  const saveWatchlist = (newList: WatchedUser[]) => {
    setWatchlist(newList);
    localStorage.setItem("douban_watchlist", JSON.stringify(newList));
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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-emerald-900 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="flex items-center gap-2">
                <ShieldAlert className="h-8 w-8 text-rose-600" />
                Watchlist
            </span>
            <span className="text-2xl text-emerald-600">视奸监控名单</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-bold">手动录入 ID，构建您的一对一垂直监控矩阵。</p>
      </div>

      {/* 添加监控栏 */}
      <div className="flex flex-col sm:grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-8 flex gap-2">
            <div className="relative flex-1">
                <UserPlus className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="UID / 昵称 (如: 阿强)" 
                    className="pl-10 h-14 sm:h-12 border-2 border-emerald-100 focus:border-rose-500 transition-all font-bold"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTarget()}
                />
            </div>
            <Button className="h-14 sm:h-12 px-6 sm:px-8 bg-rose-600 hover:bg-rose-700 font-black shadow-lg shadow-rose-100 shrink-0" onClick={addTarget}>
                加入
            </Button>
        </div>
        <div className="sm:col-span-4 relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="搜索名单..." 
                className="pl-10 h-14 sm:h-12 border-emerald-50 bg-emerald-50/30 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-100 bg-white shadow-xl overflow-x-auto overflow-y-hidden">
        <Table className="min-w-[600px] sm:min-w-0">
          <TableHeader className="bg-emerald-800">
            <TableRow className="hover:bg-emerald-800 border-none">
              <TableHead className="text-white font-black py-4 sm:py-6">监控对象</TableHead>
              <TableHead className="text-white font-black">UID</TableHead>
              <TableHead className="text-white font-black hidden sm:table-cell">日期</TableHead>
              <TableHead className="text-white font-black">成分备注</TableHead>
              <TableHead className="text-right text-white font-black px-4 sm:px-8">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.length > 0 ? (
                filteredList.map((user) => (
                    <TableRow key={user.id} className="hover:bg-rose-50/30 border-emerald-50 transition-colors">
                      <TableCell className="py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white shadow-md">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-black text-emerald-900 text-sm">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] sm:text-xs font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 font-bold">
                            {user.id}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-bold text-[10px] sm:text-xs uppercase hidden sm:table-cell">
                        {user.addedDate}
                      </TableCell>
                      <TableCell>
                        <Input 
                            value={user.tag} 
                            onChange={(e) => updateTag(user.id, e.target.value)}
                            className="h-8 w-24 sm:w-40 bg-transparent border-transparent hover:border-emerald-100 focus:bg-white transition-all text-[10px] sm:text-xs font-black text-rose-600"
                            placeholder="备注..."
                        />
                      </TableCell>
                      <TableCell className="text-right px-4 sm:px-8">
                        <div className="flex justify-end gap-1 sm:gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-emerald-200 text-emerald-700 font-black hover:bg-emerald-50 h-8 px-2 sm:px-3 text-[10px] sm:text-xs"
                                onClick={() => navigate('/', { state: { autoSearchId: user.name } })}
                            >
                                <Target className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                                <span className="hidden sm:inline">成分穿透</span>
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8"
                                onClick={() => removeTarget(user.id)}
                            >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-48 sm:h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                            <div className="p-4 sm:p-6 bg-emerald-50 rounded-full">
                                <LayoutGrid className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-200" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-emerald-900 opacity-40">空名单</h3>
                                <p className="text-xs sm:text-sm text-emerald-800/30 font-bold mt-1">请输入 UID，追踪关注对象。</p>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-rose-50/50 rounded-2xl border-2 border-rose-100/50">
        <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 shrink-0" />
        <div className="text-[10px] sm:text-sm">
            <span className="font-black text-rose-900">免责提示:</span> 
            <span className="font-bold text-rose-800/60 ml-2">数据仅供研究。名单本地存储。</span>
        </div>
      </div>
    </div>
  );
}
