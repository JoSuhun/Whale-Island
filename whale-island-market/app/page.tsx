export default function Home() {
  return (
    <main
      className="bg-gray-100 sm:bg-red-100 md:bg-blue-100 lg:bg-cyan-200
       xl:bg-pink-100 2xl:bg-green-100
     h-screen flex items-center justify-center p-5 dark:bg-gray-700"
    >
      <div
        className="bg-white shadow-xl p-5 w-96 rounded-2xl w-full max-w-screen-sm
       dark:bg-gray-600 flex flex-col gap-4
       "
      >
        <a href="">링크</a>
        {[
          'Jojo',
          'me',
          'you',
          'yourself',
          '',
        ].map(
          (person, index) => (
            <div
              key={index}
              className="flex items-center group gap-3
               "
            >
              <button className="btn" />
              <span
                className="text-lg font-medium
               empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse
                empty:bg-gray-200
                group-hover:text-blue-500"
              >
                {person}
              </span>
              <div
                className="size-5
                 bg-red-500 text-white flex items-center justify-center
               rounded-full relative"
              >
                <span className="z-10">
                  {index}
                </span>
                <div className="size-5 bg-red-500 rounded-full absolute animate-ping" />
              </div>
            </div>
          ),
        )}
      </div>
    </main>
  );
}

