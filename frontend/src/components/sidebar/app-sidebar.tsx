"use client";

import { Link, useLoaderData } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import { NavCourses } from "./nav-courses";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { courses } = useLoaderData({ from: "__root__" });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <img src="./icon.svg" className="mt-2 h-6 w-auto object-cover" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md p-1.5 font-medium transition-all hover:bg-zinc-200"
        >
          <PlusIcon className="size-4" />
          New course
        </Link>
        <NavCourses courses={courses} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
