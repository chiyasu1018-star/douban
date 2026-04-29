import { useState } from "react";
import { Cloud, Search, MessageSquare, Quote, Target, Hash, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// 模拟更详细的词云数据，包含对应微博内容
const ANALYZED_WORDS = [
  { text: "yyds", size: "text-5xl", color: "text-primary", weight: "font-black", posts: [
      { id: 1, account: "大V 观点", content: "XX 真的 yyds，这组图我看一次晕一次！", time: "24分钟前" },
      { id: 2, account: "微博官微", content: "这段打戏 yyds，国内武指的天花板了。", time: "1天前" },
      { id: 10, account: "安利博主", content: "颜值真的是 yyds，建议无限循环。", time: "2天前" }
    ] 
  },
  { text: "控评", size: "text-4xl", color: "text-secondary", weight: "font-black", posts: [
      { id: 4, account: "娱乐八卦大V", content: "这里现在全是控评，真没法看了，建议全都禁言处理。", time: "5小时前" },
      { id: 5, account: "情感树洞", content: "甚至连这个评论区都要被控评占领了吗？离谱。", time: "3天前" }
    ] 
  },
  { text: "披皮", size: "text-3xl", color: "text-accent-foreground", weight: "font-black", posts: [
      { id: 6, account: "反黑中心", content: "这一看就是披皮吧，关注列表里全是那谁谁。", time: "6小时前" },
      { id: 11, account: "吃瓜爆料", content: "大家小心，这层楼主疑似披皮，专门带节奏。", time: "8小时前" }
    ] 
  },
  { text: "真主", size: "text-2xl", color: "text-amber-600", weight: "font-bold", posts: [
      { id: 3, account: "热搜搬运", content: "真主都没在这跳呢，职粉又开始表演了？", time: "2小时前" }
    ] 
  },
  { text: "安利", size: "text-xl", color: "text-emerald-600", weight: "font-bold", posts: [
      { id: 7, account: "安利墙", content: "求大家吃下这份安利，真的是宝藏博主！", time: "12小时前" }
    ] 
  },
  { text: "糊咖", size: "text-lg", color: "text-neutral-500", weight: "font-medium", posts: [
      { id: 8, account: "八卦娱乐", content: "这种糊咖也会有人买热搜？内娱药丸。", time: "1天前" }
    ] 
  },
  { text: "cpf", size: "text-lg", color: "text-neutral-400", weight: "font-medium", posts: [
    { id: 12, account: "CP超话", content: "全世界最大的 cpf 就是我本人没错了。", time: "1天前" }
  ] 
},
];

export default function WordCloud() {
  const [searchId, setSearchId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedWord, setSelectedWord] = useState<typeof ANALYZED_WORDS[0] | null>(null);

  const startAnalysis = () => {
    if (!searchId) return;
    setAnalyzing(true);
    setSelectedWord(null);
    setTimeout(() => {
        setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-secondary font-heading">
                Word <span className="text-primary italic">Radar</span>
            </h1>
        </div>
        <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-[0.3em] ml-12">穿透语料语境 · 即时透视</p>
      </div>

      {/* 搜索控制台 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bento-card overflow-hidden">
            <CardContent className="p-3">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground/50" />
                        <Input 
                            placeholder="输入要追踪的微博 ID / 昵称..." 
                            className="pl-12 h-12 border-transparent bg-muted/30 focus:bg-white transition-all rounded-[1rem] font-bold"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                        />
                    </div>
                    <Button className="bg-primary hover:bg-secondary text-white font-black px-10 h-12 rounded-[1rem] shadow-lg shadow-primary/20" onClick={startAnalysis}>
                        {analyzing ? "ANALYZING..." : "开始抓取"}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* 交互词云 */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-7"
        >
            <Card className="bento-card min-h-[600px] flex flex-col">
                <div className="p-8 border-b border-muted/50 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Visual semantics</div>
                        <h2 className="text-xl font-heading font-black text-secondary">核心语义云图</h2>
                    </div>
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 text-primary font-black text-[10px]">REAL-TIME SCAN</Badge>
                </div>
                <CardContent className="relative flex-1 flex flex-wrap items-center justify-center p-12 sm:p-20 gap-x-8 sm:gap-x-12 gap-y-10 sm:gap-y-16 overflow-hidden">
                    {analyzing ? (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-6 text-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 border-t-2 border-primary rounded-full mb-8" 
                            />
                            <span className="text-lg font-heading font-black text-secondary uppercase tracking-[0.2em] animate-pulse">Scanning Corpus...</span>
                        </div>
                    ) : null}
                    
                    {ANALYZED_WORDS.map((w, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 100 }}
                            className={cn(
                                "cursor-pointer transition-all duration-500 hover:scale-150 hover:-rotate-6 active:scale-95 px-4 py-2 rounded-2xl group relative",
                                selectedWord?.text === w.text ? "bg-primary text-white shadow-2xl shadow-primary/40 -translate-y-2" : "hover:bg-primary/5",
                                w.size.replace('text-5xl', 'text-2xl sm:text-6xl').replace('text-4xl', 'text-xl sm:text-5xl').replace('text-3xl', 'text-lg sm:text-4xl').replace('text-2xl', 'text-base sm:text-3xl'),
                                selectedWord?.text === w.text ? "text-white" : w.color,
                                w.weight
                            )}
                            onClick={() => setSelectedWord(w)}
                        >
                            <span className="relative z-10">{w.text}</span>
                            {selectedWord?.text === w.text && (
                                <motion.div layoutId="word-active" className="absolute inset-0 bg-primary rounded-2xl -z-0" />
                            )}
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>

        {/* 关联微博抓取 */}
        <div className="lg:col-span-12 xl:col-span-5">
            <AnimatePresence mode="wait">
                {selectedWord ? (
                    <motion.div
                        key={selectedWord.text}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ type: "spring", damping: 20 }}
                    >
                        <Card className="bento-card overflow-hidden">
                            <div className="bg-secondary p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Hash className="h-24 w-24 -rotate-12" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center font-heading font-black text-xl italic">#</div>
                                        <div>
                                            <CardTitle className="text-3xl font-heading font-black tracking-tight">{selectedWord.text}</CardTitle>
                                            <CardDescription className="text-white/50 font-black uppercase text-[10px] tracking-widest mt-1">
                                                Total Hits: {selectedWord.posts.length} RECORDS
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[500px]">
                                    <div className="p-8 space-y-8">
                                        {selectedWord.posts.map((post, idx) => (
                                            <motion.div 
                                                key={post.id} 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="relative group"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                            <span className="text-[10px] font-black text-secondary/70 uppercase tracking-widest">{post.account}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-muted-foreground/40">{post.time}</span>
                                                    </div>
                                                    <div className="bg-muted/30 p-6 rounded-[1.5rem] relative group-hover:bg-primary/5 transition-colors">
                                                        <Quote className="absolute right-4 bottom-4 h-10 w-10 text-primary/5 group-hover:text-primary/10 transition-colors" />
                                                        <p className="text-base font-heading font-bold text-secondary leading-relaxed relative z-10 italic">
                                                            “{post.content}”
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-[600px] bento-card flex flex-col items-center justify-center text-center p-12 bg-white dashed border-2 border-muted"
                    >
                        <div className="w-20 h-20 rounded-[2.5rem] bg-muted/30 flex items-center justify-center mb-8">
                            <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-xl font-heading font-black text-secondary/40 uppercase tracking-[0.3em]">Instruction Search</h3>
                        <p className="text-xs text-muted-foreground/30 font-black uppercase tracking-widest max-w-[200px] mt-4 leading-relaxed">
                            点击左侧词云节点，穿透加密数据，即时呈现历史微博原文。
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
