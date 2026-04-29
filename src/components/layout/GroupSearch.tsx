import React, { useState, useMemo } from 'react';
import { Search, Loader2, ExternalLink, Hash } from 'lucide-react';

// 定义帖子数据类型
interface Post {
  title: string;
  link: string;
  groupName: string;
  date: string;
}

const STOP_WORDS = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '想', '吗', '吧', '还是', '怎么', '什么', '那个', '因为', '所以', '讨论', '大家', '觉得', '真的', '已经', '这种', '现在', '推荐', '分享']);

const GroupSearch: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://douban-proxy.chiyasu1018.workers.dev?user=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (!data.html) throw new Error('未找到内容，请检查用户名是否正确');
      parseHtml(data.html);
    } catch (err: any) {
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const parseHtml = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const rows = doc.querySelectorAll('table.olt tr:not(.th)');
    
    const results: Post[] = Array.from(rows).map(row => {
      const titleLink = row.querySelector('td.title a[href*="/topic/"]') as HTMLAnchorElement;
      const groupLink = row.querySelector('td a[href*="/group/"]') as HTMLAnchorElement;
      const dateCell = Array.from(row.querySelectorAll('td')).find(td => /\d{4}-\d{2}-\d{2}/.test(td.textContent || ''));

      return {
        title: titleLink?.textContent?.trim() || '',
        link: titleLink?.href || '',
        groupName: groupLink?.textContent?.trim() || '',
        date: dateCell?.textContent?.trim() || ''
      };
    }).filter(item => item.title);
    
    setPosts(results);
  };

  const groupSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => counts[p.groupName] = (counts[p.groupName] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const wordFreq = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach(p => {
      const words = p.title.match(/[\u4e00-\u9fa5]{2,}/g) || [];
      words.forEach(w => {
        if (!STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1;
      });
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30);
  }, [posts]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-gray-800">
      <div className="flex gap-2 max-w-md mx-auto">
        <input 
          className="flex-1 border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="输入豆瓣 ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-1"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />} 查询
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <section className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700"><Hash size={18}/> 参与小组</h3>
              <div className="flex flex-wrap gap-2">
                {groupSummary.map(([name, count]) => (
                  <span key={name} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-100">
                    {name} <b className="ml-1 text-xs opacity-70">{count}</b>
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="font-bold mb-3 text-green-700">高频词云</h3>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                {wordFreq.map(([word, freq]) => (
                  <span key={word} style={{ fontSize: `${Math.min(32, 12 + freq * 3)}px`, opacity: 0.6 + (freq * 0.1) }}>
                    {word}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-2">
            <section className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                      <th className="p-3 font-medium">标题</th>
                      <th className="p-3 font-medium">小组</th>
                      <th className="p-3 font-medium w-28">日期</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {posts.map((post, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <a href={post.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 leading-snug">
                            {post.title} <ExternalLink size={12} className="text-gray-400 flex-shrink-0"/>
                          </a>
                        </td>
                        <td className="p-3 text-sm"><span className="whitespace-nowrap bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{post.groupName}</span></td>
                        <td className="p-3 text-sm text-gray-400 whitespace-nowrap">{post.date}</td>
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
