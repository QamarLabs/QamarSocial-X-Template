"use client";
import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

type DarkSwitchProps = {};

const DarkSwitch: React.FC<DarkSwitchProps> = () => {
  const { setTheme, resolvedTheme, theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="group flex max-w-fit
      cursor-pointer items-center space-x-2 rounded-full px-6 mt-6 py-3
      transition-all duration-200 hover:bg-purple-200 dark:bg-gray-900 bg-gray-50"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}

      <p className="hidden group-hover:text-twitter md:inline-flex text-base font-light">
        {resolvedTheme === "dark" ? "Light Mod" : "Dark Mod"}
      </p>
    </motion.div>
  );
};
export default DarkSwitch;
