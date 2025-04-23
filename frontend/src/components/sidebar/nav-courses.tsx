"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavCourses({ courses }: { courses: Array<string> }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Courses</SidebarGroupLabel>
      <SidebarMenu>
        {courses.map((item) => (
          <SidebarMenuItem key={item} className="mx-2 overflow-hidden">
            <SidebarMenuButton asChild className="">
              <Link
                to={`/$courseId`}
                params={{ courseId: item }}
                className="group/link flex -translate-x-6 items-center gap-2 rounded-md p-1.5 transition-all duration-300 hover:translate-x-0 hover:bg-zinc-200"
              >
                <ArrowRightIcon className="opacity-0 transition-all duration-300 group-hover/link:opacity-100" />
                <span>{item}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
