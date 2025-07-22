import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, TextField, Separator, Dialog, IconButton } from '@radix-ui/themes';
import { Search, X } from 'lucide-react';
import { useAsyncCache } from '../../../hooks/useAsyncCache';
import api from '../../../api/client';
import { CacheLevel } from '../../../lib/cache/types';
import { SupportHeader } from './support/components/SupportHeader';
import { KnowledgeBaseSection } from './support/components/KnowledgeBaseSection';
import { VideoTutorialsSection } from './support/components/VideoTutorialsSection';
import { ContactFormSection } from './support/components/ContactFormSection';
import MyTickets from './support/components/MyTickets';
import { GeneralAdviceSection } from './support/components/GeneralAdviceSection';
import type { KnowledgeBaseArticle } from '../../../types/knowledge-base';

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
}

// --- DATA ---
const useVideoTutorials = () => {
  const { t } = useTranslation();
  
  return [
    {
      id: "vt-1",
      title: t('support.videos.complete_campaign_setup.title'),
      description: t('support.videos.complete_campaign_setup.description'),
      thumbnail: "/placeholder.svg",
      videoId: "dQw4w9WgXcQ",
    },
    {
      id: "vt-2",
      title: t('support.videos.domain_config.title'),
      description: t('support.videos.domain_config.description'),
      thumbnail: "/placeholder.svg",
      videoId: "dQw4w9WgXcQ",
    },
    {
      id: "vt-3",
      title: t('support.videos.warmup_process.title'),
      description: t('support.videos.warmup_process.description'),
      thumbnail: "/placeholder.svg",
      videoId: "dQw4w9WgXcQ",
    },
  ] as VideoTutorial[];
};

// --- MAIN COMPONENT ---
const fetchKnowledgeArticles = async () => {
  const response = await api.get<KnowledgeBaseArticle[]>('/articles');
  return response.data;
};

// --- MAIN COMPONENT ---
export default function SupportPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const videoTutorials = useVideoTutorials();

  const { data: knowledgeLibrary, loading: isLoading } = useAsyncCache(
    ['support-articles'],
    fetchKnowledgeArticles,
    CacheLevel.PERSISTENT
  );

  const filteredKnowledgeLibrary = (knowledgeLibrary || []).filter(
    (article: KnowledgeBaseArticle) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoPlay = (video: VideoTutorial) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  return (
    <Box p="6" className="space-y-8">
      <SupportHeader />

      <Box maxWidth="700px" mx="auto">
        <TextField.Root
          size="3"
          placeholder={t('support.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <TextField.Slot>
            <Search size={16} />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <GeneralAdviceSection />

      <Separator my="6" size="4" />

      <KnowledgeBaseSection articles={filteredKnowledgeLibrary} isLoading={isLoading} />

      <Separator my="6" size="4" />

      <VideoTutorialsSection onPlay={handleVideoPlay} videoTutorials={videoTutorials} />

      <Separator my="6" size="4" />

      <ContactFormSection />

      <Separator my="6" size="4" />

      <MyTickets />

      <Dialog.Root open={showVideoModal} onOpenChange={setShowVideoModal}>
        <Dialog.Content style={{ maxWidth: 800 }}>
          <Flex justify="between" align="center" mb="4">
            <Dialog.Title>{selectedVideo?.title}</Dialog.Title>
            <IconButton variant="ghost" color="gray" onClick={() => setShowVideoModal(false)}>
              <X />
            </IconButton>
          </Flex>
          {selectedVideo && (
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
