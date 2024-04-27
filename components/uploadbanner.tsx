"use client";

import { Project } from "@prisma/client";
import { UploadDropzone } from "@/components/ui/uploadthing";
import { useMutation } from "@tanstack/react-query";
import { ProjectUpdateProps } from "@/lib/validators";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { ClientUploadedFileData } from "uploadthing/types";

export const UploadBanner: React.FC<{ project: Project }> = ({ project }) => {
  if (project.bannerImageUrl)
    return (
      <>
        <img
          src={project.bannerImageUrl}
          alt={""}
          className="border-2 border-spacing-24 rounded-lg w-96 h-56"
        />
      </>
    );

  const { toast } = useToast();

  const { mutateAsync: updateProject } = useMutation<
    Project,
    any,
    ProjectUpdateProps
  >({
    async mutationFn(props) {
      const res = await api.put(`/projects/${project.id}`, props);
      return res.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const onUpload = async (file: ClientUploadedFileData<{}>) => {
    try {
      console.log("File", file);

      const parsedPayload = ProjectUpdateProps.safeParse({
        name: project.name,
        displayName: project.displayName,
        bannerImageUrl: file.url,
      });

      if (!parsedPayload.success) {
        toast({
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while creating the Event",
          variant: "destructive",
        });
        return;
      }

      console.log(parsedPayload.data);

      const res = await updateProject(parsedPayload.data);

      if (res)
        toast({
          title: "Event Updated Successfully!",
          description: `Event, "${res.name}" updated successfully!`,
        });
      else
        toast({
          title: "Some Error Occurred!",
          description: "Uh Oh! Some problem Occurred while creating the Event",
          variant: "destructive",
        });
    } catch (error) {
      console.error("Event UPDATE ERROR: ", error);
      toast({
        title: "Some Error Occurred!",
        description: "Uh Oh! Some problem Occurred while creating the Event",
        variant: "destructive",
      });
    }
  };

  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={async (res) => {
        const file = res[0];
        await onUpload(file);
      }}
    />
  );
};
