"use client";
import { useState } from "react";
import { useMarkVideoCompleted } from "@/hooks/use-progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Video } from "@/types/api";
import { getEmbedUrl } from "@/lib/utils";

interface VideoPlayerProps {
  video: Video;
  courseId: string;
  isCompleted?: boolean;
}

export function VideoPlayer({
  video,
  courseId,
  isCompleted = false,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(!!isCompleted);
  const markCompleted = useMarkVideoCompleted();
  const { toast } = useToast();

  const handleMarkCompleted = async () => {
    try {
      await markCompleted.mutateAsync({ courseId, videoId: video._id });
      setLocalCompleted(true);
      toast({
        title: "Progress updated",
        description: "This video has been marked as completed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="flex items-center gap-2 text-base">
          {localCompleted && (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
          <span className="line-clamp-1">{video.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {playing ? (
          <div className="aspect-video w-full">
            <iframe
              src={getEmbedUrl(video.url)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div
            className="aspect-video w-full bg-muted flex items-center justify-center cursor-pointer rounded-md hover:bg-muted/80 transition-colors"
            onClick={() => setPlaying(true)}
          >
            <Play className="h-12 w-12" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-none pt-2">
        {!playing ? (
          <Button onClick={() => setPlaying(true)} className="w-full">
            Watch Video
          </Button>
        ) : !localCompleted ? (
          <Button
            onClick={handleMarkCompleted}
            className="w-full"
            disabled={markCompleted.isPending}
          >
            {markCompleted.isPending ? "Updating..." : "Mark as Completed"}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
