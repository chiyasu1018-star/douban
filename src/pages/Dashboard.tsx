import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, MessageSquare, FileText, User, Share2, Info, LayoutDashboard, BarChart3, TrendingUp, Target, Cloud } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// 模拟查询结果数据
const MOCK_USER_DATA = {
  id: "44552211",
  name: "不爱吃香菜的阿强",
  avatar: "https://i.pravatar.cc/150?u=douban1",
  joinDate: "2021年加入豆瓣",
  composition: [
    { label: "娱乐八卦", value: 65, color: "bg-rose-500" },
    { label: "生活分享", value: 20, color: "bg-emerald-500" },
    { label: "数码科技", value: 10, color: "bg-sky-500" },
    { label: "其他", value: 5, color: "bg-neutral-300" },
  ],
  groups: [
    { name: "豆瓣鹅组", role: "资深潜水员", activeScore: 92 },
    { name: "极简生活", role: "普通组员", activeScore: 45 },
    { name: "我们要买房", role: "积极发言者", activeScore: 78 },
  ],
  recentComments: [
    { id: 1, group: "豆瓣鹅组", content: "这个爆料太离谱了吧，坐等反转...", time: "2小时前" },
    { id: 2, group: "极简生活", content: "支持！最近也在断舍离，整个人都轻松了。", time: "1天前" },
    { id: 3, group: "我们要买房", content: "这地段这个价位确实很有竞争力，但交通是硬伤。", time: "3天前" },
  ],
  recentPosts: [
    { id: 1, group: "我们要买房", title: "坐标二线城市，现在上车还是再等等？", likes: 142, time: "3天前" },
    { id: 2, group: "数码科技", title: "最近这款新机器大家怎么看？性价比一般啊。", likes: 45, time: "1周前" }
  ],
  stats: {
    totalInteractions: "1,248",
    activeDays: "28/30",
    fandom: "博君一肖 CPD / 唯粉",
    participation: "28.5%"
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [fandomNote, setFandomNote] = useState(MOCK_USER_DATA.stats.fandom);
  const [isEditingFandom, setIsEditingFandom] = useState(false);

  // 检测外部跳转带入的搜索 ID
  useEffect(() => {
    const state = location.state as { autoSearchId?: string };
    if (state?.autoSearchId) {
        setSearchId(state.autoSearchId);
        // 尝试从本地存储加载已有的备注
        const saved = localStorage.getItem(`fandom_note_${state.autoSearchId}`);
        if (saved) setFandomNote(saved);
        else setFandomNote("点击录入成分...");

        // 清除 state 防止刷新页面重复触发
        window.history.replaceState({}, document.title);
        
        // 自动触发搜索
        setIsSearching(true);
        setShowResult(false);
        setTimeout(() => {
            setIsSearching(false);
            setShowResult(true);
        }, 1200);
    }
  }, [location]);

  const saveFandomNote = () => {
    localStorage.setItem(`fandom_note_${searchId}`, fandomNote);
    setIsEditingFandom(false);
  };

  const handleSearch = () => {
    if (!searchId) return;
    setIsSearching(true);
    // 模拟API查询延迟
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* 搜索区域 */}
      <section className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-900 sm:text-7xl flex flex-col items-center">
             <span className="flex items-center gap-2">Douban <span className="text-emerald-600">Ingredient</span></span>
             <span className="text-4xl sm:text-6xl text-emerald-600 mt-1">豆瓣配料</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-[600px] mx-auto px-4">
            只需输入 ID，即可溯源其小组偏好、言论片段及社交“成分”。
          </p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex w-full max-w-lg items-center space-x-2 bg-white p-1.5 sm:p-2 rounded-2xl shadow-xl shadow-emerald-100 border border-emerald-100"
        >
          <Input 
            className="flex-1 border-none focus-visible:ring-0 text-base sm:text-lg py-4 sm:py-6 h-auto"
            placeholder="输入 ID / 昵称..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            className="rounded-xl px-4 sm:px-8 py-4 sm:py-6 h-auto bg-emerald-600 hover:bg-emerald-700 text-base sm:text-lg transition-all font-black min-h-[44px]"
            disabled={isSearching}
            onClick={handleSearch}
          >
            {isSearching ? "待处理" : "查成分"}
          </Button>
        </motion.div>
        
        <div className="flex gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <span>推荐示例: <span className="text-emerald-600 cursor-pointer" onClick={() => {setSearchId("阿强"); handleSearch();}}>@阿强</span> · <span className="text-emerald-600 cursor-pointer" onClick={() => {setSearchId("王师傅"); handleSearch();}}>@王师傅</span></span>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {showResult && !isSearching ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-12"
          >
            {/* 左侧：用户信息与成分比例 */}
            <div className="md:col-span-4 space-y-6">
              <Card className="overflow-hidden border-emerald-200 shadow-xl border-2">
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-white pb-8 text-center pt-8 border-b border-emerald-100">
                    <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-xl ring-4 ring-rose-100">
                        <AvatarImage src={MOCK_USER_DATA.avatar} />
                        <AvatarFallback>{MOCK_USER_DATA.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mt-4">
                        <CardTitle className="text-2xl font-black text-emerald-900">{MOCK_USER_DATA.name}</CardTitle>
                        <CardDescription className="font-bold text-rose-600">豆瓣身份: 深度活跃者</CardDescription>
                        <div className="text-[10px] text-muted-foreground font-mono mt-1">UID: {MOCK_USER_DATA.id}</div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-lg">
                            <span className="text-sm font-black text-emerald-900 flex flex-col">
                                <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Social Composition</span>
                                <span className="text-[10px] text-emerald-600 ml-6">社交身分比例</span>
                            </span>
                        </div>
                        <div className="space-y-4">
                            {MOCK_USER_DATA.composition.map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                                        <span className="text-emerald-900/60">{item.label}</span>
                                        <span className="text-emerald-700">{item.value}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-emerald-50 rounded-full overflow-hidden border border-emerald-100/50">
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                            className={cn("h-full rounded-full bg-emerald-600")} 
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 flex flex-col gap-2">
                                <Button 
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-6 rounded-xl"
                                    onClick={() => navigate('/word-cloud')}
                                >
                                   <Cloud className="h-5 w-5 mr-2" /> 穿透语料: 生成视奸词云
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 shadow-md">
                <CardHeader className="pb-3 border-b border-emerald-50">
                    <CardTitle className="text-sm font-black flex items-center gap-2 text-emerald-900 uppercase">
                      <LayoutDashboard className="h-4 w-4" /> 
                      <div className="flex flex-col">
                        <span>Monitored Groups</span>
                        <span className="text-[9px] text-emerald-600">重点监控小组</span>
                      </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-emerald-50">
                        {MOCK_USER_DATA.groups.map((group, i) => (
                            <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-emerald-50/50 transition-colors">
                                <div className="space-y-0.5">
                                    <div className="font-black text-emerald-900 text-sm">{group.name}</div>
                                    <div className="text-[10px] font-bold text-rose-500 uppercase">{group.role}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-emerald-700">{group.activeScore}%</span>
                                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">互动浓度</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：言论与活动 */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="bg-emerald-800 text-white border-none shadow-xl relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-700/20 rounded-full -mr-12 -mt-12" />
                      <CardContent className="pt-6 relative z-10">
                          <div className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] flex flex-col">
                                <span>Interaction Density (30d)</span>
                                <span className="text-[8px] opacity-100 text-emerald-200">30天抓取互动频度</span>
                              </div>
                          <div className="text-4xl font-black mt-2">{MOCK_USER_DATA.stats.totalInteractions} <span className="text-lg opacity-50">次</span></div>
                      </CardContent>
                  </Card>
                  <Card className="bg-white border-2 border-emerald-100 shadow-lg cursor-pointer hover:border-emerald-300 transition-all" onClick={() => !isEditingFandom && setIsEditingFandom(true)}>
                      <CardContent className="pt-6">
                          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex flex-col">
                            <span>Fandom Identity (Manual Note)</span>
                            <span className="text-[8px] text-emerald-500">点击卡片手动编辑成分备注</span>
                          </div>
                          {isEditingFandom ? (
                            <div className="mt-2 flex gap-2">
                                <Input 
                                    className="h-8 font-black text-emerald-900 border-emerald-200"
                                    value={fandomNote}
                                    onChange={(e) => setFandomNote(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && saveFandomNote()}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <Button size="sm" className="h-8 bg-emerald-700" onClick={(e) => { e.stopPropagation(); saveFandomNote(); }}>存</Button>
                            </div>
                          ) : (
                            <div className="text-3xl font-black mt-2 text-emerald-900 leading-tight">
                                {fandomNote || "点击录入..."}
                            </div>
                          )}
                      </CardContent>
                  </Card>
              </div>

              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="bg-emerald-50/50 p-1 rounded-2xl w-full border border-emerald-100 h-auto">
                    <TabsTrigger value="comments" className="flex-1 py-3 sm:py-4 font-black rounded-xl data-[state=active]:bg-emerald-700 data-[state=active]:text-white transition-all flex flex-col min-h-[44px]">
                      <span className="flex items-center text-xs sm:text-base"><MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/> Comments</span>
                      <span className="text-[8px] sm:text-[9px] opacity-70">历史言论</span>
                    </TabsTrigger>
                    <TabsTrigger value="posts" className="flex-1 py-3 sm:py-4 font-black rounded-xl data-[state=active]:bg-emerald-700 data-[state=active]:text-white transition-all flex flex-col min-h-[44px]">
                      <span className="flex items-center text-xs sm:text-base"><FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/> Discussions</span>
                      <span className="text-[8px] sm:text-[9px] opacity-70">讨论帖子</span>
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="comments" className="mt-6 space-y-4">
                    {MOCK_USER_DATA.recentComments.map((comment, i) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="border-emerald-100 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md">
                              <CardContent className="pt-6 pb-6">
                                  <div className="flex justify-between items-center mb-4 border-b border-emerald-50 pb-2">
                                      <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[10px]">
                                          来自: {comment.group}
                                      </Badge>
                                      <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">{comment.time}</span>
                                  </div>
                                  <p className="text-emerald-900 font-bold leading-relaxed italic border-l-4 border-emerald-200 pl-4 py-1">
                                      “{comment.content}”
                                  </p>
                              </CardContent>
                          </Card>
                        </motion.div>
                    ))}
                    <Button variant="outline" className="w-full border-emerald-100 text-emerald-600 font-black text-xs uppercase tracking-[0.2em] py-8 hover:bg-emerald-50 rounded-2xl">
                      进入 100% 语料穿透模式 (已采集 248 条)
                    </Button>
                </TabsContent>

                <TabsContent value="posts" className="mt-6 space-y-4">
                    {MOCK_USER_DATA.recentPosts.map((post, i) => (
                        <motion.div
                           key={post.id}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                        >
                          <Card className="border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
                              <CardHeader>
                                  <div className="flex justify-between items-start gap-4">
                                      <CardTitle className="text-lg font-black text-emerald-900">{post.title}</CardTitle>
                                      <Badge className="bg-rose-600 font-black flex-shrink-0">{post.group}</Badge>
                                  </div>
                                  <CardDescription className="flex items-center gap-3 font-bold mt-2">
                                    追踪于 {post.time} · <span className="text-rose-500 font-black">{post.likes} 赞</span>
                                  </CardDescription>
                              </CardHeader>
                          </Card>
                        </motion.div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        ) : isSearching ? (
          <motion.div 
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 space-y-6"
          >
            <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <Search className="absolute inset-0 m-auto h-8 w-8 text-emerald-600 animate-pulse" />
            </div>
            <div className="text-emerald-900 font-black text-xl animate-pulse tracking-[0.1em]">正在穿透数据墙，解析用户成分...</div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center py-24 border-2 border-dashed border-emerald-100 rounded-[3rem] bg-emerald-50/10"
          >
              <Target className="h-20 w-20 text-emerald-100 mx-auto mb-6" />
              <div className="space-y-2">
                  <h2 className="text-2xl font-black text-emerald-900/30 uppercase tracking-[0.3em]">等待输入指令</h2>
                  <p className="text-emerald-800/20 font-bold max-w-sm mx-auto">请在上方输入需要进行成分分析的豆瓣用户 ID，系统将自动拉取其活跃记录与言论偏好。</p>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
