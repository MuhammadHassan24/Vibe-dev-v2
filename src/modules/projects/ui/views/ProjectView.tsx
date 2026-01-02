"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/MessagesContainer";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/client";
import { ProjectHeader } from "../components/ProjectHeader";
import { FragmentWeb } from "../components/FragmentWeb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExpolorer } from "@/components/fileexplorer";
import { UserControl } from "@/components/usercontrol";
import { useAuth } from "@clerk/nextjs";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  const [activeFragment, setAvtiveFragment] = useState<Fragment | null>(null);
  const [tabs, setTabs] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 "
        >
          <Suspense
            fallback={
              <div className="rounded-md p-4 animate-pulse">
                <div className="bg-muted-foreground/40 h-5 w-32 rounded" />
              </div>
            }
          >
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense
            fallback={
              <>
                <div className="flex justify-end pb-4 pr-2 pl-10  pt-5">
                  <div className="rounded-md bg-muted-foreground/40 animate-pulse p-3 shadow-none border-none w-[60%]"></div>
                </div>
                <div className="flex justify-start pb-4 pr-2 pl-4  pt-5">
                  <div className="rounded-md bg-muted-foreground/40 animate-pulse p-3 shadow-none border-none w-[60%]"></div>
                </div>
              </>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setAvtiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabs}
            onValueChange={(value) => setTabs(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                {!hasProAccess && (
                  <Button asChild size={"sm"} variant={"tertiary"}>
                    <Link href={"/pricing"}>
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExpolorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
