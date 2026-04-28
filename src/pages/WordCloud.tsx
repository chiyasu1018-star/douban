import { useState } from "react";
import { Cloud, Search, MessageSquare, Quote, Target, Hash, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// 模拟更详细的词云数据，包含对应评论
const ANALYZED_WORDS = [
  { text: "yyds", size: "text-5xl", color: "text-rose-600", weight: "font-black", comments: [
      { id: 1, group: "明星A的小破站", content: "XX 真的 yyds，这组图我看一次晕一次！", time: "24分钟前" },
      { id: 2, group: "剧集讨论组", content: "这段打戏 yyds，国内武指的天花板了。", time: "1天前" },
      { id: 10, group: "安利博主", content: "颜值真的是 yyds，建议无限循环。", time: "2天前" }
    ] 
  },
  { text: "控评", size: "text-4xl", color: "text-rose-500", weight: "font-black", comments: [
      { id: 4, group: "豆瓣鹅组", content: "组里现在全是控评，真没法看了，建议全都禁言处理。", time: "5小时前" },
      { id: 5, group: "深夜食堂", content: "甚至连这个组都要被控评占领了吗？离谱。", time: "3天前" }
    ] 
  },
  { text: "披皮", size: "text-3xl", color: "text-orange-600", weight: "font-black", comments: [
      { id: 6, group: "披皮黑鉴定中心", content: "这一看就是披皮吧，关注列表里全是那谁谁。", time: "6小时前" },
      { id: 11, group: "吃瓜小组", content: "大家小心，这层楼主疑似披皮，专门带节奏。", time: "8小时前" }
    ] 
  },
  { text: "真主", size: "text-2xl", color: "text-amber-600", weight: "font-bold", comments: [
      { id: 3, group: "吃瓜大本营", content: "正主都没在这跳呢，职粉又开始表演了？", time: "2小时前" }
    ] 
  },
  { text: "安利", size: "text-xl", color: "text-emerald-600", weight: "font-bold", comments: [
      { id: 7, group: "安利墙", content: "求大家吃下这份安利，真的是宝藏博主！", time: "12小时前" }
    ] 
  },
  { text: "糊咖", size: "text-lg", color: "text-neutral-500", weight: "font-medium", comments: [
      { id: 8, group: "八卦娱乐", content: "这种糊咖也会有人买热搜？内娱药丸。", time: "1天前" }
    ] 
  },
  { text: "cpf", size: "text-lg", color: "text-neutral-400", weight: "font-medium", comments: [
    { id: 12, group: "CP大本营", content: "全世界最大的 cpf 就是我本人没错了。", time: "1天前" }
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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-emerald-900 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="flex items-center gap-2">
                <Target className="h-8 w-8 text-rose-500" />
                Word Radar
            </span>
            <span className="text-2xl text-emerald-600">视奸雷达: 精准透视</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">点击词云，即时查阅关联评论原文。</p>
      </div>

      {/* 搜索控制台 */}
      <Card className="border-emerald-100 shadow-xl bg-white border-2">
        <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="UID / 昵称 (如: @阿强)" 
                        className="pl-10 h-14 sm:h-12 text-base sm:text-lg border-emerald-100"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                    />
                </div>
                <Button className="bg-emerald-700 hover:bg-emerald-800 font-black px-6 sm:px-10 h-14 sm:h-12 text-base" onClick={startAnalysis}>
                    {analyzing ? "处理中..." : "抓取"}
                </Button>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-12 items-start">
        {/* 交互词云 */}
        <Card className="md:col-span-12 lg:col-span-7 border-emerald-100 overflow-hidden bg-white shadow-lg min-h-[500px]">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-emerald-600" /> 
                        核心关键词云
                    </CardTitle>
                    <Badge className="bg-emerald-600">500+ 样本</Badge>
                </div>
            </CardHeader>
            <CardContent className="relative flex flex-wrap items-center justify-center p-6 sm:p-12 gap-x-4 sm:gap-x-10 gap-y-8 sm:gap-y-14 overflow-hidden">
                {analyzing ? (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4 sm:mb-6" />
                        <span className="text-lg sm:text-xl font-black text-emerald-900 animate-pulse">正在视奸历史言论...</span>
                    </div>
                ) : null}
                
                {ANALYZED_WORDS.map((w, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                            "cursor-pointer transition-all hover:scale-125 hover:rotate-3 active:scale-95 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg",
                            selectedWord?.text === w.text ? "bg-emerald-100 ring-2 ring-emerald-400" : "hover:bg-emerald-50",
                            // Scale down text sizes for mobile
                            w.size.replace('text-5xl', 'text-2xl sm:text-5xl').replace('text-4xl', 'text-xl sm:text-4xl').replace('text-3xl', 'text-lg sm:text-3xl').replace('text-2xl', 'text-base sm:text-2xl'),
                            w.color,
                            w.weight
                        )}
                        onClick={() => setSelectedWord(w)}
                    >
                        {w.text}
                    </motion.div>
                ))}
            </CardContent>
        </Card>

        {/* 关联评论抓取 */}
        <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
                {selectedWord ? (
                    <motion.div
                        key={selectedWord.text}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="border-emerald-200 border-2 shadow-xl shadow-emerald-50">
                            <CardHeader className="bg-emerald-50/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <Hash className="h-8 w-8 text-emerald-600" />
                                    <div>
                                        <CardTitle className="text-2xl font-black text-emerald-900">「{selectedWord.text}」</CardTitle>
                                        <CardDescription className="font-bold">命中 {selectedWord.comments.length} 条记录</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px]">
                                    <div className="p-6 space-y-6">
                                        {selectedWord.comments.map((comment) => (
                                            <div key={comment.id} className="relative group">
                                                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-emerald-200 group-hover:bg-emerald-500 transition-colors" />
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <Badge variant="outline" className="text-emerald-700 bg-white border-emerald-100 font-bold">
                                                            {comment.group}
                                                        </Badge>
                                                        <span className="text-muted-foreground font-medium">{comment.time}</span>
                                                    </div>
                                                    <div className="bg-neutral-50 p-4 rounded-lg relative overflow-hidden">
                                                        <Quote className="absolute -right-1 -bottom-2 h-12 w-12 text-emerald-100/50 -rotate-12" />
                                                        <p className="text-sm font-bold text-emerald-900 leading-relaxed relative z-10">
                                                            “{comment.content}”
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="h-[500px] border-2 border-dashed border-emerald-100 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-emerald-50/10"
                    >
                        <MessageSquare className="h-16 w-16 text-emerald-100 mb-6" />
                        <h3 className="text-xl font-black text-emerald-900/40">选择词汇</h3>
                        <p className="text-sm text-emerald-800/30 font-bold max-w-xs mt-2">点击左侧词云，即时呈现历史言论原文。</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
