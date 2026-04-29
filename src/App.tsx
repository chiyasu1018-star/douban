import GroupSearch from './components/GroupSearch'

function App() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-200 py-4 mb-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-black text-gray-800 tracking-tight">DOUBAN <span className="text-green-600">INSIGHT</span></span>
          </div>
          <div className="text-sm text-gray-400 font-medium">小组足迹深度分析工具</div>
        </div>
      </nav>

      <main>
        <GroupSearch />
      </main>

      <footer className="py-12 text-center text-gray-400 text-xs">
        <p>© 2024 数据来源于豆瓣公开页面 · 仅供学习交流使用</p>
      </footer>
    </div>
  )
}

export default App
