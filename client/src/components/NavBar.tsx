import { useAppDispatch, useAppSelector } from "@/app/redux";
import Link from "next/link";
import { LuMenu, LuMoon, LuSearch, LuSettings, LuSun } from "react-icons/lu";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";

function NavBar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black dark:text-white">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="cursor-pointer"
          >
            <LuMenu className="size-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <LuSearch className="absolute top-1/2 left-[4px] mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer" />
          <input
            className="focus-border-transparent dark:placehlolder-white w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* icons */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <LuSun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <LuMoon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          <LuSettings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
        <div className="mr-5 ml-2 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
      </div>
    </div>
  );
}

export default NavBar;
