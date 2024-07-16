export default function Home() {
  return (
    <main
      className="bg-gray-100 sm:bg-red-100 md:bg-blue-100 lg:bg-cyan-200
       xl:bg-orange-200 2xl:bg-green-100
     h-screen flex items-center justify-center p-5 dark:bg-gray-700"
    >
      <div
        className="bg-white shadow-xl p-5 w-96 rounded-2xl w-full max-w-screen-sm
       dark:bg-gray-600 flex flex-col md:flex-row gap-2 *:outline-none
        has-[:invalid]:ring-2
        has-[:invalid]:ring-red-300
       "
      >
        <input
          className="w-full rounded-full py-3
          bg-gray-200 pl-5 focus:ring ring-green-400
           transition-shadow placeholder:text-gray-400
           placeholder:drop-shadow invalid:focus:ring-red-500 peer"
          type="email"
          required
          placeholder="Email address"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block">
          Eamil is required
        </span>
        <button
          className="bg-green-500
           text-white py-2 rounded-full active:scale-95
         transition-transform font-medium md:w-16 md:px-2
         peer-invalid:bg-red-500"
        >
          검색
        </button>
      </div>
    </main>
  );
}

