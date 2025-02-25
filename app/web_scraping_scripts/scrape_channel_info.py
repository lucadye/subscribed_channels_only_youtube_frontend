""" extracts the info of all videos on a channel """
from typing import Generator
import yt_dlp
from app.datatypes import VideoInfoType
from app.validators import validate_channel_id, ValidationError


def scrape_channel_videos(channel_id: str) -> Generator[VideoInfoType, None, None]:
    """ extracts the info of all videos on a channel """
    if not validate_channel_id(channel_id):
        raise ValidationError('invalid channel id')

    channel_url = f'https://www.youtube.com/channel/{channel_id}/videos/'

    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        channel_info = ydl.extract_info(channel_url, download=False)

        if 'entries' in channel_info:
            video_list = channel_info['entries']
            for video in video_list:
                yield VideoInfoType(
                    video_id=video['id'],
                    title=video['title'],
                    description=video['description'],
                    views=video['view_count'],
                    duration=video['duration'],
                    thumbnail_url=video['thumbnails'][-1]['url']
                )
