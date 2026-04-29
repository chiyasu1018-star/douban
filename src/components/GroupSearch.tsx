import React, { useState, useMemo } from 'react';
import { Search, Loader2, ExternalLink, Hash, PieChart, List } from 'lucide-react';

interface Post {
  title: string;
  link: string;
  groupName: string;
  date: string;
}

// 停用词库：过滤掉无意义的词，让词云更精准
const STOP_WORDS = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '想', '吗', '吧', '还是', '怎么', '什么', '那个', '因为', '所以', '讨论', '大家', '觉得', '真的', '已经', '这种', '现在', '推荐', '分享', '有人', '开始']);

const GroupSearch: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError('');
    setPosts([]);

    try {
      // 1. 调用 Worker 代理接口
      const res = await fetch(`https://douban-proxy.chiyasu1018.workers.dev?user=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('网络请求失败');
      
      const data = await res.json();
      if (!data.html) throw new Error('未能从豆瓣获取到内容，请检查用户 ID 是否正确（需为数字 ID 或唯一英文标识）');

// 2. 使用 DOMParser 解析 HTML
const parser = new DOMParser();
const doc = parser.parseFromString(data.html, 'text/html');

// 尝试所有可能的选择器
const selectors = [
  'table.olt tr',
  'table tr',
  '.article tr',
  'div#wrapper tr',
  'tr'
];

let allRows: Element[] = [];
for (const sel of selectors) {
  const found = Array.from(doc.querySelectorAll(sel));
  const hasTopics = found.some(r => r.querySelector('a[href*="/topic/"]'));
  if (hasTopics) {
    allRows = found;
    break;
  }
}

// 如果选择器全都没找到，尝试直接找所有topic链接
if (allRows.length === 0) {
  const topicLinks = Array.from(doc.querySelectorAll('a[href*="/topic/"]'));
  const results: Post[] = topicLinks.map(link => {
    const row = link.closest('tr') || link.closest('li') || link.closest('div');
    const groupLink = row?.querySelector('a[href*="/group/"]') as HTMLAnchorElement;
    const dateMatch = row?.textContent?.match(/\d{4}-\d{2}-\d{2}/);
    return {
      title: link.getAttribute('title') || link.textContent?.trim() || '',
      link: (link as HTMLAnchorElement).href || link.getAttribute('href') || '',
      groupName: groupLink?.textContent?.trim() || '',
      date: dateMatch?.[0] || ''
    };
  }).filter(item => item.title);

  if (results.length === 0) throw new Error('未找到发帖数据，该用户可能未公开小组发言，或豆瓣页面结构已更新');
  setPosts(results);
  return;
}

const results: Post[] = allRows.map(row => {
  const titleLink = row.querySelector('a[href*="/topic/"]') as HTMLAnchorElement;
  const groupLink = row.querySelector('a[href*="/group/"]') as HTMLAnchorElement;
  const cells = Array.from(row.querySelectorAll('td'));
  const dateCell = cells.find(td => /\d{4}-\d{2}-\d{2}/.test(td.textContent || ''));
  return {
    title: titleLink?.getAttribute('title') || titleLink?.textContent?.trim() || '',
    link: titleLink?.href || titleLink?.getAttribute('href') || '',
    groupName: groupLink?.textContent?.trim() || '',
    date: dateCell?.textContent?.trim() || ''
  };
}).filter(item => item.title);

if (results.length === 0) throw new Error('未找到发帖数据，该用户可能未公开小组发言');
setPosts(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. 数据分析：参与小组汇总
  const groupSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      counts[p.groupName] = (counts[p.groupName] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // 4. 数据分析：高频词云逻辑
  const wordFreq = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach(p => {
      const words = p.title.match(/[\u4e00-\u9fa5]{2,}/g) || [];
      words.forEach(w => {
        if (!STOP_WORDS.has(w)) {
          freq[w] = (freq[w] || 0) + 1;
        }
      });
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 35);
  }, [posts]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      {/* 搜索区域 */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-green-800">豆瓣用户发帖分析器</h2>
        <div className="flex w-full max-w-lg shadow-lg rounded-xl overflow-hidden border-2 border-green-600">
          <input 
            className="flex-1 px-4 py-3 outline-none text-lg"
            placeholder="输入豆瓣用户 ID (如: 123456)"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 hover:bg-green-700 transition-colors flex items-center gap-2 font-bold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            查询
          </button>
        </div>
        <p className="text-sm text-gray-500">注：仅能查询公开的“我的话题”列表</p>
        {error && <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100">{error}</div>}
      </div>

      {posts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 左侧：统计面板 */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                <PieChart size={20} /> 活跃小组汇总
              </h3>
              <div className="flex flex-wrap gap-2">
                {groupSummary.map(([name, count]) => (
                  <div key={name} className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 text-sm">
                    <span className="font-semibold">{name}</span>
                    <span className="bg-green-600 text-white text-[10px] px-1.5 rounded-full">{count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                <Hash size={20} /> 话题高频词
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center py-4">
                {wordFreq.map(([word, freq]) => (
                  <span 
                    key={word} 
                    style={{ 
                      fontSize: `${Math.min(32, 14 + freq * 3)}px`, 
                      opacity: 0.6 + (freq * 0.1),
                      color: freq > 2 ? '#047857' : '#6b7280'
                    }}
                    className="font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* 右侧：列表面板 */}
          <div className="lg:col-span-8">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <List size={20} className="text-green-800" />
                  <h3 className="text-lg font-bold text-green-800">发帖历史</h3>
                </div>
                <span className="text-sm text-gray-500">共计 {posts.length} 条数据</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 font-semibold">标题内容</th>
                      <th className="px-6 py-3 font-semibold">所属小组</th>
                      <th className="px-6 py-3 font-semibold w-32 text-right">发布时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {posts.map((post, i) => (
                      <tr key={i} className="hover:bg-green-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <a 
                            href={post.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-gray-700 group-hover:text-green-700 font-medium flex items-center gap-1 leading-relaxed"
                          >
                            {post.title}
                            <ExternalLink size={14} className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                            {post.groupName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 text-right whitespace-nowrap">
                          {post.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      )}
    </div>
  );
};

export default GroupSearch;
