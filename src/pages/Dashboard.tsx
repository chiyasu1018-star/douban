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
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aqiang",
  joinDate: "2021年加入微博",
  composition: [
    { label: "明星饭圈", value: 65, color: "bg-primary" },
    { label: "时事热搜", value: 20, color: "bg-secondary" },
    { label: "生活日常", value: 10, color: "bg-accent" },
    { label: "其他", value: 5, color: "bg-neutral-300" },
  ],
  groups: [
    { name: "热门明星超话 A", role: "铁杆粉丝", activeScore: 92 },
    { name: "电影交流基地", role: "活跃散粉", activeScore: 45 },
    { name: "数码科技广场", role: "路人围观", activeScore: 78 },
  ],
  recentComments: [
    { id: 1, group: "热门明星超话 A", content: "这个爆料太离谱了吧，坐等反转...", time: "2小时前" },
    { id: 2, group: "电影交流基地", content: "支持！最近也在断舍离，整个人都轻松了。", time: "1天前" },
    { id: 3, group: "数码科技广场", content: "这地段这个价位确实很有竞争力，但交通是硬伤。", time: "3天前" },
  ],
  recentPosts: [
    { id: 1, group: "热门明星超话 A", title: "今天的活动图太出片了，安利所有人！", likes: 142, time: "3天前" },
    { id: 2, group: "数码科技广场", title: "大家对这款新折叠屏怎么看？", likes: 45, time: "1周前" }
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
      <section className="flex flex-col items-center justify-center py-16 text-center space-y-8">
        <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-2">
            <Target className="h-3 w-3" /> Digital Intelligence Engine
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-secondary sm:text-8xl flex flex-col items-center leading-[0.9]">
             <span className="text-primary italic font-heading">Weibo</span>
             <span className="text-secondary opacity-90">Insight</span>
          </h1>
          <p className="text-sm font-bold text-muted-foreground max-w-[500px] mx-auto px-4 opacity-70 leading-relaxed uppercase tracking-widest mt-4">
            只需输入 ID，穿透数据墙，溯源社交“成分”。
          </p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex w-full max-w-xl items-center space-x-2 glass-panel p-2 rounded-[2.5rem] shadow-2xl shadow-primary/10"
        >
          <div className="pl-4">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            className="flex-1 border-none focus-visible:ring-0 text-lg py-6 h-auto bg-transparent font-bold placeholder:text-muted-foreground/30"
            placeholder="输入微博 UID 或 昵称..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            className="rounded-[1.8rem] px-10 py-7 h-auto bg-primary hover:bg-secondary text-white transition-all duration-300 font-black text-lg shadow-xl shadow-primary/20 hover:shadow-secondary/20"
            disabled={isSearching}
            onClick={handleSearch}
          >
            {isSearching ? "ANALYZING..." : "查成分"}
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]"
        >
           <div className="flex items-center gap-2">
            <span className="opacity-40">TRY:</span>
            <span className="text-primary cursor-pointer hover:underline" onClick={() => {setSearchId("阿强"); handleSearch();}}>@阿强</span>
            <span className="opacity-20">/</span>
            <span className="text-primary cursor-pointer hover:underline" onClick={() => {setSearchId("王师傅"); handleSearch();}}>@王师傅</span>
           </div>
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {showResult && !isSearching ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="grid gap-6 md:grid-cols-12 pb-20"
          >
            {/* 左侧：用户信息与成分比例 */}
            <div className="md:col-span-4 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bento-card overflow-hidden">
                  <CardHeader className="bg-gradient-to-b from-primary/10 to-transparent pb-10 text-center pt-12 relative">
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-[10px] px-3">ACTIVE</Badge>
                      </div>
                      <div className="relative group mx-auto w-fit">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-700" />
                        <Avatar className="h-28 w-28 mx-auto border-4 border-white shadow-xl relative z-10">
                            <AvatarImage src={MOCK_USER_DATA.avatar} />
                            <AvatarFallback>{MOCK_USER_DATA.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="mt-6 space-y-1">
                          <CardTitle className="text-3xl font-heading font-black text-secondary leading-tight">{MOCK_USER_DATA.name}</CardTitle>
                          <CardDescription className="font-black text-primary uppercase text-[10px] tracking-widest">微博身份: 深度活跃者</CardDescription>
                          <div className="text-[9px] text-muted-foreground font-mono mt-2 bg-muted/50 py-1 px-3 rounded-full inline-block">UID: {MOCK_USER_DATA.id}</div>
                      </div>
                  </CardHeader>
                  <CardContent className="pt-2 px-8 pb-10">
                      <div className="space-y-8">
                          <div className="flex items-center gap-3">
                              <div className="h-[1px] flex-1 bg-muted" />
                              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">SOCIAL MATRIX</span>
                              <div className="h-[1px] flex-1 bg-muted" />
                          </div>
                          <div className="space-y-6">
                              {MOCK_USER_DATA.composition.map((item, i) => (
                                  <div key={i} className="space-y-2">
                                      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                          <span className="text-secondary/60">{item.label}</span>
                                          <span className="text-primary">{item.value}%</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                          <motion.div 
                                              initial={{ width: 0 }} 
                                              animate={{ width: `${item.value}%` }}
                                              transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: "circOut" }}
                                              className={cn("h-full rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.3)]")} 
                                          />
                                      </div>
                                  </div>
                              ))}
                              <div className="pt-6">
                                  <Button 
                                      className="w-full bg-secondary hover:bg-primary text-white font-black py-7 rounded-[1.5rem] group transition-all duration-500"
                                      onClick={() => navigate('/word-cloud')}
                                  >
                                     <Cloud className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" /> 
                                     穿透语料
                                  </Button>
                              </div>
                          </div>
                      </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bento-card">
                  <CardHeader className="pb-4 pt-8 px-8">
                      <CardTitle className="text-[10px] font-black flex items-center gap-2 text-muted-foreground uppercase tracking-[0.25em]">
                        <LayoutDashboard className="h-3 w-3 text-primary" /> 
                        Monitored Domains
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                      <div className="divide-y divide-muted/30">
                          {MOCK_USER_DATA.groups.map((group, i) => (
                              <div key={i} className="px-8 py-5 flex justify-between items-center hover:bg-primary/[0.02] transition-colors group">
                                  <div className="space-y-1">
                                      <div className="font-heading font-extrabold text-secondary text-sm group-hover:text-primary transition-colors">{group.name}</div>
                                      <Badge variant="outline" className="text-[8px] font-black px-2 py-0 border-primary/20 text-primary uppercase">{group.role}</Badge>
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <span className="text-sm font-black text-secondary">{group.activeScore}%</span>
                                      <span className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter opacity-50">Score</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* 右侧：言论与活动 */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="bg-secondary text-white bento-card relative overflow-hidden h-full">
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 rounded-full -mr-10 -mb-10 blur-3xl" />
                        <CardContent className="pt-10 pb-12 px-8 relative z-10">
                            <TrendingUp className="h-10 w-10 text-primary mb-6" />
                            <div className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em]">Interaction Density</div>
                            <div className="text-5xl font-black mt-2 font-heading">{MOCK_USER_DATA.stats.totalInteractions} <span className="text-lg opacity-40 font-sans">TX</span></div>
                            <p className="text-[9px] mt-4 opacity-40 uppercase tracking-widest font-black">Captured over last 30 days cycle</p>
                        </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="bento-card cursor-pointer group h-full" onClick={() => !isEditingFandom && setIsEditingFandom(true)}>
                        <CardContent className="pt-10 pb-12 px-8">
                            <Target className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex justify-between">
                              <span>Identity Marker</span>
                              <span className="text-primary italic opacity-0 group-hover:opacity-100 transition-opacity">EDIT</span>
                            </div>
                            {isEditingFandom ? (
                              <div className="mt-4 flex gap-2">
                                  <Input 
                                      className="h-10 font-black text-secondary border-primary/20 rounded-xl"
                                      value={fandomNote}
                                      onChange={(e) => setFandomNote(e.target.value)}
                                      autoFocus
                                      onKeyDown={(e) => e.key === 'Enter' && saveFandomNote()}
                                      onClick={(e) => e.stopPropagation()}
                                  />
                                  <Button size="sm" className="h-10 bg-primary px-4 rounded-xl" onClick={(e) => { e.stopPropagation(); saveFandomNote(); }}>存</Button>
                              </div>
                            ) : (
                              <div className="text-3xl font-heading font-black mt-3 text-secondary leading-tight min-h-[4rem]">
                                  {fandomNote || "点击录入成分..."}
                              </div>
                            )}
                        </CardContent>
                    </Card>
                  </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Tabs defaultValue="comments" className="w-full">
                  <div className="mb-6 flex justify-between items-end">
                    <TabsList className="bg-muted/50 p-1 rounded-2xl border border-muted/50 h-auto">
                        <TabsTrigger value="comments" className="px-6 py-3 font-black rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs uppercase tracking-widest">
                          Comments
                        </TabsTrigger>
                        <TabsTrigger value="posts" className="px-6 py-3 font-black rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs uppercase tracking-widest">
                          Topics
                        </TabsTrigger>
                    </TabsList>
                    <div className="hidden sm:block text-[10px] font-black text-muted-foreground opacity-30 uppercase tracking-[0.3em]">
                      Live Stream Logic
                    </div>
                  </div>
                  
                  <TabsContent value="comments" className="mt-0 space-y-6">
                      {MOCK_USER_DATA.recentComments.map((comment, i) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                          >
                            <Card className="bento-card border border-muted/30 group">
                                <CardContent className="pt-8 pb-8 px-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                          <Badge variant="secondary" className="bg-muted text-secondary border-none font-black text-[9px] tracking-tighter hover:bg-primary hover:text-white transition-colors">
                                              {comment.group}
                                          </Badge>
                                        </div>
                                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">{comment.time}</span>
                                    </div>
                                    <p className="text-secondary font-heading font-bold text-lg leading-relaxed italic border-l-[3px] border-primary/20 pl-6 py-2 group-hover:border-primary transition-all">
                                        “{comment.content}”
                                    </p>
                                </CardContent>
                            </Card>
                          </motion.div>
                      ))}
                      <Button variant="ghost" className="w-full py-10 rounded-[1.5rem] border-2 border-dashed border-muted text-muted-foreground font-black text-[11px] uppercase tracking-[0.4em] hover:bg-primary/5 hover:text-primary hover:border-primary transition-all">
                        Load Full Corpus Analysis (+382)
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
                          <Card className="border-primary/10 hover:border-primary/30 transition-all shadow-sm">
                              <CardHeader>
                                  <div className="flex justify-between items-start gap-4">
                                      <CardTitle className="text-lg font-black text-secondary">{post.title}</CardTitle>
                                      <Badge className="bg-primary font-black flex-shrink-0">{post.group}</Badge>
                                  </div>
                                  <CardDescription className="flex items-center gap-3 font-bold mt-2">
                                    追踪于 {post.time} · <span className="text-primary font-black">{post.likes} 赞</span>
                                  </CardDescription>
                              </CardHeader>
                          </Card>
                        </motion.div>
                    ))}
                </TabsContent>
              </Tabs>
            </motion.div>
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
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <Search className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="text-secondary font-black text-xl animate-pulse tracking-[0.1em]">正在穿透数据墙，解析用户成分...</div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center py-24 border-2 border-dashed border-primary/20 rounded-[3rem] bg-primary/5"
        >
            <Target className="h-20 w-20 text-primary/20 mx-auto mb-6" />
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-primary/30 uppercase tracking-[0.3em]">等待输入指令</h2>
                <p className="text-secondary/20 font-bold max-w-sm mx-auto">请在上方输入需要进行成分分析的微博用户 ID，系统将自动拉取其活跃记录与言论偏好。</p>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
