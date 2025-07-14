import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          교사 MBTI 수업 스타일 분석
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          당신의 수업 스타일을 16가지 MBTI 타입으로 분석해보세요
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          onClick={() => setCount((count) => count + 1)}
        >
          클릭 수: {count}
        </button>
      </div>
    </div>
  )
}

export default App 