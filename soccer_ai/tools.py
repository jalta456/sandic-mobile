import os
import yt_dlp
import google.generativeai as genai
import edge_tts
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SoccerTools:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)

    async def download_and_upload_video(self, url):
        """تحميل الفيديو ورفعه لسحابة جيميناي للتحليل البصري"""
        video_path = 'match_video.mp4'
        ydl_opts = {'format': 'best[ext=mp4]/best', 'outtmpl': video_path, 'overwrites': True}
        
        logger.info(f"Downloading video from: {url}")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        logger.info("Uploading to Gemini Cloud...")
        uploaded_file = genai.upload_file(path=video_path)
        while uploaded_file.state.name == "PROCESSING":
            await asyncio.sleep(2)
            uploaded_file = genai.get_file(uploaded_file.name)
        
        logger.info(f"Video ready at: {uploaded_file.uri}")
        return uploaded_file.uri

    async def generate_voice(self, text, output_path='final_commentary.mp3'):
        """توليد تعليق إنجليزي أمريكي كامل"""
        logger.info("Generating American English audio...")
        # تنظيف النص من الرموز لضمان جودة الصوت
        clean_text = text.replace('*', '').replace('#', '').replace('`', '')
        
        communicate = edge_tts.Communicate(clean_text, "en-US-BrianNeural")
        await communicate.save(output_path)
        logger.info(f"Audio saved: {output_path}")
        return output_path
