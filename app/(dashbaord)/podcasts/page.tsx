import React from 'react'
import { PodcastsProvider } from '@/hooks/usePodcasts'
import PodcastsPage from '../_components/Admin/Podcasts/PodcastsPage'

export default function Podcasts() {
    return (
        <PodcastsProvider>
            <PodcastsPage />
        </PodcastsProvider>
    )
}
