export default function Home() {
  return (
    <main
      className="bg-gray-100 sm:bg-red-100 md:bg-blue-100 lg:bg-cyan-200 xl:bg-orange-200 2xl:bg-green-100
     h-screen flex items-center justify-center p-5 dark:bg-gray-700"
    >
      <div
        className="bg-white shadow-xl p-5 w-96 rounded-2xl w-full max-w-screen-sm
       dark:bg-gray-600 flex flex-col md:flex-row gap-2
       "
      >
        <input
          className="w-full rounded-full py-3 bg-gray-200 pl-5 outline-none focus:ring ring-yellow-400
           transition-shadow placeholder:text-gray-400
           placeholder:drop-shadow"
          type="text"
          placeholder="Search here.."
        />
        <button
          className="bg-gradient-to-tr from-violet-300 via-pink-200 to-blue-200 text-white py-2 rounded-full active:scale-95
         transition-transform font-medium outline-none md:w-16 md:px-2"
        >
          검색
        </button>
      </div>
    </main>
  );
}

