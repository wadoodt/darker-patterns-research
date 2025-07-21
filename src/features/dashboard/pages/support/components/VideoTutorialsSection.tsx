import React from 'react';
import { Heading, Grid, Card, Flex, Box, Text, IconButton } from '@radix-ui/themes';
import { Play, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { VideoTutorial } from '../../SupportPage';

interface VideoTutorialsSectionProps {
    onPlay: (video: VideoTutorial) => void;
    videoTutorials: VideoTutorial[];
}

export const VideoTutorialsSection: React.FC<VideoTutorialsSectionProps> = ({ onPlay, videoTutorials }) => {
    const { t } = useTranslation();
    
    return (
    <Box>
        <Heading as="h2" size="6" mb="4">
            <Flex align="center" gap="3">
                <Video /> 
                {t('support.video_tutorials.title')}
            </Flex>
        </Heading>
        <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
            {videoTutorials.map((video) => (
                <Card key={video.id} onClick={() => onPlay(video)} className="cursor-pointer">
                    <Flex direction="column" height="100%" justify="between">
                        <Box>
                            <Box mb="3" className="relative group">
                                <img src={video.thumbnail} alt={video.title} className="rounded-lg w-full aspect-video object-cover" />
                                <Flex align="center" justify="center" className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconButton size="3" radius="full"><Play className="text-white" fill="white" /></IconButton>
                                </Flex>
                            </Box>
                            <Heading as="h3" size="4" mb="1">{video.title}</Heading>
                            <Text as="p" size="2" color="gray">{video.description}</Text>
                        </Box>
                    </Flex>
                </Card>
            ))}
        </Grid>
        </Box>
    );
};
