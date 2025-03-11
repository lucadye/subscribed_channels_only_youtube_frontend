""" define all url routes """
from flask import Blueprint, render_template
from app.web_scraping_scripts import scrape_channel_data, scrape_search_data, scrape_video_comments
from app.youtube_api import YouTubeAPI


bp = Blueprint('main', __name__)
youtube = YouTubeAPI()


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/search/<search_terms>')
def search(search_terms):
    videos = youtube.get_search_results(search_terms)
    return render_template(
        'search_page.html',
        videos=videos,
        shorts=[]  # shorts have not been tested yet
    )


@bp.route('/channel/<channel_id>')
def channel_overview(channel_id):
    videos, shorts, channel_info = scrape_channel_data(channel_id)
    return render_template(
        'channel_overview.html',
        channel_info=channel_info,
        videos=videos,
        shorts=shorts
    )


@bp.route('/video/<video_id>')
def video_page(video_id):
    video_data = youtube.get_video_page_data(video_id)
    comments = scrape_video_comments(video_id)
    return render_template(
        'video_page.html',
        video=video_data,
        comments=comments
    )
