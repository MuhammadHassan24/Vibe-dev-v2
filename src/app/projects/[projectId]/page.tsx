import { ProjectView } from "@/modules/projects/ui/views/ProjectView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

async function Page({ params }: Props) {
  const { projectId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.message.getMany.queryOptions({
      projectId,
    })
  );

  void queryClient.prefetchQuery(
    trpc.project.getOne.queryOptions({
      id: projectId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectView projectId={projectId} />
    </HydrationBoundary>
  );
}

export default Page;
