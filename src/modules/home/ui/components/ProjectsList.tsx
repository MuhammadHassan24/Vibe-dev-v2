"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { user, isLoaded } = useUser();
  const { data: projects, isLoading } = useQuery(
    trpc.project.getMany.queryOptions()
  );

  if (!projects || projects.length === 0) {
    return null;
  }
  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4 mt-[16vh]">
      <h2 className="text-2xl font-semibold ">{user?.firstName} Vibes</h2>
      <div className=" grid grid-cols-1 sm:grid-cols-3 gap-6">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className=" font-normal h-auto justify-start w-full text-start p-4"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4">
                <Image
                  src="/globe.svg"
                  alt="Vibe"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col overflow-hidden">
                  <h3 className="truncate font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {formatDistanceToNow(new Date(project.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="border border-gray-400 rounded-md p-4 w-full animate-pulse">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-y-2 w-full">
          <div className="bg-muted-foreground/50 dark:bg-muted-foreground/40 h-4 w-3/4 rounded" />
          <div className="bg-muted-foreground/50 dark:bg-muted-foreground/40 h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
};
